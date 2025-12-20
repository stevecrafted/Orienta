package com.example.backend.model;

import jakarta.persistence.*; 
import java.util.List;

@Entity
@Table(name = "utilisateur", indexes = {
    @Index(name = "idx_utilisateur_email", columnList = "email", unique = true)
})
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String nom;

    @Column(length = 50)
    private String prenom;

    @Column(length = 100, unique = true)
    private String email;

    @Column(length = 50)
    private String telephone;

    // Auth fields
    @Column(length = 255)
    private String password;

    @Column(length = 20)
    private String role = "USER";

    @Column(name = "lotaddresse", length = 50)
    private String lotAddresse;

    // Constructors
    public Utilisateur() {
    }

    public Utilisateur(String nom, String prenom, String email, String telephone, String lotAddresse) {
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.lotAddresse = lotAddresse;
    }

    // Getters and Setters
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

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getLotAddresse() {
        return lotAddresse;
    }

    public void setLotAddresse(String lotAddresse) {
        this.lotAddresse = lotAddresse;
    }
 

    public void setRole(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public String getPassword() {
        return password; 
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
