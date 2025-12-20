package com.example.backend.repository;

import com.example.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    
    // Recherche simple par email (indexé)
    Optional<Utilisateur> findByEmail(String email);
    
    // Vérifier l'existence d'un email (plus rapide que findByEmail)
    boolean existsByEmail(String email);
}
