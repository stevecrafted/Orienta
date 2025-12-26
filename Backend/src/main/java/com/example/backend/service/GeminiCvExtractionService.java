package com.example.backend.service;

import com.example.backend.utils.IASearchUtils;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service pour extraire les informations structurées d'un CV en utilisant Google Gemini Vision API
 * Supporte: PDF, Images (JPG, PNG), TXT, DOCX
 */
@Service
public class GeminiCvExtractionService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiCvExtractionService.class);

    @Value("${google.gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Extrait les informations structurées d'un CV en utilisant Gemini Vision
     * 
     * @param file Le fichier CV uploadé (PDF, Image, TXT, etc.)
     * @return CvStructuredData contenant toutes les informations extraites
     */
    public CvStructuredData extractCvData(MultipartFile file) throws Exception {
        logger.info("===== Début extraction CV avec Gemini Vision =====");
        logger.info("Fichier: {}, Type: {}, Taille: {} bytes", 
            file.getOriginalFilename(), file.getContentType(), file.getSize());

        // Convertir le fichier en base64
        String base64Content = Base64.getEncoder().encodeToString(file.getBytes());
        String mimeType = determineMimeType(file);

        logger.info("Fichier encodé en base64, MIME type: {}", mimeType);

        // Appeler Gemini Vision API
        CvStructuredData cvData = callGeminiVisionApi(base64Content, mimeType);

        logger.info("Extraction terminée avec succès - Nom: {}, Expériences: {}, Formations: {}, Compétences: {}",
            cvData.getPersonalInfo().getName(),
            cvData.getExperiences().size(),
            cvData.getEducation().size(),
            cvData.getSkills().size());

        return cvData;
    }

    /**
     * Appelle l'API Gemini Vision pour extraire les données du CV
     */
    private CvStructuredData callGeminiVisionApi(String base64Content, String mimeType) throws Exception {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            
            // Construire le prompt pour Gemini
            String prompt = buildExtractionPrompt();

            // Construire le corps de la requête Gemini
            Map<String, Object> requestBody = new HashMap<>();
            
            // Contents
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();
            
            // Parts (text + image)
            List<Map<String, Object>> parts = new ArrayList<>();
            
            // Part 1: Le prompt texte
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);
            parts.add(textPart);
            
            // Part 2: L'image/document en base64
            Map<String, Object> imagePart = new HashMap<>();
            Map<String, Object> inlineData = new HashMap<>();
            inlineData.put("mime_type", mimeType);
            inlineData.put("data", base64Content);
            imagePart.put("inline_data", inlineData);
            parts.add(imagePart);
            
            content.put("parts", parts);
            contents.add(content);
            
            requestBody.put("contents", contents);
            
            // Configuration de génération pour obtenir du JSON
            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.1);
            // Note: response_mime_type n'est pas supporté par toutes les versions de l'API
            // On s'appuie sur les instructions du prompt pour obtenir du JSON
            requestBody.put("generationConfig", generationConfig);

            String jsonRequest = objectMapper.writeValueAsString(requestBody);
            
            // URL de l'API Gemini 1.5 Flash (utilise v1beta pour les modèles récents)
            String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;
            
            HttpPost httpPost = new HttpPost(apiUrl);
            httpPost.setHeader("Content-Type", "application/json");
            httpPost.setEntity(new StringEntity(jsonRequest, StandardCharsets.UTF_8));

            logger.info("Envoi de la requête à Gemini Vision API...");

            try (CloseableHttpResponse httpResponse = httpClient.execute(httpPost)) {
                int statusCode = httpResponse.getCode();
                
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(httpResponse.getEntity().getContent(), StandardCharsets.UTF_8));
                String responseStr = reader.lines().collect(Collectors.joining("\n"));

                logger.info("Réponse Gemini reçue (status: {})", statusCode);
                    
                if (statusCode != 200) {
                    logger.error("Erreur API Gemini: {}", responseStr);
                    throw new Exception("Erreur API Gemini: " + statusCode);
                }
                
                // Parser la réponse Gemini
                JsonNode rootNode = objectMapper.readTree(responseStr);
                String contentss = rootNode.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

                logger.info("Contenu JSON extrait par Gemini");

                // Parser le JSON des données CV
                CvStructuredData cvData = parseJsonToCvData(contentss);
                
                return cvData;
            }

        } catch (Exception e) {
            logger.error("Erreur lors de l'extraction avec Gemini", e);
            throw new Exception("Erreur extraction CV avec Gemini: " + e.getMessage(), e);
        }
    }
    
    /**
     * Construit le prompt pour l'extraction de CV
     */
    private String buildExtractionPrompt() {
        return "Analyse ce CV et extrait TOUTES les informations en JSON structuré.\n\n" +
               "IMPORTANT: Retourne UNIQUEMENT du JSON valide, sans texte additionnel, sans backticks, sans markdown.\n\n" +
               "Structure JSON attendue:\n" +
               "{\n" +
               "  \"personal_info\": {\n" +
               "    \"name\": \"Nom complet\",\n" +
               "    \"email\": \"email@example.com\",\n" +
               "    \"phone\": \"+33...\",\n" +
               "    \"location\": \"Ville, Pays\",\n" +
               "    \"linkedin\": \"URL LinkedIn (si présent)\",\n" +
               "    \"github\": \"URL GitHub (si présent)\",\n" +
               "    \"portfolio\": \"URL portfolio (si présent)\"\n" +
               "  },\n" +
               "  \"experiences\": [\n" +
               "    {\n" +
               "      \"title\": \"Titre du poste\",\n" +
               "      \"company\": \"Nom de l'entreprise\",\n" +
               "      \"location\": \"Lieu\",\n" +
               "      \"start_date\": \"MM/YYYY\",\n" +
               "      \"end_date\": \"MM/YYYY ou 'Présent'\",\n" +
               "      \"description\": \"Description des responsabilités et réalisations\",\n" +
               "      \"achievements\": [\"Réalisation 1\", \"Réalisation 2\"]\n" +
               "    }\n" +
               "  ],\n" +
               "  \"education\": [\n" +
               "    {\n" +
               "      \"degree\": \"Diplôme obtenu\",\n" +
               "      \"institution\": \"Nom de l'école/université\",\n" +
               "      \"location\": \"Lieu\",\n" +
               "      \"start_date\": \"YYYY\",\n" +
               "      \"end_date\": \"YYYY\",\n" +
               "      \"field_of_study\": \"Domaine d'étude\",\n" +
               "      \"grade\": \"Note/Mention (si présent)\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"skills\": [\n" +
               "    {\n" +
               "      \"category\": \"Langages de programmation\",\n" +
               "      \"items\": [\"Java\", \"Python\", \"JavaScript\"]\n" +
               "    },\n" +
               "    {\n" +
               "      \"category\": \"Frameworks\",\n" +
               "      \"items\": [\"Spring Boot\", \"React\", \"Django\"]\n" +
               "    }\n" +
               "  ],\n" +
               "  \"languages\": [\n" +
               "    {\n" +
               "      \"language\": \"Français\",\n" +
               "      \"level\": \"Langue maternelle\"\n" +
               "    },\n" +
               "    {\n" +
               "      \"language\": \"Anglais\",\n" +
               "      \"level\": \"Courant (C1)\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"certifications\": [\n" +
               "    {\n" +
               "      \"name\": \"Nom de la certification\",\n" +
               "      \"issuer\": \"Organisme émetteur\",\n" +
               "      \"date\": \"MM/YYYY\",\n" +
               "      \"credential_id\": \"ID (si présent)\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"projects\": [\n" +
               "    {\n" +
               "      \"name\": \"Nom du projet\",\n" +
               "      \"description\": \"Description\",\n" +
               "      \"technologies\": [\"Tech1\", \"Tech2\"],\n" +
               "      \"url\": \"URL (si présent)\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"summary\": \"Résumé professionnel (si présent sur le CV)\"\n" +
               "}\n\n" +
               "INSTRUCTIONS:\n" +
               "- Extrait toutes les informations visibles sur le CV\n" +
               "- Si une information n'est pas présente, utilise null ou [] pour les listes\n" +
               "- Normalise les dates au format indiqué\n" +
               "- Groupe les compétences par catégories logiques\n" +
               "- Retourne UNIQUEMENT du JSON, pas de texte avant ou après\n" +
               "- N'ajoute pas de backticks markdown (```json)";
    }

    /**
     * Parse le JSON retourné par Gemini en objet Java
     */
    private CvStructuredData parseJsonToCvData(String jsonContent) throws Exception {
        try {
            // Nettoyer le JSON (enlever les backticks markdown si présents)
            jsonContent = jsonContent.trim();
            if (jsonContent.startsWith("```json")) {
                jsonContent = jsonContent.substring(7);
            }
            if (jsonContent.startsWith("```")) {
                jsonContent = jsonContent.substring(3);
            }
            if (jsonContent.endsWith("```")) {
                jsonContent = jsonContent.substring(0, jsonContent.length() - 3);
            }
            jsonContent = jsonContent.trim();

            // Normaliser les caractères spéciaux générés par l'IA
            jsonContent = IASearchUtils.normalizeAIGeneratedJson(jsonContent);
            
            logger.debug("JSON normalisé pour parsing: {}", jsonContent.substring(0, Math.min(200, jsonContent.length())));

            JsonNode rootNode = objectMapper.readTree(jsonContent);
            
            CvStructuredData cvData = new CvStructuredData();
            
            // Personal Info
            JsonNode personalInfo = rootNode.path("personal_info");
            cvData.setPersonalInfo(new PersonalInfo(
                IASearchUtils.normalizeAIGeneratedText(personalInfo.path("name").asText("")),
                personalInfo.path("email").asText(null),
                personalInfo.path("phone").asText(null),
                IASearchUtils.normalizeAIGeneratedText(personalInfo.path("location").asText(null)),
                personalInfo.path("linkedin").asText(null),
                personalInfo.path("github").asText(null),
                personalInfo.path("portfolio").asText(null)
            ));
            
            // Experiences
            List<Experience> experiences = new ArrayList<>();
            rootNode.path("experiences").forEach(exp -> {
                experiences.add(new Experience(
                    IASearchUtils.normalizeAIGeneratedText(exp.path("title").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(exp.path("company").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(exp.path("location").asText(null)),
                    exp.path("start_date").asText(""),
                    exp.path("end_date").asText(""),
                    IASearchUtils.normalizeAIGeneratedText(exp.path("description").asText("")),
                    normalizeStringList(parseStringList(exp.path("achievements")))
                ));
            });
            cvData.setExperiences(experiences);
            
            // Education
            List<Education> education = new ArrayList<>();
            rootNode.path("education").forEach(edu -> {
                education.add(new Education(
                    IASearchUtils.normalizeAIGeneratedText(edu.path("degree").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(edu.path("institution").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(edu.path("location").asText(null)),
                    edu.path("start_date").asText(""),
                    edu.path("end_date").asText(""),
                    IASearchUtils.normalizeAIGeneratedText(edu.path("field_of_study").asText(null)),
                    IASearchUtils.normalizeAIGeneratedText(edu.path("grade").asText(null))
                ));
            });
            cvData.setEducation(education);
            
            // Skills
            List<SkillCategory> skills = new ArrayList<>();
            rootNode.path("skills").forEach(skill -> {
                skills.add(new SkillCategory(
                    IASearchUtils.normalizeAIGeneratedText(skill.path("category").asText("")),
                    normalizeStringList(parseStringList(skill.path("items")))
                ));
            });
            cvData.setSkills(skills);
            
            // Languages
            List<Language> languages = new ArrayList<>();
            rootNode.path("languages").forEach(lang -> {
                languages.add(new Language(
                    IASearchUtils.normalizeAIGeneratedText(lang.path("language").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(lang.path("level").asText(""))
                ));
            });
            cvData.setLanguages(languages);
            
            // Certifications
            List<Certification> certifications = new ArrayList<>();
            rootNode.path("certifications").forEach(cert -> {
                certifications.add(new Certification(
                    IASearchUtils.normalizeAIGeneratedText(cert.path("name").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(cert.path("issuer").asText("")),
                    cert.path("date").asText(""),
                    cert.path("credential_id").asText(null)
                ));
            });
            cvData.setCertifications(certifications);
            
            // Projects
            List<Project> projects = new ArrayList<>();
            rootNode.path("projects").forEach(proj -> {
                projects.add(new Project(
                    IASearchUtils.normalizeAIGeneratedText(proj.path("name").asText("")),
                    IASearchUtils.normalizeAIGeneratedText(proj.path("description").asText("")),
                    normalizeStringList(parseStringList(proj.path("technologies"))),
                    proj.path("url").asText(null)
                ));
            });
            cvData.setProjects(projects);
            
            // Summary
            cvData.setSummary(IASearchUtils.normalizeAIGeneratedText(rootNode.path("summary").asText(null)));
            
            return cvData;
            
        } catch (Exception e) {
            logger.error("Erreur lors du parsing JSON vers CvData", e);
            throw new Exception("Erreur parsing JSON: " + e.getMessage(), e);
        }
    }

    /**
     * Parse une liste de strings depuis un JsonNode
     */
    private List<String> parseStringList(JsonNode node) {
        List<String> result = new ArrayList<>();
        if (node.isArray()) {
            node.forEach(item -> result.add(item.asText()));
        }
        return result;
    }

    /**
     * Normalise une liste de strings en appliquant la normalisation sur chaque élément
     */
    private List<String> normalizeStringList(List<String> list) {
        if (list == null || list.isEmpty()) {
            return list;
        }
        List<String> normalized = new ArrayList<>();
        for (String item : list) {
            normalized.add(IASearchUtils.normalizeAIGeneratedText(item));
        }
        return normalized;
    }

    /**
     * Détermine le MIME type du fichier
     */
    private String determineMimeType(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType != null && !contentType.isEmpty()) {
            return contentType;
        }
        
        // Fallback basé sur l'extension
        String filename = file.getOriginalFilename();
        if (filename != null) {
            if (filename.toLowerCase().endsWith(".pdf")) return "application/pdf";
            if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) return "image/jpeg";
            if (filename.toLowerCase().endsWith(".png")) return "image/png";
            if (filename.toLowerCase().endsWith(".txt")) return "text/plain";
        }
        
        return "application/octet-stream";
    }

    // ==================== Classes internes pour les données structurées ====================

    public static class CvStructuredData {
        private PersonalInfo personalInfo;
        private List<Experience> experiences = new ArrayList<>();
        private List<Education> education = new ArrayList<>();
        private List<SkillCategory> skills = new ArrayList<>();
        private List<Language> languages = new ArrayList<>();
        private List<Certification> certifications = new ArrayList<>();
        private List<Project> projects = new ArrayList<>();
        private String summary;

        // Getters and Setters
        public PersonalInfo getPersonalInfo() { return personalInfo; }
        public void setPersonalInfo(PersonalInfo personalInfo) { this.personalInfo = personalInfo; }
        
        public List<Experience> getExperiences() { return experiences; }
        public void setExperiences(List<Experience> experiences) { this.experiences = experiences; }
        
        public List<Education> getEducation() { return education; }
        public void setEducation(List<Education> education) { this.education = education; }
        
        public List<SkillCategory> getSkills() { return skills; }
        public void setSkills(List<SkillCategory> skills) { this.skills = skills; }
        
        public List<Language> getLanguages() { return languages; }
        public void setLanguages(List<Language> languages) { this.languages = languages; }
        
        public List<Certification> getCertifications() { return certifications; }
        public void setCertifications(List<Certification> certifications) { this.certifications = certifications; }
        
        public List<Project> getProjects() { return projects; }
        public void setProjects(List<Project> projects) { this.projects = projects; }
        
        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }

        /**
         * Convertit les données structurées en texte brut pour l'analyse
         */
        public String toPlainText() {
            StringBuilder sb = new StringBuilder();
            
            // Personal Info
            if (personalInfo != null) {
                sb.append("===== INFORMATIONS PERSONNELLES =====\n");
                sb.append("Nom: ").append(personalInfo.getName()).append("\n");
                if (personalInfo.getEmail() != null) sb.append("Email: ").append(personalInfo.getEmail()).append("\n");
                if (personalInfo.getPhone() != null) sb.append("Téléphone: ").append(personalInfo.getPhone()).append("\n");
                if (personalInfo.getLocation() != null) sb.append("Localisation: ").append(personalInfo.getLocation()).append("\n");
                sb.append("\n");
            }
            
            // Summary
            if (summary != null && !summary.isEmpty()) {
                sb.append("===== RÉSUMÉ =====\n");
                sb.append(summary).append("\n\n");
            }
            
            // Experiences
            if (!experiences.isEmpty()) {
                sb.append("===== EXPÉRIENCES PROFESSIONNELLES =====\n");
                for (Experience exp : experiences) {
                    sb.append(exp.getTitle()).append(" - ").append(exp.getCompany()).append("\n");
                    sb.append(exp.getStartDate()).append(" - ").append(exp.getEndDate()).append("\n");
                    sb.append(exp.getDescription()).append("\n");
                    if (!exp.getAchievements().isEmpty()) {
                        sb.append("Réalisations: ").append(String.join(", ", exp.getAchievements())).append("\n");
                    }
                    sb.append("\n");
                }
            }
            
            // Education
            if (!education.isEmpty()) {
                sb.append("===== FORMATION =====\n");
                for (Education edu : education) {
                    sb.append(edu.getDegree()).append(" - ").append(edu.getInstitution()).append("\n");
                    sb.append(edu.getStartDate()).append(" - ").append(edu.getEndDate()).append("\n\n");
                }
            }
            
            // Skills
            if (!skills.isEmpty()) {
                sb.append("===== COMPÉTENCES =====\n");
                for (SkillCategory cat : skills) {
                    sb.append(cat.getCategory()).append(": ");
                    sb.append(String.join(", ", cat.getItems())).append("\n");
                }
                sb.append("\n");
            }
            
            // Languages
            if (!languages.isEmpty()) {
                sb.append("===== LANGUES =====\n");
                for (Language lang : languages) {
                    sb.append(lang.getLanguage()).append(": ").append(lang.getLevel()).append("\n");
                }
                sb.append("\n");
            }
            
            return sb.toString();
        }
    }

    public static class PersonalInfo {
        private String name;
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String portfolio;

        public PersonalInfo() {}
        public PersonalInfo(String name, String email, String phone, String location, String linkedin, String github, String portfolio) {
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.location = location;
            this.linkedin = linkedin;
            this.github = github;
            this.portfolio = portfolio;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getLinkedin() { return linkedin; }
        public void setLinkedin(String linkedin) { this.linkedin = linkedin; }
        public String getGithub() { return github; }
        public void setGithub(String github) { this.github = github; }
        public String getPortfolio() { return portfolio; }
        public void setPortfolio(String portfolio) { this.portfolio = portfolio; }
    }

    public static class Experience {
        private String title;
        private String company;
        private String location;
        private String startDate;
        private String endDate;
        private String description;
        private List<String> achievements;

        public Experience() {}
        public Experience(String title, String company, String location, String startDate, String endDate, String description, List<String> achievements) {
            this.title = title;
            this.company = company;
            this.location = location;
            this.startDate = startDate;
            this.endDate = endDate;
            this.description = description;
            this.achievements = achievements != null ? achievements : new ArrayList<>();
        }

        // Getters and Setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<String> getAchievements() { return achievements; }
        public void setAchievements(List<String> achievements) { this.achievements = achievements; }
    }

    public static class Education {
        private String degree;
        private String institution;
        private String location;
        private String startDate;
        private String endDate;
        private String fieldOfStudy;
        private String grade;

        public Education() {}
        public Education(String degree, String institution, String location, String startDate, String endDate, String fieldOfStudy, String grade) {
            this.degree = degree;
            this.institution = institution;
            this.location = location;
            this.startDate = startDate;
            this.endDate = endDate;
            this.fieldOfStudy = fieldOfStudy;
            this.grade = grade;
        }

        // Getters and Setters
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }
        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
    }

    public static class SkillCategory {
        private String category;
        private List<String> items;

        public SkillCategory() {}
        public SkillCategory(String category, List<String> items) {
            this.category = category;
            this.items = items != null ? items : new ArrayList<>();
        }

        // Getters and Setters
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public List<String> getItems() { return items; }
        public void setItems(List<String> items) { this.items = items; }
    }

    public static class Language {
        private String language;
        private String level;

        public Language() {}
        public Language(String language, String level) {
            this.language = language;
            this.level = level;
        }

        // Getters and Setters
        public String getLanguage() { return language; }
        public void setLanguage(String language) { this.language = language; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
    }

    public static class Certification {
        private String name;
        private String issuer;
        private String date;
        private String credentialId;

        public Certification() {}
        public Certification(String name, String issuer, String date, String credentialId) {
            this.name = name;
            this.issuer = issuer;
            this.date = date;
            this.credentialId = credentialId;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIssuer() { return issuer; }
        public void setIssuer(String issuer) { this.issuer = issuer; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getCredentialId() { return credentialId; }
        public void setCredentialId(String credentialId) { this.credentialId = credentialId; }
    }

    public static class Project {
        private String name;
        private String description;
        private List<String> technologies;
        private String url;

        public Project() {}
        public Project(String name, String description, List<String> technologies, String url) {
            this.name = name;
            this.description = description;
            this.technologies = technologies != null ? technologies : new ArrayList<>();
            this.url = url;
        }

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public List<String> getTechnologies() { return technologies; }
        public void setTechnologies(List<String> technologies) { this.technologies = technologies; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }
}
