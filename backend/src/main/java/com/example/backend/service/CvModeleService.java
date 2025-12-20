package com.example.backend.service;

import com.example.backend.model.CvModele;
import com.example.backend.repository.CvModeleRepository; 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CvModeleService {

    private static final Logger logger = LoggerFactory.getLogger(CvModeleService.class);

    @Autowired
    private CvModeleRepository cvModeleRepository;

    /**
     * Récupère tous les modèles de CV
     */
    public List<CvModele> getAllModeles() {
        logger.info("Récupération de tous les modèles de CV");
        return cvModeleRepository.findAll();
    }

    /**
     * Récupère tous les modèles actifs
     */
    public List<CvModele> getModelesActifs() {
        logger.info("Récupération des modèles actifs");
        return cvModeleRepository.findByEstActifTrueOrderByOrdreAsc();
    }

    /**
     * Récupère un modèle par son ID
     */
    public Optional<CvModele> getModeleById(Long id) {
        logger.info("Récupération du modèle avec l'ID: {}", id);
        return cvModeleRepository.findById(id);
    }

    /**
     * Récupère un modèle par son nom
     */
    public Optional<CvModele> getModeleByNom(String nom) {
        logger.info("Récupération du modèle avec le nom: {}", nom);
        return cvModeleRepository.findByNom(nom);
    }

    /**
     * Récupère les modèles par type de template
     */
    public List<CvModele> getModelesByTemplateType(String templateType) {
        logger.info("Récupération des modèles pour le template: {}", templateType);
        return cvModeleRepository.findByTemplateTypeAndEstActifTrue(templateType);
    }

    /**
     * Récupère les modèles par catégorie
     */
    public List<CvModele> getModelesByCategorie(String categorie) {
        logger.info("Récupération des modèles pour la catégorie: {}", categorie);
        return cvModeleRepository.findByCategorieAndEstActifTrueOrderByOrdreAsc(categorie);
    }

    /**
     * Récupère les modèles premium
     */
    public List<CvModele> getModelesPremium() {
        logger.info("Récupération des modèles premium");
        return cvModeleRepository.findByEstPremiumTrueAndEstActifTrueOrderByOrdreAsc();
    }

    /**
     * Récupère les modèles gratuits
     */
    public List<CvModele> getModelesGratuits() {
        logger.info("Récupération des modèles gratuits");
        return cvModeleRepository.findByEstPremiumFalseAndEstActifTrueOrderByOrdreAsc();
    }

    /**
     * Récupère les modèles les plus populaires
     */
    public List<CvModele> getModelesPopulaires(int limit) {
        logger.info("Récupération des {} modèles les plus populaires", limit);
        List<CvModele> modeles = cvModeleRepository.findTopByNombreUtilisations();
        return modeles.stream().limit(limit).toList();
    }

    /**
     * Crée un nouveau modèle de CV
     */
    @Transactional
    public CvModele createModele(CvModele cvModele) {
        logger.info("Création d'un nouveau modèle: {}", cvModele.getNom());
        
        // Vérifier si un modèle avec le même nom existe déjà
        if (cvModeleRepository.findByNom(cvModele.getNom()).isPresent()) {
            throw new IllegalArgumentException("Un modèle avec le nom '" + cvModele.getNom() + "' existe déjà");
        }
        
        return cvModeleRepository.save(cvModele);
    }

    /**
     * Met à jour un modèle existant
     */
    @Transactional
    public CvModele updateModele(Long id, CvModele modeleUpdated) {
        logger.info("Mise à jour du modèle avec l'ID: {}", id);
        
        return cvModeleRepository.findById(id)
                .map(modele -> {
                    if (modeleUpdated.getNom() != null) {
                        // Vérifier si le nouveau nom n'est pas déjà utilisé par un autre modèle
                        Optional<CvModele> existingModele = cvModeleRepository.findByNom(modeleUpdated.getNom());
                        if (existingModele.isPresent() && !existingModele.get().getId().equals(id)) {
                            throw new IllegalArgumentException("Un modèle avec le nom '" + modeleUpdated.getNom() + "' existe déjà");
                        }
                        modele.setNom(modeleUpdated.getNom());
                    }
                    if (modeleUpdated.getDescription() != null) {
                        modele.setDescription(modeleUpdated.getDescription());
                    }
                    if (modeleUpdated.getTemplateType() != null) {
                        modele.setTemplateType(modeleUpdated.getTemplateType());
                    }
                    if (modeleUpdated.getContenuJson() != null) {
                        modele.setContenuJson(modeleUpdated.getContenuJson());
                    }
                    if (modeleUpdated.getImagePreview() != null) {
                        modele.setImagePreview(modeleUpdated.getImagePreview());
                    }
                    if (modeleUpdated.getEstActif() != null) {
                        modele.setEstActif(modeleUpdated.getEstActif());
                    }
                    if (modeleUpdated.getEstPremium() != null) {
                        modele.setEstPremium(modeleUpdated.getEstPremium());
                    }
                    if (modeleUpdated.getOrdre() != null) {
                        modele.setOrdre(modeleUpdated.getOrdre());
                    }
                    if (modeleUpdated.getCategorie() != null) {
                        modele.setCategorie(modeleUpdated.getCategorie());
                    }
                    
                    return cvModeleRepository.save(modele);
                })
                .orElseThrow(() -> new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id));
    }

    /**
     * Supprime un modèle (soft delete en le désactivant)
     */
    @Transactional
    public void desactiverModele(Long id) {
        logger.info("Désactivation du modèle avec l'ID: {}", id);
        
        cvModeleRepository.findById(id)
                .ifPresentOrElse(
                        modele -> {
                            modele.setEstActif(false);
                            cvModeleRepository.save(modele);
                        },
                        () -> {
                            throw new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id);
                        }
                );
    }

    /**
     * Supprime définitivement un modèle
     */
    @Transactional
    public void deleteModele(Long id) {
        logger.info("Suppression définitive du modèle avec l'ID: {}", id);
        
        if (!cvModeleRepository.existsById(id)) {
            throw new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id);
        }
        
        cvModeleRepository.deleteById(id);
    }

    /**
     * Incrémente le compteur d'utilisations d'un modèle
     */
    @Transactional
    public void utiliserModele(Long id) {
        logger.info("Incrémentation du compteur d'utilisations pour le modèle: {}", id);
        
        if (!cvModeleRepository.existsById(id)) {
            throw new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id);
        }
        
        cvModeleRepository.incrementerUtilisations(id);
    }

    /**
     * Active un modèle
     */
    @Transactional
    public void activerModele(Long id) {
        logger.info("Activation du modèle avec l'ID: {}", id);
        
        cvModeleRepository.findById(id)
                .ifPresentOrElse(
                        modele -> {
                            modele.setEstActif(true);
                            cvModeleRepository.save(modele);
                        },
                        () -> {
                            throw new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id);
                        }
                );
    }

    /**
     * Clone un modèle existant avec un nouveau nom
     */
    @Transactional
    public CvModele clonerModele(Long id, String nouveauNom) {
        logger.info("Clonage du modèle {} avec le nouveau nom: {}", id, nouveauNom);
        
        CvModele modeleOriginal = cvModeleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Modèle non trouvé avec l'ID: " + id));
        
        // Vérifier si le nouveau nom n'existe pas déjà
        if (cvModeleRepository.findByNom(nouveauNom).isPresent()) {
            throw new IllegalArgumentException("Un modèle avec le nom '" + nouveauNom + "' existe déjà");
        }
        
        CvModele nouveauModele = new CvModele();
        nouveauModele.setNom(nouveauNom);
        nouveauModele.setDescription(modeleOriginal.getDescription() + " (Copie)");
        nouveauModele.setTemplateType(modeleOriginal.getTemplateType());
        nouveauModele.setContenuJson(modeleOriginal.getContenuJson());
        nouveauModele.setImagePreview(modeleOriginal.getImagePreview());
        nouveauModele.setCategorie(modeleOriginal.getCategorie());
        nouveauModele.setEstActif(false); // Le clone est désactivé par défaut
        nouveauModele.setEstPremium(modeleOriginal.getEstPremium());
        nouveauModele.setOrdre(modeleOriginal.getOrdre() + 100);
        
        return cvModeleRepository.save(nouveauModele);
    }
}
