\c postgres;

-- DROP and CREATE fresh database (ATTENTION: destructive)
DROP DATABASE IF EXISTS Hirion;
CREATE DATABASE Hirion;

-- Connect to new DB
\c Hirion;

-- =============================
-- Schema (with updated sizes)
-- =============================

-- Utilisateur
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(50),
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    lotaddresse VARCHAR(50)
);
 
-- Table pour les templates (optionnel)
CREATE TABLE templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    apercu_url VARCHAR(500),
    est_premium BOOLEAN DEFAULT FALSE,
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion des templates de base
INSERT INTO templates (nom, description, est_premium, est_actif) VALUES
('double-column', 'Template à deux colonnes avec design moderne', FALSE, TRUE),
('elegant', 'Template élégant avec mise en page classique', FALSE, TRUE),
('timeline', 'Template avec une timeline chronologique', TRUE, TRUE);

-- Vue pour récupérer les CV avec infos utilisateur
CREATE VIEW vue_cvs_utilisateurs AS
SELECT 
    c.id AS cv_id,
    c.titre,
    c.version,
    c.est_principal,
    c.date_creation AS cv_date_creation,
    c.date_modification AS cv_date_modification,
    u.id AS utilisateur_id,
    u.nom AS utilisateur_nom,
    u.email AS utilisateur_email,
    JSON_EXTRACT(c.description_cv, '$.resume.header.name') AS cv_nom,
    JSON_EXTRACT(c.description_cv, '$.resume.header.title') AS cv_titre_poste,
    JSON_EXTRACT(c.description_cv, '$.settings.template') AS template
FROM cvs c
INNER JOIN utilisateurs u ON c.utilisateur_id = u.id
WHERE u.actif = TRUE;

-- Index pour améliorer les performances
CREATE INDEX idx_cv_est_principal ON cvs(utilisateur_id, est_principal);
CREATE INDEX idx_utilisateur_email ON utilisateurs(email);
 
-- Poste (updated sizes)
CREATE TABLE poste (
    id SERIAL PRIMARY KEY,
    titre_poste VARCHAR(150),
    description VARCHAR(8000),
    entreprise VARCHAR(100),
    niveau VARCHAR(50),
    localisation VARCHAR(500),
    responsabilite VARCHAR(500),
    competence VARCHAR(500),
    categorie VARCHAR(100) DEFAULT 'Général',
    utilisateur_id INT NOT NULL REFERENCES utilisateur(id)
);

-- Formation (updated sizes)
CREATE TABLE formation (
    id VARCHAR(128) PRIMARY KEY,
    titre_formation VARCHAR(500),
    iscertified BOOLEAN,
    duration VARCHAR(100),
    isgratuit VARCHAR(20),
    poste_id INT REFERENCES poste(id)
);

-- Association Formation <-> Poste (owning side is Formation in JPA)
CREATE TABLE asso_5 (
    formation_id VARCHAR(128) REFERENCES formation(id),
    poste_id INT REFERENCES poste(id),
    PRIMARY KEY (formation_id, poste_id)
);

-- =============================
-- Seed data (safe defaults)
-- =============================

-- Utilisateurs
INSERT INTO utilisateur (id, nom, prenom, email, telephone, password, role, lotaddresse) VALUES
    (1, 'DOE', 'John', 'john.doe@example.com', '+33123456789', NULL, 'USER', '12 rue du Bac, Paris'),
    (2, 'SMITH', 'Anna', 'anna.smith@example.com', '+442012345678', NULL, 'USER', '221B Baker Street, London');
 
-- =============================
-- Fix sequences to max IDs
-- =============================
SELECT setval(pg_get_serial_sequence('utilisateur','id'), COALESCE((SELECT MAX(id) FROM utilisateur), 0));
SELECT setval(pg_get_serial_sequence('cv','id'), COALESCE((SELECT MAX(id) FROM cv), 0));
SELECT setval(pg_get_serial_sequence('experience_cv','id'), COALESCE((SELECT MAX(id) FROM experience_cv), 0));
SELECT setval(pg_get_serial_sequence('education_cv','id'), COALESCE((SELECT MAX(id) FROM education_cv), 0));
SELECT setval(pg_get_serial_sequence('poste','id'), COALESCE((SELECT MAX(id) FROM poste), 0));
 

-- Index pour améliorer les performances
CREATE INDEX idx_candidat_profile_utilisateur ON candidat_profile(utilisateur_id);
CREATE INDEX idx_candidat_profile_metier ON candidat_profile(metier);
CREATE INDEX idx_candidat_profile_visible ON candidat_profile(est_visible);
CREATE INDEX idx_candidat_profile_score ON candidat_profile(score_visibilite DESC);
CREATE INDEX idx_saved_profile_recruteur ON saved_candidate_profile(recruteur_id);
CREATE INDEX idx_saved_profile_candidat ON saved_candidate_profile(candidat_id);
 