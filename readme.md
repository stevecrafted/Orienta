# Orienta

## Project Overview
Orienta is a platform designed to **facilitate job and training search** for people seeking new professional opportunities.  
The platform also enables structured management and sharing of candidate profiles, optimized for recruiters.

The solution is composed of several core features:  
1. **CV Creation**  
2. **Job Search**  
3. **Training Search**  
4. **Candidate List**

---

## Features

### 1. CV Creation
- Easily create your CV using predefined templates.  
- Edit your CV directly on the platform.  
- Download the CV in PDF format.  
- **Automatic saving**: your CV is saved automatically, even if you leave the site before finishing.

### 2. Job Search
- Import your CV using simple **drag & drop**.  
- AI analyzes your profile and automatically generates optimized queries to find jobs matching your skills.  
- Results are retrieved via the Google Custom Search API.

### 3. Training Search
- Analysis of missing skills for a target position.  
- AI suggests relevant training programs to fill these gaps.  
- Training programs are automatically searched using optimized queries.

### 4. Recruiter 
- Access to a **marketplace** of candidate profiles.  
- Each profile is standardized and can be viewed by recruiters.  
- Candidate CVs are available for consultation.

---

## Architecture and Data Flow

### CV Creation
1. CV editing through the frontend interface  
2. Download in PDF format  
3. Publication to the marketplace → Backend → Database  

### Job Search
1. CV import  
2. CV analysis using **Gemini**  
3. Generation of an optimized Google query via **GPT-4o-mini**  
4. Job search through **Google Custom Search API**  
5. Retrieval of matching job listings  


```mermaid
graph LR
    %% Définition des styles
    classDef userNode fill:#0073b1,stroke:#fff,color:#fff,stroke-width:2px;
    classDef serverNode fill:#f5f5f5,stroke:#333,stroke-width:1.5px;
    classDef iaNode fill:#e8f4f8,stroke:#0073b1,stroke-width:1.5px;
    classDef apiNode fill:#f0f0f0,stroke:#34a853,stroke-width:1.5px;
    classDef resultNode fill:#fff,stroke:#0073b1,stroke-width:2px;
    
    %% Éléments du workflow
    A[👤 Utilisateur] -->|Import/Drag & Drop du CV| B[🌐 Frontend];
    B -->|Envoi du CV| C[⚙️ Backend];
    C -->|Analyse| D[🤖 Modèle d'IA];
    D -->|1. Extraction: compétences, expériences, métier cible| D;
    D -->|2. Génération requête optimisée| C;
    C -->|Requête de recherche| E[🔗 API Externe<br/>Google Custom Search];
    E -->|Résultats JSON/XML| C;
    C -->|Offres d'emploi pertinentes| B;
    B -->|📄 Affichage des résultats| F[📋 Liste d'offres];
    
    %% Application des styles
    class A userNode;
    class B,C serverNode;
    class D iaNode;
    class E apiNode;
    class F resultNode;
    
    %% Style général du diagramme
    linkStyle default stroke:#0073b1,stroke-width:2px,fill:none; 
```

### Training Search
1. CV import  
2. Analysis of missing skills for the target position using **Gemini** and GPT  
3. Generation of Google queries to find training programs matching missing skills  
4. Search via **Google Custom Search API**  

```mermaid
graph TD
    %% Définition des styles
    classDef userNode fill:#0073b1,stroke:#fff,color:#fff,stroke-width:2px;
    classDef frontendNode fill:#eef3f8,stroke:#0073b1,stroke-width:1.5px;
    classDef backendNode fill:#f8f9fa,stroke:#333,stroke-width:1.5px;
    classDef iaNode fill:#e8f4f8,stroke:#0073b1,stroke-width:1.5px;
    classDef apiNode fill:#f0f7ff,stroke:#1b5e20,stroke-width:1.5px;
    classDef resultNode fill:#fff,stroke:#0073b1,stroke-width:2px;
    
    %% Workflow principal
    A[👤 Utilisateur] -->|1. Import du CV| B[📱 Frontend];
    
    subgraph "Interface Utilisateur"
        B -->|2. Envoi du CV + Poste cible| C[⚙️ Backend];
    end
    
    subgraph "Analyse et Comparaison"
        C -->|3. Analyse du CV| D[🤖 IA: Analyseur];
        D -->|4. Extraction compétences| D;
        D -->|5. Identification métier cible| E[🎯 Comparateur];
        E -->|6. Compétences requises vs actuelles| E;
        E -->|7. Détection écarts| F[📊 Générateur de requêtes];
    end
    
    subgraph "Recherche de Formations"
        F -->|8. Requêtes par compétence| G[🔍 API Formations<br/>Google Custom Search];
        G -->|9. Résultats bruts| H[📦 Agrégateur];
        H -->|10. Filtrage et classement| H;
    end
    
    H -->|11. Formations recommandées| C;
    C -->|12. Affichage des résultats| I[📚 Formations personnalisées];
    I -->|13. Consultation| A;
    
    %% Application des styles
    class A userNode;
    class B frontendNode;
    class C,H backendNode;
    class D,E,F iaNode;
    class G apiNode;
    class I resultNode;
    
    %% Style des flèches
    linkStyle 0 stroke:#0073b1,stroke-width:2px;
    linkStyle 1 stroke:#0073b1,stroke-width:2px;
    linkStyle 2,3,4,5,6 stroke:#0073b1,stroke-width:2px;
    linkStyle 7 stroke:#1b5e20,stroke-width:2px;
    linkStyle 8,9 stroke:#1b5e20,stroke-width:2px;
    linkStyle 10,11 stroke:#0073b1,stroke-width:2px;
    linkStyle 12 stroke:#0073b1,stroke-width:2px; 
```

### Candidate List
- Profiles are retrieved from the CV model stored in the database.

---

## AI Models and Tools Used
- **Gemini 2.5 Flash**: CV data extraction  
- **GPT-4o-mini**: generation of optimized Google search queries  
- **Google Custom Search API**: retrieval of job and training results  

---

## Requirements and Installation

### Requirements
- Docker (if using Docker Compose)  
- Postgres 16.10  
- Java 17  
- Apache Maven 3.9.9  
- Node.js 24.8.0  
- npm  
 
### application.properties Configuration (read tools installation.md)
Once the API keys are created, add them to the backend configuration file:

`backend/src/main/resources/application.properties`

```properties
# API Keys for AI and Search
openai.api.key=YOUR_OPENAI_API_KEY
google.gemini.api.key=YOUR_GEMINI_API_KEY
google.api.key=YOUR_GOOGLE_API_KEY
google.search.engine.id=YOUR_SEARCH_ENGINE_ID

#### Using Docker
```bash
docker compose up -d
Backend
bash
Copier le code
cd backend
mvn install
mvn spring-boot:run
CV Frontend
bash
Copier le code
cd cv-frontend
npm install
npm run dev