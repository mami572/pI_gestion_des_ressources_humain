# Build GRH System

Système de Gestion des Ressources Humaines (GRH) moderne, performant et évolutif, conçu pour centraliser et optimiser la gestion du capital humain au sein d'une organisation.

---

## 1. Conception de la Gestion des Ressources Humaines

La conception de ce système repose sur une approche modulaire et intégrée de la gestion du cycle de vie des collaborateurs. L'objectif est de passer d'une gestion administrative classique à un pilotage stratégique des RH :

- **Centralisation des Données** : Un référentiel unique pour toutes les informations relatives aux employés.
- **Cycle de Vie Complet** : Du recrutement (sourcing, entretiens) à la gestion de la paie, en passant par le suivi des carrières et des formations.
- **Accessibilité et Libre-Service** : Interfaces dédiées pour les administrateurs et outils de suivi pour faciliter la transparence.

## 2. Architecture du Système

L'application est bâtie sur une stack technologique moderne assurant rapidité, sécurité et maintenabilité :

- **Framework** : [Next.js](https://nextjs.org/) (Version 15+) utilisant l'**App Router** pour des performances optimales et un rendu hybride (SSR/Client).
- **Langage** : TypeScript pour une robustesse accrue du code.
- **Base de Données** : [MySQL](https://www.mysql.com/) pour la persistance des données, avec une gestion de pool via `mysql2` pour l'efficacité.
- **Interface Utilisateur (UI)** :
    - **Tailwind CSS** pour le design responsive et moderne.
    - **Radix UI** pour des composants accessibles et haut de gamme.
    - **Lucide React** pour une iconographie cohérente.
- **Gestion des Formulaires** : React Hook Form couplé à Zod pour la validation stricte des données.

## 3. Cahier des Charges

Le projet répond aux besoins fondamentaux suivants :

- **Gestion du Recrutement** : Création d'offres d'emploi, suivi des candidatures et automatisation des flux de validation.
- **Suivi Opérationnel** : Gestion en temps réel des présences (Attendance) et des demandes de congés (Leaves).
- **Conformité et Paie** : Génération et suivi des fiches de paie, calcul des rémunérations et historique financier.
- **Développement des Compétences** : Catalogue de formations et suivi du perfectionnement des employés.
- **Reporting** : Tableau de bord analytique pour visualiser les indicateurs clés (KPI) de l'entreprise.

## 4. Technologies Utilisées

| Catégorie | Technologie |
| :--- | :--- |
| **Frontend/Backend** | Next.js, React, TypeScript |
| **Base de Données** | MySQL, mysql2 |
| **Styling** | Tailwind CSS, CSS Modules |
| **Composants** | Radix UI, Lucide Icons |
| **Validation** | Zod, React Hook Form |
| **Utilitaires** | Date-fns, Bcrypt (Sécurité) |

## 5. Fonctionnalités Clés

- 🚀 **Tableau de Bord** : Vue d'ensemble des effectifs et des alertes.
- 👥 **Gestion des Employés** : Fiches détaillées, affectations aux départements.
- 📋 **Recrutement** : Workflow complet de la publication à l'embauche.
- 📅 **Présences & Congés** : Pointage et workflow de validation des absences.
- 💰 **Paie** : Gestion des salaires et historique des paiements.
- 🎓 **Formations** : Planification et suivi des sessions de formation.

## 6. Installation et Configuration

Pour lancer le projet localement, suivez ces étapes :

### Prérequis
- Node.js (v18+)
- MySQL (Instance locale ou distante)

### Installation
1. Clonez le dépôt.
2. Installez les dépendances :
   ```bash
   npm install
   ```
3. Configurez les variables d'environnement dans un fichier `.env.local` :
   ```env
   DB_HOST=votre_host
   DB_USER=votre_utilisateur
   DB_PASSWORD=votre_mot_de_passe
   DB_NAME=votre_base_de_donnees
   ```
4. Lancez le serveur de développement :
   ```bash
   npm run dev
   ```
5. Accédez à l'application via `http://localhost:3000`.

---
*Conçu avec soin pour une gestion RH efficace.*
