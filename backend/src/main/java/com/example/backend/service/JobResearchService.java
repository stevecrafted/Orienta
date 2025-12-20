package com.example.backend.service;

import com.example.backend.dto.CvProfile;
import com.example.backend.dto.JobResult;
import com.example.backend.dto.JobResearchResponse;
import com.example.backend.service.GeminiCvExtractionService.CvStructuredData;
import com.example.backend.service.GeminiCvExtractionService.SkillCategory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

/**
 * Service orchestrant la recherche d'emploi basée sur un CV
 */
@Service
public class JobResearchService {

    private static final Logger logger = LoggerFactory.getLogger(JobResearchService.class);

    @Autowired
    private GeminiCvExtractionService geminiCvExtractionService;

    @Autowired
    private OpenAIQueryGeneratorService openAIQueryGeneratorService;

    @Autowired
    private GoogleSearchService googleSearchService;

    /**
     * Méthode principale orchestrant tout le workflow de recherche d'emploi
     * 
     * @param cv Le fichier CV uploadé
     * @param location La localisation souhaitée
     * @param includeRemote Inclure les postes en remote
     * @return La réponse complète avec requête, profil et résultats
     */
    public JobResearchResponse analyzeAndSearch(MultipartFile cv, String location, Boolean includeRemote) throws Exception {
        logger.info("===== DÉBUT RECHERCHE D'EMPLOI =====");
        logger.info("Fichier CV: {}, Location: {}, Remote: {}", cv.getOriginalFilename(), location, includeRemote);

        // Étape 1: Extraire le profil du CV avec Gemini
        logger.info("Étape 1/4: Extraction du profil CV avec Gemini...");
        CvProfile profile = extractProfileFromCv(cv);
        
        // Étape 2: Générer la requête Google optimisée avec OpenAI
        logger.info("Étape 2/4: Génération de la requête Google avec OpenAI...");
        String googleQuery = openAIQueryGeneratorService.generateJobSearchQuery(profile, location, includeRemote);
        
        // Étape 3: Effectuer la recherche Google
        logger.info("Étape 3/4: Exécution de la recherche Google...");
        List<JobResult> jobResults = googleSearchService.searchJobs(googleQuery, 10);
        
        // Étape 4: Construire et retourner la réponse
        logger.info("Étape 4/4: Construction de la réponse...");
        JobResearchResponse response = new JobResearchResponse(googleQuery, profile, jobResults);
        
        logger.info("===== RECHERCHE TERMINÉE =====");
        logger.info("Résultats trouvés: {}", jobResults.size());
        
        return response;
    }

    /**
     * Extrait le profil du CV en utilisant le service Gemini existant
     * 
     * @param cv Le fichier CV
     * @return Le profil extrait sous forme de CvProfile
     */
    public CvProfile extractProfileFromCv(MultipartFile cv) throws Exception {
        logger.info("Extraction du profil depuis le CV...");
        
        // Utiliser le service existant
        CvStructuredData cvData = geminiCvExtractionService.extractCvData(cv);
        
        // Convertir CvStructuredData en CvProfile
        CvProfile profile = new CvProfile();
        
        // Informations personnelles
        if (cvData.getPersonalInfo() != null) {
            profile.setName(cvData.getPersonalInfo().getName());
            profile.setLocation(cvData.getPersonalInfo().getLocation());
        }
        
        // Titre professionnel (premier poste ou résumé)
        if (!cvData.getExperiences().isEmpty()) {
            profile.setTitle(cvData.getExperiences().get(0).getTitle());
        } else if (cvData.getSummary() != null && !cvData.getSummary().isEmpty()) {
            // Extraire un titre du résumé
            String[] lines = cvData.getSummary().split("\\n");
            if (lines.length > 0) {
                profile.setTitle(lines[0].trim());
            }
        }
        
        // Compétences (combiner toutes les catégories)
        List<String> allSkills = new ArrayList<>();
        for (SkillCategory category : cvData.getSkills()) {
            allSkills.addAll(category.getItems());
        }
        profile.setSkills(allSkills);
        
        // Expérience (résumé textuel)
        StringBuilder experienceText = new StringBuilder();
        if (!cvData.getExperiences().isEmpty()) {
            for (var exp : cvData.getExperiences()) {
                experienceText.append(exp.getTitle())
                    .append(" chez ")
                    .append(exp.getCompany())
                    .append(" (")
                    .append(exp.getStartDate())
                    .append(" - ")
                    .append(exp.getEndDate())
                    .append("). ");
            }
        }
        profile.setExperience(experienceText.toString().trim());
        
        // Formation (résumé textuel)
        StringBuilder educationText = new StringBuilder();
        if (!cvData.getEducation().isEmpty()) {
            for (var edu : cvData.getEducation()) {
                educationText.append(edu.getDegree())
                    .append(" en ")
                    .append(edu.getFieldOfStudy() != null ? edu.getFieldOfStudy() : "")
                    .append(" - ")
                    .append(edu.getInstitution())
                    .append(". ");
            }
        }
        profile.setEducation(educationText.toString().trim());
        
        // Calculer les années d'expérience (estimation basée sur les dates)
        Integer yearsOfExp = calculateYearsOfExperience(cvData);
        profile.setYearsOfExperience(yearsOfExp);
        
        logger.info("Profil extrait: {}, {} compétences, {} ans d'exp", 
            profile.getName(), allSkills.size(), yearsOfExp);
        
        return profile;
    }

    /**
     * Calcule le nombre d'années d'expérience approximatif
     */
    private Integer calculateYearsOfExperience(CvStructuredData cvData) {
        if (cvData.getExperiences().isEmpty()) {
            return 0;
        }
        
        try {
            // Prendre la première et dernière expérience
            var firstExp = cvData.getExperiences().get(cvData.getExperiences().size() - 1);
            var lastExp = cvData.getExperiences().get(0);
            
            // Parser les dates (format MM/YYYY ou YYYY)
            Integer startYear = extractYear(firstExp.getStartDate());
            Integer endYear = extractYear(lastExp.getEndDate());
            
            if (startYear != null && endYear != null) {
                return Math.max(0, endYear - startYear);
            }
            
            // Si la dernière expérience est "Présent", utiliser l'année actuelle
            if (lastExp.getEndDate().toLowerCase().contains("présent") || 
                lastExp.getEndDate().toLowerCase().contains("present")) {
                int currentYear = java.time.Year.now().getValue();
                if (startYear != null) {
                    return Math.max(0, currentYear - startYear);
                }
            }
            
        } catch (Exception e) {
            logger.warn("Impossible de calculer les années d'expérience: {}", e.getMessage());
        }
        
        // Fallback: compter le nombre d'expériences
        return cvData.getExperiences().size();
    }

    /**
     * Extrait l'année d'une date au format MM/YYYY ou YYYY
     */
    private Integer extractYear(String date) {
        if (date == null || date.isEmpty()) {
            return null;
        }
        
        try {
            // Rechercher un pattern de 4 chiffres consécutifs
            String[] parts = date.split("[/\\-\\s]");
            for (String part : parts) {
                if (part.matches("\\d{4}")) {
                    return Integer.parseInt(part);
                }
            }
        } catch (Exception e) {
            logger.debug("Impossible d'extraire l'année de: {}", date);
        }
        
        return null;
    }
}
