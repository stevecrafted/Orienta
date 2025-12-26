package com.example.backend.utils;

import java.net.URI; 
import java.util.ArrayList; 
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.example.backend.dto.CvAnalysisRequest;
import com.example.backend.model.FormationRecommendation;

import org.slf4j.Logger;
import org.springframework.context.MessageSource;
import java.util.Locale;
import java.text.Normalizer;

public class IASearchUtils {

    /**
     * Normalise les caractères spéciaux générés par l'IA (accents, guillemets, apostrophes, etc.)
     * et les transforme en caractères ASCII standards
     * 
     * @param text Le texte à normaliser
     * @return Le texte normalisé avec des caractères standards
     */
    public static String normalizeAIGeneratedText(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        // Remplacer les guillemets typographiques par des guillemets standards
        text = text.replace("\u201C", "\"")  // "
                   .replace("\u201D", "\"")  // "
                   .replace("\u00AB", "\"")  // «
                   .replace("\u00BB", "\"")  // »
                   .replace("\u2039", "'")   // ‹
                   .replace("\u203A", "'");  // ›

        // Remplacer les apostrophes typographiques
        text = text.replace("\u2018", "'")   // '
                   .replace("\u2019", "'")   // '
                   .replace("`", "'")
                   .replace("\u00B4", "'");  // ´

        // Remplacer les tirets spéciaux
        text = text.replace("\u2014", "-")  // em dash —
                   .replace("\u2013", "-")  // en dash –
                   .replace("\u2212", "-"); // minus sign −

        // Remplacer les espaces insécables et autres espaces spéciaux
        text = text.replace("\u00A0", " ")  // espace insécable
                   .replace("\u2007", " ")  // espace de chiffre
                   .replace("\u202F", " ")  // espace fine insécable
                   .replace("\u2009", " ")  // espace fine
                   .replace("\u200B", "")   // zero-width space (invisible)
                   .replace("\u200C", "")   // zero-width non-joiner
                   .replace("\u200D", "")   // zero-width joiner
                   .replace("\uFEFF", "");  // zero-width no-break space (BOM)

        // Normaliser les accents (décomposer puis recomposer)
        // NFD = Decomposition, NFC = Recomposition
        // Ceci PRESERVE les accents français (é, à, ù, ç, etc.) mais normalise leur forme Unicode
        text = Normalizer.normalize(text, Normalizer.Form.NFC);
        
        // Remplacer les points de suspension
        text = text.replace("\u2026", "...");  // …

        // Remplacer les symboles mathématiques courants
        text = text.replace("\u00D7", "x")     // ×
                   .replace("\u00F7", "/")     // ÷
                   .replace("\u2264", "<=")    // ≤
                   .replace("\u2265", ">=")    // ≥
                   .replace("\u2260", "!=")    // ≠
                   .replace("\u221E", "infinity") // ∞
                   .replace("\u2248", "~=")    // ≈ (approximativement égal)
                   .replace("\u00B1", "+/-");  // ±

        // Remplacer les symboles de monnaie qui pourraient causer des problèmes
        text = text.replace("\u20AC", "EUR")   // €
                   .replace("\u00A3", "GBP")   // £
                   .replace("\u00A5", "JPY");  // ¥

        // Remplacer les fractions typographiques
        text = text.replace("\u00BC", "1/4")   // ¼
                   .replace("\u00BD", "1/2")   // ½
                   .replace("\u00BE", "3/4")   // ¾
                   .replace("\u2153", "1/3")   // ⅓
                   .replace("\u2154", "2/3");  // ⅔

        // Remplacer les puissances typographiques
        text = text.replace("\u00B2", "^2")    // ²
                   .replace("\u00B3", "^3")    // ³
                   .replace("\u00B9", "^1");   // ¹

        // Remplacer les bullets et puces spéciaux
        text = text.replace("\u2022", "*")     // •
                   .replace("\u2023", "*")     // ‣
                   .replace("\u25E6", "*")     // ◦
                   .replace("\u2043", "*")     // ⁃
                   .replace("\u2219", "*");    // ∙

        // Remplacer les symboles de copyright et marque
        text = text.replace("\u00A9", "(c)")   // ©
                   .replace("\u00AE", "(R)")   // ®
                   .replace("\u2122", "(TM)"); // ™

        // Remplacer les flèches qui pourraient apparaître
        text = text.replace("\u2190", "<-")    // ←
                   .replace("\u2192", "->")    // →
                   .replace("\u2191", "^")     // ↑
                   .replace("\u2193", "v")     // ↓
                   .replace("\u21D2", "=>")    // ⇒
                   .replace("\u21D0", "<=");   // ⇐

        // Remplacer les symboles de check et croix
        text = text.replace("\u2713", "v")     // ✓
                   .replace("\u2714", "v")     // ✔
                   .replace("\u2717", "x")     // ✗
                   .replace("\u2718", "x");    // ✘

        // Remplacer les symboles de degré et pourcentage spéciaux
        text = text.replace("\u00B0", "°")     // ° (garder le symbole degré standard)
                   .replace("\u2030", "‰");    // ‰ (per mille - garder)

        // Remplacer les parenthèses et crochets spéciaux
        text = text.replace("\u2768", "(")     // ❨
                   .replace("\u2769", ")")     // ❩
                   .replace("\u276A", "(")     // ❪
                   .replace("\u276B", ")")     // ❫
                   .replace("\u3008", "<")     // 〈
                   .replace("\u3009", ">");    // 〉

        // Nettoyer les espaces multiples
        text = text.replaceAll("\\s+", " ").trim();

        return text;
    }

    /**
     * Normalise une chaîne JSON générée par l'IA avant le parsing
     * 
     * @param jsonText Le texte JSON à normaliser
     * @return Le JSON normalisé
     */
    public static String normalizeAIGeneratedJson(String jsonText) {
        if (jsonText == null || jsonText.isEmpty()) {
            return jsonText;
        }

        // Appliquer la normalisation générale
        jsonText = normalizeAIGeneratedText(jsonText);

        // Corrections spécifiques pour JSON
        // S'assurer que les booléens sont en minuscules
        jsonText = jsonText.replaceAll(":\\s*True\\b", ": true")
                          .replaceAll(":\\s*False\\b", ": false")
                          .replaceAll(":\\s*TRUE\\b", ": true")
                          .replaceAll(":\\s*FALSE\\b", ": false");

        // S'assurer que null est en minuscules
        jsonText = jsonText.replaceAll(":\\s*Null\\b", ": null")
                          .replaceAll(":\\s*NULL\\b", ": null")
                          .replaceAll(":\\s*None\\b", ": null");

        return jsonText;
    }

    // Check if a link is actually a formation/course link (not a blog post, forum,
    // etc.)
    public static boolean isFormationLink(String link, String title, String snippet) {
        String lowerLink = link.toLowerCase();
        String lowerTitle = title.toLowerCase();
        String lowerSnippet = snippet.toLowerCase();

        // Skip generic homepages
        if (lowerLink.matches(
                "https?://(www\\.)?(udemy|coursera|edx|pluralsight|udacity|skillshare|datacamp|codecademy|freecodecamp|khanacademy|openclassrooms)\\.com/?$")) {
            return false;
        }

        // Skip blog posts, articles, forums
        String[] excludePatterns = {
                "/blog/", "/article/", "/forum/", "/discussion/", "/question/",
                "/news/", "/post/", "stackoverflow.com", "reddit.com", "quora.com",
                "/wiki/", "wikipedia.org", "/faq/"
        };

        for (String pattern : excludePatterns) {
            if (lowerLink.contains(pattern)) {
                return false;
            }
        }

        // Positive indicators for course/tutorial links
        String[] courseIndicators = {
                "/course/", "/learn/", "/tutorial/", "/class/", "/training/",
                "/certification/", "/program/", "/nanodegree/", "/path/",
                "/bootcamp/", "/masterclass/", "/lesson/", "/workshop/"
        };

        for (String indicator : courseIndicators) {
            if (lowerLink.contains(indicator)) {
                return true;
            }
        }

        // Check title/snippet for course indicators
        String[] titleIndicators = {
                "course", "tutorial", "learn", "training", "certification",
                "bootcamp", "masterclass", "formation", "clase", "cours"
        };

        for (String indicator : titleIndicators) {
            if (lowerTitle.contains(indicator) || lowerSnippet.contains(indicator)) {
                return true;
            }
        }

        return false;
    }

    // Build formation recommendations from search results
    public static List<FormationRecommendation> buildFormationRecommendations(
            Map<String, Map<String, List<FormationDetail>>> formationsBySkill) {

        List<FormationRecommendation> recommendations = new ArrayList<>();

        for (Map.Entry<String, Map<String, List<FormationDetail>>> entry : formationsBySkill.entrySet()) {
            String skill = entry.getKey();
            Map<String, List<FormationDetail>> formations = entry.getValue();

            // Add formations from all categories
            for (Map.Entry<String, List<FormationDetail>> categoryEntry : formations.entrySet()) {
                String category = categoryEntry.getKey();
                List<FormationDetail> formationList = categoryEntry.getValue();

                for (FormationDetail formation : formationList) {
                    FormationRecommendation rec = new FormationRecommendation();
                    rec.setId(UUID.randomUUID().toString());
                    rec.setTitre(formation.titre);
                    rec.setDuration("N/A"); // Pas de détails, juste le lien
                    rec.setCertified(false); // Pas d'info
                    rec.setGratuit(category.contains("gratuites"));
                    rec.setRelevanceReason("Formation pour maîtriser " + skill);
                    rec.setUrl(formation.url);
                    rec.setPlateforme(formation.plateforme);
                    rec.setCertificatType("N/A");
                    rec.setModalite("N/A");
                    
                    // Add targeted skill(s) for this formation
                    List<String> targetedSkills = new ArrayList<>();
                    targetedSkills.add(skill);
                    rec.setTargetedSkills(targetedSkills);
                    
                    recommendations.add(rec);
                }
            }
        }

        return recommendations;
    }

    // Classify formation based on URL
    public static String classifyFormation(String url) {
        String[] gratuitSansCertif = {
                "w3schools.com", "freecodecamp.org", "theodinproject.com",
                "developer.mozilla.org", "tutorialspoint.com", "geeksforgeeks.org", "javatpoint.com",
                "youtube.com", "medium.com", "hubspot.com/academy", "google.com/digitalgarage"
        };

        String[] gratuitAvecCertif = {
                "edx.org", "coursera.org", "khanacademy.org", "codecademy.com",
                "futurelearn.com", "alison.com", "linkedin.com/learning", "openclassrooms.com",
                "skillsbuild.org", "grow.google", "microsoft.com/learn"
        };

        String[] payantes = {
                "udemy.com", "pluralsight.com", "skillshare.com",
                "datacamp.com", "treehouse.com", "udacity.com", "masterclass.com",
                "domestika.com", "linkedin.com/premium"
        };

        for (String domain : gratuitSansCertif) {
            if (url.contains(domain))
                return "gratuites_sans_certificat";
        }

        for (String domain : gratuitAvecCertif) {
            if (url.contains(domain))
                return "gratuites_avec_certificat";
        }

        for (String domain : payantes) {
            if (url.contains(domain))
                return "payantes";
        }

        return "gratuites_sans_certificat";
    }

    // Extract platform name from URL
    public static String extractPlatformName(String url, Logger logger) {
        Map<String, String> platforms = Map.ofEntries(
                Map.entry("w3schools.com", "W3Schools"),
                Map.entry("freecodecamp.org", "FreeCodeCamp"),
                Map.entry("theodinproject.com", "The Odin Project"),
                Map.entry("developer.mozilla.org", "MDN Web Docs"),
                Map.entry("coursera.org", "Coursera"),
                Map.entry("edx.org", "edX"),
                Map.entry("udemy.com", "Udemy"),
                Map.entry("codecademy.com", "Codecademy"),
                Map.entry("khanacademy.org", "Khan Academy"),
                Map.entry("linkedin.com/learning", "LinkedIn Learning"),
                Map.entry("pluralsight.com", "Pluralsight"),
                Map.entry("skillshare.com", "Skillshare"),
                Map.entry("datacamp.com", "DataCamp"),
                Map.entry("futurelearn.com", "FutureLearn"),
                Map.entry("tutorialspoint.com", "TutorialsPoint"),
                Map.entry("geeksforgeeks.org", "GeeksforGeeks"),
                Map.entry("openclassrooms.com", "OpenClassrooms"),
                Map.entry("youtube.com", "YouTube"),
                Map.entry("medium.com", "Medium"),
                Map.entry("hubspot.com", "HubSpot Academy"),
                Map.entry("google.com/digitalgarage", "Google Digital Garage"),
                Map.entry("masterclass.com", "MasterClass"),
                Map.entry("domestika.com", "Domestika"),
                Map.entry("microsoft.com/learn", "Microsoft Learn"),
                Map.entry("grow.google", "Google Grow"));

        for (Map.Entry<String, String> entry : platforms.entrySet()) {
            if (url.contains(entry.getKey())) {
                return entry.getValue();
            }
        }

        // Extract domain if unknown platform
        try {
            URI uri = new URI(url);
            String host = uri.getHost();
            if (host != null) {
                host = host.replaceAll("^www\\.", "");
                host = host.replaceAll("\\.(com|org|net)$", "");
                return host.substring(0, 1).toUpperCase() + host.substring(1);
            }
        } catch (Exception e) {
            logger.error("Erreur extraction nom plateforme", e);
        }

        return "Plateforme inconnue";
    }


    // Get domain from URL
    public static String getDomain(String url) {
        try {
            URI uri = new URI(url);
            return uri.getHost();
        } catch (Exception e) {
            return "";
        }
    }
 
    public static class FormationDetail {
        String titre;
        String url;
        String plateforme;
        Map<String, String> certificatInfo;

        public FormationDetail(String titre, String url, String plateforme, Map<String, String> certificatInfo) {
            this.titre = titre;
            this.url = url;
            this.plateforme = plateforme;
            this.certificatInfo = certificatInfo;
        }
    }

    public static Map<String, String> generateImprovements(CvAnalysisRequest request, List<String> missingSkills) {
        Map<String, String> improvements = new HashMap<>();

        if (!missingSkills.isEmpty()) {
            improvements.put("Compétences",
                    "Ajoutez ces compétences manquantes : " + String.join(", ", missingSkills));
        }

        if (request.getExperiences() == null || request.getExperiences().isEmpty()) {
            improvements.put("Expérience",
                    "Détaillez davantage vos expériences professionnelles pertinentes");
        }

        if (request.getEducations() == null || request.getEducations().isEmpty()) {
            improvements.put("Formation",
                    "Incluez vos formations académiques et certifications");
        }

        improvements.put("Format",
                "Utilisez des mots-clés du poste dans votre CV pour passer les ATS (Applicant Tracking Systems)");

        return improvements;
    }

    /**
     * Version localisée de generateImprovements utilisant MessageSource et Locale.
     */
    public static Map<String, String> generateImprovementsLocalized(CvAnalysisRequest request, List<String> missingSkills, MessageSource messages, Locale locale) {
        Map<String, String> improvements = new HashMap<>();

        if (!missingSkills.isEmpty()) {
            String text = messages.getMessage("improvements.skills", new Object[] { String.join(", ", missingSkills) }, locale);
            improvements.put(messages.getMessage("improvements.section.skills", null, locale), text);
        }

        if (request.getExperiences() == null || request.getExperiences().isEmpty()) {
            String text = messages.getMessage("improvements.experience", null, locale);
            improvements.put(messages.getMessage("improvements.section.experience", null, locale), text);
        }

        if (request.getEducations() == null || request.getEducations().isEmpty()) {
            String text = messages.getMessage("improvements.education", null, locale);
            improvements.put(messages.getMessage("improvements.section.education", null, locale), text);
        }

        String formatText = messages.getMessage("improvements.format", null, locale);
        improvements.put(messages.getMessage("improvements.section.format", null, locale), formatText);

        return improvements;
    }

    public static String generateOverallFeedback(double matchPercentage, int missingSkillsCount) {
        if (matchPercentage >= 80) {
            return "Excellent ! Votre CV correspond très bien au poste visé. Quelques ajustements mineurs et vous êtes prêt à postuler.";
        } else if (matchPercentage >= 60) {
            return "Bon profil ! Il vous manque quelques compétences clés (" + missingSkillsCount + "). Suivez les formations recommandées pour renforcer votre candidature.";
        } else if (matchPercentage >= 40) {
            return "Profil prometteur mais nécessite du travail. Concentrez-vous sur l'acquisition des " + missingSkillsCount + " compétences manquantes identifiées.";
        } else {
            return "Votre profil nécessite une mise à niveau importante pour ce poste. Nous vous recommandons de suivre les formations proposées et d'acquérir de l'expérience pratique.";
        }
    }

    /**
     * Version localisée de generateOverallFeedback utilisant MessageSource et Locale.
     */
    public static String generateOverallFeedbackLocalized(double matchPercentage, int missingSkillsCount, MessageSource messages, Locale locale) {
        if (matchPercentage >= 80) {
            return messages.getMessage("feedback.excellent", null, locale);
        } else if (matchPercentage >= 60) {
            return messages.getMessage("feedback.good", new Object[] { missingSkillsCount }, locale);
        } else if (matchPercentage >= 40) {
            return messages.getMessage("feedback.promising", new Object[] { missingSkillsCount }, locale);
        } else {
            return messages.getMessage("feedback.upgrade", null, locale);
        }
    }
}
