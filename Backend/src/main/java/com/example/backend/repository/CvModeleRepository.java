package com.example.backend.repository;

import com.example.backend.model.CvModele;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CvModeleRepository extends JpaRepository<CvModele, Long> {

    /**
     * Trouve tous les modèles actifs
     */
    List<CvModele> findByEstActifTrueOrderByOrdreAsc();

    /**
     * Trouve tous les modèles par type de template
     */
    List<CvModele> findByTemplateTypeAndEstActifTrue(String templateType);

    /**
     * Trouve tous les modèles par catégorie
     */
    List<CvModele> findByCategorieAndEstActifTrueOrderByOrdreAsc(String categorie);

    /**
     * Trouve un modèle par son nom
     */
    Optional<CvModele> findByNom(String nom);

    /**
     * Trouve les modèles premium
     */
    List<CvModele> findByEstPremiumTrueAndEstActifTrueOrderByOrdreAsc();

    /**
     * Trouve les modèles gratuits
     */
    List<CvModele> findByEstPremiumFalseAndEstActifTrueOrderByOrdreAsc();

    /**
     * Incrémente le nombre d'utilisations d'un modèle
     */
    @Modifying
    @Query("UPDATE CvModele c SET c.nombreUtilisations = c.nombreUtilisations + 1 WHERE c.id = :id")
    void incrementerUtilisations(@Param("id") Long id);

    /**
     * Trouve les modèles les plus populaires
     */
    @Query("SELECT c FROM CvModele c WHERE c.estActif = true ORDER BY c.nombreUtilisations DESC")
    List<CvModele> findTopByNombreUtilisations();
}
