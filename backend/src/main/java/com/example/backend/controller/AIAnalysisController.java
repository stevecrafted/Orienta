package com.example.backend.controller;

import com.example.backend.dto.CvAnalysisRequest;
import com.example.backend.dto.CvAnalysisResponse;
import com.example.backend.service.AIAnalysisService;
import com.example.backend.service.GeminiCvExtractionService;
import com.example.backend.service.GeminiCvExtractionService.CvStructuredData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AIAnalysisController {
    
    @Autowired
    private AIAnalysisService aiAnalysisService;
    
    @Autowired
    private GeminiCvExtractionService geminiCvExtractionService;
    
    @PostMapping("/cv")
    public ResponseEntity<CvAnalysisResponse> analyzeCv(@RequestBody CvAnalysisRequest request) {
        try {
            CvAnalysisResponse response = aiAnalysisService.analyzeCv(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/cv/upload")
    public ResponseEntity<CvAnalysisResponse> analyzeCvWithFile(
            @RequestParam("file") MultipartFile file, 
            @RequestParam("jobDescription") String jobDescription) {
        try {
            
            // Utiliser Gemini Vision pour extraire les données du CV (PDF, images, etc.)
            CvStructuredData cvData = geminiCvExtractionService.extractCvData(file);
            
            // Convertir les données structurées en texte pour l'analyse
            String cvText = cvData.toPlainText();
            
            CvAnalysisRequest request = new CvAnalysisRequest();
            request.setCvText(cvText); 
            request.setJobDescription(jobDescription);
            
            CvAnalysisResponse response = aiAnalysisService.analyzeCv(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/cv/url")
    public ResponseEntity<CvAnalysisResponse> analyzeCvWithUrl(@RequestBody CvAnalysisRequest request) {
        try {
            // In a real implementation, you would scrape the job URL to get the description
            // For now, we'll use the provided job description
            
            CvAnalysisResponse response = aiAnalysisService.analyzeCv(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    } 

}
