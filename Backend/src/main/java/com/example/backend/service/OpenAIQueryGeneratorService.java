package com.example.backend.service;

import com.example.backend.dto.CvProfile;
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

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service pour générer des requêtes Google optimisées via OpenAI
 */
@Service
public class OpenAIQueryGeneratorService {

    private static final Logger logger = LoggerFactory.getLogger(OpenAIQueryGeneratorService.class);

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Génère une requête Google optimisée pour la recherche d'emploi basée sur un
     * CV
     * 
     * @param profile       Le profil extrait du CV
     * @param location      La localisation souhaitée
     * @param includeRemote Inclure les postes en remote
     * @return Une requête Google optimisée avec opérateurs avancés
     */
    public String generateJobSearchQuery(CvProfile profile, String location, Boolean includeRemote) throws Exception {
        logger.info("===== Génération de requête Google avec OpenAI =====");
        logger.info("Profil: {}, Location: {}, Remote: {}", profile.getName(), location, includeRemote);

        String prompt = buildPrompt(profile, location, includeRemote);
        String query = callOpenAI(prompt);

        logger.info("Requête générée: {}", query);
        return query;
    }

    /**
     * Construit le prompt pour OpenAI
     */
    private String buildPrompt(CvProfile profile, String location, Boolean includeRemote) {
        StringBuilder cvText = new StringBuilder();
        cvText.append("Nom: ").append(profile.getName()).append("\n");

        if (profile.getTitle() != null && !profile.getTitle().isEmpty()) {
            cvText.append("Titre professionnel: ").append(profile.getTitle()).append("\n");
        }

        if (profile.getExperience() != null && !profile.getExperience().isEmpty()) {
            cvText.append("Expérience: ").append(profile.getExperience()).append("\n");
        }

        if (profile.getEducation() != null && !profile.getEducation().isEmpty()) {
            cvText.append("Formation: ").append(profile.getEducation()).append("\n");
        }

        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) {
            cvText.append("Compétences: ").append(String.join(", ", profile.getSkills())).append("\n");
        }

        if (profile.getYearsOfExperience() != null) {
            cvText.append("Années d'expérience: ").append(profile.getYearsOfExperience()).append("\n");
        }

        String remoteInstruction = includeRemote
                ? "Si le travail peut être fait à distance (ex : développement, télétravail), inclure `remote` ou `télétravail`"
                : "Exclure les postes en remote, se concentrer uniquement sur les postes présentiels";

        return "Voici un CV : \n" +
                cvText.toString() + "\n" +
                "Génère une requête Google extrêmement optimisée pour trouver exactement des offres d'emploi correspondant à ce profil. \n"
                +
                "Utilise tous les opérateurs techniques disponibles pour Google Search afin d'améliorer la précision, notamment :\n"
                +
                "- `AND` pour combiner plusieurs compétences ou critères\n" +
                "- `OR` pour proposer plusieurs variantes de poste ou expressions\n" + 
                "- `\"` pour rechercher des expressions exactes\n" +    
                "- Toute autre technique ou opérateur Google avancé pertinent pour maximiser la précision\n\n" +
                "La requête doit inclure :\n" +
                "- Poste adapté au CV \n" +
                "- Localisation : " + location + "\n" +
                "- Préciser si **présentiel** ou **remote/télétravail**, selon le type de travail\n" +
                "- Les compétences principales du CV\n" +
                "- Si le travail nécessite la présence physique (ex : commerce, vente, manutention), inclure explicitement `présentiel`\n"
                +
                "- " + remoteInstruction + "\n" + 
                "Ne donne **que la requête Google finale**, prête à copier-coller, sans aucune explication, et utilise si possible des parenthèses et opérateurs pour que Google interprète correctement les priorités (`AND`, `OR`, etc.).";
    }

    /**
     * Appelle l'API OpenAI
     */
    private String callOpenAI(String prompt) throws Exception {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // Construire le corps de la requête OpenAI
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini");
            requestBody.put("temperature", 0.3);
            requestBody.put("max_tokens", 200);

            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);

            requestBody.put("messages", messages);

            String jsonRequest = objectMapper.writeValueAsString(requestBody);

            HttpPost httpPost = new HttpPost("https://api.openai.com/v1/chat/completions");
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setHeader("Authorization", "Bearer " + openaiApiKey);
            httpPost.setEntity(new StringEntity(jsonRequest, StandardCharsets.UTF_8));

            logger.info("Envoi de la requête à OpenAI...");

            try (CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
                int statusCode = httpResponse.getCode();

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
                String responseStr = reader.lines().collect(Collectors.joining("\n"));

                logger.info("Réponse OpenAI reçue (status: {})", statusCode);

                if (statusCode != 200) {
                    logger.error("Erreur API OpenAI: {}", responseStr);
                    throw new Exception("Erreur API OpenAI: " + statusCode);
                }

                // Parser la réponse OpenAI
                JsonNode rootNode = objectMapper.readTree(responseStr);
                String query = rootNode.path("choices").get(0)
                        .path("message").path("content").asText();

                // Nettoyer la requête (enlever les guillemets, espaces inutiles)
                query = query.trim();
                if (query.startsWith("\"") && query.endsWith("\"")) {
                    query = query.substring(1, query.length() - 1);
                }

                return query;
            }

        } catch (Exception e) {
            logger.error("Erreur lors de l'appel à OpenAI", e);
            throw new Exception("Erreur génération requête avec OpenAI: " + e.getMessage(), e);
        }
    }
}
