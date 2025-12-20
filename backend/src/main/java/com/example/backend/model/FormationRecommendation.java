package com.example.backend.model;

import java.util.List;

public class FormationRecommendation {
    private String id;
    private String titre;
    private String duration;
    private boolean isCertified;
    private boolean isGratuit;
    private String relevanceReason;
    private String url;
    private String plateforme;
    private String certificatType;
    private String modalite;
    private List<String> targetedSkills;

    // Constructors
    public FormationRecommendation() {
    }

    public FormationRecommendation(String id, String titre, String duration,
            boolean isCertified, boolean isGratuit, String relevanceReason) {
        this.id = id;
        this.titre = titre;
        this.duration = duration;
        this.isCertified = isCertified;
        this.isGratuit = isGratuit;
        this.relevanceReason = relevanceReason;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public boolean isCertified() {
        return isCertified;
    }

    public void setCertified(boolean certified) {
        isCertified = certified;
    }

    public boolean isGratuit() {
        return isGratuit;
    }

    public void setGratuit(boolean gratuit) {
        isGratuit = gratuit;
    }

    public String getRelevanceReason() {
        return relevanceReason;
    }

    public void setRelevanceReason(String relevanceReason) {
        this.relevanceReason = relevanceReason;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPlateforme() {
        return plateforme;
    }

    public void setPlateforme(String plateforme) {
        this.plateforme = plateforme;
    }

    public String getCertificatType() {
        return certificatType;
    }

    public void setCertificatType(String certificatType) {
        this.certificatType = certificatType;
    }

    public String getModalite() {
        return modalite;
    }

    public void setModalite(String modalite) {
        this.modalite = modalite;
    }

    public List<String> getTargetedSkills() {
        return targetedSkills;
    }

    public void setTargetedSkills(List<String> targetedSkills) {
        this.targetedSkills = targetedSkills;
    }
}
