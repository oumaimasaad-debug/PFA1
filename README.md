# Synthetic Data Creation for Driver Monitoring Systems using Generative AI

Bienvenue dans notre application web combinant **génération de datasets** et **création d'images IA** !

---

## 📑 Table des Matières

1. [Description du Projet](#-description-du-projet)
2. [Technologies Utilisées](#-technologies-utilisées)
   - [Environnements de Développement et Outils Collaboratifs](#1-environnements-de-développement-et-outils-collaboratifs)
   - [Technologies Frontend (Interface Utilisateur)](#2-technologies-frontend-interface-utilisateur)
   - [Technologies d'Intelligence Artificielle](#3-technologies-dintelligence-artificielle)
3. [Fonctionnalités Principales](#-fonctionnalités-principales)
4. [Structure du Projet](#-structure-du-projet)
5. [Installation et Lancement](#-installation-et-lancement)
   - [Backend (Python)](#backend-python)
   - [Frontend (React)](#frontend-react)

---

## 🚀 Description du Projet

Notre application propose deux fonctionnalités principales accessibles après authentification :

### 1. Génération de Dataset à partir d'une Description (Flux + Defocus)

- L'utilisateur saisit :
  - Le **nombre de classes** souhaité.
  - Le **nom des classes**.
- Le système génère automatiquement un **dataset structuré** (au format `.zip`) conforme aux standards de datasets d'images.

### 2. Génération d'une Image à partir d'une Description Simple (Defocus uniquement)

- L'utilisateur fournit une **courte description textuelle**.
- Le modèle IA génère une **image unique et réaliste** correspondant à cette description.

---

## 🛠️ Technologies Utilisées

### 1. Environnements de Développement et Outils Collaboratifs

- **Google Colab** :  
  Pour les expérimentations IA initiales avec accès gratuit aux GPU (tests de modèles *text-to-image*).

- **Kaggle** :  
  Utilisé durant le prototypage pour valider le pipeline IA complet.

- **Visual Studio Code** :  
  IDE principal pour le développement backend (Flask), frontend (React), et gestion GitHub.

### 2. Technologies Frontend (Interface Utilisateur)

- **React.js** :  
  Pour construire une interface utilisateur moderne, dynamique et modulaire.

- **CSS personnalisé & Bootstrap** :  
  Pour un design responsive et élégant.

### 3. Technologies d'Intelligence Artificielle

- **PyTorch** :  
  Bibliothèque principale pour la manipulation des modèles IA et le traitement GPU.

- **LoRA (Low-Rank Adaptation)** :  
  Pour adapter dynamiquement le style des images sans réentraîner les modèles complets.

---

## 🔑 Fonctionnalités Principales

- Authentification sécurisée des utilisateurs.
- Interface intuitive pour entrer des descriptions de datasets ou des prompts d'images.
- Génération et téléchargement de datasets compressés (.zip) et d'images.
- Visualisation rapide des images générées.
- Architecture frontend-backend séparée pour une meilleure modularité.

---

## 📂 Structure du Projet

```bash
.
├── back/                # Backend Python (API Flask)
│   ├── flux.py          # Application principale Flask
│   └── data-process/    # Modèles IA utilisés (Fluxx, Defocus)
├── front/               # Frontend React
│   ├── src/             # Code source React
│   └── public/          # Fichiers statiques React
├── README.md            # Ce fichier de documentation
└── requirements.txt     # Dépendances du backend

```
## ⚙️Installation et Lancement

### Backend (Python)

- **Version utilisée** :
  - Flask==2.2.2
  - flask-cors==3.1.1
  - gradio-client==1.0.0

- **Lancement du serveur Flask** :
Installez les dépendances avec la commande suivante :
 ```bash
  pip install -r requirements.txt
 ```
Lancez le serveur Flask en exécutant :
```bash
     python flux.py
     python data-process.py
 ```
### Frontend (React)

**Installer les dépendances**  
   Allez dans le dossier Front et installez les dépendances avec npm :
```bash
     cd front
     npm install
     npm start
```
 **Execution des modéles** 

 
 modele text-to-image (https://www.kaggle.com/code/omaimasaad/notebookec87cef797)

 modele image-to image https://colab.research.google.com/github/oumaimasaad-debug/Controle/blob/master/flux_image_to_image.ipynb

 
 **NB**

 n'oubliez pas de modifier les liens gradio des deux modéles dans le backend 
 
 
