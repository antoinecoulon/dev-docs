# Guide Docker & CI/CD DevSecOps

Guide pratique pour dockeriser une application fullstack et mettre en place un pipeline CI/CD avec tests de sécurité.

**Contexte** : Application task-manager (mono-repo avec backend Python et frontend statique HTML/JS)

---

## 1. Prérequis

### Installation locale
```bash
# Installer Docker
# Vérifier l'installation
docker --version
docker-compose --version
```

### Compte Docker Hub
1. Créer un compte sur [hub.docker.com](https://hub.docker.com)
2. Créer un token d'accès : Account Settings → Security → New Access Token
3. Conserver le token pour le CI/CD

---

## 2. Dockerisation de l'application

### 2.1 Backend Python

**Structure du projet**
```
backend/
├── Dockerfile
├── requirements.txt
├── app.py
└── ...
```

**Dockerfile backend** (`backend/Dockerfile`)
```dockerfile
FROM python:3.12-slim

# Sécurité : utilisateur non-root
RUN useradd -m appuser
USER appuser

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Health check pour monitoring
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=5)" || exit 1

CMD ["python3", "app.py"]
```

**Points clés** :
- `python:3.12-slim` : image légère
- Utilisateur non-root : sécurité renforcée (requis par Checkov)
- `HEALTHCHECK` : permet à Docker/Kubernetes de vérifier l'état du container
- `--no-cache-dir` : réduit la taille de l'image

### 2.2 Frontend statique

**Dockerfile frontend** (`frontend/Dockerfile`)
```dockerfile
FROM python:3.12-slim

# Sécurité : utilisateur non-root
RUN useradd -m appuser
USER appuser

WORKDIR /app
COPY . /app/

EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:5173/', timeout=5)" || exit 1

CMD ["python3", "-m", "http.server", "5173", "--bind", "0.0.0.0"]
```

**Alternative avec Nginx (recommandé en production)** :
```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html
EXPOSE 80

HEALTHCHECK --interval=30s CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

---

## 3. Build et test local

### Commandes essentielles

```bash
# Naviguer dans le répertoire backend
cd backend

# Build l'image
docker build -t task-manager:backend .

# Lister les images
docker images

# Run le container
docker run -d -p 8000:8000 --name backend-app task-manager:backend

# Vérifier les logs
docker logs backend-app

# Voir les containers actifs
docker ps

# Stopper et supprimer
docker stop backend-app
docker rm backend-app

# Supprimer l'image
docker rmi task-manager:backend
```

### Test multi-containers avec docker-compose

**docker-compose.yml** (à la racine)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - ENV=development

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

```bash
# Lancer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Stopper tout
docker-compose down
```

---

## 4. Publication sur Docker Hub

### 4.1 Ligne de commande

```bash
# Login
docker login -u antoinecoulon

# Tag l'image
docker tag task-manager:backend antoinecoulon/task-manager:backend-latest

# Push sur Docker Hub
docker push antoinecoulon/task-manager:backend-latest

# Vérifier sur hub.docker.com
```

### 4.2 Bonnes pratiques de tagging

```bash
# Version sémantique
docker tag task-manager:backend antoinecoulon/task-manager:backend-v1.0.0

# Latest pour la dernière version stable
docker tag task-manager:backend antoinecoulon/task-manager:backend-latest

# Par commit SHA (pour traçabilité)
docker tag task-manager:backend antoinecoulon/task-manager:backend-${GIT_SHA}
```

---

## 5. CI/CD avec GitHub Actions

### 5.1 Configuration des secrets

**Dans GitHub** : Settings → Secrets and variables → Actions

Ajouter :
- `DOCKER_TOKEN` : token Docker Hub
- `SNYK_TOKEN` : token Snyk (après inscription sur snyk.io)

### 5.2 Pipeline complet

**`.github/workflows/ci-cd.yaml`**

```yaml
name: Task Manager DevSecOps
run-name: ${{ github.actor }}'s pipeline
on: [push]
permissions: read-all

jobs:
  # 1. Vérifications pré-commit
  Pre-Commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v5
      - uses: pre-commit/action@v3.0.1

  # 2. Setup backend
  Backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-python@v5
        with:
          python-version: '3.13'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

  # 3. Setup frontend
  Frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'

  # 4. Tests de sécurité avec Snyk
  Security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Install dependencies
        working-directory: backend
        run: pip install -r requirements.txt
      - name: Check Node vulnerabilities
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --file=backend/requirements.txt
      - name: Check Python vulnerabilities
        uses: snyk/actions/python@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          command: code test
          args: --all-projects

  # 5. Build et push backend
  Docker-Backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v3
      
      # Lint Dockerfile (bonnes pratiques)
      - name: Lint Dockerfile
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: "backend/Dockerfile"
      
      # Scan de sécurité IaC
      - uses: actions/setup-python@v4
        with:
          python-version: 3.9
      - name: Tests with Checkov
        uses: bridgecrewio/checkov-action@v12
      
      # Build et push
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: antoinecoulon
          password: ${{ secrets.DOCKER_TOKEN }}
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: antoinecoulon/task-manager:backend-latest

  # 6. Build et push frontend (même structure)
  Docker-Frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v3
      - name: Lint Dockerfile
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: "frontend/Dockerfile"
      - uses: actions/setup-python@v4
        with:
          python-version: 3.9
      - name: Tests with Checkov
        uses: bridgecrewio/checkov-action@v12
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: antoinecoulon
          password: ${{ secrets.DOCKER_TOKEN }}
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: antoinecoulon/task-manager:frontend-latest
```

---

## 6. Outils de sécurité DevSecOps

### 6.1 Hadolint (Linter Dockerfile)

**Détecte** :
- Mauvaises pratiques Docker
- Images obsolètes
- Commandes dangereuses
- Optimisations manquées

**Exemple d'erreur courante** :
```dockerfile
# ❌ Mauvais
RUN apt-get update
RUN apt-get install -y curl

# ✅ Bon (combine les commandes)
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

### 6.2 Checkov (Scan IaC)

**Vérifie** :
- Absence d'utilisateur non-root
- Absence de HEALTHCHECK
- Secrets hardcodés
- Configurations non sécurisées

**Corrections type** :
```dockerfile
# ❌ Échec Checkov : pas d'utilisateur non-root
FROM python:3.12
WORKDIR /app
CMD ["python", "app.py"]

# ✅ Passe Checkov
FROM python:3.12
RUN useradd -m appuser
USER appuser
WORKDIR /app
HEALTHCHECK CMD curl --fail http://localhost/ || exit 1
CMD ["python", "app.py"]
```

### 6.3 Snyk (Vulnérabilités dépendances)

**Analyse** :
- Dépendances Python (requirements.txt)
- Dépendances Node (package.json)
- Vulnérabilités CVE connues

**Utilisation locale** :
```bash
# Installation
npm install -g snyk

# Authentification
snyk auth

# Test du projet
snyk test

# Monitorer en continu
snyk monitor
```

---

## 7. Workflow complet résumé

```bash
# 1. Développement local
docker build -t task-manager:backend ./backend
docker run -p 8000:8000 task-manager:backend

# 2. Test local
curl http://localhost:8000

# 3. Commit & push
git add .
git commit -m "feat: add feature X"
git push origin main

# 4. GitHub Actions automatique :
# → Pre-commit hooks
# → Setup backend/frontend
# → Scan sécurité (Snyk)
# → Lint Dockerfile (Hadolint)
# → Scan IaC (Checkov)
# → Build image
# → Push sur Docker Hub

# 5. Déploiement (manuel ou automatique)
docker pull antoinecoulon/task-manager:backend-latest
docker run -d -p 8000:8000 antoinecoulon/task-manager:backend-latest
```

---

## 8. Points critiques et optimisations

### 8.1 Critiques de ton implémentation

**Frontend avec Python HTTP server** :
- ❌ Non adapté pour la production
- ❌ Pas de gestion MIME types optimale
- ❌ Pas de cache/compression
- ✅ Acceptable pour le dev/test

**Recommandation** : Nginx pour la production
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
```

### 8.2 Multi-stage builds (optimisation)

**Backend optimisé** :
```dockerfile
# Stage 1: Build
FROM python:3.12 AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.12-slim
RUN useradd -m appuser
USER appuser
WORKDIR /app

# Copier seulement les dépendances compilées
COPY --from=builder /root/.local /home/appuser/.local
COPY . .

ENV PATH=/home/appuser/.local/bin:$PATH
EXPOSE 8000
CMD ["python", "app.py"]
```

**Avantage** : Image finale 30-50% plus petite

### 8.3 Gestion des secrets

```bash
# ❌ Jamais dans le Dockerfile
ENV API_KEY=secret123

# ✅ Via variables d'environnement
docker run -e API_KEY=$API_KEY myapp

# ✅ Via fichier .env avec docker-compose
environment:
  - API_KEY=${API_KEY}
```

### 8.4 Cache Docker

**Ordre optimal des instructions** :
```dockerfile
FROM python:3.12-slim

# 1. D'abord ce qui change rarement
RUN useradd -m appuser

# 2. Dépendances (cache invalidé si requirements.txt change)
COPY requirements.txt .
RUN pip install -r requirements.txt

# 3. Code source en dernier (change souvent)
COPY . .
```

---

## 9. Checklist avant production

- [ ] Utilisateur non-root configuré
- [ ] HEALTHCHECK défini
- [ ] Pas de secrets hardcodés
- [ ] Image taggée avec version sémantique
- [ ] Tests de sécurité passés (Hadolint, Checkov, Snyk)
- [ ] Logs configurés (stdout/stderr)
- [ ] Variables d'environnement documentées
- [ ] Resource limits définis (CPU/RAM)
- [ ] Multi-stage build si applicable
- [ ] Documentation README avec commandes Docker

---

## 10. Commandes Docker utiles

```bash
# Nettoyage
docker system prune -a          # Nettoyer tout
docker image prune              # Supprimer images non utilisées
docker container prune          # Supprimer containers stoppés

# Inspection
docker inspect <container>      # Détails complets
docker stats                    # Monitoring ressources
docker logs -f <container>      # Logs en temps réel

# Debug
docker exec -it <container> sh  # Shell interactif
docker cp <container>:/path .   # Copier fichier depuis container

# Réseau
docker network ls               # Lister réseaux
docker network inspect bridge   # Détails réseau
```

## 11. Pour aller plus loin : Trivy

**Trivy** : scanner de vulnérabilités open-source pour images Docker, plus complet que Snyk.

### Installation locale
```bash
# macOS
brew install aquasecurity/trivy/trivy

# Linux
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install trivy
```

### Utilisation
```bash
# Scanner une image locale
trivy image task-manager:backend

# Scanner une image depuis Docker Hub
trivy image antoinecoulon/task-manager:backend-latest

# Scanner uniquement les vulnérabilités critiques et hautes
trivy image --severity HIGH,CRITICAL task-manager:backend

# Export JSON pour CI/CD
trivy image --format json --output results.json task-manager:backend

# Scanner le Dockerfile directement
trivy config backend/Dockerfile
```

### Intégration GitHub Actions

**Ajout au pipeline** (dans `.github/workflows/ci-cd.yaml`)
```yaml
  Trivy-Scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build image for scan
        run: docker build -t task-manager:backend ./backend
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'task-manager:backend'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### Différences Trivy vs Snyk

| Critère | Trivy | Snyk |
|---------|-------|------|
| **Prix** | Gratuit & open-source | Freemium (limité gratuit) |
| **Scope** | Images, IaC, code, SBOM | Code, dépendances, containers |
| **Base de données** | Multiple sources CVE | Snyk proprietary DB |
| **Rapidité** | Très rapide (cache local) | Plus lent (API) |
| **CI/CD** | Facile à intégrer | Requiert token/compte |

**Recommandation** : Utilise Trivy en complément de Snyk pour double validation.

---

## 12. Pour aller plus loin : docker-compose avancé

### Structure multi-services complète

**docker-compose.yml**
```yaml
version: '3.8'

services:
  # Base de données
  db:
    image: postgres:15-alpine
    container_name: task-manager-db
    environment:
      POSTGRES_DB: taskdb
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d taskdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: task-manager-backend
    environment:
      - DATABASE_URL=postgresql://admin:${DB_PASSWORD}@db:5432/taskdb
      - ENV=production
      - REDIS_URL=redis://cache:6379
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    volumes:
      - ./backend:/app
      - backend_logs:/app/logs
    restart: unless-stopped
    networks:
      - app-network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: task-manager-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./frontend:/app
    networks:
      - app-network

  # Cache Redis
  cache:
    image: redis:7-alpine
    container_name: task-manager-cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    networks:
      - app-network

  # Nginx reverse proxy
  nginx:
    image: nginx:alpine
    container_name: task-manager-proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

# Volumes persistants
volumes:
  postgres_data:
  redis_data:
  backend_logs:

# Réseau isolé
networks:
  app-network:
    driver: bridge
```

### Fichier .env pour les secrets

**.env**
```env
DB_PASSWORD=super_secret_password
API_KEY=your_api_key_here
REDIS_PASSWORD=redis_secret
```

### Commandes avancées
```bash
# Démarrer seulement certains services
docker-compose up -d db cache

# Rebuild un seul service
docker-compose build backend

# Voir les logs d'un service
docker-compose logs -f backend

# Exécuter une commande dans un service
docker-compose exec backend python manage.py migrate

# Scaler un service (plusieurs instances)
docker-compose up -d --scale backend=3

# Variables d'environnement
docker-compose --env-file .env.prod up -d

# Mode debug avec override
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### docker-compose.dev.yml (Override développement)
```yaml
version: '3.8'

services:
  backend:
    build:
      target: development
    volumes:
      - ./backend:/app
    environment:
      - DEBUG=True
      - RELOAD=True
    command: python -m uvicorn app:app --reload --host 0.0.0.0

  frontend:
    volumes:
      - ./frontend:/app
    command: npm run dev
```

### Profils pour environnements

**docker-compose.yml avec profils**
```yaml
services:
  # Services toujours actifs
  backend:
    ...

  # Service uniquement en dev
  adminer:
    image: adminer
    profiles: ["dev"]
    ports:
      - "8080:8080"

  # Service uniquement en monitoring
  prometheus:
    image: prom/prometheus
    profiles: ["monitoring"]
    ports:
      - "9090:9090"
```
```bash
# Dev avec adminer
docker-compose --profile dev up

# Production avec monitoring
docker-compose --profile monitoring up
```

### Healthchecks et dépendances
```yaml
services:
  db:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    depends_on:
      db:
        condition: service_healthy  # Attend que la DB soit prête
      cache:
        condition: service_started  # Attend juste le démarrage
```

### Bonnes pratiques

**1. Isolation réseau**
```yaml
networks:
  frontend-network:
  backend-network:

services:
  frontend:
    networks:
      - frontend-network
  backend:
    networks:
      - frontend-network
      - backend-network
  db:
    networks:
      - backend-network  # Non accessible depuis frontend
```

**2. Resource limits**
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

**3. Restart policies**
```yaml
services:
  backend:
    restart: unless-stopped  # Redémarre sauf si stoppé manuellement
  
  db:
    restart: always  # Toujours redémarrer
```

### Monitoring avec docker-compose
```yaml
  # Prometheus
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  # Grafana
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
```

### Checklist docker-compose production

- [ ] Variables sensibles dans .env (gitignore)
- [ ] Volumes pour données persistantes
- [ ] Healthchecks configurés
- [ ] Resource limits définis
- [ ] Restart policies appropriées
- [ ] Réseaux isolés par couche
- [ ] Logs centralisés
- [ ] Backup strategy pour volumes

---

## Ressources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Hadolint Rules](https://github.com/hadolint/hadolint)
- [Checkov Checks](https://www.checkov.io/5.Policy%20Index/dockerfile.html)
- [Snyk Documentation](https://docs.snyk.io/)
