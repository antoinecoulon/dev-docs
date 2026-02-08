# Développement d’un outil d’aggrégation et de synthèse de veille technologique

Développement d’un outil d’aggrégation et de synthèse de veille technologique.

- Récupération de sources RSS
- Tri et classification par Mistral AI
- Dashboard avec les résultats, + filtres, statistiques
- Envoi d'un mail récapitulatif des meilleurs résultats

## Ressources

- [Documentation Node-RED](https://nodered.org/docs/getting-started/local)
- [Documentation Node-RED Dashboard 2](https://dashboard.flowfuse.com/getting-started.html)
- [Documentation Node-RED Email](https://flows.nodered.org/node/node-red-node-email)
- [Console Mistral AI](https://console.mistral.ai/home)

## Critique

Adapté à mon niveau technique, ce projet m’a permis de travailler les compétences visées par mon titre EADL. Je pourrais aussi proposer en entreprise la mise en place d’une veille technologique d’équipe.

## Outils utilisés

### Node-RED → Automatisation

J’étais parti au départ sur Make mais les limites dues à la gratuité sont trop fortes. Je me suis finalement tourné vers Node-RED car :

- Aucune limite d'opérations/tokens
- Contrôle total (installation locale)
- Déjà utilisé en entreprise → compétences Entreprise + EADL renforcées
- Open source, extensible à l'infini
- Meilleur pour mon portfolio technique

Cependant, il faut anticiper :

- Disponibilité : tourne uniquement quand ma machine est allumée
- Accès distant : pas de GUI web cloud (sauf si on expose)

![screenshot](./assets/screenshot.png)

### Mistral AI → Synthèse et classification

La limitation en tokens n’est pas trop contraignante, c’est suffisant pour mon utilisation. De plus, la qualité des modèles est supérieure en comparaison de modèles implémentés localement.

## Configuration du flux Node-RED

### **Nodes nécessaires**

**Core (déjà installés)** :

- inject, function, http request, split, switch, debug

**À installer via Palette Manager** :

```text
@flowfuse/node-red-dashboard
node-red-node-email
```

## **Gestion de l'environnement**

**Variables d'env (clé API Mistral)** :

**Fichier ~/.node-red/settings.js** :

```js
functionGlobalContext: {
    MISTRAL_API_KEY: "ta_clé_ici",
    GOOGLE_APPS_PASSWORD: "ta_clé_ici",
}
```

**Accès dans function nodes** :

```js
const apiKey = global.get("MISTRAL_API_KEY");
```

## Récupérer les flows

Vous pouvez enregistrer et importer ce fichier `.json` et l'importer directement dans Node-RED via Menu > Importer: [flows.json](./assets/flows.json)

Pensez à modifier l'adresse mail à laquelle vous envoyez l'email récapitulatif (node 'Générer email') ainsi que vos credentials dans le node 'Envoyer email'.

## Reproduire la solution

Ce guide est a adapter selon les différentes configurations ainsi que les dernières mises à jour des librairies. Se référer aux documentations.

## Phase 0 — Installation et configuration

### 0.1 Installer Node-RED

```bash
# Installation globale
sudo npm install -g --unsafe-perm node-red

# Vérifier l'installation
node-red --version
```

### 0.2 Premier lancement

```bash
node-red
```

Tu verras dans le terminal une ligne du type :

```text
Server now running at http://127.0.0.1:1880/
```

Ouvre cette URL dans ton navigateur. Tu retrouves l’éditeur visuel avec :

- **Panneau gauche** : la palette de nodes disponibles (organisés par catégorie)
- **Zone centrale** : le canvas où tu construis tes flows
- **Panneau droit** : onglets Info, Debug, et Config

> **Rappel :** Chaque “flow” est un onglet en haut du canvas. Tu peux en avoir plusieurs. Pour ce projet, on travaillera sur un seul flow.

### 0.4 Configurer la clé API Mistral

Édite le fichier de config Node-RED :

```bash
nano ~/.node-red/settings.js
```

Trouve la section `functionGlobalContext` (elle existe déjà, souvent commentée) et ajoute :

```js
functionGlobalContext: {
    MISTRAL_API_KEY: "ta_clé_mistral_ici"
}
```

> **Pourquoi ici et pas en dur dans un node ?** Sécurité et maintenabilité. La clé est centralisée, pas dupliquée dans chaque function node. Tu y accèdes ensuite avec `global.get("MISTRAL_API_KEY")`.

Redémarre Node-RED après cette modification (`Ctrl+C` puis `node-red`).

### 0.5 Créer le dossier de données

```bash
mkdir -p ~/veille-tech/data
```

C’est là que ton fichier JSON sera stocké.

**Checklist Phase 0 :**

- [x] Node-RED installé et accessible sur `localhost:1880`
- [x] `node-red-node-feedparser` installé
- [x] Clé Mistral configurée dans `settings.js`
- [x] Dossier `~/veille-tech/data` créé

## Phase 1 — Collecte RSS

On va construire la première moitié du pipeline : récupérer les articles depuis tes sources RSS.

### 1.1 Le déclencheur — Node `inject`

Glisse un node **inject** sur le canvas (catégorie “common” dans la palette).

Double-clique dessus pour le configurer :

- **Name** : `Cron Veille`
- **Repeat** : `interval` → `at a specific time` → `06:00` every `1` day
- **Coche** : “Inject once after 0.1 seconds” (pour tester sans attendre le cron)

> **Concept Node-RED :** Le node `inject` est le point d’entrée d’un flow. Il envoie un message (`msg`) au node suivant. Ce message est un objet JavaScript avec au minimum une propriété `msg.payload`. Tu peux y mettre ce que tu veux.

### 1.2 Définir les sources — Node `function`

Glisse un node **function** (catégorie “function”) et connecte-le à la sortie du node inject.

**Name** : `Sources RSS`

**Code :**

```js
// Chaque source a un nom (pour identifier l'origine) et une URL RSS
const sources = [
    { name: "Dev.to", url: "https://dev.to/feed" },
    { name: "Nuxt Blog", url: "https://nuxt.com/blog/rss.xml" },
    { name: ".NET Blog", url: "https://devblogs.microsoft.com/dotnet/feed/" }
];

// On retourne un tableau de messages : Node-RED va envoyer
// chaque élément du tableau comme un message séparé au node suivant.
// C'est l'alternative au node Split pour ce cas précis.
return sources.map(source => ({
    payload: source.url,
    sourceName: source.name
}));
```

> **Concept clé :** Quand un function node retourne un **tableau** de messages `[msg1, msg2, msg3]`, Node-RED les envoie **séquentiellement** au node suivant. C’est différent de retourner `[[msg1, msg2, msg3]]` (un tableau dans un tableau) qui les enverrait en **parallèle**. Ici, séquentiel suffit et évite de surcharger les requêtes HTTP.

### 1.3 Récupérer le flux RSS — Node `http request`

Glisse un node **http request** (catégorie “network”) et connecte-le.

Configuration :

- **Method** : GET
- **URL** : laisser vide (on utilise `msg.payload` qui contient l’URL, le node le prend automatiquement si le champ URL est vide)

> **Pourquoi laisser URL vide ?** Quand le champ URL est vide, le node `http request` utilise `msg.url` comme URL. Or notre function node précédent met l’URL dans `msg.payload`. Il faut donc soit renommer en `msg.url` dans le function node, soit remplir l’URL avec `la syntaxe moustache triple de payload`. Choisis l’option qui te parle le plus.

**Correction du function node Sources RSS :**

```js
const sources = [
    { name: "Dev.to", url: "https://dev.to/feed" },
    { name: "Nuxt Blog", url: "https://nuxt.com/blog/rss.xml" },
    { name: ".NET Blog", url: "https://devblogs.microsoft.com/dotnet/feed/" }
];

return sources.map(source => ({
    url: source.url,       // <-- msg.url pour le http request
    sourceName: source.name
}));
```

Configuration http request :

- **Method** : GET
- **URL** : (vide — utilise `msg.url`)
- **Return** : `a UTF-8 string`

### Remplacer feedparser par : `xml` + `function`

**1. Node `xml`** (catégorie "parser", déjà installé par défaut)

Connecte-le à la sortie de ton `http request`. Config par défaut, rien à changer. Il convertit le XML brut en objet JavaScript dans `msg.payload`.

**2. Node `function` — "Extraire articles"**

Connecte-le à la sortie du node `xml` :

```js
// Les flux RSS ont 2 formats courants :
// RSS 2.0 : msg.payload.rss.channel[0].item
// Atom    : msg.payload.feed.entry

let items = [];

try {
    if (msg.payload.rss) {
        items = msg.payload.rss.channel[0].item || [];
    } else if (msg.payload.feed) {
        items = msg.payload.feed.entry || [];
    } else {
        node.warn("Format RSS non reconnu pour " + msg.sourceName);
        return null;
    }
} catch (e) {
    node.warn("Erreur extraction: " + e.message);
    return null;
}

// Retourne un message par article
return [items.map(item => ({
    payload: item,
    sourceName: msg.sourceName
}))];
```

> **Point important :** `return [items.map(...)]` avec les crochets externes -- c'est un tableau **dans** un tableau. Ça envoie tous les messages en parallèle sur la sortie 1. Sans les crochets externes, chaque élément irait sur une sortie différente (sortie 1, sortie 2, etc.), ce qui n'est pas ce qu'on veut.

**3. Adapter le node `Préparer article`** :

```js
const item = msg.payload;

// Le XML parser met les valeurs dans des tableaux (particularité du parsing XML)
// Donc item.title vaut ["Mon titre"] et non "Mon titre"
const getString = (val) => {
    if (Array.isArray(val)) return val[0] || "";
    if (typeof val === "object" && val._) return val._;
    return val || "";
};

const getLink = (val) => {
    if (Array.isArray(val)) {
        // Atom: link est un objet avec attribut href
        if (typeof val[0] === "object" && val[0].$ && val[0].$.href) {
            return val[0].$.href;
        }
        return val[0] || "";
    }
    return val || "";
};

msg.article = {
    title: getString(item.title),
    description: getString(item.description || item.summary || item.content),
    link: getLink(item.link),
    date: getString(item.pubDate || item.published || item.updated),
    source: msg.sourceName || "Inconnue"
};

if (msg.article.description.length > 2000) {
    msg.article.description = msg.article.description.substring(0, 2000) + "...";
}

return msg;
```

> **Pourquoi `getString` ?** Le node `xml` de Node-RED wrappe systématiquement les valeurs texte dans des tableaux. C'est un piège classique : tu t'attends à `"Mon titre"` et tu reçois `["Mon titre"]`. Les formats Atom ajoutent une couche avec des objets `{ _: "texte", $: { attributs } }`. Ces helpers gèrent les deux cas.

### 1.6 Vérifier les doublons — Node `function`

**Name** : `Anti-doublon`

```js
const fs = global.get('fs');
const FILE = '/home/TON_USER/veille-tech/data/articles.json';

// Charger les articles existants
let existing = [];
try {
    if (fs.existsSync(FILE)) {
        existing = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    }
} catch (e) {
    node.warn("Erreur lecture fichier: " + e.message);
    existing = [];
}

// Vérifier si l'article existe déjà (par URL)
const isDuplicate = existing.some(a => a.link === msg.article.link);

if (isDuplicate) {
    node.status({ fill: "yellow", shape: "ring", text: "doublon ignoré" });
    return null;  // null = le message ne passe pas au node suivant
}

// Stocker le chemin du fichier pour plus tard
msg.dataFile = FILE;
node.status({ fill: "green", shape: "dot", text: "nouvel article" });
return msg;
```

> **Concept :** Retourner `null` dans un function node **stoppe** le message. Il ne sera pas transmis aux nodes suivants. C’est le mécanisme de filtrage le plus simple dans Node-RED.
> **`node.status()`** affiche un petit indicateur sous le node dans l’éditeur. Très utile pour le debug visuel.

### 1.7 Premier test

Connecte un node **debug** (catégorie “common”) à la sortie du node `Préparer article`.

Configuration du debug :

- **Output** : `msg.article`

Clique sur **Deploy** (bouton rouge en haut à droite), puis clique sur le bouton à gauche du node inject pour déclencher manuellement.

Regarde l’onglet **Debug** dans le panneau droit : tu devrais voir les articles parsés avec titre, description, lien, etc.

**Checklist Phase 1 :**

- [x] Flow RSS fonctionnel (inject → sources → http → feedparser → préparer → anti-doublon)
- [x] Articles visibles dans le debug
- [x] Doublons filtrés correctement

## Phase 2 — Analyse Mistral AI

Maintenant on envoie chaque nouvel article à Mistral pour résumé et classification.

### 2.1 Préparer la requête — Node `function`

**Name** : `Requête Mistral`

```js
const apiKey = global.get("MISTRAL_API_KEY");

if (!apiKey) {
    node.error("Clé API Mistral non configurée !");
    return null;
}

msg.url = "https://api.mistral.ai/v1/chat/completions";
msg.headers = {
    "Authorization": "Bearer " + apiKey,
    "Content-Type": "application/json"
};

msg.payload = {
    model: "mistral-small-latest",
    response_format: { type: "json_object" },
    messages: [
        {
            role: "system",
            content: `Tu es un assistant de veille technologique. Tu analyses des articles tech et tu réponds UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "resume": "2-3 phrases de résumé",
  "categorie": "PERSO ou PRO ou LES_DEUX ou HORS_SCOPE",
  "score": 3,
  "tags": ["tag1", "tag2", "tag3"]
}

Règles de classification :
- PERSO : projets personnels, side projects, techno fun, apprentissage
- PRO : pertinent pour le travail en entreprise, DevOps, bonnes pratiques
- LES_DEUX : applicable aux deux contextes
- HORS_SCOPE : pas lié au développement/tech

Score de 1 à 5 :
- 1 : pas intéressant
- 2 : anecdotique
- 3 : utile, à lire quand on a le temps
- 4 : important, à lire rapidement
- 5 : critique, à lire immédiatement`
        },
        {
            role: "user",
            content: `Analyse cet article :\n\nTitre:${msg.article.title}\n\nContenu:${msg.article.description}`
        }
    ],
    temperature: 0.3
};

return msg;
```

**Points pédagogiques :**

- **`response_format: { type: "json_object" }`** : force Mistral à répondre en JSON valide. Beaucoup plus fiable que le parsing regex proposé initialement. Si le modèle ne supporte pas cette option, on retirera le paramètre et on ajoutera du parsing.
- **`mistral-small-latest`** plutôt que `mistral-large-latest` : pour du résumé/classification, le modèle small suffit largement et consomme beaucoup moins de tokens (= moins cher, plus rapide).
- **`temperature: 0.3`** : basse pour des résultats cohérents et reproductibles. On ne veut pas de créativité ici.
- **System prompt détaillé** : plus le prompt est précis sur le format attendu, moins tu auras de surprises.

### 2.2 Appel API — Node `http request`

Glisse un nouveau node **http request** :

- **Method** : POST
- **URL** : (vide — utilise `msg.url`)
- **Return** : `a parsed JSON object`

> **Important :** Sélectionne bien “a parsed JSON object” pour que la réponse soit directement utilisable en JavaScript, sans `JSON.parse()` manuel.

### 2.3 Parser la réponse — Node `function`

**Name** : `Parser réponse Mistral`

```js
try {
    const content = msg.payload.choices[0].message.content;

    // Si response_format a fonctionné, content est déjà du JSON string
    const analysis = JSON.parse(content);

    // Fusionner l'article original avec l'analyse
    msg.enriched = {
        ...msg.article,
        resume: analysis.resume || "Pas de résumé",
        categorie: analysis.categorie || "HORS_SCOPE",
        score: Number(analysis.score) || 1,
        tags: Array.isArray(analysis.tags) ? analysis.tags : [],
        analyzedAt: new Date().toISOString()
    };

    node.status({
        fill: "green",
        shape: "dot",
        text: `${msg.enriched.categorie} -${msg.enriched.score}/5`
    });

    return msg;

} catch (e) {
    node.error("Erreur parsing Mistral: " + e.message, msg);
    node.status({ fill: "red", shape: "ring", text: "erreur parsing" });

    // On stocke quand même l'article mais sans analyse
    msg.enriched = {
        ...msg.article,
        resume: "Erreur d'analyse",
        categorie: "ERREUR",
        score: 0,
        tags: [],
        analyzedAt: new Date().toISOString()
    };
    return msg;
}
```

> **Bonne pratique :** Toujours gérer le cas d’erreur. L’API peut timeout, retourner du JSON mal formé, ou simplement être indisponible. Ici, on log l’erreur mais on laisse passer l’article avec un marqueur “ERREUR” pour ne pas le perdre.

### 2.4 Gérer le rate limiting — Node `delay`

Glisse un node **delay** (catégorie “function”) **avant** le http request Mistral.

Configuration :

- **Action** : Rate Limit
- **Rate** : `1` msg per `2` Seconds

> **Pourquoi ?** L’API Mistral a des limites de requêtes par minute. En espaçant les appels de 2 secondes, tu évites les erreurs 429 (Too Many Requests). Avec 3 sources RSS et ~30 articles chacune, ça fait ~2 minutes de traitement max.

**Checklist Phase 2 :**

- [x] Appel Mistral fonctionnel
- [x] Réponse JSON parsée correctement
- [x] Rate limiting en place
- [x] Gestion d’erreur OK

## Phase 3 — Filtrage et stockage

### 3.1 Filtrer par score — Node `switch`

Glisse un node **switch** (catégorie “function”).

Configuration :

- **Property** : `msg.enriched.score`
- Règle 1 : `>=` `3` → sortie 1 (on garde)
- Règle 2 : `otherwise` → sortie 2 (on ignore)

> **Concept :** Le node `switch` est le équivalent d’un `if/else` ou `switch/case`. Tu peux avoir plusieurs sorties (ajoute des règles avec le bouton “+”). Chaque règle dirige le message vers une sortie différente.

Connecte la sortie 2 à un node **debug** nommé “Articles ignorés” pour garder une trace.

### 3.2 Stocker en JSON — Node `function`

Connecte ce node à la **sortie 1** du switch (score >= 3).

**Name** : `Stockage JSON`

```js
const fs = global.get('fs');
const FILE = msg.dataFile || '/home/TON_USER/veille-tech/data/articles.json';

// Charger les données existantes
let data = [];
try {
    if (fs.existsSync(FILE)) {
        data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    }
} catch (e) {
    node.warn("Fichier corrompu, reset: " + e.message);
    data = [];
}

// Ajouter l'article enrichi
data.push({
    id: Date.now(),
    title: msg.enriched.title,
    link: msg.enriched.link,
    source: msg.enriched.source,
    date: msg.enriched.date,
    resume: msg.enriched.resume,
    categorie: msg.enriched.categorie,
    score: msg.enriched.score,
    tags: msg.enriched.tags,
    analyzedAt: msg.enriched.analyzedAt,
    lu: false
});

// Sauvegarder
try {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2), 'utf8');
    node.status({
        fill: "green",
        shape: "dot",
        text: `${data.length} articles stockés`
    });
} catch (e) {
    node.error("Erreur écriture: " + e.message, msg);
    node.status({ fill: "red", shape: "ring", text: "erreur écriture" });
}

return msg;
```

> **Note :** Le champ `lu: false` te permettra plus tard de marquer les articles comme lus dans une interface.

### 3.3 Notification de fin — Node `function` (optionnel)

Pour savoir quand un cycle est terminé, ajoute un compteur :

**Name** : `Log résultat`

```js
node.status({
    fill: "blue",
    shape: "dot",
    text: `${msg.enriched.title.substring(0, 30)}... →${msg.enriched.score}/5`
});
return msg;
```

Connecte un **debug** final configuré sur `msg.enriched` pour voir le résultat complet.

**Checklist Phase 3 :**

- [x] Switch filtre correctement par score
- [x] Articles score >= 3 stockés dans le JSON
- [x] Articles score < 3 loggés mais non stockés
- [x] Fichier JSON lisible et bien formaté

## Résumé du flow complet

```text
[Inject - Cron 1x/jour]
    ↓
[Function - Sources RSS] → retourne un msg par source
    ↓
[HTTP Request - GET RSS]
    ↓
[Feedparser] → un msg par article
    ↓
[Function - Préparer article]
    ↓
[Function - Anti-doublon] → null si déjà vu
    ↓
[Delay - Rate limit 1msg/2s]
    ↓
[Function - Requête Mistral]
    ↓
[HTTP Request - POST Mistral API]
    ↓
[Function - Parser réponse]
    ↓
[Switch - Score >= 3 ?]
    ├── Oui → [Function - Stockage JSON] → [Debug]
    └── Non → [Debug - ignoré]
```

**Total : 11 nodes** pour un pipeline complet de veille automatisée.

## Phase 4 - Envoi automatique d’un mail récapitulatif

### Prérequis Gmail

Tu ne peux pas utiliser ton mot de passe Gmail directement. Il faut un **mot de passe d'application** :

1. Va sur [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. La 2FA doit être activée sur ton compte
3. Crée un mot de passe d'application (nom : "Node-RED")
4. Copie le mot de passe généré (16 caractères)

Ajoute-le dans `settings.js` :

```js
functionGlobalContext: {
    MISTRAL_API_KEY: "ta_clé",
    fs: require('fs'),
    GMAIL_APP_PASSWORD: "le_mot_de_passe_16_chars"
}
```

Redémarre Node-RED.

### Installation

**Manage Palette → Install** → `node-red-node-email`

### Placement dans le flow de collecte

Le problème : tes articles arrivent **un par un** dans le pipeline, mais tu veux **un seul mail** avec tous les articles score 4-5 du cycle. Il faut donc accumuler les articles puis envoyer en batch.

Ajoute ces nodes **après** le node `Stockage JSON` (en parallèle du debug) :

**1. Node `switch` — "Filtre score 4-5"**

- Property : `msg.enriched.score`
- Règle : `>=` `4`

**2. Node `function` — "Accumuler articles"**

```js
// Stocker les articles en flow context
let batch = flow.get("emailBatch") || [];

batch.push({
    title: msg.enriched.title,
    source: msg.enriched.source,
    score: msg.enriched.score,
    resume: msg.enriched.resume,
    link: msg.enriched.link,
    categorie: msg.enriched.categorie,
    tags: msg.enriched.tags
});

flow.set("emailBatch", batch);
node.status({ fill: "blue", shape: "dot", text: batch.length + " articles en attente" });

return null; // On ne passe pas au node suivant ici
```

**3. Node `function` — "Générer email"**

Ce node sera déclenché **séparément** à la fin du cycle. On y revient juste après.

```js
const batch = flow.get("emailBatch") || [];

if (batch.length === 0) {
    node.status({ fill: "yellow", shape: "ring", text: "rien à envoyer" });
    return null;
}

const date = new Date().toLocaleDateString('fr-FR');

let html = `<h2>Veille Tech — ${date}</h2>`;
html += `<p>${batch.length} article(s) score 4-5</p><hr>`;

batch.forEach(a => {
    html += `
    <div style="margin-bottom: 20px;">
        <h3><a href="${a.link}">${a.title}</a></h3>
        <p><strong>${a.source}</strong> | ${a.categorie} | Score: ${"⭐".repeat(a.score)}</p>
        <p>${a.resume}</p>
        <p style="color: #666; font-size: 12px;">Tags: ${Array.isArray(a.tags) ? a.tags.join(', ') : a.tags}</p>
    </div>`;
});

flow.set("emailBatch", [])
node.status({fill:"green",shape:"dot",text:batch.length + " envoyés"});

return {
    to: "a.antoinecoulon@gmail.com",
    topic: `Veille Tech — ${batch.length} article(s) à lire — ${date}`,
    payload: html
};
```

**4. Node `email` (email out)**

Configuration :

- **To** : laisser vide (on utilise `msg.to`)
- **Server** : `smtp.gmail.com`
- **Port** : `465`
- **Secure** : cocher (SSL)
- **Userid** : `ton_email@gmail.com`
- **Password** : utilise le mot de passe d'application (tu peux le mettre en dur ici ou le lire via un function node avec `global.get("GMAIL_APP_PASSWORD")`)

### Déclencher l'envoi en fin de cycle

C'est la partie délicate : comment savoir que le cycle est terminé ? Le plus simple est un **node `delay`** en mode **debounce** :

**Node `delay` — "Attente fin cycle"**

Connecte-le à la sortie du node `Stockage JSON` (en parallèle de "Filtre score 4-5") :

- **Action** : Rate Limit - All messages
- **Mode** : `Last message` (debounce)
- **Délai** : `30` seconds

Chaque article reçu relance le timer. Quand plus rien n'arrive pendant 30 secondes, il laisse passer le dernier message → c'est le signal de fin de cycle.

Connecte la sortie de ce delay → `Générer email` → `email out`.

### Résumé du câblage

```text
[Stockage JSON]
    ├→ [Debug existant]
    ├→ [Switch score >= 4] → [Accumuler articles]
    └→ [Delay debounce 30s] → [Générer email] → [Email out]
```

Le delay et l'accumulation travaillent en parallèle : les articles s'empilent dans le batch, et quand le cycle est terminé (30s sans nouveau message), le mail part avec tout ce qui a été accumulé.

## Conseils de debug

| Problème | Solution |
| --- | --- |
| Aucun article en sortie du feedparser | Vérifie que l’URL RSS est valide (teste dans ton navigateur d’abord) |
| Erreur 401 Mistral | Vérifie ta clé API dans `settings.js` et que tu as bien redémarré Node-RED |
| Erreur 429 Mistral | Augmente le délai dans le node delay (3-5 secondes) |
| JSON corrompu | Supprime `articles.json` et relance — le flow recréera le fichier |
| Feedparser ne reçoit rien | Vérifie que le http request retourne bien du XML (mets un debug entre les deux) |
| `global.get()` retourne undefined | Tu as oublié de redémarrer Node-RED après avoir modifié `settings.js` |

## Phase 5 — Dashboard Node-RED

Le flow dashboard est **séparé** de ton flow de collecte (onglet différent), ce qui garde les choses propres. Les deux communiquent uniquement via le fichier JSON.

### Objectif

Créer une interface web locale pour consulter, filtrer et gérer les articles collectés par ton pipeline de veille. Accessible sur `http://localhost:1880/dashboard`.

## Installation dashboard

### 0.1 Installer le module dashboard

Dans Node-RED : **Menu (☰) → Manage Palette → Install** → cherche `@flowfuse/node-red-dashboard`.

> **Pourquoi `@flowfuse/node-red-dashboard` et pas `node-red-dashboard` ?** L'ancien package (`node-red-dashboard`) n'est plus maintenu. La v2 par FlowFuse est la succession officielle, basée sur Vue 3 et activement développée. Elle utilise un système de pages et layouts plus flexible.

Après installation, tu verras une nouvelle catégorie **dashboard 2.0** dans ta palette.

### 0.2 Comprendre la hiérarchie dashboard

Le dashboard v2 organise l'interface en 3 niveaux :

```text
Dashboard (config globale)
  └── Page (un onglet/écran)
       └── Group (une section dans la page)
            └── Widgets (tableau, texte, bouton, graphique...)
```

Tu configures ces niveaux **dans les nodes eux-mêmes** : chaque widget te demande à quel Group il appartient, et chaque Group appartient à une Page. Node-RED crée les configs automatiquement quand tu les définis la première fois.

## Charger les données

On va créer un **nouveau flow** (onglet) dédié au dashboard pour ne pas encombrer ton flow de collecte.

**Menu (☰) → Flows → Add** ou double-clic sur un onglet vide. Nomme-le `Dashboard Veille`.

### 1.1 Endpoint de chargement — Node `function`

Ce node lit le JSON et prépare les données pour les widgets.

**Name** : `Charger articles`

```javascript
const fs = global.get('fs');
const FILE = '/home/antoinecoulon/veille-tech/data/articles.json';

let articles = [];
try {
    const raw = fs.readFileSync(FILE, 'utf8');
    articles = JSON.parse(raw);
} catch (e) {
    node.warn("Erreur lecture: " + e.message);
}

// Trier par date décroissante (plus récent en premier)
articles.sort((a, b) => new Date(b.date) - new Date(a.date));

msg.payload = articles;
return msg;
```

### 1.2 Déclencher le chargement

Deux déclencheurs connectés au node `Charger articles` :

**Node `inject`** :

- Name : `Auto-refresh`
- Repeat : `interval` → every `5` minutes
- Cocher "Inject once after 0.1 seconds"

**Node `ui-event`** (catégorie dashboard 2.0) :

- Écoute l'événement `$pageview` pour recharger les données quand l'utilisateur ouvre la page

> Les deux déclencheurs alimentent le même node `Charger articles`. Connecte les deux sorties vers son entrée.

## Tableau d'articles

### 2.1 Node `ui-table`

Glisse un node **ui-table** (catégorie dashboard 2.0) et connecte-le à `Charger articles`.

Configuration :

- **Group** : clique sur le crayon pour créer un nouveau group
  - **Name** : `Articles`
  - **Page** : clique sur le crayon pour créer une nouvelle page
    - **Name** : `Veille Tech`
    - **Layout** : `Grid`
  - **Width** : `12` (pleine largeur)
- **Max rows** : `50`
- **Auto columns** : décocher
- **Columns** (ajoute manuellement) :

| Key | Title | Width |
| ----- | ------- | ------- |
| `score` | Score | 60px |
| `categorie` | Cat. | 80px |
| `title` | Titre | 300px |
| `source` | Source | 100px |
| `resume` | Résumé | auto |
| `date` | Date | 120px |

> **Concept :** `ui-table` prend un `msg.payload` qui est un tableau d'objets. Chaque objet = une ligne. Les clés des objets sont mappées aux colonnes. C'est exactement le format de ton JSON.

### 2.2 Formater les données pour le tableau — Node `function`

Insère ce node **entre** `Charger articles` et `ui-table` :

**Name** : `Formater pour tableau`

```javascript
msg.payload = msg.payload.map(article => ({
    score: "⭐".repeat(article.score || 0),
    categorie: article.categorie,
    title: article.title,
    source: article.source,
    resume: article.resume || "",
    date: new Date(article.date).toLocaleDateString('fr-FR'),
    link: article.link,
    tags: Array.isArray(article.tags) ? article.tags.join(', ') : ''
}));

return msg;
```

## Statistiques

### 3.1 Calculer les stats — Node `function`

Connecte-le à `Charger articles` (en parallèle du tableau, pas en série).

**Name** : `Calculer stats`

```javascript
const articles = msg.payload;

const stats = {
    total: articles.length,
    parCategorie: {},
    parSource: {},
    scoreMoyen: 0,
    nonLus: articles.filter(a => !a.lu).length
};

let totalScore = 0;

articles.forEach(a => {
    // Par catégorie
    const cat = a.categorie || "INCONNU";
    stats.parCategorie[cat] = (stats.parCategorie[cat] || 0) + 1;

    // Par source
    const src = a.source || "Inconnue";
    stats.parSource[src] = (stats.parSource[src] || 0) + 1;

    totalScore += (a.score || 0);
});

stats.scoreMoyen = articles.length > 0
    ? (totalScore / articles.length).toFixed(1)
    : 0;

// Envoyer sur plusieurs sorties pour alimenter différents widgets
// Sortie 1 : stats texte
// Sortie 2 : données catégories (pour graphique)
// Sortie 3 : données sources (pour graphique)

const msgStats = {
    payload: `${stats.total} articles | ${stats.nonLus} non lus | Score moyen : ${stats.scoreMoyen}/5`
};

const msgCategories = {
    payload: Object.entries(stats.parCategorie).map(([label, value]) => ({
        x: label,
        y: value
    }))
};

const msgSources = {
    payload: Object.entries(stats.parSource).map(([label, value]) => ({
        x: label,
        y: value
    }))
};

return [msgStats, msgCategories, msgSources];
```

**Important :** configure ce function node avec **3 sorties** (champ "Outputs" dans la config du node).

### 3.2 Afficher le résumé — Node `ui-text`

Connecte à la **sortie 1** de `Calculer stats`.

Configuration :

- **Group** : crée un nouveau group `Statistiques` (dans la même page `Veille Tech`)
- **Width** : `12`
- **Label** : laisser vide
- **Layout** : `Row`

### 3.3 Graphique par catégorie — Node `ui-chart`

Connecte à la **sortie 2** de `Calculer stats`.

Configuration :

- **Group** : `Statistiques`
- **Type** : `Bar`
- **Label** : `Par catégorie`
- **Width** : `6`

### 3.4 Graphique par source — Node `ui-chart`

Connecte à la **sortie 3** de `Calculer stats`.

Configuration :

- **Group** : `Statistiques`
- **Type** : `Bar` ou `Doughnut`
- **Label** : `Par source`
- **Width** : `6`

## Filtres

### 4.1 Filtre par catégorie — Node `ui-dropdown`

**Name** : `Filtre catégorie`

Configuration :

- **Group** : crée un nouveau group `Filtres` (dans la même page, positionne-le en haut)
- **Label** : `Catégorie`
- **Options** :
  - `Toutes` → valeur : `ALL`
  - `PERSO` → valeur : `PERSO`
  - `PRO` → valeur : `PRO`
  - `LES_DEUX` → valeur : `LES_DEUX`
- **Width** : `3`

### 4.2 Filtre par score minimum — Node `ui-dropdown`

**Name** : `Filtre score`

Configuration :

- **Group** : `Filtres`
- **Label** : `Score min.`
- **Options** :
  - `Tous` → valeur : `0`
  - `≥ 3` → valeur : `3`
  - `≥ 4` → valeur : `4`
  - `= 5` → valeur : `5`
- **Width** : `3`

### 4.3 Appliquer les filtres — Node `function`

Le principe : les dropdowns envoient un message quand l'utilisateur change la sélection. On stocke la valeur en flow context, puis on recharge et filtre les articles.

**Name** : `Appliquer filtres`

```javascript
// Stocker les valeurs des filtres dans le flow context
// msg.topic permet d'identifier quel dropdown a envoyé le message
if (msg.topic === "categorie") {
    flow.set("filtreCategorie", msg.payload);
} else if (msg.topic === "score") {
    flow.set("filtreScore", Number(msg.payload));
}

// Charger tous les articles
const fs = global.get('fs');
const FILE = '/home/antoinecoulon/veille-tech/data/articles.json';

let articles = [];
try {
    articles = JSON.parse(fs.readFileSync(FILE, 'utf8'));
} catch (e) {
    return null;
}

// Appliquer les filtres
const catFiltre = flow.get("filtreCategorie") || "ALL";
const scoreFiltre = flow.get("filtreScore") || 0;

articles = articles.filter(a => {
    if (catFiltre !== "ALL" && a.categorie !== catFiltre) return false;
    if ((a.score || 0) < scoreFiltre) return false;
    return true;
});

articles.sort((a, b) => new Date(b.date) - new Date(a.date));

msg.payload = articles;
return msg;
```

> **Concept `flow.set()` / `flow.get()` :** Le flow context est un espace mémoire partagé entre tous les nodes d'un même flow (onglet). Il persiste tant que Node-RED tourne. Parfait pour stocker l'état des filtres.

**Connexions :**

- Connecte `Filtre catégorie` → `Appliquer filtres`
- Connecte `Filtre score` → `Appliquer filtres`

Mais il faut distinguer quel dropdown a envoyé le message. Configure le **Topic** dans chaque dropdown :

- `Filtre catégorie` → Topic : `categorie`
- `Filtre score` → Topic : `score`

Connecte la sortie de `Appliquer filtres` → `Formater pour tableau` → `ui-table`.

> Le tableau se mettra à jour à chaque changement de filtre.

## Bouton de rafraîchissement

### Node `ui-button`

Configuration :

- **Group** : `Filtres`
- **Label** : `Rafraîchir`
- **Width** : `2`

Connecte-le à `Charger articles` pour relancer le chargement complet.

## Résumé du flow Dashboard

```text
[Inject 5min] ──┐
[ui-event]   ───┤
[ui-button]  ───┴→ [Charger articles]
                        ├→ [Formater pour tableau] → [ui-table]
                        └→ [Calculer stats]
                              ├→ sortie 1 → [ui-text résumé]
                              ├→ sortie 2 → [ui-chart catégories]
                              └→ sortie 3 → [ui-chart sources]

[Filtre catégorie] ──┬→ [Appliquer filtres] → [Formater pour tableau] → [ui-table]
[Filtre score]    ───┘
```

## Accès au dashboard

Après deploy, ouvre : `http://localhost:1880/dashboard`

## Problèmes courants

| Problème | Solution |
| ---------- | ---------- |
| Page blanche sur /dashboard | Vérifie que les widgets ont bien un Group et une Page assignés |
| Tableau vide | Mets un debug après `Charger articles` pour vérifier que le JSON se charge |
| Filtres ne réagissent pas | Vérifie que le Topic est bien configuré sur chaque dropdown |
| Graphiques vides | Vérifie que `Calculer stats` a bien 3 sorties configurées |
| Layout cassé | Ajuste les Width des groups et widgets — la grille fait 12 colonnes |

## Évolutions possibles

- **Clic sur un article** → ouvrir le lien dans un nouvel onglet (via `ui-template` avec du HTML custom)
- **Bouton "Marquer lu"** → met à jour le champ `lu` dans le JSON
- **Filtre par tags** → un troisième dropdown alimenté dynamiquement
- **Export** → bouton qui génère un résumé hebdo en markdown
