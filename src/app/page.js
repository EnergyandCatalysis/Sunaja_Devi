import Sidebar from "@/components/Sidebar";
import CongratulatoryPopup from "@/components/CongratulatoryPopup";
import SelectedPublications from "@/components/SelectedPublications";
import ResearchAreas from "@/components/ResearchAreas";
import Image from "next/image";
import Link from "next/link";
import scholarStats from "@/data/scholarStats.json";
import rawLatestPublications from "@/data/latestPublications.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const latestPublications = rawLatestPublications.map((pub) => ({
  ...pub,
  graphicalAbstract: pub.graphicalAbstract ? `${basePath}${pub.graphicalAbstract}` : "",
}));

function getInitials(name) {
  const cleanName = name.replace(/^Dr\.\s*/i, "").replace(/\./g, " ");
  const words = cleanName.split(" ").filter(Boolean);
  return ((words[0]?.[0] || "") + (words[words.length - 1]?.[0] || "")).toUpperCase();
}

const memberPhotos = {
  "Dr. Pushparaj Loganathan": `${basePath}/images/pushparaj_l_pdf.jpg`,
  "Cheriyan John": `${basePath}/images/cheriyan_john_present.jpg`,
  "Jessica Jones W": `${basePath}/images/jessica_jones.jpg`,
  "Arsha.R": `${basePath}/images/arsha_r.jpg`,
  "Dr. Dephan Phinero": `${basePath}/images/dephan_phinero.jpg`,
  "Dr. Arun Varghese Ayyamala": `${basePath}/images/arun_varghese.jpg`,
  "Dr. Sandra Mathew": `${basePath}/images/sandra_mathew.jpg`,
  "Sandra Mathew": `${basePath}/images/sandra_mathew.jpg`,
  "Dr. Muthukumar Devarasu": `${basePath}/images/muthukumar_d.jpg`,
  "Dr. Samika Anand": `${basePath}/images/samika_anand.jpg`,
  "Dr. Sujith S": `${basePath}/images/sujith_s.jpg`,
};

const groupCategories = [
  {
    category: "Post-Doctoral Researcher",
    members: ["Dr. Pushparaj Loganathan"],
  },
  {
    category: "PhD Scholars",
    members: ["Cheriyan John", "Jessica Jones W", "Arsha.R"],
  },
  {
    category: "Past Members",
    members: [
      "Dr. Dephan Phinero",
      "Dr. Shalini Reghunath",
      "Dr. Sruthi Rajasekaran",
      "Dr. Arun Varghese Ayyamala",
      "Dr. Sandra Mathew",
      "Dr. Muthukumar Devarasu",
      "Dr. Madhushree",
      "Dr. Samika Anand",
      "Dr. Sujith S",
      "Dr. Selva Priya",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <Sidebar />
      <CongratulatoryPopup />

      <main className="main-content" id="home">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-bg" style={{ position: "absolute" }}>
            <Image
              src={`${basePath}/images/lab-banner.png`}
              alt="Chemistry Research Laboratory"
              fill
              priority
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-portrait">
              <Image
                src={`${basePath}/images/sunaja_devi.png`}
                alt="Prof. Sunaja Devi K R"
                width={280}
                height={280}
                priority
                id="professor-portrait"
              />
            </div>
            <div className="hero-info">
              <h1>Prof. Sunaja Devi K R</h1>
              <p className="designation">
                Head & Professor, Department of Chemistry
              </p>
              <p className="university">
                Christ (Deemed to be University), Bangalore
              </p>
              <div className="hero-links">
                <a
                  href="https://scholar.google.com/citations?user=HmOcEpIAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn primary"
                  id="scholar-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Google Scholar
                </a>
                <a
                  href="https://www.sciencedirect.com/author/55450509500/kalathiparambil-rajendra-pai-sunajadevi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn"
                  id="scopus-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Scopus ID
                </a>
                <a
                  href="https://www.researchgate.net/profile/Sunaja-Devi-K-R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-btn"
                  id="researchgate-link"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                  ResearchGate
                </a>
                <a href="#contact" className="hero-btn" id="contact-hero-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Contact
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Top Navigation Bar */}
        <nav className="top-nav" id="top-navigation">
          <div className="top-nav-inner">
            <a href="#research" className="top-nav-link">
              Research
            </a>
            <div className="top-nav-dropdown-container">
              <a href="#publications" className="top-nav-link top-nav-dropdown-trigger" id="pub-dropdown-trigger">
                Publications
                <svg className="dropdown-arrow" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </a>
              <div className="top-nav-dropdown-menu" id="pub-dropdown-menu">
                <a href="#selected-publications" className="top-nav-dropdown-item" id="nav-selected-pub">
                  <span className="dropdown-item-icon">⭐</span>
                  Selected Publications
                </a>
                <a href="#latest-publications" className="top-nav-dropdown-item" id="nav-latest-pub">
                  <span className="dropdown-item-icon">✨</span>
                  Latest Publications
                </a>
              </div>
            </div>
            <a href="#group" className="top-nav-link">
              Group
            </a>
            <a href="#collaborations" className="top-nav-link">
              Collaborations
            </a>
            <a href="#opportunities" className="top-nav-link">
              Opportunities
            </a>
            <a href="#contact" className="top-nav-link">
              Contact
            </a>
            <Link href="/scholar" className="top-nav-link">
              Google Scholar
            </Link>
            <a
              href="https://www.sciencedirect.com/author/55450509500/kalathiparambil-rajendra-pai-sunajadevi"
              target="_blank"
              rel="noopener noreferrer"
              className="top-nav-link"
              id="top-scopus-link"
            >
              Scopus ID
            </a>
          </div>
        </nav>

        {/* Stats Bar */}
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="stats-bar" id="stats-section">
            <div className="stat-item">
              <span className="stat-number">{scholarStats.publicationsCount}</span>
              <span className="stat-label">Publications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{scholarStats.citations}</span>
              <span className="stat-label">Citations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">20</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">Patents</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10</span>
              <span className="stat-label">PhD Scholars Graduated</span>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section className="section" id="research">
          <div className="section-header">
            <h2 className="section-title">Research</h2>
            <p className="section-subtitle">
              Advancing Materials for Sustainable Energy and Environmental Solutions
            </p>
          </div>

          <div className="research-description">
            <p>
              Our research focuses on the design, synthesis, and engineering of
              advanced functional materials to address global challenges in clean
              energy and environmental sustainability. We develop and investigate
              MXenes, MAX phases, metal–organic frameworks (MOFs), layered double
              hydroxides (LDHs), nanocomposites, and hybrid materials for
              next-generation energy storage, energy conversion, and environmental
              remediation.
            </p>
            <p>
              Our work encompasses the development of high-performance electrode
              materials for supercapacitors and batteries, efficient
              electrocatalysts for hydrogen evolution, oxygen evolution, and overall
              water splitting, as well as photocatalysts and adsorbents for
              wastewater treatment and pollutant degradation. By integrating
              innovative synthesis strategies with advanced structural,
              spectroscopic, and electrochemical characterization, we establish
              fundamental structure–property relationships that enable the rational
              design of high-performance functional materials.
            </p>
            <p>
              Through interdisciplinary research and international collaborations,
              our group aims to translate fundamental materials science into
              practical technologies that contribute to a cleaner, more
              sustainable future.
            </p>

            <div className="research-image-wrapper">
              <Image
                src={`${basePath}/images/research_overview.png`}
                alt="Advancing Materials for Sustainable Energy and Environmental Solutions"
                width={1200}
                height={600}
                style={{ width: "100%", height: "auto", maxHeight: "520px", objectFit: "contain" }}
                id="research-illustration"
              />
            </div>
          </div>

          <div style={{ marginTop: "36px" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--primary)",
                marginBottom: "20px",
              }}
            >
              Research Areas
            </h3>
            <ResearchAreas />
          </div>
        </section>

        {/* Publications Section */}
        <section className="section" id="publications">
          <div className="section-header">
            <h2 className="section-title">Publications</h2>
            <p className="section-subtitle">
              Over {scholarStats.publicationsCount} publications in peer-reviewed international journals.{" "}
              <a
                href="https://scholar.google.com/citations?user=HmOcEpIAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                View all on Google Scholar →
              </a>
            </p>
          </div>

          {/* Subsection 1: Selected Publications */}
          <div style={{ marginBottom: "40px" }}>
            <SelectedPublications />
          </div>

          {/* Subsection 2: Latest Publications */}
          <div className="pub-subsection" id="latest-publications">
            <div className="pub-subsection-header">
              <h3 className="pub-subsection-title">
                <span className="pub-subsection-icon">✨</span>
                Latest Publications
              </h3>
            </div>
            <div className="publications-list">
              {latestPublications.map((pub, idx) => (
                <div className="publication-card" key={idx} id={`latest-pub-card-${idx}`}>
                  <div className="pub-main-info">
                    <div className="pub-year">{pub.year}</div>
                    <div className="pub-content">
                      <h4>{pub.title}</h4>
                      <p className="pub-authors">{pub.authors}</p>
                      <p className="pub-journal">
                        {pub.journal}
                        {pub.doi && (
                          <a
                            href={`https://doi.org/${pub.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pub-doi-badge"
                          >
                            DOI: {pub.doi} ↗
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="pub-abstract-wrapper" title="Graphical Abstract">
                    {pub.graphicalAbstract ? (
                      <Image
                        src={pub.graphicalAbstract}
                        alt={`Graphical Abstract - ${pub.title}`}
                        width={140}
                        height={95}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="pub-abstract-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span>Graphical Abstract</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Group Section */}
        <section className="section" id="group">
          <div className="section-header">
            <h2 className="section-title">Research Group</h2>
            <p className="section-subtitle">
              Meet the talented researchers in our group
            </p>
          </div>

          <div className="group-banner-wrapper">
            <Image
              src={`${basePath}/images/latest_group_photo.jpg`}
              alt="Sunaja Devi Research Group"
              width={1200}
              height={500}
              className="group-banner-image"
            />
            <div className="group-banner-caption">
              <span>Sunaja Devi Research Group</span>
            </div>
          </div>

          {groupCategories.map((group, groupIdx) => (
            <div key={group.category} style={{ marginBottom: "36px" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  marginBottom: "20px",
                }}
              >
                {group.category}
              </h3>
              <div className="group-grid">
                {group.members.map((name, idx) => (
                  <div
                    className="member-card"
                    key={name}
                    id={`member-card-${groupIdx}-${idx}`}
                  >
                    <div className="member-avatar">
                      {memberPhotos[name] ? (
                        <Image
                          src={memberPhotos[name]}
                          alt={name}
                          width={150}
                          height={150}
                        />
                      ) : (
                        getInitials(name)
                      )}
                    </div>
                    <h4>{name}</h4>
                    <p className="member-role">
                      {group.category === "PhD Scholars"
                        ? "PhD Scholar"
                        : group.category === "Past Members"
                        ? "Past Member"
                        : group.category}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Collaborations Section */}
        <section className="section" id="collaborations">
          <div className="section-header">
            <h2 className="section-title">Collaborations</h2>
            <p className="section-subtitle">
              We collaborate with leading research groups across the globe
            </p>
          </div>

          <div className="research-grid">
            <div className="research-card">
              <div className="research-card-icon" style={{ overflow: "hidden", background: "#ffffff", border: "1px solid var(--border-light)", padding: "4px" }}>
                <Image
                  src={`${basePath}/images/tnpcb.png`}
                  alt="Tamil Nadu Pollution Control Board"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <h3>Tamil Nadu Pollution Control Board</h3>
              <p>
                Collaborative research initiatives on environmental pollution monitoring, industrial wastewater management, and advanced catalyst materials for environmental protection.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon" style={{ overflow: "hidden", background: "#ffffff", border: "1px solid var(--border-light)", padding: "4px" }}>
                <Image
                  src={`${basePath}/images/iisc.png`}
                  alt="IISc Bangalore"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <h3>IISc Bangalore</h3>
              <p>
                Collaborative research on advanced nanomaterials for energy
                applications with the Materials Research Centre.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon" style={{ overflow: "hidden", background: "#ffffff", border: "1px solid var(--border-light)", padding: "4px" }}>
                <Image
                  src={`${basePath}/images/iitm.png`}
                  alt="IIT Madras"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <h3>IIT Madras</h3>
              <p>
                Joint projects on MOF-based composites for environmental
                remediation and catalysis.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon" style={{ overflow: "hidden", background: "#ffffff", border: "1px solid var(--border-light)", padding: "4px" }}>
                <Image
                  src={`${basePath}/images/ncl.png`}
                  alt="CSIR-NCL Pune"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain", width: "100%", height: "100%" }}
                />
              </div>
              <h3>CSIR-NCL Pune</h3>
              <p>
                Partnering on development of electrocatalysts for sustainable
                hydrogen production.
              </p>
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="section" id="opportunities">
          <div className="section-header">
            <h2 className="section-title">Opportunities</h2>
            <p className="section-subtitle">
              Join our dynamic research group at Christ University
            </p>
          </div>

          <div className="research-grid">
            <div className="research-card">
              <div className="research-card-icon">🎓</div>
              <h3>PhD Positions</h3>
              <p>
                We are looking for motivated PhD candidates with a strong
                background in Chemistry / Materials Science. Fellowships
                available through UGC-NET / CSIR-NET / KSET.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon">🔬</div>
              <h3>Post-Doctoral Fellows</h3>
              <p>
                Openings for post-doctoral researchers in energy materials and
                environmental chemistry. Send your CV with a research proposal.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon">📚</div>
              <h3>M.Sc. Projects</h3>
              <p>
                Final year M.Sc. students interested in doing their dissertation
                in materials chemistry are welcome to apply.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section" id="contact">
          <div className="section-header">
            <h2 className="section-title">Contact</h2>
            <p className="section-subtitle">
              Get in touch for research collaborations and inquiries
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-card" id="contact-email">
              <div className="contact-icon">📧</div>
              <div className="contact-details">
                <h4>Email</h4>
                <a href="mailto:sunajadevi.kr@christuniversity.in">
                  sunajadevi.kr@christuniversity.in
                </a>
              </div>
            </div>
            <div className="contact-card" id="contact-office">
              <div className="contact-icon">🏢</div>
              <div className="contact-details">
                <h4>Office</h4>
                <p>
                  Department of Chemistry
                  <br />
                  Christ (Deemed to be University)
                  <br />
                  Hosur Road, Bangalore - 560029
                </p>
              </div>
            </div>
            <div className="contact-card" id="contact-phone">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Phone</h4>
                <p>+91-80-4012 9100 (University)</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer" id="site-footer">
          <p>
            © {new Date().getFullYear()} Prof. Sunaja Devi K R | Department of
            Chemistry, Christ University
          </p>
          <p>
            <a
              href="https://christuniversity.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              Christ (Deemed to be University)
            </a>
          </p>
        </footer>
      </main>
    </>
  );
}
