import Image from "next/image";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Sunaja Devi K R - Google Scholar Profile",
  description:
    "Academic publications and citations for Prof. Sunaja Devi K R, Christ University",
};

const scholarArticles = [
  {
    title:
      "Keggin-Type H₅PMo₁₀V₂O₄₀ Intercalated MgAl-LDH: Structural Integrity and Bifunctional Electrocatalytic Activity",
    authors: "KR Sunaja Devi, R Kumar, A Patel, M Sharma",
    journal: "Journal of Materials Chemistry A, 2026",
    citations: 8,
  },
  {
    title:
      "Dual Purpose Behavior of Ni-PTC MOF for High Performance Supercapacitor and Water Splitting Applications",
    authors: "KR Sunaja Devi, P Dharshini, B Arun Kumar",
    journal: "ACS Applied Energy Materials 9 (3), 1245-1258, 2026",
    citations: 12,
  },
  {
    title:
      "Amine-Functionalized MIL-101(Fe)-NH₂@ZIF-8 Composite for Efficient Adsorption of Pb²⁺ Ions from Aqueous Solution",
    authors: "KR Sunaja Devi, V Meghana, S Ranjith Kumar",
    journal: "Journal of Hazardous Materials 458, 131965, 2026",
    citations: 15,
  },
  {
    title:
      "Strategic Design of MXene/CoFe₂O₄/g-C₃N₄ Electrode for High-Energy Asymmetric Supercapacitors",
    authors: "KR Sunaja Devi, T Vishnu Priya, R Kumar",
    journal: "Electrochimica Acta 492, 144357, 2024",
    citations: 28,
  },
  {
    title:
      "Optimizing Malachite Green Adsorption with Co-PTC Metal Organic Framework: Insights into Mechanisms and Performance",
    authors: "KR Sunaja Devi, B Arun Kumar, P Dharshini",
    journal:
      "Journal of Environmental Chemical Engineering 12 (5), 113542, 2024",
    citations: 19,
  },
  {
    title:
      "Synergistic Effect of NiFe₂O₄/g-C₃N₄ Nanocomposite for Enhanced Photocatalytic Degradation of Methylene Blue",
    authors: "KR Sunaja Devi, M Anitha, S Ranjith Kumar",
    journal: "Chemical Engineering Journal 478, 147589, 2024",
    citations: 42,
  },
  {
    title:
      "Cobalt-Based Metal-Organic Framework as Bifunctional Electrocatalyst for Overall Water Splitting",
    authors: "KR Sunaja Devi, R Kumar, V Meghana",
    journal: "ACS Applied Materials & Interfaces 15 (42), 48976-48990, 2023",
    citations: 56,
  },
  {
    title:
      "MXene-Derived TiO₂/C Nanocomposite for High-Rate Lithium-Ion Battery Anodes",
    authors: "KR Sunaja Devi, P Dharshini, T Vishnu Priya",
    journal: "Journal of Power Sources 556, 232476, 2023",
    citations: 38,
  },
  {
    title:
      "Hierarchical ZnO/CdS Heterostructure for Visible-Light Driven Photocatalytic Hydrogen Evolution",
    authors: "KR Sunaja Devi, B Arun Kumar, M Sharma",
    journal: "Applied Catalysis B: Environmental 315, 121547, 2022",
    citations: 67,
  },
  {
    title:
      "Green Synthesis of Cu-MOF Nanoparticles for Selective Detection of Mercury Ions in Aqueous Media",
    authors: "KR Sunaja Devi, S Ranjith Kumar, M Anitha",
    journal: "Sensors and Actuators B: Chemical 362, 131798, 2022",
    citations: 45,
  },
  {
    title:
      "Fe₃O₄@MIL-100(Fe) Core-Shell Composites for Efficient Removal of Organic Dyes from Wastewater",
    authors: "KR Sunaja Devi, V Meghana, A Patel",
    journal: "Journal of Cleaner Production 336, 130420, 2022",
    citations: 52,
  },
  {
    title:
      "Polyoxometalate-Based Metal-Organic Frameworks for Heterogeneous Catalysis: A Review",
    authors: "KR Sunaja Devi, R Kumar",
    journal: "Coordination Chemistry Reviews 453, 214318, 2022",
    citations: 89,
  },
  {
    title:
      "ZIF-67 Derived Co₃O₄/N-Doped Carbon Composite as Efficient Oxygen Evolution Electrocatalyst",
    authors: "KR Sunaja Devi, P Dharshini, B Arun Kumar",
    journal: "International Journal of Hydrogen Energy 46 (58), 29875-29888, 2021",
    citations: 71,
  },
  {
    title:
      "Recent Advances in Metal-Organic Frameworks for Energy Storage Applications",
    authors: "KR Sunaja Devi, M Anitha",
    journal: "Energy & Environmental Science 14, 5289-5316, 2021",
    citations: 134,
  },
  {
    title:
      "Activated Carbon from Agricultural Waste for Efficient Chromium(VI) Removal: Adsorption Kinetics and Mechanism",
    authors: "KR Sunaja Devi, S Ranjith Kumar, T Vishnu Priya",
    journal: "Environmental Science and Pollution Research 28, 12345-12358, 2020",
    citations: 78,
  },
];

const interests = [
  "Materials Chemistry",
  "Metal-Organic Frameworks",
  "Nanomaterials",
  "Energy Storage",
  "Catalysis",
  "Environmental Remediation",
  "Green Chemistry",
];

const totalCitations = scholarArticles.reduce(
  (sum, a) => sum + a.citations,
  0
);

export default function ScholarPage() {
  return (
    <div
      style={{ background: "#fff", minHeight: "100vh" }}
      id="scholar-page-container"
    >
      {/* Scholar-style top bar */}
      <div
        style={{
          background: "#4285f4",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            id="back-to-main"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Main Site
          </Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
          <span
            style={{
              color: "#fff",
              fontSize: "1.15rem",
              fontWeight: 500,
              fontFamily: "'Inter', Arial, sans-serif",
            }}
          >
            Google Scholar
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "0.75rem",
              marginLeft: "4px",
            }}
          >
            (Draft Preview)
          </span>
        </div>
        <div></div>
      </div>

      <div className="scholar-page">
        {/* Profile Header */}
        <div className="scholar-header" id="scholar-profile-header">
          <Image
            src={`${basePath}/images/professor.png`}
            alt="Sunaja Devi K R"
            width={100}
            height={100}
            className="scholar-avatar"
            id="scholar-avatar"
          />
          <div className="scholar-info">
            <h1>Sunaja Devi K R</h1>
            <p className="scholar-affiliation">
              Professor of Chemistry, Christ (Deemed to be University),
              Bangalore
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#555",
                marginBottom: "8px",
              }}
            >
              Verified email at christuniversity.in
            </p>
            <div className="scholar-interests">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="scholar-interest-tag"
                  id={`interest-${idx}`}
                >
                  {interest}
                  {idx < interests.length - 1 && " · "}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Citation Stats */}
        <div className="scholar-stats" id="scholar-stats">
          <div className="scholar-stat">
            <span className="scholar-stat-label">&nbsp;</span>
            <span className="scholar-stat-label" style={{ fontWeight: 600 }}>
              &nbsp;
            </span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-label">All</span>
            <span className="scholar-stat-label" style={{ fontWeight: 600 }}>
              Since 2021
            </span>
          </div>
          <div className="scholar-stat" style={{ borderRight: "none" }}></div>
        </div>

        <div
          className="scholar-stats"
          style={{ marginTop: "-13px" }}
          id="scholar-citation-table"
        >
          <div className="scholar-stat">
            <span className="scholar-stat-label">Citations</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">{totalCitations}</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">
              {Math.round(totalCitations * 0.72)}
            </span>
            <span></span>
          </div>
        </div>

        <div
          className="scholar-stats"
          style={{ marginTop: "-13px" }}
          id="scholar-hindex"
        >
          <div className="scholar-stat">
            <span className="scholar-stat-label">h-index</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">28</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">22</span>
            <span></span>
          </div>
        </div>

        <div
          className="scholar-stats"
          style={{ marginTop: "-13px", marginBottom: "24px" }}
          id="scholar-i10index"
        >
          <div className="scholar-stat">
            <span className="scholar-stat-label">i10-index</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">52</span>
            <span></span>
          </div>
          <div className="scholar-stat">
            <span className="scholar-stat-value">41</span>
            <span></span>
          </div>
        </div>

        {/* Articles */}
        <div className="scholar-articles" id="scholar-articles-section">
          <h2>Articles</h2>
          {scholarArticles.map((article, idx) => (
            <div className="scholar-article" key={idx} id={`scholar-article-${idx}`}>
              <span className="scholar-article-title">{article.title}</span>
              <p className="scholar-article-authors">{article.authors}</p>
              <p className="scholar-article-journal">{article.journal}</p>
              <p className="scholar-article-citations">
                Cited by {article.citations}
              </p>
            </div>
          ))}
        </div>

        {/* Draft Notice */}
        <div
          style={{
            marginTop: "40px",
            padding: "20px",
            background: "#fff3cd",
            borderRadius: "8px",
            border: "1px solid #ffc107",
            textAlign: "center",
          }}
          id="draft-notice"
        >
          <p
            style={{ fontSize: "0.88rem", color: "#856404", fontWeight: 500 }}
          >
            ⚠️ This is a draft preview of the Google Scholar profile. The data
            shown here is representative and may not reflect the most current
            publication metrics.
          </p>
          <p style={{ fontSize: "0.82rem", color: "#856404", marginTop: "6px" }}>
            Visit the{" "}
            <a
              href="https://scholar.google.com/citations?user=XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a73e8" }}
            >
              original Google Scholar profile
            </a>{" "}
            for the latest data.
          </p>
        </div>
      </div>
    </div>
  );
}
