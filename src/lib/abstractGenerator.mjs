import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ABSTRACTS_DIR = path.join(__dirname, '..', '..', 'public', 'images', 'graphical_abstracts');

function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function truncateText(str, maxLen = 90) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

function extractThreeStepSummary(title, abstract = '') {
  const combined = (title + ' ' + abstract).toLowerCase();

  // 1. Methodology Extraction
  let methodology = 'Advanced Nanomaterial Synthesis & Characterization';
  if (combined.includes('zif') || combined.includes('mof')) {
    methodology = 'MOF Hydrothermal & Heterojunction Assembly';
  } else if (combined.includes('max phase') || combined.includes('mxene')) {
    methodology = 'Etching & Intercalation of MAX Phase / MXene';
  } else if (combined.includes('ldh') || combined.includes('layered double')) {
    methodology = 'Layered Double Hydroxide Coprecipitation';
  } else if (combined.includes('thin film') || combined.includes('electrodeposition')) {
    methodology = 'In-situ Thin Film Deposition & Surface Engineering';
  } else if (combined.includes('photocatalyst') || combined.includes('z-scheme')) {
    methodology = 'Z-Scheme Heterojunction Construction';
  } else if (combined.includes('pdnps') || combined.includes('qds') || combined.includes('quantum dots')) {
    methodology = 'Quantum Dot Functionalization & Metallic Nanoparticle Anchoring';
  }

  // 2. Key Finding Extraction
  let keyFinding = 'Enhanced Charge Transfer & Superior Catalytic Efficiency';
  if (combined.includes('water splitting') || combined.includes('hydrogen evolution') || combined.includes('her')) {
    keyFinding = 'Low Overpotential for Efficient Electrocatalytic Water Splitting';
  } else if (combined.includes('supercapacitor') || combined.includes('energy storage')) {
    keyFinding = 'High Specific Capacitance & Long-Term Cycling Stability';
  } else if (combined.includes('adsorption') || combined.includes('dye') || combined.includes('wastewater')) {
    keyFinding = 'High Specific Surface Area & Rapid Pollutant Adsorption';
  } else if (combined.includes('co2') || combined.includes('oxidation')) {
    keyFinding = 'Oxygen Vacancies & Reactive Lewis Pair Active Sites';
  } else if (combined.includes('sers') || combined.includes('sensing')) {
    keyFinding = 'High SERS Hotspot Density & Sensitive Molecular Sensing';
  }

  // 3. Impact Extraction
  let impact = 'Clean Energy & Environmental Sustainability';
  if (combined.includes('hydrogen') || combined.includes('water splitting')) {
    impact = 'Zero-Emission Green Hydrogen Production Technology';
  } else if (combined.includes('supercapacitor')) {
    impact = 'Next-Generation Energy Storage Devices';
  } else if (combined.includes('adsorption') || combined.includes('remediation')) {
    impact = 'Sustainable Industrial Wastewater Purification';
  } else if (combined.includes('co2')) {
    impact = 'Carbon Capture & Value-Added Chemical Conversion';
  }

  return {
    methodology,
    keyFinding,
    impact,
  };
}

export function generateGraphicalAbstractSvg(paper) {
  const title = paper.title || 'Research Paper';
  const journal = paper.journal || 'Peer-Reviewed Journal';
  const year = paper.year || '2026';
  const authors = paper.authors || 'Sunaja Devi K R et al.';
  
  const { methodology, keyFinding, impact } = extractThreeStepSummary(title, paper.abstract);

  const cleanTitle = sanitizeText(truncateText(title, 110));
  const cleanJournal = sanitizeText(truncateText(journal, 60));
  const cleanAuthors = sanitizeText(truncateText(authors, 70));
  const cleanMethodology = sanitizeText(methodology);
  const cleanKeyFinding = sanitizeText(keyFinding);
  const cleanImpact = sanitizeText(impact);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f2b46" />
    </linearGradient>

    <!-- Card Gradients -->
    <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#065f46" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="cardGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#581c87" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#1e293b" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#fbbf24" />
    </linearGradient>

    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="700" fill="url(#bgGrad)" />

  <!-- Grid overlay lines -->
  <path d="M0 100 L1200 100 M0 200 L1200 200 M0 300 L1200 300 M0 400 L1200 400 M0 500 L1200 500 M0 600 L1200 600" stroke="#334155" stroke-width="1" stroke-dasharray="4 8" opacity="0.3" />

  <!-- Header Branding -->
  <rect x="50" y="40" width="1100" height="120" rx="16" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" filter="url(#glow)" opacity="0.95" />
  
  <!-- Header Title -->
  <text x="80" y="78" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="bold" fill="#f8fafc">
    ${cleanTitle}
  </text>

  <!-- Header Journal & Authors -->
  <text x="80" y="112" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" fill="#94a3b8">
    ${cleanJournal} (${year})  •  <tspan fill="#38bdf8">${cleanAuthors}</tspan>
  </text>
  
  <rect x="1000" y="65" width="120" height="32" rx="8" fill="url(#goldGrad)" />
  <text x="1060" y="86" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">
    GRAPHICAL
  </text>

  <!-- Flow Arrows between Cards -->
  <path d="M 390 380 L 440 380" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" marker-end="url(#arrow)" />
  <polygon points="435,372 450,380 435,388" fill="#38bdf8" />

  <path d="M 760 380 L 810 380" stroke="#34d399" stroke-width="4" stroke-linecap="round" />
  <polygon points="805,372 820,380 805,388" fill="#34d399" />

  <!-- STEP 1: METHODOLOGY CARD -->
  <g transform="translate(60, 200)">
    <rect width="320" height="360" rx="20" fill="url(#cardGrad1)" stroke="#3b82f6" stroke-width="2" />
    <circle cx="50" cy="50" r="24" fill="#2563eb" />
    <text x="50" y="57" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text>
    
    <text x="90" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#60a5fa">METHODOLOGY</text>
    
    <!-- Icon: Molecule / Flask -->
    <g transform="translate(130, 100)" fill="none" stroke="#93c5fd" stroke-width="3" stroke-linecap="round">
      <path d="M20 0 L40 30 L40 60 C40 70 30 80 15 80 C0 80 -10 70 -10 60 L-10 30 Z" transform="translate(25, 10)" />
      <circle cx="20" cy="55" r="5" fill="#60a5fa" />
      <circle cx="35" cy="65" r="7" fill="#93c5fd" />
    </g>

    <rect x="20" y="210" width="280" height="125" rx="12" fill="#0f172a" opacity="0.7" />
    <text x="35" y="240" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#f8fafc">Synthesis &amp; Design:</text>
    
    <!-- Multi-line text for Methodology -->
    <foreignObject x="35" y="250" width="250" height="75">
      <xhtml:div xmlns:xhtml="http://www.w3.org/1999/xhtml" style="color:#cbd5e1; font-family:'Segoe UI', sans-serif; font-size:14px; line-height:1.4;">
        ${cleanMethodology}
      </xhtml:div>
    </foreignObject>
  </g>

  <!-- STEP 2: KEY FINDING CARD -->
  <g transform="translate(430, 200)">
    <rect width="320" height="360" rx="20" fill="url(#cardGrad2)" stroke="#10b981" stroke-width="2" />
    <circle cx="50" cy="50" r="24" fill="#059669" />
    <text x="50" y="57" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">2</text>
    
    <text x="90" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#34d399">KEY FINDING</text>
    
    <!-- Icon: Energy Catalyst / Atom -->
    <g transform="translate(120, 100)" fill="none" stroke="#6ee7b7" stroke-width="3">
      <ellipse cx="40" cy="40" rx="35" ry="14" transform="rotate(30 40 40)" />
      <ellipse cx="40" cy="40" rx="35" ry="14" transform="rotate(-30 40 40)" />
      <circle cx="40" cy="40" r="10" fill="#34d399" />
    </g>

    <rect x="20" y="210" width="280" height="125" rx="12" fill="#0f172a" opacity="0.7" />
    <text x="35" y="240" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#f8fafc">Core Performance:</text>
    
    <foreignObject x="35" y="250" width="250" height="75">
      <xhtml:div xmlns:xhtml="http://www.w3.org/1999/xhtml" style="color:#cbd5e1; font-family:'Segoe UI', sans-serif; font-size:14px; line-height:1.4;">
        ${cleanKeyFinding}
      </xhtml:div>
    </foreignObject>
  </g>

  <!-- STEP 3: IMPACT & APPLICATION CARD -->
  <g transform="translate(800, 200)">
    <rect width="320" height="360" rx="20" fill="url(#cardGrad3)" stroke="#a855f7" stroke-width="2" />
    <circle cx="50" cy="50" r="24" fill="#7e22ce" />
    <text x="50" y="57" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">3</text>
    
    <text x="90" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#c084fc">TARGET IMPACT</text>
    
    <!-- Icon: Globe / Energy Plant -->
    <g transform="translate(120, 100)" fill="none" stroke="#e9d5ff" stroke-width="3">
      <circle cx="40" cy="40" r="32" />
      <path d="M 8 40 Q 40 10 72 40 Q 40 70 8 40 Z" />
      <line x1="40" y1="8" x2="40" y2="72" />
    </g>

    <rect x="20" y="210" width="280" height="125" rx="12" fill="#0f172a" opacity="0.7" />
    <text x="35" y="240" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#f8fafc">Domain Application:</text>
    
    <foreignObject x="35" y="250" width="250" height="75">
      <xhtml:div xmlns:xhtml="http://www.w3.org/1999/xhtml" style="color:#cbd5e1; font-family:'Segoe UI', sans-serif; font-size:14px; line-height:1.4;">
        ${cleanImpact}
      </xhtml:div>
    </foreignObject>
  </g>

  <!-- Footer Banner -->
  <rect x="50" y="600" width="1100" height="60" rx="12" fill="#0f172a" stroke="#334155" stroke-width="1" />
  <text x="80" y="636" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" fill="#94a3b8">
    <tspan fill="#38bdf8" font-weight="bold">Sunaja Devi Research Group</tspan> • Department of Chemistry, Christ (Deemed to be University), Bangalore
  </text>
  <text x="1120" y="636" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="bold" fill="#f59e0b" text-anchor="end">
    AI GRAPHICAL ABSTRACT
  </text>
</svg>`;
}

const REAL_ABSTRACT_MAP = [
  { match: ['zif-8/ldh', 'zif8/ldh', 'zif 8/ldh', '10.1021/acsanm.6c02084'], image: '/images/abstracts/abstract_zif8_ldh.png' },
  { match: ['v2alc', 'v2alc max', '10.1002/ente.202600123', '10.1002/ente.70560'], image: '/images/abstracts/abstract_v2alc_max.png' },
  { match: ['cr2moalc2', 'cr2moc2tx', '10.1039/d6dt00446f'], image: '/images/abstracts/abstract_cr2moalc2_max.png' },
  { match: ['frustrated lewis pair', 'furfural to furoic', 'mof derived frustrated lewis pair-ceo2', '10.1002/chem.202502616'], image: '/images/abstracts/abstract_mof_ceo2.png' },
  { match: ['keggin', 'h5pmo10v2o40', '10.1021/acs.inorgchem.5c05604'], image: '/images/abstracts/abstract_keggin_pom_ldh.png' },
  { match: ['ni-ptc', 'ni ptc', '10.1016/j.colsurfa.2026.139593'], image: '/images/abstracts/abstract_ni_ptc_mof.png' },
  { match: ['lacoo3', 'g-c3n5', 'lacoo3/g-c3n5', '10.1016/j.nxmate.2026.101775'], image: '/images/abstracts/abstract_lacoo3_g_c3n5.jpg' },
  { match: ['hydrous nickel', 'nickel oxyhydroxide', 'niooh', '10.1039/d5cy01321f'], image: '/images/abstracts/abstract_hydrous_nickel.png' },
  { match: ['pdnps', 'goqds', '10.1039/d5ra08190d'], image: '/images/abstracts/abstract_pdnps_goqds.png' },
  { match: ['cu3mo2o9', '1,2-propanediol', '10.1021/acs.inorgchem.5c00316'], image: '/images/abstracts/abstract_cu3mo2o9_co2.png' },
  { match: ['heteroatom doped mxene', '10.1016/b978-0-443-38313-7.01014-8'], image: '/images/abstracts/abstract_heteroatom_mxene.png' },
];

function normalizeForMatching(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[₀0]/g, '0')
    .replace(/[₁1]/g, '1')
    .replace(/[₂2]/g, '2')
    .replace(/[₃3]/g, '3')
    .replace(/[₄4]/g, '4')
    .replace(/[₅5]/g, '5')
    .replace(/[₆6]/g, '6')
    .replace(/[₇7]/g, '7')
    .replace(/[₈8]/g, '8')
    .replace(/[₉9]/g, '9')
    .replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, '-')
    .replace(/\s+/g, ' ');
}

export function ensureGraphicalAbstract(paper) {
  const existingUrl = (paper.graphical_abstract_url || paper.graphicalAbstract || '').trim();

  // 1. If existing URL points to a real image (png, jpg, jpeg, webp, gif), keep it
  if (existingUrl && !existingUrl.endsWith('.svg') && !existingUrl.includes('/graphical_abstracts/')) {
    return existingUrl;
  }

  // 2. Check if paper title or DOI matches any real image in REAL_ABSTRACT_MAP
  const titleNorm = normalizeForMatching(paper.title || '');
  const doiNorm = (paper.doi || '').toLowerCase().trim();

  for (const item of REAL_ABSTRACT_MAP) {
    const matches = Array.isArray(item.match) ? item.match : [item.match];
    for (const pattern of matches) {
      const patNorm = normalizeForMatching(pattern);
      if (patNorm && (titleNorm.includes(patNorm) || (doiNorm && doiNorm.includes(patNorm)))) {
        return item.image;
      }
    }
  }

  // 3. If paper already has a generated SVG or other URL, keep it
  if (existingUrl) {
    return existingUrl;
  }

  // 4. Otherwise, generate dynamic SVG abstract file
  if (!fs.existsSync(ABSTRACTS_DIR)) {
    fs.mkdirSync(ABSTRACTS_DIR, { recursive: true });
  }

  const paperId = paper.id || (paper.doi ? paper.doi.replace(/[^a-z0-9]/gi, '_') : 'abstract_' + Date.now());
  const filename = `abstract_${paperId.replace(/^pub-|^doi-/, '')}.svg`;
  const filePath = path.join(ABSTRACTS_DIR, filename);

  const svgContent = generateGraphicalAbstractSvg(paper);
  fs.writeFileSync(filePath, svgContent, 'utf8');

  return `/images/graphical_abstracts/${filename}`;
}

export function generateTextAbstract(paper) {
  if (paper && paper.abstract && typeof paper.abstract === 'string' && paper.abstract.trim().length > 25) {
    return paper.abstract.replace(/\s+/g, ' ').replace(/^ABSTRACT\s*/i, '').trim();
  }

  const title = (paper?.title || '').trim();
  if (!title) return 'No title available for generating publication abstract.';

  const titleNorm = normalizeForMatching(title);

  if (titleNorm.includes('ni-ptc') || (titleNorm.includes('mof') && titleNorm.includes('supercapacitor'))) {
    return 'This study reports the synthesis and multifunctional electrochemical characterization of Ni-PTC metal-organic frameworks (MOFs). The porous hybrid architecture provides high surface area and abundant redox-active sites, yielding superior specific capacitance and long-term cycling stability for supercapacitors alongside low overpotential for electrocatalytic water splitting.';
  }

  if (titleNorm.includes('lacoo3') || titleNorm.includes('c3n5') || titleNorm.includes('allura red')) {
    return 'A novel LaCoO3/g-C3N5 Z-scheme heterojunction photocatalyst was fabricated for multi-functional environmental and energy applications. The direct Z-scheme interface facilitates efficient charge separation, enabling rapid photocatalytic degradation of Allura Red dye, highly sensitive electrochemical sensing of ascorbic acid, and robust solar-driven hydrogen evolution.';
  }

  if (titleNorm.includes('mil-101') || titleNorm.includes('pb2+') || (titleNorm.includes('amine') && titleNorm.includes('zif-8'))) {
    return 'An amine-functionalized MIL-101(Fe)-NH2@ZIF-8 composite was developed for the highly efficient adsorption of Pb2+ heavy metal ions from contaminated water. Synergistic interactions between amino functional groups and the porous ZIF-8 matrix provide abundant active binding sites, leading to exceptional adsorption capacity, fast kinetics, and high reusability.';
  }

  if (titleNorm.includes('fluorometric') && titleNorm.includes('mxene')) {
    return 'This work explores the design and analytical performance of fluorometric sensors based on MXene-polymer composites. Integrating 2D MXene nanosheets into fluorescent polymeric matrices provides enhanced quenching/luminescence mechanisms, excellent selectivity, and low detection limits for target chemical and biological analytes.';
  }

  if (titleNorm.includes('mxene-polymer composites: an overview') || (titleNorm.includes('mxene-polymer') && titleNorm.includes('overview'))) {
    return 'This comprehensive review presents an overview of MXene-polymer composites, highlighting state-of-the-art synthesis methodologies, interfacial bonding interactions, and structural property relationships. The integration of 2D MXenes with polymer matrices addresses restacking and oxidation while unlocking applications in energy storage, sensing, and environmental remediation.';
  }

  if (titleNorm.includes('heteroatom doped mxene') || (titleNorm.includes('heteroatom') && titleNorm.includes('supercapacitor'))) {
    return 'Heteroatom-doped MXene materials are investigated as advanced electrode architectures for high-performance supercapacitors. Doping with heteroatoms (such as N, S, or P) alters the electronic structure, expands interlayer spacing, and introduces pseudocapacitive active sites, resulting in significantly enhanced specific capacitance and rate capability.';
  }

  if (titleNorm.includes('v3s4') || (titleNorm.includes('ti3c2') && titleNorm.includes('asymmetric'))) {
    return 'V3S4 decorated Ti3C2 MXene hybrid electrode materials were synthesized to achieve synergistic pseudocapacitive charge storage in asymmetric supercapacitors. The V3S4 nanoparticles prevent MXene restacking and enhance surface reactivity, achieving high energy density, superior rate capability, and long-term cycling stability.';
  }

  if (titleNorm.includes('nimn2o4') || titleNorm.includes('nanofibrous')) {
    return 'One-dimensional NiMn2O4 nanofibrous architectures were synthesized via electrospinning for symmetric supercapacitor devices. The 1D nanofiber network provides continuous electron transport pathways and short ion diffusion channels, delivering high specific capacitance and outstanding capacity retention over extended cycling.';
  }

  if (titleNorm.includes('chalcogenide') || titleNorm.includes('materials advances')) {
    return 'This paper reviews transition metal oxide/chalcogenide-integrated MXene heterostructures for sustainable energy storage and conversion. It highlights interfacial engineering, charge transfer mechanisms, and performance metrics across supercapacitor electrodes and water splitting electrocatalysts.';
  }

  if (titleNorm.includes('cr2ctx') || titleNorm.includes('carbon nanofiber')) {
    return 'Electrospun Cr2CTx/carbon nanofiber membrane electrodes were fabricated and evaluated for supercapacitor applications. The flexible membrane structure exhibits high electrical conductivity and accessible pore channels, delivering high specific capacitance and high power density in asymmetric device configurations.';
  }

  if (titleNorm.includes('lanthanide') || titleNorm.includes('explosive sensing')) {
    return 'Luminescent lanthanide-based coordination polymers were synthesized for selective fluorometric sensing of explosive compounds. The coordination polymer framework exhibits strong characteristic luminescence and high sensitivity toward nitroaromatic target molecules through photoinduced electron transfer.';
  }

  if (titleNorm.includes('zif-8/ldh') || titleNorm.includes('dye adsorption')) {
    return 'ZIF-8/LDH nanohybrids were synthesized to study the effect of LDH composition on structural ordering and organic dye adsorption performance. The optimized hybrid displays exceptionally high specific surface area and rapid adsorption kinetics for industrial dye decontamination.';
  }

  if (titleNorm.includes('v2alc') || titleNorm.includes('hydrogen evolution')) {
    return 'The intrinsic electrocatalytic hydrogen evolution reaction (HER) performance of V2AlC MAX phase was investigated. Structural and electrochemical analysis reveals low overpotential and favorable Tafel kinetics, establishing pristine MAX phase materials as viable electrocatalysts for sustainable hydrogen production.';
  }

  if (titleNorm.includes('cr2moalc2') || titleNorm.includes('cr2moc2tx')) {
    return 'Cr2MoAlC2 MAX phase and its derivative Cr2MoC2Tx MXene were synthesized and evaluated for dual energy storage (supercapacitors) and electrocatalytic water splitting applications. The MXene derivative demonstrates enhanced electrical conductivity and abundant electroactive sites.';
  }

  if (titleNorm.includes('furfural') || titleNorm.includes('furoic acid')) {
    return 'MOF-derived frustrated Lewis pair-CeO2 nanocatalysts were developed for the CO2-activated soft oxidation of furfural to furoic acid. The surface oxygen vacancies and Ce3+ active sites provide high catalytic conversion and selectivity under mild reaction conditions.';
  }

  const { methodology, keyFinding, impact } = extractThreeStepSummary(title, '');
  return `This research investigates "${title}", focusing on ${methodology.toLowerCase()}. Structural and electrochemical analysis demonstrates ${keyFinding.toLowerCase()}, providing key insights for ${impact.toLowerCase()}.`;
}

