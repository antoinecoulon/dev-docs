# PopOs! 24 - Guide de maintenance

## Mise à jour du système (À faire 1-2 fois par semaine)

```bash
# Commande tout-en-un complète
sudo apt update && sudo apt upgrade -y && flatpak update -y && sudo apt autoremove -y && sudo apt autoclean
```

**Ou version détaillée pour comprendre :**

```bash
# 1. Mettre à jour la liste des paquets disponibles
sudo apt update

# 2. Installer les mises à jour
sudo apt upgrade -y

# 3. (Occasionnel) Mises à jour majeures (kernel, etc.)
sudo apt full-upgrade -y

# 4. Mettre à jour les applications Flatpak
flatpak update -y

# 5. Supprimer les paquets devenus inutiles
sudo apt autoremove -y

# 6. Nettoyer le cache des paquets
sudo apt autoclean
```

### Créer un alias pour simplifier

**Ajoute ceci à ton `.bashrc` :**

```bash
nano ~/.bashrc
```

**Ajoute à la fin :**

```bash
# Alias de maintenance
alias update='sudo apt update && sudo apt upgrade -y && flatpak update -y'
alias clean='sudo apt autoremove -y && sudo apt autoclean && flatpak uninstall --unused -y'
alias fullupdate='sudo apt update && sudo apt full-upgrade -y && flatpak update -y && sudo apt autoremove -y && sudo apt autoclean'
```

**Sauvegarde et recharge :**

```bash
source ~/.bashrc
```

**Maintenant tu peux juste taper :**

```bash
update        # Mise à jour simple
fullupdate    # Mise à jour complète
clean         # Nettoyage
```

## Nettoyer les journaux système

```bash
# Voir la taille des logs
sudo journalctl --disk-usage

# Nettoyer les logs de plus de 2 semaines
sudo journalctl --vacuum-time=2weeks

# Ou limiter à 500M maximum
sudo journalctl --vacuum-size=500M
```

## Nettoyer le cache

```bash
# Cache APT
sudo apt clean

# Cache thumbnails (miniatures d'images)
rm -rf ~/.cache/thumbnails/*

# Cache des navigateurs (optionnel, à faire manuellement dans le navigateur)
```

## Vérifier l'espace disque

```bash
# Vue d'ensemble
df -h

# Trouver les gros dossiers dans /home
du -sh ~/* | sort -hr | head -20

# Analyser visuellement (installer baobab)
sudo apt install baobab
baobab
```

### Optimiser SSD avec TRIM

```bash
# Vérifier si TRIM est activé
sudo systemctl status fstrim.timer

# Forcer un TRIM manuel (si le timer est actif, c'est fait automatiquement)
sudo fstrim -av
```

### Vérifier la santé du disque

```bash
# Installer smartmontools si pas déjà fait
sudo apt install smartmontools -y

# Vérifier la santé du SSD/HDD
sudo smartctl -H /dev/nvme0n1

# Infos détaillées
sudo smartctl -a /dev/nvme0n1
```

**Résultat attendu :** `PASSED` ✅

## Vérifier l'intégrité des paquets

```bash
# Vérifier les paquets cassés
sudo apt check

# Réparer les dépendances
sudo apt install -f

# Reconfigurer les paquets problématiques
sudo dpkg --configure -a
```

## Nettoyer les anciens kernels

Pop!_OS garde plusieurs versions du kernel. Tu peux supprimer les anciens :

```bash
# Voir les kernels installés
dpkg --list | grep linux-image

# Voir le kernel actuel (NE PAS SUPPRIMER)
uname -r

# Supprimer les anciens kernels automatiquement
sudo apt autoremove --purge
```

**⚠️ Ne supprime JAMAIS le kernel actuel !**

## Nettoyer Docker

```bash
# Supprimer les conteneurs arrêtés
docker container prune -f

# Supprimer les images non utilisées
docker image prune -a -f

# Supprimer les volumes non utilisés
docker volume prune -f

# Supprimer les réseaux non utilisés
docker network prune -f

# Tout nettoyer d'un coup (ATTENTION, supprime tout ce qui n'est pas actif)
docker system prune -a --volumes -f
```

## Nettoyer npm/node_modules

```bash
# Trouver tous les node_modules et leur taille
find ~ -name "node_modules" -type d -prune -exec du -sh {} \; | sort -hr

# Supprimer node_modules dans les projets inactifs
# (fais-le manuellement, projet par projet)
cd ~/projets/vieux-projet
rm -rf node_modules

# Nettoyer le cache npm
npm cache clean --force
```

## Nettoyer .NET

```bash
# Nettoyer les packages NuGet non utilisés
dotnet nuget locals all --clear
```

## Vérifier les services en erreur

```bash
# Lister les services failed
systemctl --failed

# Détails d'un service problématique
sudo systemctl status nom_du_service
```

## Vérifier les erreurs système

```bash
# Dernières erreurs
sudo journalctl -p 3 -xb

# Erreurs d'aujourd'hui
sudo journalctl --since today -p err

# Suivre les logs en temps réel
sudo journalctl -f
```

## Monitorer les ressources

```bash
# CPU, RAM, processus
htop

# Espace disque
df -h

# Utilisation réseau
sudo apt install nethogs -y
sudo nethogs

# Température CPU (si supporté)
sudo apt install lm-sensors -y
sensors
```

## TIPS

### Première mise à jour complète

```bash
# Mettre à jour la liste des paquets
sudo apt update

# Mettre à jour tous les paquets installés
sudo apt upgrade -y

# Nettoyer les paquets inutiles
sudo apt autoremove -y

# Si des mises à jour kernel sont disponibles
sudo apt full-upgrade -y
```

```bash
# Installer les codecs multimédia
sudo apt install ubuntu-restricted-extras -y

# Utilitaires
sudo apt install htop -y              # Moniteur système (mieux que top)
sudo apt install neofetch -y          # Info système stylé
```

## Interface

### Raccourcis clavier

```jsx
Super (touche Windows)           → Ouvrir le lanceur d'applications
Super + T                        → Ouvrir le terminal
Super + /                        → Afficher tous les raccourcis
Super + Tab                      → Changer d'application
Alt + Tab                        → Changer de fenêtre (même app)
Super + flèches                  → Organiser les fenêtres (tiling)
```

### Tiling (gestion des fenêtres)

```jsx
Super + flèche gauche            → Fenêtre à gauche (50%)
Super + flèche droite            → Fenêtre à droite (50%)
Super + flèche haut              → Maximiser
Super + flèche bas               → Restaurer/Minimiser
Super + Y                        → Tiling automatique ON/OFF
```

### Espaces de travail (Workspaces)

```jsx
Super + flèche haut (maintenu)   → Vue d'ensemble des workspaces
Super + Ctrl + flèche haut/bas   → Changer de workspace
Super + Shift + flèche haut/bas  → Déplacer fenêtre vers autre workspace
```

### Système

```jsx
Super + L                        → Verrouiller la session
Ctrl + Alt + T                   → Terminal (classique Linux)
Super + A                        → Voir toutes les applications
```

## Gestionnaires de paquets

### APT (système Ubuntu/Debian)

```bash
# Chercher un paquet
apt search nom_du_paquet

# Installer
sudo apt install nom_du_paquet

# Supprimer
sudo apt remove nom_du_paquet

# Nettoyer
sudo apt autoremove
sudo apt autoclean
```

### Flatpak (applications sandboxées)

```bash
# Chercher
flatpak search nom

# Installer depuis Flathub
flatpak install flathub com.example.App

# Lister installés
flatpak list

# Supprimer
flatpak uninstall com.example.App

# Mettre à jour tout
flatpak update
```

### Snap (alternative Canonical)

Pop!_OS ne l'installe pas par défaut, mais tu peux :

```bash
sudo apt install snapd -y

# Chercher
snap find nom

# Installer
sudo snap install nom

# Lister
snap list

# Supprimer
sudo snap remove nom
```

**Note :** Flatpak est généralement préféré sur Pop!_OS.
