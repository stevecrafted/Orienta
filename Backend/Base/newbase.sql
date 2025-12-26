\c postgres;

-- DROP and CREATE fresh database (ATTENTION: destructive)
DROP DATABASE IF EXISTS orienta;
CREATE DATABASE orienta;

-- Connect to new DB
\c orienta;

-- =============================
-- Schema (with updated sizes)
-- =============================

-- Utilisateur
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50),
    prenom VARCHAR(50),
    email VARCHAR(100) UNIQUE NOT NULL,
    telephone VARCHAR(50),
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'USER',
    lotaddresse VARCHAR(50)
);

-- Table pour stocker les modèles de CV predefinis
CREATE TABLE IF NOT EXISTS cv_modeles (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    template_type VARCHAR(50) NOT NULL,
    contenu_json JSONB NOT NULL,
    image_preview VARCHAR(500),
    est_actif BOOLEAN NOT NULL DEFAULT true,
    est_premium BOOLEAN NOT NULL DEFAULT false,
    ordre INTEGER NOT NULL DEFAULT 0,
    nombre_utilisations INTEGER NOT NULL DEFAULT 0,
    categorie VARCHAR(100),
    date_creation TIMESTAMP,
    date_modification TIMESTAMP
);

-- Index pour ameliorer les performances
CREATE INDEX IF NOT EXISTS idx_cv_modeles_template_type ON cv_modeles(template_type);
CREATE INDEX IF NOT EXISTS idx_cv_modeles_est_actif ON cv_modeles(est_actif);
CREATE INDEX IF NOT EXISTS idx_cv_modeles_categorie ON cv_modeles(categorie);
CREATE INDEX IF NOT EXISTS idx_cv_modeles_ordre ON cv_modeles(ordre); 

    INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
    -- Modèle 6: CV Premium Executif
    (
        'Executive Premium CV',
        'High-end CV for senior executives and leaders',
        'single-column',
        '{
            "resume": {
                "header": {
                    "name": "MARIE LAURENT",
                    "title": "Head of Digital Marketing",
                    "phone": "+33 6 12 34 56 78",
                    "email": "marie.laurent@example.com",
                    "link": "linkedin.com/in/marielaurent",
                    "extraLink": "",
                    "location": "Paris, France",
                    "extraField": "15 years of experience",
                    "photoUrl": "https://images.unsplash.com/photo-1545996124-1b1b82b9a75b?w=800&q=80&auto=format&fit=crop",
                    "visibility": {
                        "title": true,
                        "phone": true,
                        "email": true,
                        "link": true,
                        "extraLink": false,
                        "location": true,
                        "photo": true,
                        "extraField": true
                    },
                    "uppercaseName": true,
                    "roundPhoto": true
                },
                "sections": [
                    {
                        "id": "section-summary",
                        "type": "summary",
                        "column": "main",
                        "title": "EXECUTIVE SUMMARY",
                        "content": {
                            "summary": "Accomplished Head of Digital Marketing with 15 years of experience in digital strategy and transformation. Expert in organic growth (SEO/Content) and paid channels (Google Ads, Social Ads). Proven track record generating over €50M in revenue through innovative campaigns."
                        "template": "double-column"
                            }
                        }'::jsonb,
                        'Junior',
                        5,
                        false
                    );

                    -- Modèle 6: CV Premium Executif
                    INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
                    (
                        'Executive Premium CV',
                        'High-end CV for senior executives and leaders',
                        'single-column',
                        '{
                            "resume": {
                                "header": {
                                    "name": "MARIE LAURENT",
                                    "title": "Head of Digital Marketing",
                                    "phone": "+33 6 12 34 56 78",
                                    "email": "marie.laurent@example.com",
                                    "link": "linkedin.com/in/marielaurent",
                                    "extraLink": "",
                                    "location": "Paris, France",
                                    "extraField": "15 years of experience",
                                    "photoUrl": "https://images.unsplash.com/photo-1545996124-1b1b82b9a75b?w=800&q=80&auto=format&fit=crop",
                                    "visibility": {
                                        "title": true,
                                        "phone": true,
                                        "email": true,
                                        "link": true,
                                        "extraLink": false,
                                        "location": true,
                                        "photo": true,
                                        "extraField": true
                                    },
                                    "uppercaseName": true,
                                    "roundPhoto": true
                                },
                                "sections": [
                                    {
                                        "id": "section-summary",
                                        "type": "summary",
                                        "column": "main",
                                        "title": "EXECUTIVE SUMMARY",
                                        "content": {
                                            "summary": "Accomplished Head of Digital Marketing with 15 years of experience in digital strategy and transformation. Expert in organic growth (SEO/Content) and paid channels (Google Ads, Social Ads). Proven track record generating over €50M in revenue through innovative campaigns."
                                        }
                                    },
                                    {
                                        "id": "section-experience",
                                        "type": "experiences",
                                        "column": "main",
                                        "title": "PROFESSIONAL EXPERIENCE",
                                        "content": {
                                            "experiences": [
                                                {
                                                    "id": "exp-1",
                                                    "company": "International Retail Group",
                                                    "position": "Head of Digital Marketing",
                                                    "location": "Paris, France",
                                                    "period": "2018 – Present",
                                                    "bullets": [
                                                        "Led a team of 25 across SEO, SEA, Social Media, and Content",
                                                        "Grew e-commerce revenue by 180% in 5 years (€15M to €42M)",
                                                        "Rolled out omnichannel strategy across 8 European countries",
                                                        "Reduced customer acquisition cost by 35% through campaign optimization",
                                                        "Managed a €8M annual marketing budget",
                                                        "Implemented advanced analytics and predictive AI tools"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-2",
                                                    "company": "Digital Strategy Agency",
                                                    "position": "Head of Digital Strategy",
                                                    "location": "Paris, France",
                                                    "period": "2014 – 2018",
                                                    "bullets": [
                                                        "Managed a team of 12 consultants",
                                                        "Supported 50+ clients in digital transformation",
                                                        "Specialized in luxury, retail, and B2B tech sectors",
                                                        "Built proprietary strategic frameworks"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-3",
                                                    "company": "E-commerce Startup",
                                                    "position": "Digital Marketing Project Lead",
                                                    "location": "Lyon, France",
                                                    "period": "2010 – 2014",
                                                    "bullets": [
                                                        "Launched and scaled a B2C marketplace",
                                                        "Managed Google Ads and Facebook Ads campaigns",
                                                        "Grew to 500K monthly visitors in 3 years"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-education",
                                        "type": "educations",
                                        "column": "main",
                                        "title": "EDUCATION",
                                        "content": {
                                            "educations": [
                                                {
                                                    "id": "edu-1",
                                                    "school": "HEC Paris",
                                                    "degree": "MBA, Marketing & Innovation",
                                                    "location": "Paris, France",
                                                    "gpa": "Top of class",
                                                    "period": "2008 – 2010",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "gpa": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-skills",
                                        "type": "skills",
                                        "column": "main",
                                        "title": "EXPERTISES",
                                        "content": {
                                            "skills": [
                                                {
                                                    "id": "group-1",
                                                    "groupName": "Strategy",
                                                    "skills": ["Digital Marketing", "Growth Hacking", "Brand Strategy", "Customer Journey", "Omnichannel"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                },
                                                {
                                                    "id": "group-2",
                                                    "groupName": "Tools",
                                                    "skills": ["Google Analytics 4", "SEMrush", "HubSpot", "Salesforce", "Looker Studio", "Hotjar"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                },
                                                {
                                                    "id": "group-3",
                                                    "groupName": "Leadership",
                                                    "skills": ["Team Management", "Budget Management", "Negotiation", "Change Management"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "settings": {
                                "branding": true,
                                "theme": "light",
                                "fontSize": 1,
                                "fontFamily": "Libre Baskerville",
                                "template": "single-column"
                            }
                        }'::jsonb,
                        'Executive',
                        6,
                        true
                    );

                    -- Modèle 7: CV Data Scientist
                    INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
                    (
                        'Data Scientist CV',
                        'Specialized CV for data and AI roles',
                        'double-column',
                        '{
                            "resume": {
                                "header": {
                                    "name": "PIERRE ROUSSEAU",
                                    "title": "Data Scientist",
                                    "phone": "+33 7 89 01 23 45",
                                    "email": "pierre.rousseau@example.com",
                                    "link": "linkedin.com/in/pierrerousseau",
                                    "extraLink": "kaggle.com/pierrerousseau",
                                    "location": "Paris, France",
                                    "extraField": "PhD in Machine Learning",
                                    "photoUrl": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop",
                                    "visibility": {
                                        "title": true,
                                        "phone": true,
                                        "email": true,
                                        "link": true,
                                        "extraLink": true,
                                        "location": true,
                                        "photo": false,
                                        "extraField": true
                                    },
                                    "uppercaseName": true,
                                    "roundPhoto": false
                                },
                                "sections": [
                                    {
                                        "id": "section-skills",
                                        "type": "skills",
                                        "column": "left",
                                        "title": "SKILLS",
                                        "content": {
                                            "skills": [
                                                {
                                                    "id": "group-1",
                                                    "groupName": "Languages",
                                                    "skills": ["Python", "R", "SQL", "Scala", "Julia"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-2",
                                                    "groupName": "Machine Learning",
                                                    "skills": ["Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost", "LightGBM"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-3",
                                                    "groupName": "Big Data",
                                                    "skills": ["Spark", "Hadoop", "Kafka", "Airflow", "Databricks"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-4",
                                                    "groupName": "Visualization",
                                                    "skills": ["Tableau", "Power BI", "Plotly", "Matplotlib", "Seaborn"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-education",
                                        "type": "educations",
                                        "column": "left",
                                        "title": "EDUCATION",
                                        "content": {
                                            "educations": [
                                                {
                                                    "id": "edu-1",
                                                    "school": "Ecole Polytechnique",
                                                    "degree": "PhD in Machine Learning",
                                                    "location": "Paris, France",
                                                    "period": "2018 – 2021",
                                                    "bullets": [
                                                        "Thesis: Deep learning for time series forecasting",
                                                        "5 publications in international conferences"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "gpa": false,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "edu-2",
                                                    "school": "Telecom Paris",
                                                    "degree": "Master in Data Science",
                                                    "location": "Paris, France",
                                                    "gpa": "With High Honors",
                                                    "period": "2016 – 2018",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "gpa": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-experience",
                                        "type": "experiences",
                                        "column": "right",
                                        "title": "EXPERIENCE",
                                        "content": {
                                            "experiences": [
                                                {
                                                    "id": "exp-1",
                                                    "company": "Tech Giant France",
                                                    "position": "Senior Data Scientist",
                                                    "location": "Paris, France",
                                                    "period": "2021 – Present",
                                                    "bullets": [
                                                        "Built recommendation models for 50M+ users",
                                                        "Improved CTR by 23% using deep learning",
                                                        "Deployed ML pipelines to production on AWS",
                                                        "Mentored 3 junior data scientists",
                                                        "Collaborated with product and engineering teams"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-2",
                                                    "company": "FinTech Innovation",
                                                    "position": "Data Scientist",
                                                    "location": "Paris, France",
                                                    "period": "2018 – 2021",
                                                    "bullets": [
                                                        "Built fraud detection models (98.5% precision)",
                                                        "Developed ML-based credit scoring system",
                                                        "Reduced false positives by 40%"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-projects",
                                        "type": "projects",
                                        "column": "right",
                                        "title": "PROJECTS & PUBLICATIONS",
                                        "content": {
                                            "projects": [
                                                {
                                                    "id": "project-1",
                                                    "projectName": "Kaggle Competition - Top 1%",
                                                    "description": "Real estate price prediction",
                                                    "link": "kaggle.com/competitions/housing-prices",
                                                    "period": "2023",
                                                    "bullets": [
                                                        "Ensembled models (XGBoost, LightGBM, Neural Networks)",
                                                        "Advanced feature engineering"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "description": true,
                                                        "link": true,
                                                        "location": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "project-2",
                                                    "projectName": "NeurIPS Publication 2022",
                                                    "description": "Novel approach to time series forecasting with transformers",
                                                    "period": "2022",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "description": true,
                                                        "link": false,
                                                        "location": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "settings": {
                                "branding": true,
                                "theme": "light",
                                "fontSize": 0.95,
                                "fontFamily": "Roboto",
                                "template": "double-column"
                            }
                        }'::jsonb,
                        'Data Science',
                        7,
                        false
                    );

                    -- Modèle 8: CV Ressources Humaines
                    INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
                    (
                        'Modern HR CV',
                        'CV for human resources professionals',
                        'single-column',
                        '{
                            "resume": {
                                "header": {
                                    "name": "CATHERINE MOREAU",
                                    "title": "HR Manager",
                                    "phone": "+33 6 56 78 90 12",
                                    "email": "catherine.moreau@example.com",
                                    "link": "linkedin.com/in/catherinemoreau",
                                    "extraLink": "",
                                    "location": "Lille, France",
                                    "extraField": "GPEC Certified",
                                    "photoUrl": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=800&q=80&auto=format&fit=crop",
                                    "visibility": {
                                        "title": true,
                                        "phone": true,
                                        "email": true,
                                        "link": true,
                                        "extraLink": false,
                                        "location": true,
                                        "photo": true,
                                        "extraField": true
                                    },
                                    "uppercaseName": true,
                                    "roundPhoto": true
                                },
                                "sections": [
                                    {
                                        "id": "section-summary",
                                        "type": "summary",
                                        "column": "main",
                                        "title": "PROFILE",
                                        "content": {
                                            "summary": "Versatile HR manager with 10 years of experience in personnel management, recruitment and skills development. Skilled in HR transformation and change management. Passionate about employee wellbeing and engagement."
                                        }
                                    },
                                    {
                                        "id": "section-experience",
                                        "type": "experiences",
                                        "column": "main",
                                        "title": "WORK EXPERIENCE",
                                        "content": {
                                            "experiences": [
                                                {
                                                    "id": "exp-1",
                                                    "company": "International Industrial Group",
                                                    "position": "HR Manager",
                                                    "location": "Lille, France",
                                                    "period": "2019 – Present",
                                                    "bullets": [
                                                        "Managed HR for 200 employees across 2 sites",
                                                        "Led end-to-end recruitment (35 hires/year)",
                                                        "Implemented annual training plan (budget €150K)",
                                                        "Deployed an HRIS (Workday) and digitized processes",
                                                        "Reduced turnover by 25% over 3 years",
                                                        "Facilitated social dialogue and works councils"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-2",
                                                    "company": "HR Consulting Firm",
                                                    "position": "HR Consultant",
                                                    "location": "Lille, France",
                                                    "period": "2016 – 2019",
                                                    "bullets": [
                                                        "Supported SMEs in HR structuring",
                                                        "Audited and optimized HR processes",
                                                        "Ensured legal and regulatory compliance",
                                                        "Trained managers on recruitment best practices"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-3",
                                                    "company": "Service Company",
                                                    "position": "Recruitment Officer",
                                                    "location": "Roubaix, France",
                                                    "period": "2014 – 2016",
                                                    "bullets": [
                                                        "Recruited IT and commercial profiles",
                                                        "Sourced candidates and headhunting",
                                                        "Conducted interviews and evaluations"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-skills",
                                        "type": "skills",
                                        "column": "main",
                                        "title": "SKILLS",
                                        "content": {
                                            "skills": [
                                                {
                                                    "id": "group-1",
                                                    "groupName": "HR Expertise",
                                                    "skills": ["Recruitment", "Workforce Planning", "Training", "Payroll", "Employment Law", "Employee Relations"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                },
                                                {
                                                    "id": "group-2",
                                                    "groupName": "Tools",
                                                    "skills": ["Workday", "LinkedIn Recruiter", "Indeed", "Advanced Excel", "PowerPoint"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                },
                                                {
                                                    "id": "group-3",
                                                    "groupName": "Soft Skills",
                                                    "skills": ["Active Listening", "Mediation", "Confidentiality", "Organization", "Coaching"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-education",
                                        "type": "educations",
                                        "column": "main",
                                        "title": "EDUCATION",
                                        "content": {
                                            "educations": [
                                                {
                                                    "id": "edu-1",
                                                    "school": "IAE Lille",
                                                    "degree": "Master in Human Resources Management",
                                                    "location": "Lille, France",
                                                    "gpa": "With Honors",
                                                    "period": "2012 – 2014",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "gpa": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-certifications",
                                        "type": "custom",
                                        "column": "main",
                                        "title": "CERTIFICATIONS",
                                        "content": {
                                            "text": "• GPEC Certification (Workforce Planning)\\n• Advanced Employment Law Training\\n• Professional Interviewing Accreditation"
                                        }
                                    }
                                ]
                            },
                            "settings": {
                                "branding": true,
                                "theme": "light",
                                "fontSize": 1,
                                "fontFamily": "Inter",
                                "template": "single-column"
                            }
                        }'::jsonb,
                        'Human Resources',
                        8,
                        false
                    );

                    -- Modèle 9: CV Comptable/Finance
                    INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
                    (
                        'Accounting & Finance CV',
                        'CV for accounting and finance roles',
                        'double-column',
                        '{
                            "resume": {
                                "header": {
                                    "name": "LAURENT DURAND",
                                    "title": "Head Accountant",
                                    "phone": "+33 6 67 89 01 23",
                                    "email": "laurent.durand@example.com",
                                    "link": "linkedin.com/in/laurentdurand",
                                    "extraLink": "",
                                    "location": "Bordeaux, France",
                                    "extraField": "Chartered Accountant",
                                    "photoUrl": "https://images.unsplash.com/photo-1547425260-4c0b0f2f1e7a?w=800&q=80&auto=format&fit=crop",
                                    "visibility": {
                                        "title": true,
                                        "phone": true,
                                        "email": true,
                                        "link": true,
                                        "extraLink": false,
                                        "location": true,
                                        "photo": false,
                                        "extraField": true
                                    },
                                    "uppercaseName": true,
                                    "roundPhoto": false
                                },
                                "sections": [
                                    {
                                        "id": "section-experience",
                                        "type": "experiences",
                                        "column": "right",
                                        "title": "PROFESSIONAL EXPERIENCE",
                                        "content": {
                                            "experiences": [
                                                {
                                                    "id": "exp-1",
                                                    "company": "Regional Wine Group",
                                                    "position": "Head Accountant",
                                                    "location": "Bordeaux, France",
                                                    "period": "2018 – Present",
                                                    "bullets": [
                                                        "Oversaw general and cost accounting",
                                                        "Prepared annual financial statements (Revenue: €25M)",
                                                        "Managed a team of 4 accountants",
                                                        "Coordinated with statutory auditors and tax authorities",
                                                        "Optimized tax and cash management",
                                                        "Implemented management dashboards"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-2",
                                                    "company": "Accounting Firm",
                                                    "position": "Senior Accountant",
                                                    "location": "Bordeaux, France",
                                                    "period": "2014 – 2018",
                                                    "bullets": [
                                                        "Managed a portfolio of 30 client accounts (SMEs)",
                                                        "Performed audits and prepared tax filings",
                                                        "Advised on financial management and tax optimization",
                                                        "Trained and supervised junior accountants"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "exp-3",
                                                    "company": "Industrial SME",
                                                    "position": "Accountant",
                                                    "location": "Arcachon, France",
                                                    "period": "2011 – 2014",
                                                    "bullets": [
                                                        "Managed accounts receivable/payable",
                                                        "Prepared tax and social declarations",
                                                        "Performed bank reconciliations"
                                                    ],
                                                    "visibility": {
                                                        "bullets": true,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-skills",
                                        "type": "skills",
                                        "column": "left",
                                        "title": "SKILLS",
                                        "content": {
                                            "skills": [
                                                {
                                                    "id": "group-1",
                                                    "groupName": "Accounting",
                                                    "skills": ["General Accounting", "Cost Accounting", "Consolidation", "Financial Close", "Tax Filings"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-2",
                                                    "groupName": "Finance",
                                                    "skills": ["Cash Management", "Forecasting", "Financial Analysis", "Management Reporting"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-3",
                                                    "groupName": "Software",
                                                    "skills": ["Sage", "Cegid", "SAP", "Advanced Excel", "QuickBooks"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                },
                                                {
                                                    "id": "group-4",
                                                    "groupName": "Regulatory",
                                                    "skills": ["IFRS Standards", "Chart of Accounts", "Tax Law", "Corporate Law"],
                                                    "visibility": {
                                                        "groupName": true,
                                                        "compactMode": false
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-education",
                                        "type": "educations",
                                        "column": "left",
                                        "title": "EDUCATION",
                                        "content": {
                                            "educations": [
                                                {
                                                    "id": "edu-1",
                                                    "school": "DEC – Chartered Accountant Diploma",
                                                    "degree": "Chartered Accountant",
                                                    "location": "Paris, France",
                                                    "period": "2013",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "gpa": false,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                },
                                                {
                                                    "id": "edu-2",
                                                    "school": "DSCG",
                                                    "degree": "Advanced Diploma in Accounting and Management",
                                                    "location": "Bordeaux, France",
                                                    "period": "2009 – 2011",
                                                    "bullets": [],
                                                    "visibility": {
                                                        "bullets": false,
                                                        "gpa": false,
                                                        "location": true,
                                                        "logo": false,
                                                        "period": true
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        "id": "section-languages",
                                        "type": "languages",
                                        "column": "left",
                                        "title": "LANGUAGES",
                                        "content": {
                                            "languages": [
                                                {
                                                    "id": "lang-1",
                                                    "name": "French",
                                                    "level": "Native",
                                                    "proficiency": 5,
                                                    "visibility": {
                                                        "proficiency": true,
                                                        "slider": true
                                                    }
                                                },
                                                {
                                                    "id": "lang-2",
                                                    "name": "English",
                                                    "level": "Professional",
                                                    "proficiency": 4,
                                                    "visibility": {
                                                        "proficiency": true,
                                                        "slider": true
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            },
                            "settings": {
                                "branding": true,
                                "theme": "light",
                                "fontSize": 0.95,
                                "fontFamily": "Roboto",
                                "template": "double-column"
                            }
                        }'::jsonb,
                        'Accounting',
                        9,
                        false
                    );
         
-- Modèle 5: CV Debutant/Junior
INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
(
    'Modern Junior CV',
    'Perfect for recent graduates and junior profiles',
    'double-column',
    '{
        "resume": {
            "header": {
                "name": "THOMAS PETIT",
                "title": "Junior Web Developer",
                "phone": "+33 6 78 90 12 34",
                "email": "thomas.petit@example.com",
                "link": "linkedin.com/in/thomaspetit",
                "extraLink": "github.com/thomaspetit",
                "location": "Nantes, France",
                "extraField": "Available immediately",
                "photoUrl": "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=800&q=80&auto=format&fit=crop",
                "visibility": {
                    "title": true,
                    "phone": true,
                    "email": true,
                    "link": true,
                    "extraLink": true,
                    "location": true,
                    "photo": false,
                    "extraField": true
                },
                "uppercaseName": true,
                "roundPhoto": false
            },
            "sections": [
                {
                    "id": "section-summary",
                    "type": "summary",
                    "column": "left",
                    "title": "ABOUT",
                    "content": {
                        "summary": "Enthusiastic junior developer recently graduated with a Master s in Computer Science. Motivated to learn and contribute to innovative projects."
                    }
                },
                {
                    "id": "section-education",
                    "type": "educations",
                    "column": "left",
                    "title": "EDUCATION",
                    "content": {
                        "educations": [
                            {
                                "id": "edu-1",
                                "school": "University of Nantes",
                                "degree": "Master in Computer Science",
                                "location": "Nantes, France",
                                "gpa": "With Honors",
                                "period": "2022 – 2024",
                                "bullets": [
                                    "Specialization in web development",
                                    "Thesis project: collaborative platform"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "gpa": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "edu-2",
                                "school": "IUT Computer Science",
                                "degree": "Professional Bachelors Degree",
                                "location": "Nantes, France",
                                "period": "2019 – 2022",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": false,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-skills",
                    "type": "skills",
                    "column": "left",
                    "title": "SKILLS",
                    "content": {
                        "skills": [
                            {
                                "id": "group-1",
                                "groupName": "Frontend",
                                "skills": ["HTML/CSS", "JavaScript", "React", "Tailwind CSS"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-2",
                                "groupName": "Backend",
                                "skills": ["Node.js", "Express", "PostgreSQL", "MongoDB"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-3",
                                "groupName": "Tools",
                                "skills": ["Git", "VS Code", "Figma", "Postman"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-projects",
                    "type": "projects",
                    "column": "right",
                    "title": "PERSONAL PROJECTS",
                    "content": {
                        "projects": [
                            {
                                "id": "project-1",
                                "projectName": "Task Management App",
                                "description": "Full-stack collaborative to-do list application",
                                "link": "github.com/thomaspetit/task-app",
                                "period": "2024",
                                "bullets": [
                                    "Stack: React, Node.js, MongoDB",
                                    "JWT authentication",
                                    "Responsive modern UI",
                                    "Deployed on Heroku"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "description": true,
                                    "link": true,
                                    "location": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "project-2",
                                "projectName": "Personal Portfolio",
                                "description": "Portfolio site with animations",
                                "link": "thomaspetit.dev",
                                "period": "2023",
                                "bullets": [
                                    "Built with Next.js and Tailwind",
                                    "Animations using Framer Motion",
                                    "SEO optimized"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "description": true,
                                    "link": true,
                                    "location": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-experience",
                    "type": "experiences",
                    "column": "right",
                    "title": "EXPERIENCE",
                    "content": {
                        "experiences": [
                            {
                                "id": "exp-1",
                                "company": "StartUp Tech",
                                "position": "Web Developer Intern",
                                "location": "Nantes, France",
                                "period": "Mar 2024 – Aug 2024",
                                "bullets": [
                                    "Developed frontend features in React",
                                    "Fixed bugs and optimized performance",
                                    "Participated in code reviews",
                                    "Collaborated in Agile/Scrum"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-languages",
                    "type": "languages",
                    "column": "right",
                    "title": "LANGUAGES",
                    "content": {
                        "languages": [
                            {
                                "id": "lang-1",
                                "name": "French",
                                "level": "Native",
                                "proficiency": 5,
                                "visibility": {
                                    "proficiency": true,
                                    "slider": true
                                }
                            },
                            {
                                "id": "lang-2",
                                "name": "English",
                                "level": "Intermediate (B2)",
                                "proficiency": 3,
                                "visibility": {
                                    "proficiency": true,
                                    "slider": true
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "settings": {
            "branding": true,
            "theme": "light",
            "fontSize": 1,
            "fontFamily": "Inter",
            "template": "double-column"
        }
    }'::jsonb,
    'Junior',
    5,
    false
);

INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
-- Modèle 6: CV Premium Executif
(
    'CV Executif Premium',
    'CV haut de gamme pour cadres superieurs et dirigeants',
    'single-column',
        'Executive Premium CV',
        'High-end CV for senior executives and leaders',
            "header": {
        '{
            "resume": {
                "header": {
                    "name": "MARIE LAURENT",
                    "title": "Head of Digital Marketing",
                    "phone": "+33 6 12 34 56 78",
                    "email": "marie.laurent@example.com",
                    "link": "linkedin.com/in/marielaurent",
                    "extraLink": "",
                    "location": "Paris, France",
                    "extraField": "15 years of experience",
                    "photoUrl": "https://images.unsplash.com/photo-1545996124-1b1b82b9a75b?w=800&q=80&auto=format&fit=crop",
                    "email": true,
                    "link": true,
                    "extraLink": false,
                    "location": true,
                    "photo": true,
                    "extraField": true
                },
                "uppercaseName": true,
                "roundPhoto": true
            },
            "sections": [
                {
                    "id": "section-summary",
                    "type": "summary",
                    "column": "main",
                    "title": "SYNTHÈSE EXeCUTIVE",
                    "content": {
                        "column": "main",
                        "title": "EXECUTIVE SUMMARY",
                        "content": {
                            "summary": "Accomplished Head of Digital Marketing with 15 years of experience in digital strategy and transformation. Expert in organic growth (SEO/Content) and paid channels (Google Ads, Social Ads). Proven track record generating over €50M in revenue through innovative campaigns."
                        }
                    "type": "experiences",
                    "column": "main",
                    "title": "EXPeRIENCE PROFESSIONNELLE",
                    "content": {
                        "column": "main",
                        "title": "PROFESSIONAL EXPERIENCE",
                                "id": "exp-1",
                                "company": "Groupe International Retail",
                                "position": "Directrice Marketing Digital",
                                "location": "Paris, France",
                                    "company": "International Retail Group",
                                    "position": "Head of Digital Marketing",
                                    "location": "Paris, France",
                                    "period": "2018 – Present",
                                    "bullets": [
                                        "Led a team of 25 across SEO, SEA, Social Media, and Content",
                                        "Grew e-commerce revenue by 180% in 5 years (€15M to €42M)",
                                        "Rolled out omnichannel strategy across 8 European countries",
                                        "Reduced customer acquisition cost by 35% through campaign optimization",
                                        "Managed a €8M annual marketing budget",
                                        "Implemented advanced analytics and predictive AI tools"
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-2",
                                "company": "Agence Digital Leader",
                                "position": "Responsable Strategie Digitale",
                                "location": "Paris, France",
                                "period": "2014 – 2018",
                                "bullets": [
                                    "Management de 12 consultants",
                                    "Accompagnement de 50+ clients dans leur transformation digitale",
                                    "Specialisation secteurs: luxe, retail, B2B tech",
                                    "Creation de frameworks strategiques proprietaires"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-3",
                                "company": "Start-up E-commerce",
                                "position": "Chef de Projet Marketing Digital",
                                "location": "Lyon, France",
                                "period": "2010 – 2014",
                                "bullets": [
                                    "Lancement et croissance d''une marketplace BtoC",
                                    "Gestion complète des campagnes Google Ads et Facebook Ads",
                                    "Croissance de 0 à 500K visiteurs/mois en 3 ans"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-education",
                    "type": "educations",
                    "column": "main",
                    "title": "FORMATION",
                    "content": {
                        "educations": [
                            {
                                "id": "edu-1",
                                "school": "HEC Paris",
                                "degree": "MBA Marketing & Innovation",
                                "location": "Paris, France",
                                "gpa": "Major de promotion",
                                "period": "2008 – 2010",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-skills",
                    "type": "skills",
                    "column": "main",
                    "title": "EXPERTISES",
                    "content": {
                        "skills": [
                            {
                                "id": "group-1",
                                "groupName": "Strategie",
                                "skills": ["Marketing Digital", "Growth Hacking", "Brand Strategy", "Customer Journey", "Omnicanal"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-2",
                                "groupName": "Techniques",
                                "skills": ["Google Analytics 4", "SEMrush", "HubSpot", "Salesforce", "Looker Studio", "Hotjar"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-3",
                                "groupName": "Leadership",
                                "skills": ["Management d''equipes", "Budget Management", "Negociation", "Change Management"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "settings": {
            "branding": true,
            "theme": "light",
            "fontSize": 1,
            "fontFamily": "Libre Baskerville",
            "template": "single-column"
        }
    }'::jsonb,
    'Executive',
    6,
    true
);

-- Modèle 7: CV Data Scientist
INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
(
    'Data Scientist CV',
    'Specialized CV for data and AI roles',
    'double-column',
    '{
        "resume": {
            "header": {
                "name": "PIERRE ROUSSEAU",
                "title": "Data Scientist",
                "phone": "+33 7 89 01 23 45",
                "email": "pierre.rousseau@example.com",
                "link": "linkedin.com/in/pierrerousseau",
                "extraLink": "kaggle.com/pierrerousseau",
                "location": "Paris, France",
                "extraField": "PhD in Machine Learning",
                "photoUrl": "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=800&q=80&auto=format&fit=crop",
                "visibility": {
                    "title": true,
                    "phone": true,
                    "email": true,
                    "link": true,
                    "extraLink": true,
                    "location": true,
                    "photo": false,
                    "extraField": true
                },
                "uppercaseName": true,
                "roundPhoto": false
            },
            "sections": [
                {
                    "id": "section-skills",
                    "type": "skills",
                    "column": "left",
                    "title": "SKILLS",
                    "content": {
                        "skills": [
                            {
                                "id": "group-1",
                                "groupName": "Langages",
                                "skills": ["Python", "R", "SQL", "Scala", "Julia"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-2",
                                "groupName": "Machine Learning",
                                "skills": ["Scikit-learn", "TensorFlow", "PyTorch", "Keras", "XGBoost", "LightGBM"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-3",
                                "groupName": "Big Data",
                                "skills": ["Spark", "Hadoop", "Kafka", "Airflow", "Databricks"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-4",
                                "groupName": "Visualisation",
                                "skills": ["Tableau", "Power BI", "Plotly", "Matplotlib", "Seaborn"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-education",
                    "type": "educations",
                    "column": "left",
                    "title": "EDUCATION",
                    "content": {
                        "educations": [
                            {
                                "id": "edu-1",
                                "school": "Ecole Polytechnique",
                                "degree": "PhD in Machine Learning",
                                "location": "Paris, France",
                                "period": "2018 – 2021",
                                "bullets": [
                                    "Thesis: Deep learning for time series forecasting",
                                    "5 publications in international conferences"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "gpa": false,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "edu-2",
                                "school": "Telecom Paris",
                                "degree": "Master Data Science",
                                "location": "Paris, France",
                                "gpa": "Mention Très Bien",
                                "period": "2016 – 2018",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-experience",
                    "type": "experiences",
                    "column": "right",
                    "title": "EXPERIENCE",
                    "content": {
                        "experiences": [
                            {
                                "id": "exp-1",
                                "company": "Tech Giant France",
                                "position": "Senior Data Scientist",
                                "location": "Paris, France",
                                "period": "2021 – Present",
                                "bullets": [
                                    "Built recommendation models for 50M+ users",
                                    "Improved CTR by 23% using deep learning",
                                    "Deployed ML pipelines to production on AWS",
                                    "Mentored 3 junior data scientists",
                                    "Collaborated with product and engineering teams"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-2",
                                "company": "FinTech Innovation",
                                "position": "Data Scientist",
                                "location": "Paris, France",
                                "period": "2018 – 2021",
                                "bullets": [
                                    "Modèles de detection de fraude (precision 98.5%)",
                                    "Système de scoring credit avec ML",
                                    "Reduction des faux positifs de 40%"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-projects",
                    "type": "projects",
                    "column": "right",
                    "title": "PROJECTS & PUBLICATIONS",
                    "content": {
                        "projects": [
                            {
                                "id": "project-1",
                                "projectName": "Kaggle Competition - Top 1%",
                                "description": "Real estate price prediction",
                                "link": "kaggle.com/competitions/housing-prices",
                                "period": "2023",
                                "bullets": [
                                    "Ensembled models (XGBoost, LightGBM, Neural Networks)",
                                    "Advanced feature engineering"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "description": true,
                                    "link": true,
                                    "location": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "project-2",
                                "projectName": "Publication NeurIPS 2022",
                                "description": "Novel approach to time series forecasting with transformers",
                                "period": "2022",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "description": true,
                                    "link": false,
                                    "location": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "settings": {
            "branding": true,
            "theme": "light",
            "fontSize": 0.95,
            "fontFamily": "Roboto",
            "template": "double-column"
        }
    }'::jsonb,
    'Data Science',
    7,
    false
);

-- Modèle 8: CV Ressources Humaines
INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
(
    'CV RH Moderne',
    'CV pour professionnels des ressources humaines',
    'single-column',
    '{
        "resume": {
            "header": {
                "name": "CATHERINE MOREAU",
                "title": "Responsable Ressources Humaines",
                "phone": "+33 6 56 78 90 12",
                "email": "catherine.moreau@example.com",
                "link": "linkedin.com/in/catherinemoreau",
                "extraLink": "",
                "location": "Lille, France",
                "extraField": "Certifiee GPEC",
                "photoUrl": "",
                "visibility": {
                    "title": true,
                    "phone": true,
                    "email": true,
                    "link": true,
                    "extraLink": false,
                    "location": true,
                    "photo": true,
                    "extraField": true
                },
                "uppercaseName": true,
                "roundPhoto": true
            },
            "sections": [
                {
                    "id": "section-summary",
                    "type": "summary",
                    "column": "main",
                    "title": "PROFIL",
                    "content": {
                        "summary": "Responsable RH polyvalente avec 10 ans d''experience en gestion du personnel, recrutement et developpement des competences. Expertise en transformation RH et accompagnement du changement. Passionnee par le bien-être au travail et l''engagement collaborateur."
                    }
                },
                {
                    "id": "section-experience",
                    "type": "experiences",
                    "column": "main",
                    "title": "PARCOURS PROFESSIONNEL",
                    "content": {
                        "experiences": [
                            {
                                "id": "exp-1",
                                "company": "Groupe Industriel International",
                                "position": "Responsable Ressources Humaines",
                                "location": "Lille, France",
                                "period": "2019 – Present",
                                "bullets": [
                                    "Gestion RH de 200 collaborateurs sur 2 sites",
                                    "Pilotage complet du cycle de recrutement (35 embauches/an)",
                                    "Mise en place d''un plan de formation annuel (budget 150K€)",
                                    "Deploiement d''un SIRH (Workday) et digitalisation des processus",
                                    "Reduction du turnover de 25% en 3 ans",
                                    "Animation des IRP et dialogue social"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-2",
                                "company": "Cabinet de Conseil RH",
                                "position": "Consultante RH",
                                "location": "Lille, France",
                                "period": "2016 – 2019",
                                "bullets": [
                                    "Accompagnement de PME dans leur structuration RH",
                                    "Audit et optimisation des process RH",
                                    "Mise en conformite legale et reglementaire",
                                    "Formation des managers au recrutement"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-3",
                                "company": "Entreprise Services",
                                "position": "Chargee de Recrutement",
                                "location": "Roubaix, France",
                                "period": "2014 – 2016",
                                "bullets": [
                                    "Recrutement de profils IT et commerciaux",
                                    "Sourcing candidats et chasse de têtes",
                                    "Conduite d''entretiens et evaluation"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-skills",
                    "type": "skills",
                    "column": "main",
                    "title": "COMPeTENCES",
                    "content": {
                        "skills": [
                            {
                                "id": "group-1",
                                "groupName": "Expertise RH",
                                "skills": ["Recrutement", "GPEC", "Formation", "Paie", "Droit du travail", "Relations sociales"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-2",
                                "groupName": "Outils",
                                "skills": ["Workday", "LinkedIn Recruiter", "Indeed", "Excel avance", "PowerPoint"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            },
                            {
                                "id": "group-3",
                                "groupName": "Soft Skills",
                                "skills": ["ecoute active", "Mediation", "Confidentialite", "Organisation", "Pedagogie"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-education",
                    "type": "educations",
                    "column": "main",
                    "title": "FORMATION",
                    "content": {
                        "educations": [
                            {
                                "id": "edu-1",
                                "school": "IAE Lille",
                                "degree": "Master Management des Ressources Humaines",
                                "location": "Lille, France",
                                "gpa": "Mention Bien",
                                "period": "2012 – 2014",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-certifications",
                    "type": "custom",
                    "column": "main",
                    "title": "CERTIFICATIONS",
                    "content": {
                        "text": "• Certification GPEC (Gestion Previsionnelle des Emplois et Competences)\n• Formation Droit du travail approfondi\n• Habilitation conduite d''entretien professionnel"
                    }
                }
            ]
        },
        "settings": {
            "branding": true,
            "theme": "light",
            "fontSize": 1,
            "fontFamily": "Inter",
            "template": "single-column"
        }
    }'::jsonb,
    'Ressources Humaines',
    8,
    false
);

-- Modèle 9: CV Comptable/Finance
INSERT INTO cv_modeles (nom, description, template_type, contenu_json, categorie, ordre, est_premium) VALUES
(
    'CV Comptabilite & Finance',
    'CV pour les metiers de la comptabilite et de la finance',
    'double-column',
    '{
        "resume": {
            "header": {
                "name": "LAURENT DURAND",
                "title": "Responsable Comptable",
                "phone": "+33 6 67 89 01 23",
                "email": "laurent.durand@example.com",
                "link": "linkedin.com/in/laurentdurand",
                "extraLink": "",
                "location": "Bordeaux, France",
                "extraField": "Expert-Comptable Diplôme",
                "photoUrl": "",
                "visibility": {
                    "title": true,
                    "phone": true,
                    "email": true,
                    "link": true,
                    "extraLink": false,
                    "location": true,
                    "photo": false,
                    "extraField": true
                },
                "uppercaseName": true,
                "roundPhoto": false
            },
            "sections": [
                {
                    "id": "section-experience",
                    "type": "experiences",
                    "column": "right",
                    "title": "EXPeRIENCE PROFESSIONNELLE",
                    "content": {
                        "experiences": [
                            {
                                "id": "exp-1",
                                "company": "Groupe Viticole Regional",
                                "position": "Responsable Comptable",
                                "location": "Bordeaux, France",
                                "period": "2018 – Present",
                                "bullets": [
                                    "Supervision de la comptabilite generale et analytique",
                                    "etablissement des comptes annuels (CA: 25M€)",
                                    "Management d''une equipe de 4 comptables",
                                    "Relation avec les CAC et administration fiscale",
                                    "Optimisation fiscale et gestion de tresorerie",
                                    "Mise en place de tableaux de bord de gestion"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-2",
                                "company": "Cabinet d''Expertise Comptable",
                                "position": "Chef de Mission Comptable",
                                "location": "Bordeaux, France",
                                "period": "2014 – 2018",
                                "bullets": [
                                    "Gestion d''un portefeuille de 30 dossiers clients (PME/TPE)",
                                    "Revision comptable et etablissement des liasses fiscales",
                                    "Conseil en gestion et optimisation fiscale",
                                    "Formation et encadrement d''assistants comptables"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "exp-3",
                                "company": "PME Industrie",
                                "position": "Comptable",
                                "location": "Arcachon, France",
                                "period": "2011 – 2014",
                                "bullets": [
                                    "Tenue de la comptabilite clients/fournisseurs",
                                    "Declarations fiscales et sociales",
                                    "Rapprochements bancaires et lettrage"
                                ],
                                "visibility": {
                                    "bullets": true,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-skills",
                    "type": "skills",
                    "column": "left",
                    "title": "COMPeTENCES",
                    "content": {
                        "skills": [
                            {
                                "id": "group-1",
                                "groupName": "Comptabilite",
                                "skills": ["Comptabilite generale", "Comptabilite analytique", "Consolidation", "Clôture des comptes", "Liasse fiscale"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-2",
                                "groupName": "Finance",
                                "skills": ["Gestion de tresorerie", "Budget previsionnel", "Analyse financière", "Contrôle de gestion"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-3",
                                "groupName": "Logiciels",
                                "skills": ["Sage", "Cegid", "SAP", "Excel Expert", "QuickBooks"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            },
                            {
                                "id": "group-4",
                                "groupName": "Reglementaire",
                                "skills": ["Normes IFRS", "Plan comptable general", "Droit fiscal", "Droit des societes"],
                                "visibility": {
                                    "groupName": true,
                                    "compactMode": false
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-education",
                    "type": "educations",
                    "column": "left",
                    "title": "FORMATION",
                    "content": {
                        "educations": [
                            {
                                "id": "edu-1",
                                "school": "DEC – Diplôme d''Expert-Comptable",
                                "degree": "Expert-Comptable",
                                "location": "Paris, France",
                                "period": "2013",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": false,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            },
                            {
                                "id": "edu-2",
                                "school": "DSCG",
                                "degree": "Diplôme Superieur de Comptabilite et Gestion",
                                "location": "Bordeaux, France",
                                "period": "2009 – 2011",
                                "bullets": [],
                                "visibility": {
                                    "bullets": false,
                                    "gpa": false,
                                    "location": true,
                                    "logo": false,
                                    "period": true
                                }
                            }
                        ]
                    }
                },
                {
                    "id": "section-languages",
                    "type": "languages",
                    "column": "left",
                    "title": "LANGUES",
                    "content": {
                        "languages": [
                            {
                                "id": "lang-1",
                                "name": "Français",
                                "level": "Langue maternelle",
                                "proficiency": 5,
                                "visibility": {
                                    "proficiency": true,
                                    "slider": true
                                }
                            },
                            {
                                "id": "lang-2",
                                "name": "Anglais",
                                "level": "Professionnel",
                                "proficiency": 4,
                                "visibility": {
                                    "proficiency": true,
                                    "slider": true
                                }
                            }
                        ]
                    }
                }
            ]
        },
        "settings": {
            "branding": true,
            "theme": "light",
            "fontSize": 0.95,
            "fontFamily": "Roboto",
            "template": "double-column"
        }
    }'::jsonb,
    'Comptabilite',
    9,
    false
);