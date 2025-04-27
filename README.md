# Synthetic Data Creation for Driver Monitoring Systems using Generative AI



Bienvenue dans notre application web combinant **génération de datasets** et **création d'images IA** !

## 📑 Table des Matières

1. [Description du Projet](#description-du-projet)
2. [Technologies Utilisées](#technologies-utilisees)
   - [Environnements de Développement et Outils Collaboratifs](#61-environnements-de-developpement-et-outils-collaboratifs)
   - [Technologies Frontend (Interface Utilisateur)](#62-technologies-frontend-interface-utilisateur)
   - [Technologies d'Intelligence Artificielle](#63-technologies-dintelligence-artificielle)
3. [Fonctionnalités principales](#fonctionnalites-principales)
4. [Structure du Projet](#structure-du-projet)
5. [Installation et Lancement](#installation-et-lancement)
   - [Backend (Python)](#backend-python)
   - [Frontend (React)](#frontend-react)
6. [Captures d'Écran](#captures-decran)
7.  [Video démonstrative](#video-demonstrative)


## 🚀 Description du Projet

Notre application propose deux fonctionnalités principales accessibles après authentification :

1. **Génération de Dataset à partir d'une Description (Flux + Defocus)**  
   - L'utilisateur saisit une description comprenant :
     - Le **nombre de classes** souhaité.
     - Le **nom des classes**.
   - Le système génère automatiquement un **dataset structuré** (au format `.zip`) conforme aux standards de dataset d'images.

2. **Génération d'une Image à partir d'une Description Simple (Defocus uniquement)**  
   - L'utilisateur fournit une **courte description textuelle**.
   - Le modèle IA génère une **image unique et réaliste** correspondant à cette description.

## 🛠️ Technologies Utilisées

### 1 Environnements de Développement et Outils Collaboratifs

- **Google Colab** :  
  Utilisé pour les expérimentations IA initiales avec un accès gratuit aux GPU. Nous avons pu tester plusieurs modèles **text-to-image** et évaluer différents paramètres de génération dans un environnement cloud.

- **Kaggle** :  
  Utilisé durant la phase de prototypage pour tester la génération d'images textuelles à partir de prompts, exécuter un script complet de génération, et valider le pipeline IA avant son intégration dans notre plateforme.

- **Visual Studio Code** :  
  IDE principal du projet pour le développement backend (Flask), frontend (React), et la gestion des fichiers du projet. Il a également facilité le débogage et l'intégration avec GitHub.

### 2 Technologies Frontend (Interface Utilisateur)

- **React.js** :  
  Utilisé pour construire l'interface utilisateur. React nous a permis de créer une application modulaire et dynamique avec des composants réutilisables, facilitant la gestion de la connexion utilisateur et de l'interaction avec l'application.

- **CSS personnalisé & Bootstrap** :  
  Utilisé pour styliser l'application avec un design responsive, cohérent, et adapté à tous types d'écrans. Bootstrap a été utilisé pour simplifier la gestion des layouts, formulaires, et boutons.

### 3 Technologies d'Intelligence Artificielle

- **PyTorch** :  
  Utilisé comme bibliothèque principale pour charger les modèles, effectuer l'inférence sur GPU, manipuler les tenseurs, et contrôler le processus de génération d'images.

- **LoRA (Low-Rank Adaptation)** :  
  Permet d’adapter le style des images générées sans réentraîner complètement les modèles. LoRA a été utilisé pour injecter des styles spécifiques (réalisme, cartoon, etc.) tout en maintenant des ressources optimisées.

## 🔑 Fonctionnalités principales

- **Authentification sécurisée** des utilisateurs.
- **Interface intuitive** pour entrer les descriptions de dataset ou les prompts pour la génération d'images.
- **Génération et téléchargement** des datasets compressés (.zip) et des images générées.
- **Visualisation des images générées** apres téléchargement.
- **Architecture frontend-backend séparée** pour plus de modularité.

## 📂 Structure du Projet
```bash
.
├── back/       # API Python
│   ├── flux.py     # Application backend principale
│   └── data-process/    # Modèles IA utilisés (Fluxx, Defocus)
├── front/      # Application React
│   ├── src/       # Code source React
│   └── public/    # Fichiers statiques React
├── README.md      # Ce fichier
└── requirements.txt # Dépendances backend Python

**⚙️ # Installation et Lancement**

### Backend (Python)

- **Version utilisée** :
  - Flask==2.2.2
  - flask-cors==3.1.1
  - gradio-client==1.0.0

- **Lancement du serveur Flask** :
  1. Installez les dépendances avec la commande suivante :
     ```bash
     pip install -r requirements.txt
     ```

  2. Lancez le serveur Flask en exécutant :
     ```bash
     python flux.py
     python data-process.py
     ```
### Frontend (React)

1. **Installer les dépendances**  
   Allez dans le dossier Front et installez les dépendances avec npm :
   ```bash
   cd Front
   npm install
   npm start
