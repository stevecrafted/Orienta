package com.example.backend.controller;
 
import com.example.backend.model.Utilisateur; 
import com.example.backend.repository.UtilisateurRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UtilisateurRepository utilisateurRepository; 

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String nom = body.getOrDefault("nom", "");
        String prenom = body.getOrDefault("prenom", "");
        String telephone = body.getOrDefault("telephone", "");

        if (utilisateurRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email déjà utilisé"));
        }

        Utilisateur u = new Utilisateur();
        u.setEmail(email);
        u.setNom(nom);
        u.setPrenom(prenom);
        u.setTelephone(telephone);
        u.setPassword(passwordEncoder.encode(password));
        u.setRole("USER");
        u = utilisateurRepository.save(u);

        // Créer automatiquement un profil candidat pour chaque nouvel utilisateur 
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        claims.put("userId", u.getId());
        String token = JwtUtil.generateToken(u.getEmail(), claims);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "utilisateur", Map.of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "nom", u.getNom(),
                        "prenom", u.getPrenom()
                )
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Utilisateur u = utilisateurRepository.findByEmail(email)
                .orElse(null);
        if (u == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Identifiants invalides"));
        }
        if (u.getPassword() == null || !passwordEncoder.matches(password, u.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Identifiants invalides"));
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "USER");
        claims.put("userId", u.getId());
        String token = JwtUtil.generateToken(u.getEmail(), claims);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "utilisateur", Map.of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "nom", u.getNom(),
                        "prenom", u.getPrenom()
                )
        ));
    }
}
