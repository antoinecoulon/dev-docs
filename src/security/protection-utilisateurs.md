# Protection et authentification utilisateurs

# Passwords

# Stocker des mots de passe

**Ne jamais stocker des mots de passe en clair dans une base de données. Jamais.**

Une fois ce rappel obligatoire fait, nous pouvons passer au cœur du problème, à savoir : **quelles sont les bonnes pratiques pour stocker les mots de passe de vos utilisateurs ?**

Tout d'abord, vous devez vous mettre en tête que peu importe la taille de votre site, un attaquant sera éventuellement capable de :

- Récupérer les informations de **votre base de données**
- Avoir accès au **code source** du serveur
- Automatiser des **actions pour essayer de s'introduire**

**Bien sûr, votre objectif est de tout faire pour éviter que cela arrive**, mais il faut que vous gardiez ces informations en tête lors de la conception de votre système de mots de passe.

## **Communiquer en https**

La première étape est de sécuriser votre site web (ou votre application) en forçant la communication par https car **lors de l'inscription ou de la connexion, le mot de passe de votre utilisateur sera envoyé en clair dans la requête.**

Pour éviter tout problème d'interception des données, **assurez vous que le chiffrement de ces données soit effectué grâce à un certificat SSL**, c'est la première étape de sécurisation du mot de passe.

## **Hashage**

Une fois arrivé sur le serveur, le mot de passe devra être "hashé" avant d'être sauvegardé en base de données. **Attention, on ne chiffre (encrypte) pas le mot de passe, mais on le hash, les deux notions sont complètement différentes.**

**Une donnée chiffrée doit pouvoir être déchiffrée grâce à la clé** de chiffrement utilisée et l'on doit pouvoir retrouver l'information originelle intacte, les méthodes de hashages sont dites "destructives".

## **Grain de sel**

À première vue, lorsque vos mots de passe sont hashés avec un algorithme suffisamment sécurisé, même si votre base de données subit une fuite, **les attaquants n'auront pas directement accès aux mots passe de clairs.**

Mais si ces dernier arrivent à découvrir quel algorithme de hashage a été utilisé (ce qui est possible), il leur reste quand même la possibilité de générer des mots de passe et de les comparer aux hashs trouvés en utilisant des techniques comme  :

- Le brut-force: Tester toutes les possibilités de suites de caractères différents
- Les dictionnaires : Tester des combinaisons de mots issus des informations personnels et de mots usuels

**Certains attaquants utilisent même ce qu'on appelle des "rainbow-table", d'immenses tableaux de hashs déjà générés** (avec les méthodes ci-dessus) avec l'algorithme de hashage trouvé précédemment, ces tableaux peuvent parfois peser jusqu'à plusieurs Tera-octets.

**Pour freiner (voir empêcher) ces attaques, on utilise la méthode du grain de sel (ou du salage)** qui consiste à ajouter une chaine de caractères au mot de passe avant qu'il ne soit hashé.

Ce grain de sel permet de **rallonger la taille du mot de passe de base** (et donc de le rendre plus long à craquer, car plus long à générer), et de **limiter l'utilisation de dictionnaires et des rainbow-tables.**

### **Statique**

**Le salage statique consiste à ajouter toujours la même chaine de caractères pour tous les mots de passe enregistrés**, ce grain de sel doit rester secret, car sinon son efficacité est corrompue.

**Cette technique permet de ralentir la récupération des mots de passe, mais elle n'empêche pas l'utilisation de rainbow-tables**, ces dernières devront simplement être générées spécifiquement pour ce site en particulier.

### **Dynamique**

**Le salage dynamique consiste à générer aléatoirement un grain de sel pour chaque utilisateur**, et de le stocker en plus du mot de passe dans la base de donnée (ou au mieux dans une base de donnée séparée).

**Cette technique vise notamment à empêcher l'utilisation d'une rainbow-table sur l'entièreté de la base de données**, car chaque utilisateur ayant un grain de sel différent, il est impossible de pré-calculer tous les hashs pour tous les grains de sels possibles.

# JWT

## **Utilisation**

La première chose à comprendre, c’est que **les tokens JWT sont utilisés dans des systèmes d’authentification** (ou d’identification), mais ils ne suffisent pas à eux seuls pour gérer tout l’authentification !

> Un token, c’est simplement un jeton, un identifiant qui va être échangé
> 

Au casino, vous échangez un morceau de plastique (le jeton), contre une valeur financière (disons 50€), et bien dans une application, **vous allez échanger votre jeton contre des données et des droits d’accès.**

Mais contrairement aux jetons de casino, **votre “token” contient des informations**, vous concernant (l’utilisateur) et permet de vous identifier, et de prouver que c’est bien vous qui effectuez la demande !

Et l’avantage, c’est que vous ne perdez pas votre jeton en le partageant avec un serveur d’authentification, **vous envoyez simplement une copie de ce jeton, qui pourra être lu par le serveur pour vous identifier !**

> Mais comment ça fonctionne exactement ?
> 

## **Fonctionnement**

### **La structure d'un token JWT**

Voilà un token d’exemple :

```sql
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNjM4MzA2MzYyfQ.tzN8XdOlxOQo6fEOMY25Gbn6cNF5iYAOXA-oy89fJEg

```

> Ca ressemble à n’importe quel identifiant unique chiffré me direz-vous !
> 

**Et pourtant, on est très loin du compte, car un token JWT n’est pas chiffré, il est signé**, ce qui est très différent : ça signifie entre autre que **son contenu est complètement public !**

La preuve, si vous copiez-coller le token précédent sur le site [*jwt.io*](http://jwt.io/), vous obtiendrez le résultat suivant :

```jsx
// header
{
  "alg": "HS256",
  "typ": "JWT"
}

// payload
{
  "sub": "1234567890",
  "name": "John Doe",
  "exp": 1638306362
}

```

> Observez le payload, vous verrez deux informations importantes, un nom et un id : “John Doe” et “1234567890”
> 

**Un JWT est composé de trois parties** : l'en-tête (header), la charge utile (payload), et la signature (que nous verrons juste après).

L’en-tête et la charge utile sont simplement deux objets JSON, et pour former le token (la chaîne de caractère), il suffit de changer leur encodage en Base64, comme ceci :

```jsx
const str = JSON.Stringify({
  "alg": "HS256",
  "typ": "JWT"
})

const header = btoa(str);//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> La méthode btoa(…) permet de convertir en Base64, et il suffirait de faire la même chose avec le payload pour reconstituer notre token (sauf pour la signature)
> 

Mais décortiquons maintenant le contenu de ce dernier :

### **En-tête (Header)**

L'en-tête contient des métadonnées sur le type de token et l'algorithme de signature utilisé. Il ressemble à quelque chose comme ceci :

```json
{
  "alg": "HS256",
  "typ": "JWT"
}

```

### **Charge Utile (Payload)**

La charge utile transporte tout ce dont vous aurez besoin pour identifier un utilisateur, un exemple basique :

```json
{
  "sub": "1234567890",
  "name": "John Doe"
  "exp": 1638306362
}

```

> C’est vous qui décidez ce dont vous avez besoin dans le payload !
> 

Mais il y a quelques conventions qu’il est utile de respecter :

- “sub” représente l’identifiant utilisateur
- “exp” représente la date d’expiration du token (timestamp)

### **Signature**

Mais la partie la plus importante d’un token, et qu’il nous reste à expliquer, **c’est la signature !**

> C’est comme sur un chèque pour la banque, mais en plus sécurisé…
> 

On pourrait penser que si il est possible de transformer un simple objet JSON, et de passer en Base64, il serait possible de se faire passer pour n’importe quel utilisateur !

Sauf qu’il vous manquera la signature… Et lorsque le serveur ouvrira le jeton falsifié, et **verra que la signature ne concorde pas avec celle attendue, il rejettera le token immédiatement !**

Pour créer cette signature, on a besoin de trois choses :

- l'en-tête du token
- la charge utile du token
- une clé secrète (à ne jamais partager)
- un algorithme spécifié dans l'en-tête (dans notre exemple, "HS256")

> Et c’est en passant tout cela à la moulinette, que l’on va pouvoir signer notre token !
> 

Et comme la clé secrète ne quitte jamais le serveur, alors **il sera impossible pour quelqu’un d’autre d’emettre un token falsifié !**

Autrement dit, **si le serveur valide la signature, il peut utiliser les informations** contenues dans le “payload” les yeux fermés, et identifier l’utilisateur !

> On parle aussi de “lecture publique, écriture privée”
> 

## **Conclusion**

Un token JWT est un jeton d’identification contenant les informations nécessaires à un serveur pour authentifier l’utilisateur (souvent l’identifiant de ce dernier en base de données).

Le serveur peut se fier au token, si et seulement si la signature correspond à celle attendu, cela fait l’effet d’un sceau virtuel qui garantit que les données sont fiables et intègres.

> Seul le serveur est habilité à créer un token JWT valide, car lui seul possède la clé privée !
>

# Hashage

**Le hashage consiste à faire passer une donnée d'une taille arbitraire dans une fonction qui va la transformer en une donnée d'une taille définie.**

> Pour les mots de passe par exemple, la taille de sortie est souvent plus grande que l'entrée.
> 

**Contrairement au chiffrement, une fonction de hashage est destructive** (ou unilatéral) car on perd de la donnée d'origine, il est impossible de revenir en arrière.

## **Concept simplifié**

**Prenons une fonction de hashage théorique la plus simple possible**, disons que notre fonction prend une chaine de caractère en entrée, et retourne sa taille :

> f(x) => taille(x)
> 

Ce qui nous donne "bonjour" => 7, "password" => 8 et "chien" => 5

## **Pourquoi utiliser un hash ?**

### **Pour les mots de passe**

On voit bien dans l'exemple précédent, qu'une fois passé dans la fonction, **le mot de passe n'est plus récupérable, donc si on le stocke dans une base de données, il est "protégé".**

> Impossible de récupérer le mot "bonjour" à partir du simple chiffre 7
> 

Pour l'authentification, il suffira de hasher en direct le mot de passe fourni par l'utilisateur et le comparer au hash stocké dans la base, **car la fonction de hashage doit toujours retourner le même hash pour la même donnée en entrée.**

### **Pour simplifier/représenter des données**

Un hash est une représentation simplifiée d'une donnée. Il existe beaucoup d'algorithmes différent, mais la bonne pratique veut que **deux hashs, issus de deux données quasi-similaires à quelques bits près, soient eux, très différents.**

> Exemple théorique: le hash du mot "hello" égal "ABCDEF" tandis que le hash de "hellp" égal "ZYXWV"
> 

Ce qui signifie que la comparaison entre les hashs, plutôt que les données d'origines est plus optimisée, car **les premiers bits du hash sont déjà différents.**

Et dans le cas de comparaison de gros fichier, le hash utilisé sera beaucoup plus léger que l'entièreté des données contenues, **donc la comparaison sera plus efficace, c'est ce que l'on appelle le "checksum".**

## **Quels algorithmes ?**

Vous l'aurez compris, le problème avec notre fonction de hashage simplifiée, ce sont les collisions. Car en l'occurence, le hash de "bonjour" est égal à 7 mais le hash de "baisers" est aussi égal à 7, **c'est ce que l'on appelle une collision, est c'est l'une des problématiques du hashage.**

**En pratique, les fonctions de hashage cryptographique génère des hash assez longs, parfois plus longs que la valeur d'entrée**, par exemple le hash du mot "bonjour" avec l'algorithme SHA-256 est égale à :

> 2cb4b1431b84ec15d35ed83bb927e27e8967d75f4bcd9cc4b25c8d879ae23e18
> 

alors que le hash du mot "baisers" est égal à :

> 73beed7425bd31551890c0727f4b169cd99b5c708fa8d50a713747e0878e2580
> 

**La complexité d'une algorithme de hashage réside dans son ratio entre le temps d'exécution et le nombre de collisions possibles**, par exemple la famille d'algorithme SHA est plus rapide à s'exécuter, mais son nombre de collision possible est plus élevé que d'autres algorithme comme le Bcrypt.

À moins que la contrainte de temps d'exécution soit une grosse problématique, **il est recommandé d'utiliser l'algorithme BCrypt pour les mots de passe par exemple.**

Mais il existe également d'autres algorithmes encore plus rapides, car les collisions sont moins critiques, **comme le hash MD5 qui est très rapide et permet de faire du checksum de manière efficace !**

# Chiffrement

## **Concept**

Le chiffrement symétrique, même le plus basique, est basé sur deux outils : **Un algorithme de chiffrement/déchiffrement, et une clé.**

Le fonctionnement est le suivant :

![](https://cellar-c2.services.clever-cloud.com/content/2022/01/schema-asymetrique.jpg)

**Les participants se mettent d'accord sur un algorithme** de chiffrement commun (souvent inhérent au système utilisé pour communiquer). **L'un des participants génère une clé**, qu'il ne va distribuer qu'aux autres participants à la discussion, de manière discrète (mais non sécurisée).

**Une fois la clé reçu, chaque message sera chiffré en utilisant l'algorithme couplé à la clé**, et déchiffré de la même manière, de sorte à ce qu'uniquement les participants ayant accès à la clé puissent lire et envoyer des messages.

## **Algorithmes**

Il existe plusieurs **familles d'algorithmes de chiffrement symétrique**, que voici dans leurs formes les plus simple :

### **Substitution mono-alphabétique**

La première famille d'algorithme consiste très simplement à **remplacer chaque lettre du texte, par une lettre correspondante**, prise dans un "tableau" de correspondance.

> L'un des algorithmes les plus connus (bien que ne présentant aujourd'hui aucune sécurité), est le "Code de César".
> 

**Ce dernier consiste à décaler chaque lettre, d'un certain nombre de places dans l'alphabet**, et ce nombre servira de clé pour chiffrer, déchiffrer.

Pour la clé "1", chaque lettre sera déplacée 1 fois vers la droite (a devient b, b devient c, c devient d, etc...). **L'exemple ci-dessous représente un texte chiffré avec le code de César, et la clé "13"**, c'est ce qu'on appelle le [*ROT13*](https://fr.wikipedia.org/wiki/ROT13).

> Exemple : "Hello World !" => "Uryyb jbeyq !"
> 

### **Substitution poly-alphabétique**

Le principal problème de la famille des "mono-alphabétique", c'est que chaque lettre du texte original, **n'a qu'une seule lettre équivalente dans le texte chiffré.**

En clair, si l'on connait la langue d'origine, alors en regardant **la distributivité des lettres, le code est facilement déchiffrable.**

C'est pourquoi il existe des substitution poly-alphabétique, c'est à dire que **l'algorithme ne prendra pas seulement la clé comme référence, mais également la position de la lettre** dans la phrase d'origine.

**C'est la base du fonctionnement de la machine de chiffrement Allemande "[*Enigma*](https://fr.wikipedia.org/wiki/Enigma_(machine))"**, utilisée pendant la seconde guerre mondiale et "crackée" par Alan Turing et son équipe au "Bletchley Park"

> Exemple : "Hello World !" => "flqib shgpm !"
> 

### **Permutation**

La permutation simple est algorithme très simple à déchiffrer, mais **il apporte le fait de "casser" la structure du texte**, en déplaçant les espaces, les lettres et donc en destructurant les mots.

L'exemple ci-dessous permutte simplement chaque couple de lettre :

> Exemple :  "Hello World !" => "eHll ooWlr d!"
> 

### **Hybride (Substitution + Permutation)**

Comme on l'a vu, **chacune des familles précédentes nous offre une sécurité de l'information chiffrée supplémentaire**, ce qui signifie qu'en pratique, on va implémenter une famille hybride :

> On combine substitution poly-alphabétique, permutations et une clé privée complexe afin d'avoir une solution de chiffrement/déchiffrement solide.
> 

> Exemple :  "Hello World !" => "JsOL d$ aNdls"
> 

## **En pratique**

### **AES**

Il existe des dizaines d'algorithmes de chiffrement symétrique utilisé dans l'industrie, **mais si l'on ne devait en connaitre qu'un seul, ce serait sûrement l'algorithme AES.**

A[*ES*](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) signifie "Advanced Encryption Standard" et est un algorithme existant sous plusieurs version pour différents usages. **Il est par exemple utilisé pour le chiffrement des données transmises en Wi-Fi, le protocole HTTPS.**

Je ne vais pas rentrer dans les détails de l'implémentation AES car il est très complexe, mais voilà ce qu'il faut retenir :

Contrairement aux algorithmes basiques présentés ci-dessus, ce dernier ne chiffre pas de simples phrases, mais directement de la données **sous forme de matrices de bits, et que les clés associées sont en général constitué de 128, 192 ou 256 bits**.

Si vous voulez en savoir plus, je vous invite à **lire cet article pour comprendre le fonctionnement exact d'AES** : [*https://securityboulevard.com/2020/04/advanced-encryption-standard-aes-what-it-is-and-how-it-works/*](https://securityboulevard.com/2020/04/advanced-encryption-standard-aes-what-it-is-and-how-it-works/)

### **Avantages/Inconvénients**

En utilisant un algorithme suffisamment solide et une clé suffisament complexe, les algorithmes de chiffrement comme AES sont très rapides à exécuter, **ce qui permet d'avoir une grande solidité tout en étant efficient** sur le chiffrement et le déchiffrement.

> Pour information, craquer une information par brute force chiffrée en AES-256 prendrait environs 27 337 893 038 406 611 194 430 009 974 922 940 323 611 067 429 756 962 487 493 203 années.
> 

**Néanmoins, les algorithmes de chiffrement symétriques possèdent une grande faille : le partage de la clé privée.** Si la clé est interceptée pendant le partage, alors toutes les communications peuvent être interceptées.

C'est pour cela que certains systèmes ([*comme le SSL*](https://www.f5.com/services/resources/glossary/ssl-tls-encryption)) utilisent à la fois **un chiffrement asymétrique** pour transférer la clé, et chiffrent les données finales **de manières symétriques.**

## **En résumé**

Le chiffrement symétrique fonctionne de la manière suivante : **Génération de la clé privée, partage de la clé, chiffrement et déchifrement avec la même clé.**

**Ce système est le plus rapide mais possède également une faille** lors du transfert de la clé privée.

**Le chiffrement symétrique est donc parfois utilisée conjointement avec du chiffrement asymétrique**, comme c'est le cas pour le SSL dont les paquets sont chiffrés avec l'algorithme AES.
