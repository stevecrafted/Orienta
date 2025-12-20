import '../Style/DetailPoste.scoped.css'
import Header from '@/components/BasicComponents/Header'

export default function Page() {
    return (
        <div>
            <Header></Header>

            <main className="ma-main-container">

                <div className="ma-page4-grid">
                    <form method='post' action='/FormationsPoste' className="ma-page4-left-panel">
                        <h2 className="ma-page4-panel-title">Le Poste que vous voulez :</h2>
                        <div className="ma-page4-job-header">
                            <h3 className="ma-page4-job-title">Senior UX Designer</h3>
                            <div className="ma-page2-job-badges">
                                <span className="ma-page2-badge ma-page2-badge-featured">Featured</span>
                                <span className="ma-page2-badge ma-page2-badge-fulltime">Full Time</span>
                            </div>
                            <div className="ma-page4-contact-info">
                                <div className="ma-page4-contact-item"><span>📞</span><span>(400) 555-0120</span></div>
                                <div className="ma-page4-contact-item"><span>✉️</span><span>career@instagram.com</span></div>
                            </div>
                        </div>

                        <div className="ma-page4-section">
                            <h4 className="ma-page4-section-title">Job Description</h4>
                            <p className="ma-page4-description">Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo tincidunt consectetur.</p>
                        </div>

                        <button className="ma-page4-boost-btn">Je Veut Booster Mon Profil</button>
                    
                    </form>

                    <form method='post' action='CreateCv' className="ma-page4-right-panel">
                        <h2 className="ma-page4-panel-title">En analysant votre profil, il vous manque ces competences :</h2>
                        <div className="ma-page4-section">
                            <h4 className="ma-page4-section-title">Responsibilities</h4>
                            <ul className="ma-page4-responsibilities-list">
                                <li>Quisque semper gravida est et consectetur.</li>
                                <li>Curabitur blandit lorem velit, vitae pretium leo placerat eget.</li>
                                <li>Morbi mattis in ipsum ac tempus.</li>
                            </ul>
                        </div>

                        <button className="ma-page4-modify-btn">Modifier Mon Cv</button>
                    </form>

                </div>
            </main>
        </div>
    )
}
