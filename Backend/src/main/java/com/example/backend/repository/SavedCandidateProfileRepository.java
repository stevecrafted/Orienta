package com.example.backend.repository;

import com.example.backend.model.SavedCandidateProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedCandidateProfileRepository extends JpaRepository<SavedCandidateProfile, Long> {
    
    List<SavedCandidateProfile> findByRecruteurId(Long recruteurId);
    
    Optional<SavedCandidateProfile> findByRecruteurIdAndCandidatId(Long recruteurId, Long candidatId);
    
    boolean existsByRecruteurIdAndCandidatId(Long recruteurId, Long candidatId);
    
    void deleteByRecruteurIdAndCandidatId(Long recruteurId, Long candidatId);
}
