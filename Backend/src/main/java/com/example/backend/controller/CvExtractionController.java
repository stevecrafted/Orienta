package com.example.backend.controller;

import com.example.backend.service.GeminiCvExtractionService;
import com.example.backend.service.GeminiCvExtractionService.CvStructuredData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * Controller pour tester l'extraction de CV avec Gemini Vision
 */
@RestController
@RequestMapping("/api/cv-extraction")
@CrossOrigin(origins = "*")
public class CvExtractionController {
    
    @Autowired
    private GeminiCvExtractionService geminiCvExtractionService;
    
    /**
     * Endpoint pour extraire les données structurées d'un CV
     * Supporte: PDF, Images (JPG, PNG), TXT, DOCX
     * 
     * @param file Le fichier CV à analyser
     * @return Les données structurées du CV en JSON
     */
    @PostMapping("/extract")
    public ResponseEntity<CvStructuredData> extractCvData(@RequestParam("file") MultipartFile file) {
        try {
            CvStructuredData cvData = geminiCvExtractionService.extractCvData(file);
            return ResponseEntity.ok(cvData);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Endpoint pour extraire et convertir en texte simple
     * Utile pour debug ou pour les systèmes qui n'ont besoin que du texte
     */
    @PostMapping("/extract-text")
    public ResponseEntity<String> extractCvText(@RequestParam("file") MultipartFile file) {
        try {
            CvStructuredData cvData = geminiCvExtractionService.extractCvData(file);
            String plainText = cvData.toPlainText();
            return ResponseEntity.ok(plainText);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
