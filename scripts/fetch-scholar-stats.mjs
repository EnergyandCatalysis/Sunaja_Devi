import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'scholarStats.json');
const PUBS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'latestPublications.json');
const ANNOUNCEMENTS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'activeAnnouncements.json');

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

async function fetchMetadataByDOI(doi) {
  try {
    const cleanDoi = doi.trim().replace(/^https?:\/\/doi\.org\//i, '');
    if (!cleanDoi) return null;

    const url = `https://api.crossref.org/v1/works/${encodeURIComponent(cleanDoi)}`;
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
    const item = data.message;
    if (!item) return null;

    const container = item['container-title']?.[0] || '';
    const volume = item.volume ? ` ${item.volume}` : '';
    const issue = item.issue ? ` (${item.issue})` : '';
    const page = item.page ? `: ${item.page}` : '';

    const printDateParts = item['published-print']?.['date-parts']?.[0];
    const onlineDateParts = item['published-online']?.['date-parts']?.[0];
    const createdDateParts = item.created?.['date-parts']?.[0];
    const dateParts = onlineDateParts || printDateParts || createdDateParts;

    let publishedYear = '';
    let actualPublishDate = '';
    if (dateParts && dateParts.length > 0) {
      publishedYear = String(dateParts[0]);
      const month = dateParts[1] ? String(dateParts[1]).padStart(2, '0') : '01';
      const day = dateParts[2] ? String(dateParts[2]).padStart(2, '0') : '01';
      actualPublishDate = `${publishedYear}-${month}-${day}`;
    }

    let journalStr = container;
    if (journalStr && (publishedYear || volume || page)) {
      journalStr += ` (${publishedYear})${volume}${issue}${page}`;
    }

    const authorsList = (item.author || [])
      .map((a) => `${a.given || ''} ${a.family || ''}`.trim())
      .filter(Boolean)
      .join(', ');

    return {
      doi: cleanDoi,
      journal: journalStr,
      authors: authorsList || 'Sunaja Devi K R et al.',
      year: publishedYear || '2026',
      actualPublishDate,
      title: item.title?.[0] || '',
    };
  } catch (err) {
    return null;
  }
}

async function resolveCrossrefMetadataByTitle(title) {
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

    return await fetchMetadataByDOI(item.DOI);
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
        citations: citations || currentData.citations || 3028,
        citationsSince2021: citationsSince2021 || currentData.citationsSince2021 || 2188,
        hIndex: hIndex || currentData.hIndex || 32,
        hIndexSince2021: hIndexSince2021 || currentData.hIndexSince2021 || 25,
        i10Index: i10Index || currentData.i10Index || 52,
        i10IndexSince2021: i10IndexSince2021 || currentData.i10IndexSince2021 || 41,
        publicationsCount:
          pubMatches.length > 0 ? pubMatches.length : currentData.publicationsCount || 167,
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
        const existing = existingPubs.find(
          (p) => p.title.toLowerCase().trim() === title.toLowerCase().trim()
        );

        const crossref = await resolveCrossrefMetadataByTitle(title);

        const mergedDoi = crossref?.doi || existing?.doi || '';
        const mergedAbstract =
          existing?.graphicalAbstract ||
          abstractMap.get(title.toLowerCase().trim()) ||
          abstractMap.get(mergedDoi.toLowerCase().trim()) ||
          '';

        enrichedPubs.push({
          year: crossref?.year || existing?.year || '2026',
          actualPublishDate: crossref?.actualPublishDate || existing?.actualPublishDate || '',
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
        updateAnnouncementsFromLatestPubs(enrichedPubs);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Could not fetch live Google Scholar profile: ${err.message}`);
    console.log('ℹ️ Retaining existing cached metrics and publication list.');
  }
}

const SCHOLAR_DIRECTORY = [
  {
    name: 'Dr. Pushparaj Loganathan',
    shortName: 'Dr. Pushparaj L.',
    role: 'Post-Doctoral Researcher',
    photo: '/images/pushparaj_l_pdf.jpg',
    patterns: [/pushparaj/i, /loganathan/i],
  },
  {
    name: 'Cheriyan John',
    shortName: 'Cheriyan John',
    role: 'PhD Scholar',
    photo: '/images/cheriyan_john_present.jpg',
    patterns: [/cheriyan/i],
  },
  {
    name: 'Jessica Jones W',
    shortName: 'Jessica Jones W',
    role: 'PhD Scholar',
    photo: '/images/jessica_jones.jpg',
    patterns: [/jessica/i],
  },
  {
    name: 'Arsha R',
    shortName: 'Arsha R',
    role: 'PhD Scholar',
    photo: '/images/arsha_r.jpg',
    patterns: [/arsha/i],
  },
  {
    name: 'Dr. Sujith S',
    shortName: 'S. Sujith',
    role: 'Research Scholar',
    photo: '/images/sujith_s.jpg',
    patterns: [/sujith/i],
  },
  {
    name: 'R. Madhushree',
    shortName: 'R. Madhushree',
    role: 'Research Scholar',
    photo: null,
    patterns: [/madhushree/i],
  },
  {
    name: 'Dr. Dephan Pinheiro',
    shortName: 'Dr. Dephan Pinheiro',
    role: 'Post-Doctoral Researcher',
    photo: '/images/dephan_phinero.jpg',
    patterns: [/dephan/i, /pinheiro/i],
  },
  {
    name: 'Dr. Sandra Mathew',
    shortName: 'Dr. Sandra Mathew',
    role: 'Research Scholar',
    photo: '/images/sandra_mathew.jpg',
    patterns: [/sandra/i],
  },
  {
    name: 'Dr. Samika Anand',
    shortName: 'Dr. Samika Anand',
    role: 'Research Scholar',
    photo: '/images/samika_anand.jpg',
    patterns: [/samika/i],
  },
  {
    name: 'Dr. Muthukumar Devarasu',
    shortName: 'Dr. Muthukumar Devarasu',
    role: 'Research Scholar',
    photo: '/images/muthukumar_d.jpg',
    patterns: [/muthukumar/i],
  },
  {
    name: 'Dr. Arun Varghese Ayyamala',
    shortName: 'Dr. Arun Varghese',
    role: 'Research Scholar',
    photo: '/images/arun_varghese.jpg',
    patterns: [/arun/i],
  },
];

function generateSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 30);
}

function updateAnnouncementsFromLatestPubs(enrichedPubs) {
  let existingAnnouncements = [];
  if (fs.existsSync(ANNOUNCEMENTS_FILE_PATH)) {
    try {
      existingAnnouncements = JSON.parse(fs.readFileSync(ANNOUNCEMENTS_FILE_PATH, 'utf8'));
    } catch (_) {}
  }

  const existingMap = new Map();
  existingAnnouncements.forEach((item) => {
    existingMap.set(item.id, item);
    if (item.link) existingMap.set(item.link.toLowerCase().trim(), item);
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const updatedAnnouncements = [...existingAnnouncements];
  let newAddedCount = 0;

  for (const pub of enrichedPubs) {
    const authorsStr = pub.authors || '';
    const matchedScholars = SCHOLAR_DIRECTORY.filter((scholar) =>
      scholar.patterns.some((pattern) => pattern.test(authorsStr))
    );

    if (matchedScholars.length === 0) continue;

    const doiLink = pub.doi
      ? (pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`)
      : '';

    const pubKey = doiLink ? doiLink.toLowerCase().trim() : pub.title.toLowerCase().trim();
    if (existingMap.has(pubKey)) continue;

    // --- RECENTNESS & DATE FILTERING OPTIMIZATION ---
    // Only auto-generate congratulatory popup announcements for genuinely recent publications!
    const effectivePublishDate = pub.actualPublishDate || (pub.year ? `${pub.year}-01-01` : todayStr);
    const pubYear = parseInt(pub.year || '0', 10);
    const currentYear = new Date().getFullYear();

    const pubTime = new Date(effectivePublishDate).getTime();
    const nowTime = new Date().getTime();
    const ageInDays = (nowTime - pubTime) / (1000 * 60 * 60 * 24);

    // Skip creating popup announcements if paper is older than 30 days or published in a previous calendar year
    if (pubYear < currentYear || ageInDays > 30) {
      console.log(`⏩ Skipping popup announcement for older publication (${effectivePublishDate}): "${pub.title}"`);
      continue;
    }

    const isPushparaj = matchedScholars.some((s) => s.patterns.some((p) => p.test('pushparaj')));
    const isCheriyan = matchedScholars.some((s) => s.patterns.some((p) => p.test('cheriyan')));

    let publisherName = '';
    let publisherRole = '';
    let publisherPhoto = '';

    if (isPushparaj && isCheriyan) {
      publisherName = 'Dr. Pushparaj L. & Cheriyan John';
      publisherRole = 'Post-Doctoral Researcher & PhD Scholar';
      publisherPhoto = '/images/pushparaj_cheriyan_announcement.png';
    } else {
      publisherName = matchedScholars.map((s) => s.shortName).join(' & ');
      publisherRole = Array.from(new Set(matchedScholars.map((s) => s.role))).join(' & ');
      publisherPhoto = matchedScholars.find((s) => s.photo)?.photo || '/images/sunaja_devi.png';
    }

    const newId = `announcement-${generateSlug(pub.title)}`;
    if (existingMap.has(newId)) continue;

    const newAnnouncement = {
      id: newId,
      enabled: true,
      publishDate: effectivePublishDate || todayStr,
      activeDays: 14,
      publisherName,
      publisherRole,
      publisherPhoto,
      paperTitle: pub.title,
      journal: pub.journal,
      link: doiLink,
    };

    updatedAnnouncements.unshift(newAnnouncement);
    existingMap.set(newId, newAnnouncement);
    if (doiLink) existingMap.set(doiLink.toLowerCase().trim(), newAnnouncement);
    newAddedCount++;
  }

  // --- AUTOMATIC EXPIRED ANNOUNCEMENTS CLEANUP ---
  const nowMs = Date.now();
  const activeAnnouncementsOnly = updatedAnnouncements.filter((item) => {
    if (!item.publishDate) return true;
    const itemTime = new Date(item.publishDate).getTime();
    const activeDurationMs = (item.activeDays || 14) * 24 * 60 * 60 * 1000;
    return (nowMs - itemTime) <= activeDurationMs;
  });

  if (newAddedCount > 0 || activeAnnouncementsOnly.length !== existingAnnouncements.length) {
    fs.writeFileSync(ANNOUNCEMENTS_FILE_PATH, JSON.stringify(activeAnnouncementsOnly.slice(0, 10), null, 2), 'utf8');
    console.log(`🎉 Sync completed. Active valid announcements saved: ${activeAnnouncementsOnly.length}`);
  }
}

updateScholarData();
