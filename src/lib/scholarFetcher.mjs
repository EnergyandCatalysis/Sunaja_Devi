import { upsertPublication, getPublications, generatePaperId, normalizeTitle } from './db.mjs';
import { ensureGraphicalAbstract, generateTextAbstract } from './abstractGenerator.mjs';

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
  const minAllowedYear = currentYear - 1;

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

export async function resolveCrossrefByTitle(title) {
  try {
    const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'ProfWebsiteSync/1.0 (mailto:sunajadevi.kr@christuniversity.in)',
      },
    });

    clearTimeout(timeout);
    if (!res.ok) return null;

    const data = await res.json();
    const item = data.message?.items?.[0];
    if (!item) return null;

    const itemTitle = item.title?.[0] || '';
    if (normalizeTitle(itemTitle).slice(0, 25) !== normalizeTitle(title).slice(0, 25)) {
      return null;
    }

    const doi = item.DOI || '';
    const dateParts =
      item['published-online']?.['date-parts']?.[0] ||
      item['published']?.['date-parts']?.[0] ||
      item['issued']?.['date-parts']?.[0];

    let year = '';
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
      doi,
      year,
      publication_date: pubDate,
      authors: authorsList || '',
      abstract: item.abstract ? item.abstract.replace(/<[^>]*>/g, '') : '',
      doiLink: doi ? `https://doi.org/${doi}` : '',
    };
  } catch (err) {
    return null;
  }
}

export async function fetchScholarScraper() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

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
    const trMatches = [...html.matchAll(/<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/gi)];

    const articles = [];
    for (const trMatch of trMatches) {
      const rowHtml = trMatch[1];

      const titleMatch =
        rowHtml.match(/<a[^>]+href=["']([^"']+)["'][^>]*class="gsc_a_at"[^>]*>([\s\S]*?)<\/a>/i) ||
        rowHtml.match(/<a[^>]+class="gsc_a_at"[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);

      if (!titleMatch) continue;

      const rawHref = titleMatch[1].replace(/&amp;/g, '&');
      const title = titleMatch[2].replace(/<[^>]*>/g, '').trim();
      const scholarLink = rawHref.startsWith('http')
        ? rawHref
        : `https://scholar.google.com${rawHref}`;

      const grayDivs = [...rowHtml.matchAll(/<div class="gs_gray">([\s\S]*?)<\/div>/gi)].map((m) =>
        m[1].replace(/<[^>]*>/g, '').trim()
      );

      const authors = grayDivs[0] || 'Sunaja Devi K R et al.';
      const journal = grayDivs[1] || 'Peer-reviewed Journal';

      const yearMatch =
        rowHtml.match(/class=["']?[^"']*gsc_a_h[^"']*["']?[^>]*>([^<]*)<\/span>/i) ||
        rowHtml.match(/<td class="gsc_a_y">[\s\S]*?<span[^>]*>([^<]*)<\/span>/i);
      const year = yearMatch ? yearMatch[1].trim() : journal.match(/\b(20\d\d)\b/)?.[1] || '2026';

      const citeMatch = rowHtml.match(/class=["']?[^"']*gsc_a_ac[^"']*["']?[^>]*>([^<]*)<\/a>/i);
      const citations = citeMatch ? parseInt(citeMatch[1].trim(), 10) || 0 : 0;

      articles.push({
        title,
        authors,
        journal,
        year,
        publication_date: `${year}-01-01`,
        citations,
        link: scholarLink,
        scholarLink,
      });
    }

    return articles;
  } catch (err) {
    console.warn('Scholar profile fetcher warning:', err.message);
    return [];
  }
}

export async function syncPublicationsPipeline() {
  console.log('🔄 Executing Scholar-Direct Publications Sync Pipeline...');
  
  // 1. Fetch publications directly from Google Scholar profile HmOcEpIAAAAJ
  const scholarPubs = await fetchScholarScraper();

  // 2. Strict Date Filtering (current year or last 12 months)
  const recentPubs = scholarPubs.filter((p) => isRecentPublication(p.year, p.publication_date));

  let newCount = 0;
  let updatedCount = 0;
  const processedPubs = [];

  // 3. Enrich with Crossref DOI matching & ensure Graphical Abstract
  for (const paper of recentPubs) {
    if (!paper.title) continue;

    // Crossref DOI lookup for exact title
    const crossrefData = await resolveCrossrefByTitle(paper.title);
    const candidateAbstract = crossrefData?.abstract || paper.abstract || '';
    const finalAbstract = generateTextAbstract({ ...paper, abstract: candidateAbstract });

    const mergedPaper = {
      ...paper,
      doi: crossrefData?.doi || paper.doi || '',
      abstract: finalAbstract,
      publication_date: crossrefData?.publication_date || paper.publication_date || `${paper.year}-01-01`,
      authors: paper.authors || crossrefData?.authors || 'Sunaja Devi K R et al.',
      link: crossrefData?.doiLink || paper.scholarLink || paper.link,
    };

    const graphical_abstract_url = ensureGraphicalAbstract(mergedPaper);
    mergedPaper.graphical_abstract_url = graphical_abstract_url;

    const result = upsertPublication(mergedPaper);
    if (result.isNew) {
      newCount++;
    } else {
      updatedCount++;
    }
    processedPubs.push(result.publication);
  }

  // Ensure graphical and text abstracts for all existing DB records
  const dbPubs = getPublications();
  for (const p of dbPubs) {
    const generatedAbstract = generateTextAbstract(p);
    const generatedGraphicalUrl = ensureGraphicalAbstract(p);
    if (!p.abstract || p.abstract !== generatedAbstract || !p.graphical_abstract_url || p.graphical_abstract_url !== generatedGraphicalUrl) {
      upsertPublication({ ...p, abstract: generatedAbstract, graphical_abstract_url: generatedGraphicalUrl });
    }
  }

  console.log(`✅ Publications Pipeline Finished. Total profile recent papers processed: ${processedPubs.length} (${newCount} new, ${updatedCount} updated).`);

  return {
    success: true,
    totalRecentProcessed: processedPubs.length,
    newCount,
    updatedCount,
    recentPublications: processedPubs,
  };
}
