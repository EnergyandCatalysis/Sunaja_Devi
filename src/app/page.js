import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import Link from "next/link";

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

const publications = [
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

function getInitials(name) {
  const words = name.replace(/^Dr\.\s*/i, "").split(" ").filter(Boolean);
  return ((words[0]?.[0] || "") + (words[words.length - 1]?.[0] || "")).toUpperCase();
}

const groupCategories = [
  {
    category: "Post-Doctoral Researcher",
    members: ["Dr. Pushparaj Loganathan"],
  },
  {
    category: "PhD Scholars",
    members: ["Cheriyan John"],
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
                src={`${basePath}/images/professor.png`}
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
                Professor of Chemistry & PhD Coordinator
              </p>
              <p className="university">
                Christ (Deemed to be University), Bangalore
              </p>
              <div className="hero-links">
                <Link href="/scholar" className="hero-btn primary" id="scholar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                  </svg>
                  Google Scholar
                </Link>
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
            <a href="#publications" className="top-nav-link">
              Publications
            </a>
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
              <span className="stat-number">90+</span>
              <span className="stat-label">Publications</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2000+</span>
              <span className="stat-label">Citations</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">6+</span>
              <span className="stat-label">Patents</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">PhD Scholars</span>
            </div>
          </div>
        </section>

        {/* Research Section */}
        <section className="section" id="research">
          <div className="section-header">
            <h2 className="section-title">Research</h2>
            <p className="section-subtitle">
              Our research group focuses on materials chemistry for energy and
              environmental applications
            </p>
          </div>

          <div className="research-description">
            <p>
              We are interested in designing and developing advanced functional
              materials including metal-organic frameworks (MOFs), MXenes,
              nanocomposites, and layered double hydroxides (LDHs) for energy
              storage & conversion and environmental remediation. Our research
              spans the development of high-performance electrode materials for
              supercapacitors and batteries, efficient electrocatalysts for water
              splitting, and novel adsorbents for pollutant removal. We also
              explore green chemistry approaches and photocatalytic degradation
              of organic pollutants. The group combines experimental synthesis
              with advanced characterization techniques to understand
              structure-property relationships in these functional materials.
            </p>
          </div>

          <div className="research-gallery">
            <Image
              src={`${basePath}/images/research.png`}
              alt="Advanced MOFs and Nanocomposites Research"
              width={600}
              height={180}
              style={{ height: "180px", width: "auto" }}
              id="research-illustration"
            />
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
            <h2 className="section-title">Selected Publications</h2>
            <p className="section-subtitle">
              Over 90 publications in peer-reviewed international journals.{" "}
              <Link
                href="/scholar"
                style={{ color: "var(--accent)", textDecoration: "none" }}
              >
                View all on Google Scholar →
              </Link>
            </p>
          </div>

          <div className="publications-list">
            {publications.map((pub, idx) => (
              <div className="publication-card" key={idx} id={`pub-card-${idx}`}>
                <div className="pub-year">{pub.year}</div>
                <div className="pub-content">
                  <h4>{pub.title}</h4>
                  <p className="pub-authors">{pub.authors}</p>
                  <p className="pub-journal">{pub.journal}</p>
                </div>
              </div>
            ))}
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
                    <div className="member-avatar">{getInitials(name)}</div>
                    <h4>{name}</h4>
                    <p className="member-role">{group.category}</p>
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
