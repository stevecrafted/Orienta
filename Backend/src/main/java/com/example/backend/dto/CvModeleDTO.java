package com.example.backend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.annotation.JsonAlias;
import java.util.Map;

public class CvModeleDTO {

    private String nom;
    private String description;
    private String templateType;
    private String categorie;

    // Utiliser Map au lieu de JsonNode pour éviter les problèmes de désérialisation
    private Map<String, Object> contenuJson;

    private Boolean estActif;
    
    @JsonAlias("utilisateurId")
    private Integer utilisateur;

    // Getter et Setter pour nom
    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    // Getter et Setter pour description
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Getter et Setter pour templateType
    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    // Getter et Setter pour categorie
    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    // Getter et Setter pour contenuJson
    public Map<String, Object> getContenuJson() {
        return contenuJson;
    }

    public void setContenuJson(Map<String, Object> contenuJson) {
        this.contenuJson = contenuJson;
    }

    // Getter et Setter pour estActif
    public Boolean getEstActif() {
        return estActif;
    }

    public void setEstActif(Boolean estActif) {
        this.estActif = estActif;
    }

    // Getter et Setter pour utilisateur
    public Integer getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Integer utilisateur) {
        this.utilisateur = utilisateur;
    }
}
