# Guide transformation Tour -> NAS

## PHASE 1 : ÉTAT DES LIEUX (depuis Windows actuel)

Avant de toucher à quoi que ce soit

### Récupération données

```powershell
# Lancer PowerShell en admin, scanner les gros dossiers
Get-ChildItem C:\ -Recurse -Directory | 
    Where-Object {$_.Name -match "Documents|Pictures|Music|Videos|Downloads"} |
    ForEach-Object { "$($_.FullName) - $('{0:N2}' -f ((Get-ChildItem $_.FullName -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB)) GB" }
```

Cherche manuellement :

```powershell
C:\Users\[ton_user]\Documents
C:\Users\[ton_user]\Pictures
C:\Users\[ton_user]\Music
D:\ ou autres partitions si disques multiples
```

-> Copie tout vers ton PopOS via clé USB/réseau local.

### Inventaire matériel

```powershell
# Infos système
systeminfo | findstr /C:"Total Physical Memory" /C:"Processor"

# Disques disponibles
wmic diskdrive get size,model,interfacetype
```

Note :

- RAM (minimum 2GB pour NAS basique, 4GB+ confortable)
- CPU (peu importe, même vieux suffit)
- Disques durs (nombre, taille, état SMART)

## PHASE 2 : CHOIX DISTRIBUTION

**Critères** : simplicité, stabilité, faible consommation

Distribution | Profil | Avantages | Inconvénients |
------------ | ------ | --------- | ------------- |
OpenMediaVault | NAS clé en main | Interface web simple, plugins, basé Debian | Moins flexible, orienté NAS pur |
TrueNAS CORE | NAS pro | ZFS natif, snapshots, robuste | Gourmand RAM (8GB min), complexe |
Ubuntu Server | Polyvalent | Familier, communauté, évolutif | Config manuelle, plus lourd |
Debian minimal | Puriste | Ultra léger, stable rock | Tout en CLI, courbe apprentissage |

-> Mon conseil critique : OpenMediaVault pour toi

- Interface web intuitive
- Plugins (Docker, Rsync, etc.)
- Basé Debian (stable)
- Tu l'administres depuis ton navigateur, pas besoin de clavier/écran branché

*Alternative si tu veux apprendre* : Ubuntu Server + Cockpit (interface web)

## PHASE 3 : INSTALLATION

### Préparation

Créer clé USB bootable

```bash
# Depuis ton PopOS
# Télécharger OpenMediaVault ISO
wget https://www.openmediavault.org/download.html

# Flasher sur clé USB (remplace sdX par ta clé)
sudo dd if=openmediavault-*.iso of=/dev/sdX bs=4M status=progress
sync
```

### Installation

Boot sur clé USB (F12/DEL au démarrage)

**Installation guidée Debian :**

- Disque système : petit SSD/HDD dédié (20GB suffit)
- Disques données : ne pas toucher pendant install, on configure après
- Config réseau : IP fixe (ex: 192.168.1.100)
- Pas d'interface graphique
- Install serveur SSH

## PHASE 4 : CONFIGURATION NAS

### Premier accès

```bash
# Depuis ton PopOS, tester connexion
ping 192.168.1.100  # IP de ton NAS
ssh root@192.168.1.100  # Mot de passe défini à l'install

# Interface web : http://192.168.1.100
# User: admin / Password: openmediavault
```

### Configuration initiale

- Changer mot de passe admin (interface web)
- Préparer disques de stockage
  - Storage → Disks : voir tes disques
  - Storage → File Systems : créer ext4 sur disque données
- Monter le système de fichiers

### Créer partage réseau

- Services → SMB/CIFS : activer
- Access Rights Management → Shared Folders : créer dossier
- Services → SMB/CIFS → Shares : exposer dossier
- Créer utilisateur (Users)
- Donner permissions (ACL)

### Monter sur ton PopOS

```bash
# Installer client SMB
sudo apt install cifs-utils

# Créer point de montage
sudo mkdir /mnt/nas

# Monter manuellement (test)
sudo mount -t cifs //192.168.1.100/partage /mnt/nas -o username=ton_user,password=ton_pass

# Auto-montage au démarrage (/etc/fstab)
echo "//192.168.1.100/partage /mnt/nas cifs username=ton_user,password=ton_pass,iocharset=utf8 0 0" | sudo tee -a /etc/fstab
```

## PHASE 5 : OPTIMISATIONS

### Performances

-> Disques : mode économie

```bash
# SSH sur NAS
# Installer hd-idle
apt install hd-idle

# Config : /etc/default/hd-idle
# Arrêt disques après 10min inactivité
HD_IDLE_OPTS="-i 600"
```

### Wake-on-LAN (réveiller NAS à distance)

- BIOS : activer WOL
- OpenMediaVault : Network → Interfaces → activer WOL

```bash
# Depuis PopOS, réveiller NAS
sudo apt install wakeonlan
wakeonlan AA:BB:CC:DD:EE:FF  # MAC address du NAS
```

### Snapshots/backups (si disques multiples)

- Plugin OMV-Extras
- Rsync ou Duplicati pour backups automatiques

### Sécurité

```bash
# SSH : désactiver login root
sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
systemctl restart ssh

# Firewall basique (optionnel)
apt install ufw
ufw allow 22,80,139,445,3000/tcp
ufw enable
Maintenance
bash# Vérifier santé disques (SMART)
apt install smartmontools
smartctl -a /dev/sda

# Monitoring espace
df -h
```

## CONSEILS USAGE OPTIMAL

### À faire

- Backups critiques uniquement (docs, photos, code)
- Médias (films/musiques) si tu stream
- Archives/ISOs
- Environnements de test Docker/Podman

### À ne PAS faire

- Bases de données actives (latence réseau)
- Projets de dev quotidien (performance)
- Fichiers swap/cache système

### Workflow efficace

```bash
# Dossiers type
/mnt/nas/
├── backups/        # rsync automatique depuis PopOS
├── media/          # films/séries
├── archives/       # vieux projets
└── partage/        # échange fichiers
```

## CHECKLIST AVANT PROD

- [ ] Données Windows sauvegardées
- [ ] Disques testés (SMART OK)
- [ ] IP fixe configurée (sur routeur aussi)
- [ ] Partage accessible depuis PopOS
- [ ] Backup de test réussi
- [ ] WOL fonctionnel (si besoin)
- [ ] Ventilation/chaleur tour OK

## Points d'attention critiques

- **Électricité** : vieille tour = 50-150W 24/7 = ~10€/mois
- **Bruit** : si dans ton espace de vie, change ventilateurs
- **Fiabilité disques** : vérifier SMART, prévoir remplacement
- **Pas de RAID ?** : perte disque = perte données, backups essentiels
