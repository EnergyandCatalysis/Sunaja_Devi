import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'scholarStats.json');
const SCHOLAR_USER_ID = 'HmOcEpIAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en`;

async function updateScholarStats() {
  console.log('🔄 Attempting to fetch updated Google Scholar metrics...');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

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

    const html = await response.text();

    // Parse citation table cells <td class="gsc_rsb_std">...</td>
    const cellMatches = [...html.matchAll(/<td class="gsc_rsb_std">([^<]+)<\/td>/g)].map(
      (m) => m[1].trim()
    );

    // Count publication rows on main profile <tr class="gsc_a_tr">
    const pubMatches = [...html.matchAll(/<tr class="gsc_a_tr">/g)];

    if (cellMatches.length >= 6) {
      const citations = parseInt(cellMatches[0].replace(/,/g, ''), 10);
      const citationsSince2021 = parseInt(cellMatches[1].replace(/,/g, ''), 10);
      const hIndex = parseInt(cellMatches[2].replace(/,/g, ''), 10);
      const hIndexSince2021 = parseInt(cellMatches[3].replace(/,/g, ''), 10);
      const i10Index = parseInt(cellMatches[4].replace(/,/g, ''), 10);
      const i10IndexSince2021 = parseInt(cellMatches[5].replace(/,/g, ''), 10);

      // Existing data fallback for pub count
      let currentData = {};
      if (fs.existsSync(DATA_FILE_PATH)) {
        try {
          currentData = JSON.parse(fs.readFileSync(DATA_FILE_PATH, 'utf8'));
        } catch (_) {}
      }

      const updatedStats = {
        citations: citations || currentData.citations || 3039,
        citationsSince2021: citationsSince2021 || currentData.citationsSince2021 || 2188,
        hIndex: hIndex || currentData.hIndex || 32,
        hIndexSince2021: hIndexSince2021 || currentData.hIndexSince2021 || 25,
        i10Index: i10Index || currentData.i10Index || 52,
        i10IndexSince2021: i10IndexSince2021 || currentData.i10IndexSince2021 || 41,
        publicationsCount: pubMatches.length > 0 ? pubMatches.length : (currentData.publicationsCount || 166),
        lastUpdated: new Date().toISOString(),
      };

      fs.mkdirSync(path.dirname(DATA_FILE_PATH), { recursive: true });
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(updatedStats, null, 2), 'utf8');

      console.log('✅ Google Scholar metrics successfully updated:');
      console.log(`   • Citations: ${updatedStats.citations} (Since 2021: ${updatedStats.citationsSince2021})`);
      console.log(`   • h-index: ${updatedStats.hIndex}`);
      console.log(`   • i10-index: ${updatedStats.i10Index}`);
      console.log(`   • Publications Count: ${updatedStats.publicationsCount}`);
      return;
    } else {
      console.warn('⚠️ Google Scholar HTML structure had fewer table cells than expected.');
    }
  } catch (err) {
    console.warn(`⚠️ Could not fetch live Google Scholar stats: ${err.message}`);
  }

  console.log('ℹ️ Retaining existing cached metrics in src/data/scholarStats.json');
}

updateScholarStats();
