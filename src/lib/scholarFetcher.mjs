import { upsertPublication, getPublications, generatePaperId, normalizeTitle } from './db.mjs';
import { ensureGraphicalAbstract } from './abstractGenerator.mjs';

const SCHOLAR_USER_ID = 'HmOcEpIAAAAJ';
const SCHOLAR_PROFILE_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en&sortby=pubdate`;

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

function getRandomUserAgent() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export function isRecentPublication(pubYear, pubDate) {
  const currentYear = new Date().getFullYear();
  const minAllowedYear = currentYear - 1; // Last 12 months / current year or previous year

  if (pubYear) {
    const yearNum = parseInt(String(pubYear), 10);
    if (!isNaN(yearNum) && yearNum >= minAllowedYear) {
      return true;
    }
  }

  if (pubDate) {
    const pubTime = new Date(pubDate).getTime();
    if (!isNaN(pubTime)) {
      const twelveMonthsAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
      return pubTime >= twelveMonthsAgo;
    }
  }

  return false;
}

export async function fetchCrossrefPublications() {
  try {
    const url = `https://api.crossref.org/works?query.author=Sunaja+Devi&sort=published&order=desc&rows=20`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ProfWebsiteSync/1.0 (mailto:sunajadevi.kr@christuniversity.in)',
      },
    });

    clearTimeout(timeout);
    if (!res.ok) return [];

    const data = await res.json();
    const items = data.message?.items || [];

    return items.map((item) => {
      const title = item.title?.[0] || '';
      const doi = item.DOI || '';
      const journal = item['container-title']?.[0] || 'Peer-reviewed Journal';

      const dateParts =
        item['published-online']?.['date-parts']?.[0] ||
        item['published']?.['date-parts']?.[0] ||
        item['issued']?.['date-parts']?.[0];

      let year = '2026';
      let pubDate = '';
      if (dateParts && dateParts.length > 0) {
        year = String(dateParts[0]);
        const m = dateParts[1] ? String(dateParts[1]).padStart(2, '0') : '01';
        const d = dateParts[2] ? String(dateParts[2]).padStart(2, '0') : '01';
        pubDate = `${year}-${m}-${d}`;
      }

      const authorsList = (item.author || [])
        .map((a) => `${a.given || ''} ${a.family || ''}`.trim())
        .filter(Boolean)
        .join(', ');

      return {
        title,
        doi,
        journal,
        authors: authorsList || 'Sunaja Devi K R et al.',
        year,
        publication_date: pubDate || `${year}-01-01`,
        abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, '') : '',
        link: doi ? `https://doi.org/${doi}` : '',
      };
    });
  } catch (err) {
    console.warn('Crossref fetch warning:', err.message);
    return [];
  }
}

export async function fetchScholarScraper() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(SCHOLAR_PROFILE_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const html = await res.text();
    const titleMatches = [...html.matchAll(/<a[^>]+class="gsc_a_at"[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].trim());

    return titleMatches.map((title) => ({
      title,
      authors: 'Sunaja Devi K R et al.',
      journal: 'Google Scholar Discovered Journal',
      year: String(new Date().getFullYear()),
      publication_date: new Date().toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.warn('Scholar scraper warning:', err.message);
    return [];
  }
}

export async function syncPublicationsPipeline() {
  console.log('🔄 Executing Publications Sync Pipeline...');
  
  // 1. Multi-tier fetching
  const crossrefPubs = await fetchCrossrefPublications();
  const scholarPubs = await fetchScholarScraper();

  const combinedRawPubs = [...crossrefPubs, ...scholarPubs];

  // 2. Strict Date Filtering (current year or last 12 months)
  const recentPubs = combinedRawPubs.filter((p) => isRecentPublication(p.year, p.publication_date));

  let newCount = 0;
  let updatedCount = 0;
  const processedPubs = [];

  // 3. Deduplication & Graphical Abstract Generation
  for (const rawPaper of recentPubs) {
    if (!rawPaper.title) continue;

    // Check graphical abstract
    const graphical_abstract_url = ensureGraphicalAbstract(rawPaper);

    const paperToSave = {
      ...rawPaper,
      graphical_abstract_url,
    };

    const result = upsertPublication(paperToSave);
    if (result.isNew) {
      newCount++;
    } else {
      updatedCount++;
    }
    processedPubs.push(result.publication);
  }

  // Also verify existing DB records for graphical abstracts
  const dbPubs = getPublications();
  for (const p of dbPubs) {
    if (!p.graphical_abstract_url) {
      const generatedUrl = ensureGraphicalAbstract(p);
      upsertPublication({ ...p, graphical_abstract_url: generatedUrl });
    }
  }

  console.log(`✅ Publications Pipeline Finished. Discovered/Processed: ${processedPubs.length} recent papers (${newCount} new, ${updatedCount} updated).`);

  return {
    success: true,
    totalRecentProcessed: processedPubs.length,
    newCount,
    updatedCount,
    recentPublications: processedPubs,
  };
}
