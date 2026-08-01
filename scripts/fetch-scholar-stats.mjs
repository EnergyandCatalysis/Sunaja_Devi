import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'scholarStats.json');
const PUBS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'latestPublications.json');

const SCHOLAR_USER_ID = 'HmOcEpIAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en&sortby=pubdate`;

async function fetchScholarProfile() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  const response = await fetch(SCHOLAR_URL, {
    signal: controller.signal,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  clearTimeout(timeout);
  if (!response.ok) {
    throw new Error(`HTTP error ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

async function resolveCrossrefMetadata(title) {
  try {
    const url = `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

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

    const doi = item.DOI || '';
    const container = item['container-title']?.[0] || '';
    const volume = item.volume ? ` ${item.volume}` : '';
    const issue = item.issue ? ` (${item.issue})` : '';
    const page = item.page ? `: ${item.page}` : '';
    const publishedYear =
      item['published-print']?.['date-parts']?.[0]?.[0] ||
      item['published-online']?.['date-parts']?.[0]?.[0] ||
      item.created?.['date-parts']?.[0]?.[0] ||
      '';

    let journalStr = container;
    if (journalStr && (publishedYear || volume || page)) {
      journalStr += ` (${publishedYear || '2026'})${volume}${issue}${page}`;
    }

    const authorsList = (item.author || [])
      .map((a) => `${a.given || ''} ${a.family || ''}`.trim())
      .filter(Boolean)
      .join(', ');

    return {
      doi,
      journal: journalStr,
      authors: authorsList,
      year: String(publishedYear || '2026'),
      title: item.title?.[0] || title,
    };
  } catch (err) {
    return null;
  }
}

async function updateScholarData() {
  console.log('🔄 Attempting to fetch updated Google Scholar metrics and publications...');

  try {
    const html = await fetchScholarProfile();

    // 1. Update Metrics
    const cellMatches = [...html.matchAll(/<td class="gsc_rsb_std">([^<]+)<\/td>/g)].map(
      (m) => m[1].trim()
    );
    const pubMatches = [...html.matchAll(/<tr class="gsc_a_tr">/g)];

    if (cellMatches.length >= 6) {
      const citations = parseInt(cellMatches[0].replace(/,/g, ''), 10);
      const citationsSince2021 = parseInt(cellMatches[1].replace(/,/g, ''), 10);
      const hIndex = parseInt(cellMatches[2].replace(/,/g, ''), 10);
      const hIndexSince2021 = parseInt(cellMatches[3].replace(/,/g, ''), 10);
      const i10Index = parseInt(cellMatches[4].replace(/,/g, ''), 10);
      const i10IndexSince2021 = parseInt(cellMatches[5].replace(/,/g, ''), 10);

      let currentData = {};
      if (fs.existsSync(STATS_FILE_PATH)) {
        try {
          currentData = JSON.parse(fs.readFileSync(STATS_FILE_PATH, 'utf8'));
        } catch (_) {}
      }

      const updatedStats = {
        citations: citations || currentData.citations || 3039,
        citationsSince2021: citationsSince2021 || currentData.citationsSince2021 || 2188,
        hIndex: hIndex || currentData.hIndex || 32,
        hIndexSince2021: hIndexSince2021 || currentData.hIndexSince2021 || 25,
        i10Index: i10Index || currentData.i10Index || 52,
        i10IndexSince2021: i10IndexSince2021 || currentData.i10IndexSince2021 || 41,
        publicationsCount:
          pubMatches.length > 0 ? pubMatches.length : currentData.publicationsCount || 166,
        lastUpdated: new Date().toISOString(),
      };

      fs.mkdirSync(path.dirname(STATS_FILE_PATH), { recursive: true });
      fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(updatedStats, null, 2), 'utf8');

      console.log('✅ Google Scholar metrics updated successfully:');
      console.log(`   • Citations: ${updatedStats.citations}`);
      console.log(`   • h-index: ${updatedStats.hIndex}`);
      console.log(`   • i10-index: ${updatedStats.i10Index}`);
    }

    // 2. Extract Recent Publications from Profile HTML
    const articleTitleMatches = [...html.matchAll(/<a[^>]+class="gsc_a_at"[^>]*>([^<]+)<\/a>/g)].map(
      (m) => m[1].trim()
    );

    if (articleTitleMatches.length > 0) {
      let existingPubs = [];
      if (fs.existsSync(PUBS_FILE_PATH)) {
        try {
          existingPubs = JSON.parse(fs.readFileSync(PUBS_FILE_PATH, 'utf8'));
        } catch (_) {}
      }

      // Map graphical abstracts by title/DOI substring
      const abstractMap = new Map();
      existingPubs.forEach((p) => {
        if (p.graphicalAbstract) {
          abstractMap.set(p.title.toLowerCase().trim(), p.graphicalAbstract);
          if (p.doi) abstractMap.set(p.doi.toLowerCase().trim(), p.graphicalAbstract);
        }
      });

      const topTitles = articleTitleMatches.slice(0, 6);
      const enrichedPubs = [];

      for (const title of topTitles) {
        // Find existing pub match
        const existing = existingPubs.find(
          (p) => p.title.toLowerCase().trim() === title.toLowerCase().trim()
        );

        const crossref = await resolveCrossrefMetadata(title);

        const mergedDoi = crossref?.doi || existing?.doi || '';
        const mergedAbstract =
          existing?.graphicalAbstract ||
          abstractMap.get(title.toLowerCase().trim()) ||
          abstractMap.get(mergedDoi.toLowerCase().trim()) ||
          '';

        enrichedPubs.push({
          year: crossref?.year || existing?.year || '2026',
          title: existing?.title || crossref?.title || title,
          authors: existing?.authors || crossref?.authors || 'Sunaja Devi K R et al.',
          journal: existing?.journal || crossref?.journal || 'Peer-reviewed Journal (2026)',
          graphicalAbstract: mergedAbstract,
          doi: mergedDoi,
        });
      }

      if (enrichedPubs.length > 0) {
        fs.writeFileSync(PUBS_FILE_PATH, JSON.stringify(enrichedPubs, null, 2), 'utf8');
        console.log(`✅ ${enrichedPubs.length} recent publications updated with DOIs & metadata!`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Could not fetch live Google Scholar profile: ${err.message}`);
    console.log('ℹ️ Retaining existing cached metrics and publication list.');
  }
}

updateScholarData();
