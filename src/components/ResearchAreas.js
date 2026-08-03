"use client";

const researchAreas = [
  {
    id: "energy-storage",
    title: "Energy Storage & Conversion",
    description:
      "Designing advanced electrode materials for batteries and supercapacitors. Developing electrocatalysts for hydrogen production via water splitting (HER/OER).",
    tag: "HER / OER Water Splitting & Supercapacitors",
    colorClass: "area-cyan",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="14" height="12" rx="2.5" />
        <path d="M16 10h1.5a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5H16" />
        <path d="M9.5 8.5L7 12h4l-1 3.5 4-4.5h-4l1-2.5z" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
  },
  {
    id: "mofs",
    title: "Metal-Organic Frameworks (MOFs)",
    description:
      "Synthesis and characterization of MOFs and MOF composites for catalysis, adsorption, and energy applications.",
    tag: "Porous Crystalline Coordination Frameworks",
    colorClass: "area-violet",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 20 7 20 17 12 22 4 17 4 7 12 2" />
        <line x1="12" y1="2" x2="12" y2="12" />
        <line x1="12" y1="12" x2="20" y2="17" />
        <line x1="12" y1="12" x2="4" y2="17" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" fillOpacity="0.2" />
        <circle cx="12" cy="2" r="1.5" />
        <circle cx="20" cy="7" r="1.5" />
        <circle cx="20" cy="17" r="1.5" />
        <circle cx="12" cy="22" r="1.5" />
        <circle cx="4" cy="17" r="1.5" />
        <circle cx="4" cy="7" r="1.5" />
      </svg>
    ),
  },
  {
    id: "nanomaterials-mxenes",
    title: "Nanomaterials & MXenes",
    description:
      "Research on nanocomposites, MXene-based materials, and hybrid structures for functional applications in energy and environment.",
    tag: "2D Transition Metal Carbides & Nitrides",
    colorClass: "area-emerald",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6h20M2 12h20M2 18h20" strokeDasharray="2 2" />
        <path d="M3 5l9-3 9 3-9 3-9-3z" />
        <path d="M3 11l9-3 9 3-9 3-9-3z" />
        <path d="M3 17l9-3 9 3-9 3-9-3z" fill="currentColor" fillOpacity="0.15" />
        <circle cx="8" cy="14" r="1.2" fill="currentColor" />
        <circle cx="16" cy="14" r="1.2" fill="currentColor" />
        <circle cx="12" cy="8" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "environmental-remediation",
    title: "Environmental Remediation",
    description:
      "Developing methods for pollutant removal from water bodies through adsorptive and degradative processes using advanced materials.",
    tag: "Wastewater Treatment & Heavy Metal Removal",
    colorClass: "area-teal",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5C12 2.5 5 10 5 14.5A7 7 0 0 0 19 14.5C19 10 12 2.5 12 2.5Z" fill="currentColor" fillOpacity="0.15" />
        <path d="M12 8v5" />
        <path d="M10 15.5c1 1 3 1 4 0" />
        <path d="M3 21c3-1 6 1 9 0s6-1 9 0" />
      </svg>
    ),
  },
  {
    id: "green-chemistry",
    title: "Green Chemistry & Catalysis",
    description:
      "Exploring sustainable catalytic processes, chemical kinetics, and green synthesis methodologies for industrial applications.",
    tag: "Sustainable Synthesis & CO₂ Utilization",
    colorClass: "area-amber",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2v5L4.5 16.5A3 3 0 0 0 7 21h10a3 3 0 0 0 2.5-4.5L14 7V2h-4z" />
        <line x1="9" y1="2" x2="15" y2="2" />
        <path d="M12 11c1.5-2 3.5-2 4 0s-1 3.5-4 4c0-1.5 0-3 0-4z" fill="currentColor" fillOpacity="0.25" />
      </svg>
    ),
  },
  {
    id: "photocatalysis",
    title: "Photocatalysis",
    description:
      "Design and development of photocatalysts for degradation of organic pollutants and solar energy harvesting applications.",
    tag: "Solar Energy Harvesting & Degradation",
    colorClass: "area-orange",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
        <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" />
        <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" />
        <line x1="4.93" y1="19.07" x2="7.05" y2="16.95" />
        <line x1="16.95" y1="7.05" x2="19.07" y2="4.93" />
      </svg>
    ),
  },
];

export default function ResearchAreas() {
  return (
    <div className="research-grid">
      {researchAreas.map((area) => (
        <div className={`research-card ${area.colorClass}`} key={area.id} id={area.id}>
          <div className="research-card-header">
            <div className="research-card-icon">{area.icon}</div>
            <span className="research-focus-tag">{area.tag}</span>
          </div>
          <h3>{area.title}</h3>
          <p>{area.description}</p>
        </div>
      ))}
    </div>
  );
}
