import Sidebar from "@/components/Sidebar";
import CongratulatoryPopup from "@/components/CongratulatoryPopup";
import Image from "next/image";
import Link from "next/link";
import scholarStats from "@/data/scholarStats.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const researchAreas = [
  {
    icon: "⚡",
    title: "Energy Storage & Conversion",
    description:
      "Designing advanced electrode materials for batteries and supercapacitors. Developing electrocatalysts for hydrogen production via water splitting (HER/OER).",
  },
  {
    icon: "🔬",
    title: "Metal-Organic Frameworks (MOFs)",
    description:
      "Synthesis and characterization of MOFs and MOF composites for catalysis, adsorption, and energy applications.",
  },
  {
    icon: "🧪",
    title: "Nanomaterials & MXenes",
    description:
      "Research on nanocomposites, MXene-based materials, and hybrid structures for functional applications in energy and environment.",
  },
  {
    icon: "🌿",
    title: "Environmental Remediation",
    description:
      "Developing methods for pollutant removal from water bodies through adsorptive and degradative processes using advanced materials.",
  },
  {
    icon: "🔥",
    title: "Green Chemistry & Catalysis",
    description:
      "Exploring sustainable catalytic processes, chemical kinetics, and green synthesis methodologies for industrial applications.",
  },
  {
    icon: "📊",
    title: "Photocatalysis",
    description:
      "Design and development of photocatalysts for degradation of organic pollutants and solar energy harvesting applications.",
  },
];

const latestPublications = [
  {
    year: "2026",
    title:
      "ZIF-8/LDH Nanohybrids for Dye Adsorption: LDH Composition-Dependent Structure and Adsorption Performance",
    authors: "Pushparaj Loganathan, Cheriyan John, Sunaja Devi K R et al.",
    journal: "ACS Appl. Nano Mater. (2026) 9 (28): 13490–13507",
  },
  {
    year: "2026",
    title:
      "Keggin-Type H₅PMo₁₀V₂O₄₀ Intercalated MgAl-LDH: Structural Integrity and Bifunctional Electrocatalytic Activity",
    authors: "Sunaja Devi K R et al.",
    journal: "Journal of Materials Chemistry A",
  },
  {
    year: "2026",
    title:
      "Dual Purpose Behavior of Ni-PTC MOF for High Performance Supercapacitor and Water Splitting Applications",
    authors: "Sunaja Devi K R et al.",
    journal: "ACS Applied Energy Materials",
  },
  {
    year: "2026",
    title:
      "Amine-Functionalized MIL-101(Fe)-NH₂@ZIF-8 Composite for Efficient Adsorption of Pb²⁺ Ions from Aqueous Solution",
    authors: "Sunaja Devi K R et al.",
    journal: "Journal of Hazardous Materials",
  },
  {
    year: "2024",
    title:
      "Strategic Design of MXene/CoFe₂O₄/g-C₃N₄ Electrode for High-Energy Asymmetric Supercapacitors",
    authors: "Sunaja Devi K R et al.",
    journal: "Electrochimica Acta",
  },
  {
    year: "2024",
    title:
      "Optimizing Malachite Green Adsorption with Co-PTC Metal Organic Framework: Insights into Mechanisms and Performance",
    authors: "Sunaja Devi K R et al.",
    journal: "Journal of Environmental Chemical Engineering",
  },
  {
    year: "2024",
    title:
      "Synergistic Effect of NiFe₂O₄/g-C₃N₄ Nanocomposite for Enhanced Photocatalytic Degradation of Methylene Blue",
    authors: "Sunaja Devi K R et al.",
    journal: "Chemical Engineering Journal",
  },
];

const selectedPublications = [
  {
    year: "2023",
    title:
      "Cobalt-Based Metal-Organic Framework as Bifunctional Electrocatalyst for Overall Water Splitting",
    authors: "Sunaja Devi K R et al.",
    journal: "ACS Applied Materials & Interfaces",
  },
  {
    year: "2022",
    title:
      "Polyoxometalate-Based Metal-Organic Frameworks for Heterogeneous Catalysis: A Review",
    authors: "Sunaja Devi K R et al.",
    journal: "Coordination Chemistry Reviews",
  },
  {
    year: "2022",
    title:
      "Hierarchical ZnO/CdS Heterostructure for Visible-Light Driven Photocatalytic Hydrogen Evolution",
    authors: "Sunaja Devi K R et al.",
    journal: "Applied Catalysis B: Environmental",
  },
  {
    year: "2021",
    title:
      "Recent Advances in Metal-Organic Frameworks for Energy Storage Applications",
    authors: "Sunaja Devi K R et al.",
    journal: "Energy & Environmental Science",
  },
  {
    year: "2021",
    title:
      "ZIF-67 Derived Co₃O₄/N-Doped Carbon Composite as Efficient Oxygen Evolution Electrocatalyst",
    authors: "Sunaja Devi K R et al.",
    journal: "International Journal of Hydrogen Energy",
  },
];

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
            <div className="research-grid">
              {researchAreas.map((area, idx) => (
                <div className="research-card" key={idx} id={`research-card-${idx}`}>
                  <div className="research-card-icon">{area.icon}</div>
                  <h3>{area.title}</h3>
                  <p>{area.description}</p>
                </div>
              ))}
            </div>
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
          <div className="pub-subsection" id="selected-publications" style={{ marginBottom: "40px" }}>
            <div className="pub-subsection-header">
              <h3 className="pub-subsection-title">
                <span className="pub-subsection-icon">⭐</span>
                Selected Publications
              </h3>
            </div>
            <div className="publications-list">
              {selectedPublications.map((pub, idx) => (
                <div className="publication-card" key={idx} id={`selected-pub-card-${idx}`}>
                  <div className="pub-year">{pub.year}</div>
                  <div className="pub-content">
                    <h4>{pub.title}</h4>
                    <p className="pub-authors">{pub.authors}</p>
                    <p className="pub-journal">{pub.journal}</p>
                  </div>
                </div>
              ))}
            </div>
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
                  <div className="pub-year">{pub.year}</div>
                  <div className="pub-content">
                    <h4>{pub.title}</h4>
                    <p className="pub-authors">{pub.authors}</p>
                    <p className="pub-journal">{pub.journal}</p>
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
              <div className="research-card-icon">🇮🇳</div>
              <h3>IISc Bangalore</h3>
              <p>
                Collaborative research on advanced nanomaterials for energy
                applications with the Materials Research Centre.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon">🇮🇳</div>
              <h3>IIT Madras</h3>
              <p>
                Joint projects on MOF-based composites for environmental
                remediation and catalysis.
              </p>
            </div>
            <div className="research-card">
              <div className="research-card-icon">🇮🇳</div>
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
