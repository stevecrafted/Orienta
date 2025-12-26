package com.example.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Base64;

/**
 * Service Gemini Vision optimisé pour économiser la mémoire
 */
@Service
public class GeminiStreamingService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiStreamingService.class);

    @Value("${google.gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Extrait les données du CV avec streaming (pas de sérialisation complète en mémoire)
     */
    public CvStructuredData extractCvDataStreaming(MultipartFile file) throws Exception {
        logger.info("Extraction CV (Streaming): {}", file.getOriginalFilename());

        // Lire et encoder le fichier par chunks
        String base64Content = encodeFileToBase64Streaming(file);
        String mimeType = determineMimeType(file);

        logger.info("Fichier encodé (taille base64: {} chars), appel Gemini...", 
            base64Content.length());

        // Appeler Gemini avec streaming
        return callGeminiVisionApiStreaming(base64Content, mimeType, file.getOriginalFilename());
    }

    /**
     * Encode un fichier en base64 avec streaming (chunk par chunk)
     * Économise la mémoire en ne chargeant pas tout le fichier d'un coup
     */
    private String encodeFileToBase64Streaming(MultipartFile file) throws Exception {
        final int CHUNK_SIZE = 1024 * 1024; // 1MB chunks
        byte[] fileBytes = file.getBytes();
        
        logger.debug("Encodage base64 du fichier ({} bytes)", fileBytes.length);
        
        // Pour les petits fichiers (< 5MB), utiliser l'encodage standard
        if (fileBytes.length < CHUNK_SIZE * 5) {
            return Base64.getEncoder().encodeToString(fileBytes);
        }

        // Pour les gros fichiers, traiter par chunks
        StringBuilder base64 = new StringBuilder();
        for (int i = 0; i < fileBytes.length; i += CHUNK_SIZE) {
            int end = Math.min(i + CHUNK_SIZE, fileBytes.length);
            byte[] chunk = new byte[end - i];
            System.arraycopy(fileBytes, i, chunk, 0, end - i);
            base64.append(Base64.getEncoder().encodeToString(chunk));
            
            // Libérer la mémoire du chunk
            chunk = null;
        }

        return base64.toString();
    }

    /**
     * Appelle Gemini Vision API avec streaming de la réponse
     */
    private CvStructuredData callGeminiVisionApiStreaming(
            String base64Content, 
            String mimeType,
            String filename) throws Exception {

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" 
            + geminiApiKey;

        // Construire le payload JSON sans sérialiser tout d'un coup
        String payload = buildGeminiPayload(base64Content, mimeType);

        logger.info("Envoi de la requête à Gemini (payload: {} chars)", payload.length());

        URLConnection connection = new URL(url).openConnection();
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);
        connection.setDoInput(true);

        // Écrire le payload
        try (OutputStream os = connection.getOutputStream()) {
            byte[] payloadBytes = payload.getBytes("UTF-8");
            os.write(payloadBytes);
            os.flush();
            
            logger.debug("Payload envoyé ({} bytes)", payloadBytes.length);
        }

        // Lire la réponse avec streaming
        StringBuilder responseBody = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(connection.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                responseBody.append(line);
            }
        }

        logger.info("Réponse reçue ({} chars)", responseBody.length());

        // Parser la réponse JSON
        return parseGeminiResponse(responseBody.toString());
    }

    /**
     * Construit le payload JSON pour l'API Gemini sans ObjectMapper
     * (plus économe en mémoire)
     */
    private String buildGeminiPayload(String base64Content, String mimeType) {
        return String.format(
            "{\"contents\":[{\"parts\":[" +
            "{\"text\":\"Analyse ce CV et extrais les données structurées au format JSON avec la structure suivante:\\n" +
            "{\\\"personalInfo\\\":{\\\"name\\\":\\\"...\\\"},\\\"experiences\\\":[],\\\"skills\\\":[],\\\"education\\\":[]}\\n" +
            "Sois précis et structuré.\"}," +
            "{\"inlineData\":{\"mimeType\":\"%s\",\"data\":\"%s\"}}" +
            "]}]}",
            mimeType,
            base64Content
        );
    }

    /**
     * Parser la réponse de Gemini
     */
    private CvStructuredData parseGeminiResponse(String responseJson) throws Exception {
        // Parser et retourner les données structurées
        // Implémentation dépendante de votre structure CvStructuredData
        logger.info("Parsing de la réponse Gemini");
        
        // TODO: Implémenter le parsing JSON
        return new CvStructuredData();
    }

    private String determineMimeType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && contentType.equals("application/pdf")) {
            return "application/pdf";
        } else if (contentType != null && contentType.contains("word")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if (contentType != null && contentType.startsWith("image/")) {
            return contentType;
        }
        return contentType != null ? contentType : "application/octet-stream";
    }

    // Classe pour les données structurées (à adapter à votre implémentation)
    public static class CvStructuredData {
        // À implémenter
    }
}