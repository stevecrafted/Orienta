package com.example.backend.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonRawValue;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

/**
 * Modèle de CV prédéfini
 * Permet de stocker des templates/modèles de CV que les utilisateurs peuvent
 * utiliser
 */
@Entity
@Table(name = "cv_modeles")
public class CvModele {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nom;

    @Column(length = 500)
    private String description;

    @Column(name = "template_type", nullable = false, length = 50)
    private String templateType; // "double-column", "elegant", "modern", "standard"

    @Column(name = "contenu_json", columnDefinition = "jsonb", nullable = false)
    @JsonRawValue
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode contenuJson;

    @Column(name = "image_preview", length = 500)
    private String imagePreview; // URL de l'aperçu du modèle

    @Column(name = "est_actif", nullable = false)
    private Boolean estActif = true;

    @Column(name = "est_premium", nullable = false)
    private Boolean estPremium = false;

    @Column(nullable = false)
    private Integer ordre = 0; // Pour l'ordre d'affichage

    @Column(name = "nombre_utilisations", nullable = false)
    private Integer nombreUtilisations = 0;

    @Column(length = 100)
    private String categorie; // "Professionnel", "Créatif", "Académique", etc.

    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @Column(name = "date_modification")
    private LocalDateTime dateModification;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        dateModification = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDateTime.now();
    }

    // ===========================
    // CONSTRUCTEURS
    // ===========================

    public CvModele() {
    }

    public CvModele(String nom, String description, String templateType, JsonNode contenuJson) {
        this.nom = nom;
        this.description = description;
        this.templateType = templateType;
        this.contenuJson = contenuJson;
    }

    // ===========================
    // GETTERS & SETTERS
    // ===========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTemplateType() {
        return templateType;
    }

    public void setTemplateType(String templateType) {
        this.templateType = templateType;
    }

    public JsonNode getContenuJson() {
        return contenuJson;
    }

    public void setContenuJson(JsonNode contenuJson) {
        this.contenuJson = contenuJson;
    }

    /**
     * Setter qui accepte une String JSON et la convertit en JsonNode
     * Utile pour la désérialisation depuis le frontend
     */
    public void setContenuJson(String contenuJsonString) {
        if (contenuJsonString != null && !contenuJsonString.isEmpty()) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                this.contenuJson = mapper.readTree(contenuJsonString);
            } catch (JsonProcessingException e) {
                throw new IllegalArgumentException("Format JSON invalide pour contenuJson", e);
            }
        }
    }

    public String getImagePreview() {
        return imagePreview;
    }

    public void setImagePreview(String imagePreview) {
        this.imagePreview = imagePreview;
    }

    public Boolean getEstActif() {
        return estActif;
    }

    public void setEstActif(Boolean estActif) {
        this.estActif = estActif;
    }

    public Boolean getEstPremium() {
        return estPremium;
    }

    public void setEstPremium(Boolean estPremium) {
        this.estPremium = estPremium;
    }

    public Integer getOrdre() {
        return ordre;
    }

    public void setOrdre(Integer ordre) {
        this.ordre = ordre;
    }

    public Integer getNombreUtilisations() {
        return nombreUtilisations;
    }

    public void setNombreUtilisations(Integer nombreUtilisations) {
        this.nombreUtilisations = nombreUtilisations;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public LocalDateTime getDateModification() {
        return dateModification;
    }

    public void setDateModification(LocalDateTime dateModification) {
        this.dateModification = dateModification;
    }

    // ===========================
    // MÉTHODES UTILITAIRES
    // ===========================

    public void incrementerUtilisations() {
        this.nombreUtilisations++;
    }

    @Override
    public String toString() {
        return "CvModele{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", templateType='" + templateType + '\'' +
                ", categorie='" + categorie + '\'' +
                ", estActif=" + estActif +
                ", nombreUtilisations=" + nombreUtilisations +
                '}';
    }
}