package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_candidate_profile", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"recruteur_id", "candidat_id"}),
    indexes = {
        @Index(name = "idx_saved_profile_recruteur", columnList = "recruteur_id"),
        @Index(name = "idx_saved_profile_candidat", columnList = "candidat_id")
    }
)
public class SavedCandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "recruteur_id", nullable = false)
    private Utilisateur recruteur;

    @ManyToOne
    @JoinColumn(name = "candidat_id", nullable = false)
    private Utilisateur candidat;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "date_sauvegarde")
    private LocalDateTime dateSauvegarde;

    @PrePersist
    protected void onCreate() {
        dateSauvegarde = LocalDateTime.now();
    }

    // Constructors
    public SavedCandidateProfile() {
    }

    public SavedCandidateProfile(Utilisateur recruteur, Utilisateur candidat, String notes) {
        this.recruteur = recruteur;
        this.candidat = candidat;
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getRecruteur() {
        return recruteur;
    }

    public void setRecruteur(Utilisateur recruteur) {
        this.recruteur = recruteur;
    }

    public Utilisateur getCandidat() {
        return candidat;
    }

    public void setCandidat(Utilisateur candidat) {
        this.candidat = candidat;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getDateSauvegarde() {
        return dateSauvegarde;
    }

    public void setDateSauvegarde(LocalDateTime dateSauvegarde) {
        this.dateSauvegarde = dateSauvegarde;
    }
}
