import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncPublicationsPipeline } from '../src/lib/scholarFetcher.mjs';
import { getPublications, getUnnotifiedPublications, markAsNotified } from '../src/lib/db.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STATS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'scholarStats.json');
const PUBS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'latestPublications.json');
const ANNOUNCEMENTS_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'activeAnnouncements.json');
const REPORT_FILE_PATH = path.join(__dirname, '..', 'src', 'data', 'automationReport.json');

const SCHOLAR_USER_ID = 'HmOcEpIAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}&hl=en&sortby=pubdate`;

async function fetchScholarProfileMetrics() {
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
    if (!response.ok) return null;

    const html = await response.text();
    const tableMatch = html.match(/<table[^>]*id=["']?gsc_rsb_st["']?[^>]*>([\s\S]*?)<\/table>/i);
    const tableHtml = tableMatch ? tableMatch[1] : html;

    const rowMatches = [...tableHtml.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    const dataRows = rowMatches
      .map((m) => m[1])
      .filter((rowHtml) => rowHtml.includes('gsc_rsb_std'));

    const extractRowStdCells = (rowHtml) => {
      if (!rowHtml) return [];
      return [...rowHtml.matchAll(/<td[^>]*class=["']?[^"']*gsc_rsb_std[^"']*["']?[^>]*>([^<]*)<\/td>/gi)].map(
        (m) => m[1].trim()
      );
    };

    const row1Cells = extractRowStdCells(dataRows[0]);
    const row2Cells = extractRowStdCells(dataRows[1]);
    const row3Cells = extractRowStdCells(dataRows[2]);

    const parseMetricNumber = (val) => {
      if (!val) return 0;
      const cleanVal = val.replace(/,/g, '').replace(/[^0-9]/g, '');
      return parseInt(cleanVal, 10) || 0;
    };

    const citations = parseMetricNumber(row1Cells[0]);
    const citationsSince2021 = parseMetricNumber(row1Cells[1]);
    const hIndex = parseMetricNumber(row2Cells[0]);
    const hIndexSince2021 = parseMetricNumber(row2Cells[1]);
    const i10Index = parseMetricNumber(row3Cells[0]);
    const i10IndexSince2021 = parseMetricNumber(row3Cells[1]);

    const pubMatches = [...html.matchAll(/<tr class="gsc_a_tr">/g)];

    return {
      citations,
      citationsSince2021,
      hIndex,
      hIndexSince2021,
      i10Index,
      i10IndexSince2021,
      publicationsCount: pubMatches.length > 0 ? pubMatches.length : 167,
    };
  } catch (err) {
    console.warn('Google Scholar metrics scrape warning:', err.message);
    return null;
  }
}

async function runDailyAutomation() {
  console.log('🔄 Executing Publications & Scholar Sync Automation...');
  const reportLogs = [];
  const runTimestamp = new Date().toISOString();

  try {
    // 1. Sync Publications Pipeline
    let syncResult = { totalRecentProcessed: 0, newCount: 0, updatedCount: 0 };
    try {
      syncResult = await syncPublicationsPipeline();
      reportLogs.push(
        `✅ Publications Sync Complete: ${syncResult.totalRecentProcessed} recent papers processed (${syncResult.newCount} new added, ${syncResult.updatedCount} updated).`
      );
    } catch (pipelineErr) {
      reportLogs.push(`⚠️ Sync Pipeline Warning: ${pipelineErr.message}. Retaining cached DB papers.`);
    }

    // 2. Fetch Scholar Metrics
    let currentStats = {
      citations: 3039,
      citationsSince2021: 2793,
      hIndex: 32,
      hIndexSince2021: 31,
      i10Index: 79,
      i10IndexSince2021: 71,
      publicationsCount: 167,
    };

    if (fs.existsSync(STATS_FILE_PATH)) {
      try {
        currentStats = JSON.parse(fs.readFileSync(STATS_FILE_PATH, 'utf8'));
      } catch (_) {}
    }

    const fetchedStats = await fetchScholarProfileMetrics();
    const updatedStats = {
      citations: fetchedStats?.citations || currentStats.citations,
      citationsSince2021: fetchedStats?.citationsSince2021 || currentStats.citationsSince2021,
      hIndex: fetchedStats?.hIndex || currentStats.hIndex,
      hIndexSince2021: fetchedStats?.hIndexSince2021 || currentStats.hIndexSince2021,
      i10Index: fetchedStats?.i10Index || currentStats.i10Index,
      i10IndexSince2021: fetchedStats?.i10IndexSince2021 || currentStats.i10IndexSince2021,
      publicationsCount: fetchedStats?.publicationsCount || currentStats.publicationsCount,
      lastUpdated: runTimestamp,
    };

    fs.mkdirSync(path.dirname(STATS_FILE_PATH), { recursive: true });
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(updatedStats, null, 2), 'utf8');
    reportLogs.push(`✅ Scholar Metrics Saved: ${updatedStats.citations} Citations | h-index: ${updatedStats.hIndex}`);

    // 3. Export DB to latestPublications.json (Top 6 strictly recent)
    const allDbPubs = getPublications();
    const topRecentPubs = allDbPubs.slice(0, 6).map((p) => ({
      id: p.id,
      year: p.year,
      actualPublishDate: p.publication_date,
      title: p.title,
      authors: p.authors,
      journal: p.journal,
      graphicalAbstract: p.graphical_abstract_url,
      doi: p.doi,
      link: p.link,
    }));

    fs.writeFileSync(PUBS_FILE_PATH, JSON.stringify(topRecentPubs, null, 2), 'utf8');

    // 4. Update Popup Announcements
    const unnotified = getUnnotifiedPublications();
    const announcements = unnotified.map((p) => ({
      id: p.id,
      enabled: true,
      publishDate: p.publication_date || runTimestamp.slice(0, 10),
      activeDays: 4,
      publisherName: 'Sunaja Devi Research Group',
      publisherRole: 'Department of Chemistry, Christ University',
      publisherPhoto: '/images/sunaja_devi.png',
      paperTitle: p.title,
      journal: p.journal,
      graphicalAbstract: p.graphical_abstract_url,
      link: p.link || (p.doi ? `https://doi.org/${p.doi}` : ''),
    }));

    fs.writeFileSync(ANNOUNCEMENTS_FILE_PATH, JSON.stringify(announcements, null, 2), 'utf8');
    if (unnotified.length > 0) {
      reportLogs.push(`🎉 Created ${unnotified.length} congratulatory popups for unnotified publications.`);
    }

    // 5. Generate Audit Report
    const reportData = {
      lastRunTimestamp: runTimestamp,
      status: 'SUCCESS',
      scholarMetrics: updatedStats,
      changesSummary: {
        newPublicationsDiscovered: syncResult.newCount,
        totalRecentPapers: syncResult.totalRecentProcessed,
        unnotifiedCount: unnotified.length,
      },
      logs: reportLogs,
    };

    fs.writeFileSync(REPORT_FILE_PATH, JSON.stringify(reportData, null, 2), 'utf8');
    console.log('✅ Daily Automation Completed Successfully.');
  } catch (globalErr) {
    console.error('⚠️ Global Automation Execution Warning:', globalErr.message);
  }
}

runDailyAutomation();
