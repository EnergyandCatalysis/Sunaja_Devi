"use client";

import { useState } from "react";
import Image from "next/image";
import rawSelectedPublications from "@/data/selectedPublications.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Helper to sanitize title HTML (strips stray formatting whitespace)
function cleanHtmlTitle(titleStr) {
  if (!titleStr) return "";
  return titleStr
    .replace(/\s*\n\s*/g, " ")
    .replace(/\s*<sub>\s*/g, "<sub>")
    .replace(/\s*<\/sub>\s*/g, "</sub>")
    .trim();
}

// Helper to strip HTML tags for plain text copying
function stripHtmlTags(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function SelectedPublications() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedAbstracts, setExpandedAbstracts] = useState({});
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    "All",
    "Electrocatalysis & Water Splitting",
    "CO₂ Fixation & Green Catalysis",
    "Frustrated Lewis Pairs & Biomass Upcycling",
    "Environmental Remediation & Adsorption",
  ];

  const publications = rawSelectedPublications.map((pub) => ({
    ...pub,
    graphicalAbstract: pub.graphicalAbstract ? `${basePath}${pub.graphicalAbstract}` : "",
  }));

  const filteredPubs =
    selectedCategory === "All"
      ? publications
      : publications.filter((pub) => pub.category === selectedCategory);

  const toggleAbstract = (id) => {
    setExpandedAbstracts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyCitation = (pub) => {
    const plainTitle = stripHtmlTags(pub.title);
    const volStr = pub.volume ? `, vol. ${pub.volume}` : "";
    const issueStr = pub.issue ? `, no. ${pub.issue}` : "";
    const pageStr = pub.pages ? `, pp. ${pub.pages}` : "";
    const citation = `${pub.authors}. "${plainTitle}." ${pub.journal}${volStr}${issueStr}, ${pub.year}${pageStr}. https://doi.org/${pub.doi}`;
    navigator.clipboard.writeText(citation);
    setCopiedId(pub.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="pub-subsection selected-pub-container" id="selected-publications">
      <div className="pub-subsection-header">
        <div className="pub-header-top">
          <h3 className="pub-subsection-title">
            <span className="pub-subsection-icon">⭐</span>
            Featured & Selected Publications
          </h3>
          <span className="pub-count-badge">{publications.length} High-Impact Articles</span>
        </div>
        <p className="pub-section-desc">
          Highlighting key breakthroughs in electrocatalytic water splitting, carbon dioxide capture & utilization, frustrated Lewis pair catalysis, and nanostructured water purification.
        </p>

        {/* Category Filter Pills */}
        <div className="pub-category-pills">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="selected-pub-grid">
        {filteredPubs.map((pub) => {
          const isExpanded = expandedAbstracts[pub.id];
          const isCopied = copiedId === pub.id;
          const cleanedTitle = cleanHtmlTitle(pub.title);

          return (
            <div className="selected-pub-card" key={pub.id || pub.doi} id={pub.id}>
              {/* Card Header & Badges */}
              <div className="pub-card-top">
                <div className="pub-meta-badges">
                  <span className="journal-badge">{pub.journal}</span>
                  <span className="year-badge">{pub.year}</span>
                  {pub.publisher && <span className="publisher-badge">{pub.publisher}</span>}
                </div>
                {pub.highlightMetric && (
                  <div className="metric-chip">
                    <span className="metric-icon">✨</span>
                    <span>{pub.highlightMetric}</span>
                  </div>
                )}
              </div>

              {/* Title with HTML subscript support */}
              <h4
                className="selected-pub-title"
                dangerouslySetInnerHTML={{ __html: cleanedTitle }}
              />

              {/* Authors */}
              <p className="selected-pub-authors">
                {pub.authors.split(/(Sunaja Devi K R\*?|Kalathiparambil Rajendra Pai Sunajadevi\*?)/g).map((part, i) =>
                  part.includes("Sunaja") ? (
                    <strong key={i} className="author-highlight">
                      {part}
                    </strong>
                  ) : (
                    part
                  )
                )}
              </p>

              {/* Bibliographic Info */}
              <div className="pub-citation-line">
                <span>
                  <em>{pub.journal}</em>, <strong>{pub.year}</strong>
                  {pub.volume && <>, Vol. {pub.volume}</>}
                  {pub.issue && <> ({pub.issue})</>}
                  {pub.pages && <>, pp. {pub.pages}</>}
                </span>
              </div>

              {/* Key Findings Bullet List */}
              {pub.keyFindings && pub.keyFindings.length > 0 && (
                <div className="pub-highlights-box">
                  <span className="highlights-title">💡 Key Breakthroughs & Findings</span>
                  <ul className="highlights-list">
                    {pub.keyFindings.map((finding, idx) => (
                      <li key={idx}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Graphical Abstract & Abstract Section */}
              <div className="pub-body-layout">
                {pub.graphicalAbstract && (
                  <div
                    className="selected-abstract-preview"
                    onClick={() => setActiveModalImage({ src: pub.graphicalAbstract, title: cleanedTitle })}
                    title="Click to view high-resolution Graphical Abstract"
                  >
                    <Image
                      src={pub.graphicalAbstract}
                      alt={`Graphical Abstract - ${stripHtmlTags(pub.title)}`}
                      width={240}
                      height={150}
                      className="abstract-img"
                    />
                    <div className="abstract-overlay-hint">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        <line x1="11" y1="8" x2="11" y2="14" />
                        <line x1="8" y1="11" x2="14" y2="11" />
                      </svg>
                      <span>Enlarge View</span>
                    </div>
                  </div>
                )}

                {pub.abstract && (
                  <div className="pub-abstract-text-area">
                    <div className={`abstract-content ${isExpanded ? "expanded" : "collapsed"}`}>
                      <p>
                        <strong>Abstract: </strong>
                        {pub.abstract}
                      </p>
                    </div>

                    <button
                      className="toggle-abstract-btn"
                      onClick={() => toggleAbstract(pub.id)}
                    >
                      {isExpanded ? "Show Less ▲" : "Read Full Abstract ▼"}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="pub-card-actions">
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-action-btn primary"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  DOI: {pub.doi} ↗
                </a>

                <button
                  onClick={() => copyCitation(pub)}
                  className={`pub-action-btn secondary ${isCopied ? "copied" : ""}`}
                >
                  {isCopied ? (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Citation Copied!
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy Citation
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal for Graphical Abstracts */}
      {activeModalImage && (
        <div className="abstract-modal-backdrop" onClick={() => setActiveModalImage(null)}>
          <div className="abstract-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModalImage(null)}>
              ✕
            </button>
            <h4
              className="modal-title"
              dangerouslySetInnerHTML={{ __html: activeModalImage.title }}
            />
            <div className="modal-image-wrapper">
              <Image
                src={activeModalImage.src}
                alt="Graphical Abstract"
                width={800}
                height={500}
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />
            </div>
            <p className="modal-caption">Graphical Abstract High-Resolution View</p>
          </div>
        </div>
      )}
    </div>
  );
}
