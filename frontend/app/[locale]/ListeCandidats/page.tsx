'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { apiClient } from '@/lib/api/apiClient';
import Header from '@/components/BasicComponents/Header';
import { Heart, MapPin, Briefcase, Award, MessageSquare, Share2, Search, Filter } from 'lucide-react';
import '../Style/ListeCandidatsRecruteur.scoped.css';

interface CvResume {
  header?: {
    name: string;
    title: string;
    location: string;
    email: string;
    phone: string;
    photoUrl?: string;
    link?: string;
  };
  sections?: Array<{
    id: string;
    type: string;
    title: string;
    content: any;
  }>;
}

interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  description: string;
  templateType: string;
  contenuJson: CvResume;
  categorie: string;
  estActif: boolean;
  estPremium: boolean;
  nombreUtilisations: number;
}

export default function ListeCandidatsRecruteur() {
  const t = useTranslations('candidates');
  const router = useRouter();
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [filteredCandidats, setFilteredCandidats] = useState<Candidat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedCandidats, setSavedCandidats] = useState<Set<number>>(new Set());
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)
  const [activeContact, setActiveContact] = useState<{ email?: string; phone?: string; name?: string } | null>(null)

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    loadCandidats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidats, searchTerm, selectedCategorie, selectedSkills]);

  const loadCandidats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<Candidat[]>('/cv-modeles');
      const activeCandidats = response.data?.filter(cv => cv.estActif) || [];
      setCandidats(activeCandidats);
      setFilteredCandidats(activeCandidats);
    } catch (err: any) {
      console.error('Erreur lors du chargement des candidats:', err);
      setError(t('errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...candidats];

    // Filtre par recherche (nom, titre, compétences)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => {
        const header: any = c.contenuJson?.header || {};
        const fullName = `${header.name || ''}`.toLowerCase();
        const title = `${header.title || ''}`.toLowerCase();
        return fullName.includes(term) || title.includes(term);
      });
    }

    // Filtre par catégorie
    if (selectedCategorie) {
      filtered = filtered.filter(c => c.categorie === selectedCategorie);
    }

    setFilteredCandidats(filtered);
  };

  const extractSkills = (contenuJson: CvResume): string[] => {
    const sections = contenuJson?.sections || [];
    const skillsSection = sections.find(s => s.type === 'skills');
    if (skillsSection?.content?.skills) {
      return skillsSection.content.skills.slice(0, 5).map((g: any) => g.groupName || g.skills?.[0] || '');
    }
    return [];
  };

  const handleViewProfile = (candidatId: number) => {
    router.push(`/ViewCv?id=${candidatId}`);
  };

  const handleSaveCandidat = (e: React.MouseEvent, candidatId: number) => {
    e.stopPropagation();
    const newSaved = new Set(savedCandidats);
    if (newSaved.has(candidatId)) {
      newSaved.delete(candidatId);
    } else {
      newSaved.add(candidatId);
    }
    setSavedCandidats(newSaved);
  };

  const getCategories = () => {
    const categories = new Set(candidats.map(c => c.categorie));
    return Array.from(categories).sort();
  };

  const getInitials = (header: any): string => {
    const name = header?.name || 'NC';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="recruter-candidates-page">
      <Header />

      <div className="recruter-candidates-container">
        {/* Barre latérale des filtres */}
        <aside className="recruter-candidates-filters-sidebar">
          <div className="recruter-candidates-filters-header">
            <Filter size={20} />
            <h3 className="recruter-candidates-filters-title">{t('filters')}</h3>
          </div>

          <div className="recruter-candidates-filter-group">
            <div className="recruter-candidates-search-wrapper">
              <Search size={18} className="recruter-candidates-search-icon" />
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="recruter-candidates-search-input"
              />
            </div>
          </div>

          <div className="recruter-candidates-filter-group">
            <label className="recruter-candidates-filter-label">{t('domain')}</label>
            <select
              value={selectedCategorie}
              onChange={(e) => setSelectedCategorie(e.target.value)}
              className="recruter-candidates-domain-select"
            >
              <option value="">{t('allCategories')}</option>
              {getCategories().map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategorie('');
              setSelectedSkills([]);
            }}
            className="recruter-candidates-reset-filters"
          >
            {t('allCategories')}
          </button>
        </aside>

        {/* Contenu principal */}
        <main className="recruter-candidates-main-content">
          <div className="recruter-candidates-page-header">
            <div className="recruter-candidates-header-content">
              <div className="recruter-candidates-header-text">
                <h1 className="recruter-candidates-page-title">{t('marketplace')}</h1>
                <p className="recruter-candidates-page-subtitle">{t('title')}</p>
              </div>

            </div>
          </div>

          {loading ? (
            <div className="recruter-candidates-loading">
              <div className="recruter-candidates-spinner"></div>
              <p className="recruter-candidates-loading-text">{t('loading')}</p>
            </div>
          ) : error ? (
            <div className="recruter-candidates-error-message">{error}</div>
          ) : filteredCandidats.length === 0 ? (
            <div className="recruter-candidates-no-results">
              {t('noResults')}
            </div>
          ) : (
            <div className="recruter-candidates-list">
              {filteredCandidats.map(candidat => {
                const header: any = candidat.contenuJson?.header || {};
                const skills = extractSkills(candidat.contenuJson);
                const initials = getInitials(header);
                const isSaved = savedCandidats.has(candidat.id);

                return (
                  <article key={candidat.id} className="recruter-candidate-card">
                    <div className="recruter-candidate-card-header">
                      <div className="recruter-candidate-profile-info">
                        <div className="recruter-candidate-avatar-wrapper">
                          <div className="recruter-candidate-avatar">
                            {header.photoUrl ? (
                              <img
                                src={header.photoUrl}
                                alt={header.name}
                                className="recruter-candidate-avatar-image"
                              />
                            ) : (
                              <div className="recruter-candidate-avatar-initials">{initials}</div>
                            )}
                          </div>
                        </div>

                        <div className="recruter-candidate-profile-details">
                          <h2 className="recruter-candidate-name">{header.name || 'Non spécifié'}</h2>
                          <p className="recruter-candidate-title">{header.title || 'Candidat'}</p>

                          <div className="recruter-candidate-metadata">
                            {header.location && (
                              <span className="recruter-candidate-location">
                                <MapPin size={16} />
                                <span className="recruter-candidate-location-text">{header.location}</span>
                              </span>
                            )}
                            {candidat.nombreUtilisations > 0 && (
                              <span className="recruter-candidate-views">
                                <Award size={16} />
                                <span className="recruter-candidate-views-count">{candidat.nombreUtilisations} vues</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          className={`recruter-candidate-save-button ${isSaved ? 'recruter-candidate-saved' : ''}`}
                          onClick={(e) => handleSaveCandidat(e, candidat.id)}
                          title={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        >
                          <Heart size={22} fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    {/* Description/Domaine avec storytelling */}
                    {candidat.description && (
                      <div className="recruter-candidate-description-section">
                        <p className="recruter-candidate-description">{candidat.description}</p>
                      </div>
                    )}

                    {/* Compétences */}
                    {skills.length > 0 && (
                      <div className="recruter-candidate-skills-section">
                        <h4 className="recruter-candidate-skills-title">Compétences principales</h4>
                        <div className="recruter-candidate-skills-list">
                          {skills.map((skill, idx) => (
                            <span key={idx} className="recruter-candidate-skill-badge">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Domaine */}
                    <div className="recruter-candidate-category-section">
                      <span className="recruter-candidate-category-badge">
                        <Briefcase size={14} />
                        <span className="recruter-candidate-category-text">{candidat.categorie}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="recruter-candidate-actions">
                      <button
                        onClick={() => handleViewProfile(candidat.id)}
                        className="recruter-candidate-action-button recruter-candidate-action-primary"
                      >
                        Voir le profil complet
                      </button>
                      <div className="recruter-candidate-action-buttons">
                        <button
                          className="recruter-candidate-action-button recruter-candidate-action-secondary"
                          aria-label={t('contact')}
                          onClick={async (e) => {
                            e.stopPropagation()
                            setContactModalOpen(true)
                            setContactLoading(true)
                            setContactError(null)
                            setActiveContact(null)
                            try {
                              const res = await apiClient.get(`/cv-modeles/${candidat.id}`)
                              const data = res.data
                              let contenu = data?.contenuJson
                              if (typeof contenu === 'string') {
                                try { contenu = JSON.parse(contenu) } catch { }
                              }
                              const header = contenu?.header || {}
                              setActiveContact({ email: header.email, phone: header.phone, name: header.name })
                            } catch (err) {
                              console.error('Erreur fetch contact:', err)
                              setContactError(t('contactLoadingError'))
                            } finally {
                              setContactLoading(false)
                            }
                          }}
                        >
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* AJOUTER CETTE LIGNE POUR AFFICHER LE MODAL */}
      <ContactModal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        loading={contactLoading}
        error={contactError}
        contact={activeContact}
      />

    </div >


  );
}

// Contact modal outside main component render (kept in same file for simplicity)
function ContactModal({ open, onClose, loading, error, contact }: { open: boolean; onClose: () => void; loading: boolean; error: string | null; contact: { email?: string; phone?: string; name?: string } | null }) {
  const t = useTranslations('candidates')
  if (!open) return null
  return (
    <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 20, width: 420, maxWidth: '95%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>{t('contactDetailsTitle')}</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </div>
        {loading ? (
          <div>{t('contactLoading')}</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : contact ? (
          <div>
            <div style={{ marginBottom: 8 }}><strong>{t('contactEmail')}:</strong> {contact.email || t('noContactEmail')}</div>
            <div style={{ marginBottom: 12 }}><strong>{t('contactPhone')}:</strong> {contact.phone || '-'}</div>
            {contact.email && (
              <a href={`mailto:${contact.email}?subject=${encodeURIComponent('Opportunity from Hirion')}`} className="btn-primary">{t('openMail')}</a>
            )}
          </div>
        ) : (
          <div>{t('contactNoData')}</div>
        )}
      </div>
    </div>
  )
}