package com.example.backend.service;

import com.example.backend.dto.JobResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.net.URIBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service pour effectuer des recherches Google via Custom Search API
 */
@Service
public class GoogleSearchService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleSearchService.class);

    @Value("${google.api.key}")
    private String googleApiKey;

    @Value("${google.search.engine.id}")
    private String searchEngineId;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Mots-clés pour identifier les offres d'emploi
    private static final Set<String> JOB_KEYWORDS = Set.of(
        "emploi", "job", "poste", "recrutement", "offre", "candidature", "carrière",
        "recruitment", "hiring", "position", "opportunity", "career", "vacancy"
    );

    // Mots-clés pour identifier les postes remote
    private static final Set<String> REMOTE_KEYWORDS = Set.of(
        "remote", "télétravail", "teletravail", "distance", "home office", 
        "travail à distance", "100% remote", "full remote"
    );

    /**
     * Effectue une recherche d'emplois via Google Custom Search
     * 
     * @param query La requête Google optimisée
     * @param maxResults Le nombre maximum de résultats (max 10 par requête API)
     * @return Liste des résultats d'emplois trouvés
     */
    public List<JobResult> searchJobs(String query, int maxResults) throws Exception {
        logger.info("===== Recherche Google =====");
        logger.info("Requête: {}", query);
        logger.info("Max résultats: {}", maxResults);

        List<JobResult> allResults = new ArrayList<>();
        
        // Google Custom Search API limite à 10 résultats par requête
        int resultsPerPage = Math.min(maxResults, 10);
        
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            
            // Construire l'URL de l'API
            URI uri = new URIBuilder("https://www.googleapis.com/customsearch/v1")
                .addParameter("key", googleApiKey)
                .addParameter("cx", searchEngineId)
                .addParameter("q", query)
                .addParameter("num", String.valueOf(resultsPerPage))
                .build();

            HttpGet httpGet = new HttpGet(uri);

            logger.info("Envoi de la requête à Google Custom Search API...");

            try (CloseableHttpResponse httpResponse = httpClient.execute(httpGet)) {
                int statusCode = httpResponse.getCode();
                
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
                String responseStr = reader.lines().collect(Collectors.joining("\n"));

                logger.info("Réponse Google reçue (status: {})", statusCode);

                if (statusCode != 200) {
                    logger.error("Erreur API Google: {}", responseStr);
                    throw new Exception("Erreur API Google: " + statusCode);
                }
                
                // Parser la réponse Google
                JsonNode rootNode = objectMapper.readTree(responseStr);
                JsonNode items = rootNode.path("items");

                if (items.isArray()) {
                    for (JsonNode item : items) {
                        JobResult jobResult = parseSearchResult(item);
                        if (jobResult != null && isJobRelated(jobResult)) {
                            allResults.add(jobResult);
                        }
                    }
                }

                logger.info("Résultats trouvés: {}", allResults.size());
            }

        } catch (Exception e) {
            logger.error("Erreur lors de la recherche Google", e);
            throw new Exception("Erreur recherche Google: " + e.getMessage(), e);
        }

        // Supprimer les doublons basés sur l'URL
        allResults = removeDuplicates(allResults);
        
        return allResults;
    }

    /**
     * Parse un résultat de recherche Google en JobResult
     */
    private JobResult parseSearchResult(JsonNode item) {
        try {
            String title = item.path("title").asText("");
            String link = item.path("link").asText("");
            String snippet = item.path("snippet").asText("");
            String displayLink = item.path("displayLink").asText("");

            // Extraire le nom de l'entreprise du displayLink ou du snippet
            String company = extractCompany(displayLink, snippet);
            
            // Détecter si c'est un poste remote
            Boolean isRemote = detectRemote(title, snippet);
            
            // Extraire la localisation si possible
            String location = extractLocation(snippet);

            JobResult result = new JobResult();
            result.setTitle(cleanTitle(title));
            result.setCompany(company);
            result.setLocation(location);
            result.setUrl(link);
            result.setDescription(snippet);
            result.setIsRemote(isRemote);
            result.setPublishedDate(null); // Google Custom Search ne fournit pas la date

            return result;

        } catch (Exception e) {
            logger.warn("Erreur lors du parsing d'un résultat: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Vérifie si le résultat est lié à une offre d'emploi
     */
    private boolean isJobRelated(JobResult result) {
        String searchText = (result.getTitle() + " " + result.getDescription()).toLowerCase();
        
        for (String keyword : JOB_KEYWORDS) {
            if (searchText.contains(keyword)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Détecte si le poste est en remote
     */
    private Boolean detectRemote(String title, String description) {
        String searchText = (title + " " + description).toLowerCase();
        
        for (String keyword : REMOTE_KEYWORDS) {
            if (searchText.contains(keyword)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Extrait le nom de l'entreprise
     */
    private String extractCompany(String displayLink, String snippet) {
        // Utiliser le domaine comme nom d'entreprise par défaut
        String company = displayLink.replace("www.", "").split("\\.")[0];
        
        // Capitaliser la première lettre
        if (!company.isEmpty()) {
            company = company.substring(0, 1).toUpperCase() + company.substring(1);
        }
        
        return company;
    }

    /**
     * Extrait la localisation du snippet si possible
     */
    private String extractLocation(String snippet) {
        // Patterns communs pour les localisations
        String[] patterns = {
            "à Antananarivo", "Antananarivo", "Madagascar",
            "à Tana", "Tana,", "location:", "lieu:"
        };
        
        for (String pattern : patterns) {
            int index = snippet.toLowerCase().indexOf(pattern.toLowerCase());
            if (index != -1) {
                // Extraire quelques mots après le pattern
                int endIndex = Math.min(index + pattern.length() + 30, snippet.length());
                String locationText = snippet.substring(index, endIndex).trim();
                
                // Nettoyer
                locationText = locationText.split("\\.")[0];
                locationText = locationText.split(",")[0];
                
                return locationText;
            }
        }
        
        return "Non spécifiée";
    }

    /**
     * Nettoie le titre en enlevant les suffixes inutiles
     */
    private String cleanTitle(String title) {
        // Enlever les suffixes comme " - Nom du site"
        String[] separators = {" - ", " | ", " – "};
        
        for (String sep : separators) {
            int index = title.indexOf(sep);
            if (index > 0) {
                title = title.substring(0, index);
            }
        }
        
        return title.trim();
    }

    /**
     * Supprime les doublons basés sur l'URL
     */
    private List<JobResult> removeDuplicates(List<JobResult> results) {
        Set<String> seenUrls = new HashSet<>();
        List<JobResult> unique = new ArrayList<>();
        
        for (JobResult result : results) {
            if (!seenUrls.contains(result.getUrl())) {
                seenUrls.add(result.getUrl());
                unique.add(result);
            }
        }
        
        return unique;
    }
}
