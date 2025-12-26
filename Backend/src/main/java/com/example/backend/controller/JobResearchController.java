package com.example.backend.controller;

import com.example.backend.dto.JobResearchResponse;
import com.example.backend.service.JobResearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller pour la recherche d'emploi basée sur un CV
 */
@RestController
@RequestMapping("/api/job-research")
@CrossOrigin(origins = "*")
public class JobResearchController {

    private static final Logger logger = LoggerFactory.getLogger(JobResearchController.class);

    @Autowired
    private JobResearchService jobResearchService;

    // Tailles maximales autorisées
    private static final long MAX_FILE_SIZE = 20 * 1024 * 1024; // 10MB

    /**
     * Endpoint pour analyser un CV et générer des résultats de recherche d'emploi
     * 
     * @param file Le fichier CV (PDF, DOCX, Image)
     * @param location La localisation souhaitée (défaut: Antananarivo)
     * @param includeRemote Inclure les postes remote (défaut: true)
     * @return JobResearchResponse avec la requête Google, le profil et les résultats
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAndSearch(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "location", defaultValue = "Antananarivo") String location,
            @RequestParam(value = "includeRemote", defaultValue = "true") Boolean includeRemote) {
        
        logger.info("===== REQUÊTE DE RECHERCHE D'EMPLOI =====");
        logger.info("Fichier: {}, Taille: {} bytes", file.getOriginalFilename(), file.getSize());
        logger.info("Location: {}, Include Remote: {}", location, includeRemote);

        try {
            // Validation du fichier
            if (file.isEmpty()) {
                logger.warn("Fichier vide reçu");
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Le fichier est vide"));
            }

            if (file.getSize() > MAX_FILE_SIZE) {
                logger.warn("Fichier trop volumineux: {} bytes", file.getSize());
                return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body(createErrorResponse("Le fichier est trop volumineux (max 10MB)"));
            }

            // Validation du type de fichier
            String contentType = file.getContentType();
            if (contentType == null || !isValidFileType(contentType)) {
                logger.warn("Type de fichier non supporté: {}", contentType);
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Type de fichier non supporté. Utilisez PDF, DOCX ou images"));
            }

            // Effectuer l'analyse et la recherche
            JobResearchResponse response = jobResearchService.analyzeAndSearch(file, location, includeRemote);

            logger.info("Recherche terminée avec succès - {} résultats trouvés", 
                response.getJobResults().size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Erreur lors de la recherche d'emploi", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Erreur lors de l'analyse: " + e.getMessage()));
        }
    }

    /**
     * Endpoint de santé pour tester le service
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("service", "Job Research Service");
        return ResponseEntity.ok(response);
    }

    /**
     * Vérifie si le type de fichier est valide
     */
    private boolean isValidFileType(String contentType) {
        return contentType.equals("application/pdf") ||
               contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
               contentType.equals("application/msword") ||
               contentType.startsWith("image/");
    }

    /**
     * Crée une réponse d'erreur standardisée
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        error.put("timestamp", java.time.LocalDateTime.now().toString());
        return error;
    }
}
