import Image from "next/image";
import Link from "next/link";
import scholarStats from "@/data/scholarStats.json";
import rawPublicationsDb from "@/data/publicationsDb.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata = {
  title: "Sunaja Devi K R - Google Scholar Profile & Publications",
  description:
    "Academic publications, text abstracts, graphical abstracts, and citation metrics for Prof. Sunaja Devi K R, Christ University",
};

const interests = [
  "Materials Chemistry",
  "Metal-Organic Frameworks",
  "Nanomaterials",
  "Energy Storage",
  "Catalysis",
  "Environmental Remediation",
  "Green Chemistry",
];

export default function ScholarPage() {
  return (
    <div
      style={{ background: "#f8fafc", minHeight: "100vh" }}
      id="scholar-page-container"
    >
      {/* Scholar-style top bar */}
      <div
        style={{
          background: "#4285f4",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "0.88rem",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255,255,255,0.15)",
              padding: "6px 14px",
              borderRadius: "20px",
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
              fontSize: "1.2rem",
              fontWeight: 600,
              fontFamily: "'Inter', Arial, sans-serif",
            }}
          >
            Google Scholar Profile &amp; Publications
          </span>
        </div>
        <div></div>
      </div>

      <div className="scholar-page" style={{ maxWidth: "1050px", margin: "30px auto", padding: "0 20px" }}>
        {/* Profile Header Card */}
        <div className="scholar-header" id="scholar-profile-header" style={{ background: "#fff", padding: "28px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", display: "flex", gap: "24px", alignItems: "flex-start" }}>
          <Image
            src={`${basePath}/images/sunaja_devi.png`}
            alt="Sunaja Devi K R"
            width={110}
            height={110}
            className="scholar-avatar"
            id="scholar-avatar"
            style={{ borderRadius: "50%", border: "3px solid #e2e8f0", objectFit: "cover" }}
          />
          <div className="scholar-info" style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.75rem", color: "#0f172a", marginBottom: "6px" }}>Prof. Sunaja Devi K R</h1>
            <p className="scholar-affiliation" style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "8px" }}>
              Head &amp; Professor, Department of Chemistry, Christ (Deemed to be University), Bangalore
            </p>
            <p style={{ fontSize: "0.88rem", color: "#64748b", marginBottom: "12px" }}>
              Verified email at christuniversity.in &bull;{" "}
              <a
                href="https://scholar.google.com/citations?user=HmOcEpIAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                id="official-scholar-link"
              >
                Google Scholar Profile ↗
              </a>
              {" "}&bull;{" "}
              <a
                href="https://www.sciencedirect.com/author/55450509500/kalathiparambil-rajendra-pai-sunajadevi"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                id="official-scopus-link"
              >
                Scopus Profile ↗
              </a>
            </p>
            <div className="scholar-interests" style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="scholar-interest-tag"
                  id={`interest-${idx}`}
                  style={{ background: "#eff6ff", color: "#1d4ed8", padding: "4px 10px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 500 }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Citation Stats */}
        <div style={{ background: "#fff", padding: "20px 28px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginTop: "20px" }}>
          <h3 style={{ fontSize: "1.1rem", color: "#0f172a", marginBottom: "16px" }}>Citation Metrics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>Citations</span>
              <strong style={{ fontSize: "1.4rem", color: "#2563eb" }}>{scholarStats.citations}</strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>h-index</span>
              <strong style={{ fontSize: "1.4rem", color: "#2563eb" }}>{scholarStats.hIndex}</strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>i10-index</span>
              <strong style={{ fontSize: "1.4rem", color: "#2563eb" }}>{scholarStats.i10Index}</strong>
            </div>
            <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "12px", textAlign: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", display: "block" }}>Total Articles</span>
              <strong style={{ fontSize: "1.4rem", color: "#2563eb" }}>{rawPublicationsDb.length}</strong>
            </div>
          </div>
        </div>

        {/* Articles List with Text Abstracts & Graphical Abstracts */}
        <div style={{ marginTop: "28px" }} id="scholar-articles-section">
          <h2 style={{ fontSize: "1.35rem", color: "#0f172a", marginBottom: "18px" }}>
            Publications ({rawPublicationsDb.length} Articles with Full Abstracts)
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {rawPublicationsDb.map((article, idx) => {
              const graphicalUrl = article.graphical_abstract_url || article.graphicalAbstract;
              const fullGraphicalUrl = graphicalUrl ? (graphicalUrl.startsWith("http") ? graphicalUrl : `${basePath}${graphicalUrl}`) : "";

              return (
                <div
                  key={article.id || idx}
                  id={`scholar-article-${idx}`}
                  style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  {/* Article Title & DOI */}
                  <h3 style={{ fontSize: "1.15rem", color: "#0f172a", marginBottom: "8px", lineHeight: "1.4" }}>
                    <a
                      href={article.link || (article.doi ? `https://doi.org/${article.doi}` : "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#1e40af", textDecoration: "none" }}
                    >
                      {article.title} ↗
                    </a>
                  </h3>

                  {/* Authors & Journal Info */}
                  <p style={{ fontSize: "0.9rem", color: "#334155", marginBottom: "4px", fontWeight: 500 }}>
                    {article.authors}
                  </p>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "12px" }}>
                    <em>{article.journal}</em> {article.year && <strong>({article.year})</strong>}
                    {article.citations !== undefined && (
                      <span style={{ marginLeft: "12px", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "8px", fontSize: "0.8rem" }}>
                        Cited by {article.citations}
                      </span>
                    )}
                  </p>

                  {/* Text Abstract Section */}
                  {article.abstract && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "14px 16px",
                        background: "#f8fafc",
                        borderRadius: "10px",
                        borderLeft: "4px solid #2563eb",
                        fontSize: "0.88rem",
                        color: "#334155",
                        lineHeight: "1.55",
                      }}
                    >
                      <strong style={{ color: "#1e293b", display: "block", marginBottom: "4px", fontSize: "0.9rem" }}>
                        📖 Scientific Abstract:
                      </strong>
                      {article.abstract}
                    </div>
                  )}

                  {/* Graphical Abstract Display */}
                  {fullGraphicalUrl && (
                    <div style={{ marginTop: "16px" }}>
                      <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                        📊 Graphical Abstract:
                      </span>
                      <div style={{ background: "#0f172a", borderRadius: "12px", padding: "8px", display: "inline-block", maxWidth: "100%" }}>
                        <Image
                          src={fullGraphicalUrl}
                          alt={`Graphical Abstract - ${article.title}`}
                          width={480}
                          height={260}
                          style={{ width: "100%", height: "auto", maxHeight: "280px", objectFit: "contain", borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
                    <a
                      href={article.link || (article.doi ? `https://doi.org/${article.doi}` : "#")}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "#2563eb",
                        color: "#fff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      <span>Read Full Paper / DOI</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
