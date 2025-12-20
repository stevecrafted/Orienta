package com.example.backend.controller;

import com.example.backend.dto.CvModeleDTO;
import com.example.backend.model.CvModele;
import com.example.backend.service.CvModeleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller pour gérer les modèles de CV prédéfinis
 */
@RestController
@RequestMapping("/api/cv-modeles")
@CrossOrigin(origins = "*")
public class CvModeleController {

    private static final Logger logger = LoggerFactory.getLogger(CvModeleController.class);

    @Autowired
    private CvModeleService cvModeleService;

    /**
     * Récupère tous les modèles de CV
     * GET /api/cv-modeles
     */
    @GetMapping
    public ResponseEntity<List<CvModele>> getAllModeles() {
        logger.info("GET /api/cv-modeles - Récupération de tous les modèles");
        try {
            List<CvModele> modeles = cvModeleService.getAllModeles();
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère tous les modèles actifs
     * GET /api/cv-modeles/actifs
     */
    @GetMapping("/actifs")
    public ResponseEntity<List<CvModele>> getModelesActifs() {
        logger.info("GET /api/cv-modeles/actifs - Récupération des modèles actifs");
        try {
            List<CvModele> modeles = cvModeleService.getModelesActifs();
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles actifs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère un modèle par son ID
     * GET /api/cv-modeles/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getModeleById(@PathVariable Long id) {
        logger.info("GET /api/cv-modeles/{} - Récupération du modèle", id);
        try {
            return cvModeleService.getModeleById(id)
                    .map(modele -> ResponseEntity.ok((Object) modele))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(createErrorResponse("Modèle non trouvé avec l'ID: " + id)));
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Récupère les modèles par type de template
     * GET /api/cv-modeles/template/{templateType}
     */
    @GetMapping("/template/{templateType}")
    public ResponseEntity<List<CvModele>> getModelesByTemplateType(@PathVariable String templateType) {
        logger.info("GET /api/cv-modeles/template/{} - Récupération des modèles", templateType);
        try {
            List<CvModele> modeles = cvModeleService.getModelesByTemplateType(templateType);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles par template {}", templateType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les modèles par catégorie
     * GET /api/cv-modeles/categorie/{categorie}
     */
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<CvModele>> getModelesByCategorie(@PathVariable String categorie) {
        logger.info("GET /api/cv-modeles/categorie/{} - Récupération des modèles", categorie);
        try {
            List<CvModele> modeles = cvModeleService.getModelesByCategorie(categorie);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles par catégorie {}", categorie, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les modèles premium
     * GET /api/cv-modeles/premium
     */
    @GetMapping("/premium")
    public ResponseEntity<List<CvModele>> getModelesPremium() {
        logger.info("GET /api/cv-modeles/premium - Récupération des modèles premium");
        try {
            List<CvModele> modeles = cvModeleService.getModelesPremium();
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles premium", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les modèles gratuits
     * GET /api/cv-modeles/gratuits
     */
    @GetMapping("/gratuits")
    public ResponseEntity<List<CvModele>> getModelesGratuits() {
        logger.info("GET /api/cv-modeles/gratuits - Récupération des modèles gratuits");
        try {
            List<CvModele> modeles = cvModeleService.getModelesGratuits();
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles gratuits", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Récupère les modèles les plus populaires
     * GET /api/cv-modeles/populaires?limit=5
     */
    @GetMapping("/populaires")
    public ResponseEntity<List<CvModele>> getModelesPopulaires(
            @RequestParam(defaultValue = "5") int limit) {
        logger.info("GET /api/cv-modeles/populaires?limit={} - Récupération des modèles populaires", limit);
        try {
            List<CvModele> modeles = cvModeleService.getModelesPopulaires(limit);
            return ResponseEntity.ok(modeles);
        } catch (Exception e) {
            logger.error("Erreur lors de la récupération des modèles populaires", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Crée un nouveau modèle de CV
     * POST /api/cv-modeles
     */
    @PostMapping
    public ResponseEntity<?> createModele(@RequestBody CvModeleDTO cvModeleDTO) {
        logger.info("POST /api/cv-modeles - Création d'un nouveau modèle: {}", cvModeleDTO.getNom());
        try {
            CvModele cvModele = new CvModele();
            cvModele.setNom(cvModeleDTO.getNom());
            cvModele.setDescription(cvModeleDTO.getDescription());
            cvModele.setTemplateType(cvModeleDTO.getTemplateType());
            cvModele.setCategorie(cvModeleDTO.getCategorie());
            cvModele.setEstActif(cvModeleDTO.getEstActif() != null ? cvModeleDTO.getEstActif() : true);

            // Convertir Map en JsonNode
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            com.fasterxml.jackson.databind.JsonNode jsonNode = mapper.valueToTree(cvModeleDTO.getContenuJson());
            cvModele.setContenuJson(jsonNode);

            CvModele modeleCreated = cvModeleService.createModele(cvModele);
            return ResponseEntity.status(HttpStatus.CREATED).body(modeleCreated);
        } catch (IllegalArgumentException e) {
            logger.error("Erreur de validation lors de la création du modèle", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de la création du modèle", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Met à jour un modèle existant
     * PUT /api/cv-modeles/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateModele(
            @PathVariable Long id,
            @RequestBody CvModele cvModele) {
        logger.info("PUT /api/cv-modeles/{} - Mise à jour du modèle", id);
        try {
            CvModele modeleUpdated = cvModeleService.updateModele(id, cvModele);
            return ResponseEntity.ok(modeleUpdated);
        } catch (IllegalArgumentException e) {
            logger.error("Erreur de validation lors de la mise à jour du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de la mise à jour du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Désactive un modèle (soft delete)
     * PATCH /api/cv-modeles/{id}/desactiver
     */
    @PatchMapping("/{id}/desactiver")
    public ResponseEntity<?> desactiverModele(@PathVariable Long id) {
        logger.info("PATCH /api/cv-modeles/{}/desactiver - Désactivation du modèle", id);
        try {
            cvModeleService.desactiverModele(id);
            return ResponseEntity.ok(createSuccessResponse("Modèle désactivé avec succès"));
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la désactivation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de la désactivation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Active un modèle
     * PATCH /api/cv-modeles/{id}/activer
     */
    @PatchMapping("/{id}/activer")
    public ResponseEntity<?> activerModele(@PathVariable Long id) {
        logger.info("PATCH /api/cv-modeles/{}/activer - Activation du modèle", id);
        try {
            cvModeleService.activerModele(id);
            return ResponseEntity.ok(createSuccessResponse("Modèle activé avec succès"));
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de l'activation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de l'activation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Supprime définitivement un modèle
     * DELETE /api/cv-modeles/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteModele(@PathVariable Long id) {
        logger.info("DELETE /api/cv-modeles/{} - Suppression définitive du modèle", id);
        try {
            cvModeleService.deleteModele(id);
            return ResponseEntity.ok(createSuccessResponse("Modèle supprimé avec succès"));
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de la suppression du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de la suppression du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Incrémente le compteur d'utilisations d'un modèle
     * POST /api/cv-modeles/{id}/utiliser
     */
    @PostMapping("/{id}/utiliser")
    public ResponseEntity<?> utiliserModele(@PathVariable Long id) {
        logger.info("POST /api/cv-modeles/{}/utiliser - Incrémentation des utilisations", id);
        try {
            cvModeleService.utiliserModele(id);
            return ResponseEntity.ok(createSuccessResponse("Utilisation enregistrée avec succès"));
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors de l'enregistrement de l'utilisation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors de l'enregistrement de l'utilisation du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    /**
     * Clone un modèle existant
     * POST /api/cv-modeles/{id}/cloner
     */
    @PostMapping("/{id}/cloner")
    public ResponseEntity<?> clonerModele(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String nouveauNom = body.get("nouveauNom");
        logger.info("POST /api/cv-modeles/{}/cloner - Clonage du modèle avec le nom: {}", id, nouveauNom);

        if (nouveauNom == null || nouveauNom.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse("Le nouveau nom est requis"));
        }

        try {
            CvModele modeleClone = cvModeleService.clonerModele(id, nouveauNom);
            return ResponseEntity.status(HttpStatus.CREATED).body(modeleClone);
        } catch (IllegalArgumentException e) {
            logger.error("Erreur lors du clonage du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Erreur lors du clonage du modèle {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Erreur interne du serveur"));
        }
    }

    // ===========================
    // MÉTHODES UTILITAIRES
    // ===========================

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }

    private Map<String, Object> createSuccessResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }
}
