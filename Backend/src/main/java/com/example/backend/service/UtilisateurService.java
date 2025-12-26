package com.example.backend.service;
 
import com.example.backend.model.Utilisateur; 
import com.example.backend.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UtilisateurService {
    
    @Autowired
    private UtilisateurRepository utilisateurRepository;
     
    
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }
     
    // Version simple sans les relations
    public Optional<Utilisateur> getUtilisateurByIdSimple(Long id) {
        return utilisateurRepository.findById(id);
    }
    
    public Optional<Utilisateur> getUtilisateurByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }
    
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        // Check if email already exists (optimisé)
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }
        
        // Sauvegarder l'utilisateur
        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
          
        
        return savedUtilisateur;
    }
    
    public Utilisateur updateUtilisateur(Long id, Utilisateur utilisateurDetails) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        utilisateur.setNom(utilisateurDetails.getNom());
        utilisateur.setPrenom(utilisateurDetails.getPrenom());
        utilisateur.setEmail(utilisateurDetails.getEmail());
        utilisateur.setTelephone(utilisateurDetails.getTelephone());
        utilisateur.setLotAddresse(utilisateurDetails.getLotAddresse());
        
        return utilisateurRepository.save(utilisateur);
    }
    
    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }
}
