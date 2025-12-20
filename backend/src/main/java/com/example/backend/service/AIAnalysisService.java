package com.example.backend.service;

import com.example.backend.dto.CvAnalysisRequest;
import com.example.backend.dto.CvAnalysisResponse; 
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper; 
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory; 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

import com.example.backend.model.FormationRecommendation;
import com.example.backend.utils.IASearchUtils;
import com.example.backend.utils.IASearchUtils.*;

@Service
public class AIAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AIAnalysisService.class);

    @Value("${openai.api.key}")
    private String openAiKey;

    @Value("${google.api.key}")
    private String googleApiKey;

    @Value("${google.search.engine.id}")
    private String googleSearchEngineId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // AI-powered CV analysis using OpenAI and Google Custom Search
    public CvAnalysisResponse analyzeCv(CvAnalysisRequest request) throws Exception {
        logger.info("===== Début analyse CV avec IA (100% AI-Driven) =====");

        CvAnalysisResponse response = new CvAnalysisResponse();

        // Step 1: Use OpenAI for comprehensive skill analysis
        SkillAnalysisResult skillAnalysis = analyzeSkillsWithAI(request.getJobDescription(), request.getCvText());
        logger.info("Analyse IA terminée - Matching: {}%, Manquantes: {}, Possédées: {}",
                skillAnalysis.matchPercentage, skillAnalysis.missingSkills.size(), skillAnalysis.currentSkills.size());

        if (skillAnalysis.missingSkills.isEmpty()) {
            logger.info("Aucune compétence manquante détectée.");
            response.setJobDescription(request.getJobDescription());
            response.setMissingSkills(new ArrayList<>());
            response.setMatchingSkills(skillAnalysis.matchingSkills);
            response.setMatchPercentage(100.0);
            response.setRecommendedFormations(new ArrayList<>());
            response.setImprovements(new HashMap<>());

            response.setOverallFeedback("Excellent ! Votre profil correspond parfaitement au poste.");
            return response;
        }

        // Step 2: Search for formations for each missing skill using Google Custom
        // Search
        Map<String, Map<String, List<FormationDetail>>> formationsBySkill = new HashMap<>();
        for (String skill : skillAnalysis.missingSkills) {
            logger.info("Recherche de formations pour: {}", skill);
            Map<String, List<FormationDetail>> formations = searchFormationsWithGoogle(skill);
            formationsBySkill.put(skill, formations);
        }

        // Step 3: Build comprehensive response
        // Convert formations to response format
        List<FormationRecommendation> recommendations = IASearchUtils.buildFormationRecommendations(formationsBySkill);

        Map<String, String> improvements = IASearchUtils.generateImprovements(request, skillAnalysis.missingSkills);
        String feedback = IASearchUtils.generateOverallFeedback(skillAnalysis.matchPercentage,
                skillAnalysis.missingSkills.size());

        response.setJobDescription(request.getJobDescription());
        response.setMissingSkills(skillAnalysis.missingSkills);
        response.setMatchingSkills(skillAnalysis.matchingSkills);
        response.setMatchPercentage(skillAnalysis.matchPercentage);
        response.setRecommendedFormations(recommendations);
        response.setImprovements(improvements);
        response.setOverallFeedback(feedback);

        logger.info("Analyse terminée avec succès");
        return response;
    }
    
    // Comprehensive AI-powered skill analysis
    private SkillAnalysisResult analyzeSkillsWithAI(String jobDescription, String cvText) throws Exception {
        logger.info("===== Analyse complète des compétences avec IA =====");

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            String prompt = String.format(
                    "Voici une offre d'emploi :\n%s\n\n" +
                            "Voici le profil du candidat :\n%s\n\n" +
                            "INSTRUCTIONS IMPORTANTES :\n" +
                            "1. Analyse uniquement les competences techniques essentielles dans l'offre d'emploi.\n" +
                            "2. Analyse uniquement les competences techniques importantes du candidat.\n" +
                            "3. Identifie les correspondances importantes (matching).\n" +
                            "4. Identifie uniquement les competences techniques manquantes REELLEMENT importantes.\n" +
                            "5. NE PAS suggerer les competences de base si une competence avancee est presente :\n" +
                            "   - React/Next.js/Angular/Vue.js -> NE PAS HTML, CSS, JavaScript\n" +
                            "   - Spring Boot -> NE PAS Java\n" +
                            "   - Django/Flask -> NE PAS Python\n" +
                            "   - Kubernetes -> NE PAS Docker\n" +
                            "   - Machine Learning -> NE PAS Python, Data Analysis\n" +
                            "   - Figma/Adobe XD -> NE PAS UI/UX Design de base\n" +
                            "   - Google Analytics -> NE PAS Digital Marketing de base\n" +
                            "   - Financial Modeling -> NE PAS Excel ou Financial Analysis de base\n" +
                            "6. Limite à maximum 10 competences clés par catégorie si la liste est longue.\n" +
                            "7. Calcule le pourcentage de matching (competences matching / competences requises * 100).\n\n"
                            +
                            "IMPORTANT : Tout ce que tu generes sera utilise directement dans un code Java. " +
                            "Tu NE DOIS PAS ajouter : accents, guillemets doubles ou simples supplementaires, ou caracteres speciaux/invisibles. "
                            +
                            "Respecte strictement le format JSON fourni et utilise uniquement des caracteres ASCII standards.\n\n"
                            +
                            "Format JSON valide avec double quotes UNIQUEMENT :\n" +
                            "{\n" +
                            "    \"competences_requises\": [\"comp1\", \"comp2\", ...],\n" +
                            "    \"competences_candidat\": [\"comp1\", \"comp2\", ...],\n" +
                            "    \"competences_matching\": [\"comp1\", ...],\n" +
                            "    \"competences_manquantes\": [\"comp2\", ...],\n" +
                            "    \"pourcentage_matching\": 75.5\n" +
                            "}\n" +
                            "NE PAS ajouter de texte avant ou apres le JSON.\n" +
                            "UTILISE UNE LOGIQUE POUR COUVRIR LES BASES SI COMPETENCE AVANCEE EST PRESENTE.",
                    jobDescription,
                    cvText);

            // Build OpenAI request
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini");
            requestBody.put("messages", Arrays.asList(
                    Map.of("role", "system", "content",
                            "Tu es un expert en analyse de compétences professionnelles. Tu analyses les CV et offres d'emploi avec précision."),
                    Map.of("role", "user", "content", prompt)));

            String jsonRequest = objectMapper.writeValueAsString(requestBody);

            HttpPost httpPost = new HttpPost("https://api.openai.com/v1/chat/completions");
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("Authorization", "Bearer " + openAiKey);
            httpPost.setEntity(new StringEntity(jsonRequest));

            try (CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
                String responseStr = reader.lines().collect(Collectors.joining("\n"));

                logger.info("Réponse OpenAI reçue pour analyse complète");

                // Parse OpenAI response
                JsonNode rootNode = objectMapper.readTree(responseStr);
                String content = rootNode.path("choices").get(0).path("message").path("content").asText();

                logger.info("Contenu brut GPT: {}", content);

                // Clean JSON response
                content = content.replaceAll("^```json\\s*", "").replaceAll("\\s*```$", "").trim();
                content = content.replace("'", "\"");
                
                // Normaliser les caractères spéciaux générés par l'IA
                content = IASearchUtils.normalizeAIGeneratedJson(content);

                logger.info("Contenu nettoyé et normalisé: {}", content);

                // Parse skill analysis
                JsonNode analysisNode = objectMapper.readTree(content);

                SkillAnalysisResult result = new SkillAnalysisResult();

                // Extract required skills (avec normalisation)
                result.requiredSkills = new ArrayList<>();
                analysisNode.path("competences_requises").forEach(node -> 
                    result.requiredSkills.add(IASearchUtils.normalizeAIGeneratedText(node.asText())));

                // Extract current skills (avec normalisation)
                result.currentSkills = new ArrayList<>();
                analysisNode.path("competences_candidat").forEach(node -> 
                    result.currentSkills.add(IASearchUtils.normalizeAIGeneratedText(node.asText())));

                // Extract matching skills (avec normalisation)
                result.matchingSkills = new ArrayList<>();
                analysisNode.path("competences_matching").forEach(node -> 
                    result.matchingSkills.add(IASearchUtils.normalizeAIGeneratedText(node.asText())));

                // Extract missing skills (avec normalisation)
                result.missingSkills = new ArrayList<>();
                analysisNode.path("competences_manquantes").forEach(node -> 
                    result.missingSkills.add(IASearchUtils.normalizeAIGeneratedText(node.asText())));

                // Extract match percentage
                result.matchPercentage = analysisNode.path("pourcentage_matching").asDouble(0.0);

                logger.info("Analyse complète: {} requises, {} possédées, {} matching, {} manquantes ({}%)",
                        result.requiredSkills.size(), result.currentSkills.size(),
                        result.matchingSkills.size(), result.missingSkills.size(), result.matchPercentage);

                return result;
            }

        } catch (Exception e) {
            logger.error("Erreur lors de l'analyse IA complète, fallback sur méthode simple", e);
            // Fallback to simple method
            throw new Exception(e);
        }
    }

    // Inner class for skill analysis result
    private static class SkillAnalysisResult {
        List<String> requiredSkills;
        List<String> currentSkills;
        List<String> matchingSkills;
        List<String> missingSkills;
        double matchPercentage;
    }

    // Search formations using Google Custom Search API with direct course links
    private Map<String, List<FormationDetail>> searchFormationsWithGoogle(String skill) {
        logger.info("===== Recherche Google pour: {} =====", skill);

        Map<String, List<FormationDetail>> results = new HashMap<>();
        results.put("gratuites_sans_certificat", new ArrayList<>());
        results.put("gratuites_avec_certificat", new ArrayList<>());
        results.put("payantes", new ArrayList<>());

        try {
            // Utilisation d'une requête fixe optimisée - seule la compétence change
            String query = stringQueryForGoogleSearch(skill);
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);

            String url = String.format(
                    "https://www.googleapis.com/customsearch/v1?key=%s&cx=%s&q=%s&num=3",
                    googleApiKey, googleSearchEngineId, encodedQuery);

            URI uri = new URI(url);
            String response = restTemplate.getForObject(uri, String.class);

            JsonNode rootNode = objectMapper.readTree(response);
            JsonNode items = rootNode.path("items");

            logger.info("Résultats Google reçus pour '{}': {} items", skill, items.size());

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String title = IASearchUtils.normalizeAIGeneratedText(item.path("title").asText(""));
                    String link = item.path("link").asText("");
                    String snippet = IASearchUtils.normalizeAIGeneratedText(item.path("snippet").asText(""));

                    if (link.isEmpty())
                        continue;

                    // Skip non-formation links (blog posts, forums, etc.)
                    if (!IASearchUtils.isFormationLink(link, title, snippet)) {
                        logger.debug("Lien ignoré (pas une formation): {}", link);
                        continue;
                    }

                    // Extract platform name
                    String platform = IASearchUtils.normalizeAIGeneratedText(IASearchUtils.extractPlatformName(link, logger));

                    // Simple classification - just get category for organization
                    String category = IASearchUtils.classifyFormation(link);

                    logger.info("Formation trouvée: {} - {} ({})", platform, title, link);

                    // Create formation with minimal info - just link matters
                    FormationDetail formation = new FormationDetail(
                            title, link, platform, new HashMap<>());

                    results.get(category).add(formation);

                    // Limit to 3 per category
                    if (results.get(category).size() >= 3) {
                        boolean hasMinimum = results.values().stream()
                                .allMatch(list -> list.size() >= 1);
                        if (hasMinimum)
                            break;
                    }
                }
            }

            logger.info("Formations trouvées - Gratuites sans cert: {}, Gratuites avec cert: {}, Payantes: {}",
                    results.get("gratuites_sans_certificat").size(),
                    results.get("gratuites_avec_certificat").size(),
                    results.get("payantes").size());

        } catch (Exception e) {
            logger.error("Erreur lors de la recherche Google", e);
        }

        return results;
    }
 
    private String stringQueryForGoogleSearch(String competence) throws Exception { 
        return String.format(
            "(intitle:\"formation\" OR intitle:\"cours\" OR intitle:\"tutoriel\" OR intitle:\"certification\" OR intitle:\"programme\" OR intitle:\"bootcamp\") AND (\"%s\") -intitle:\"offre\" (inurl:formation OR inurl:cours OR inurl:tutoriel OR inurl:certification OR inurl:programme OR inurl:bootcamp) -site:\"linkedin.com\"",
            competence
        );
    }

}
