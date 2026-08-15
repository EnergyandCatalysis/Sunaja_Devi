import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateTextAbstract } from './abstractGenerator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'publicationsDb.json');
const LATEST_PUBS_PATH = path.join(__dirname, '..', 'data', 'latestPublications.json');

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    // Seed initial database from existing latestPublications.json if present
    let initialData = [];
    if (fs.existsSync(LATEST_PUBS_PATH)) {
      try {
        const raw = fs.readFileSync(LATEST_PUBS_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        initialData = parsed.map((item) => ({
          id: generatePaperId(item.title, item.doi),
          title: item.title,
          abstract: item.abstract || '',
          authors: item.authors || 'Sunaja Devi K R et al.',
          journal: item.journal || 'Peer-reviewed Journal',
          publication_date: item.actualPublishDate || `${item.year || '2026'}-01-01`,
          year: item.year || '2026',
          link: item.doi ? (item.doi.startsWith('http') ? item.doi : `https://doi.org/${item.doi}`) : '',
          doi: item.doi || '',
          graphical_abstract_url: item.graphicalAbstract || '',
          is_new_notified: true, // Seeded papers marked as already notified
          created_at: new Date().toISOString(),
        }));
      } catch (err) {
        console.error('Error seeding DB from latestPublications.json:', err);
      }
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

export function generatePaperId(title, doi) {
  if (doi && doi.trim()) {
    const cleanDoi = doi.trim().toLowerCase().replace(/^https?:\/\/doi\.org\//i, '');
    return `doi-${cleanDoi.replace(/[^a-z0-9]+/g, '-')}`;
  }
  const cleanTitle = (title || 'pub')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 50);
  return `pub-${cleanTitle}`;
}

export function normalizeTitle(title) {
  if (!title) return '';
  return title
    .normalize('NFKD')
    .toLowerCase()
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
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

export function getPublications() {
  ensureDbExists();
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading publications database:', err);
    return [];
  }
}

export function savePublications(pubs) {
  ensureDbExists();
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(pubs, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving publications database:', err);
    return false;
  }
}

export function getUnnotifiedPublications() {
  const pubs = getPublications();
  return pubs.filter((p) => p.is_new_notified === false);
}

export function markAsNotified(id) {
  const pubs = getPublications();
  let updated = false;
  const updatedPubs = pubs.map((p) => {
    if (p.id === id || p.doi === id) {
      updated = true;
      return { ...p, is_new_notified: true };
    }
    return p;
  });

  if (updated) {
    savePublications(updatedPubs);
  }
  return updated;
}

export function upsertPublication(paperData) {
  const pubs = getPublications();
  const targetId = paperData.id || generatePaperId(paperData.title, paperData.doi);
  const normTitle = normalizeTitle(paperData.title);
  const normDoi = paperData.doi ? paperData.doi.toLowerCase().trim() : '';

  const existingIndex = pubs.findIndex((p) => {
    if (p.id === targetId) return true;
    if (normDoi && p.doi && p.doi.toLowerCase().trim() === normDoi) return true;
    if (normTitle && normalizeTitle(p.title) === normTitle) return true;
    return false;
  });

  if (existingIndex >= 0) {
    const existing = pubs[existingIndex];
    const candidateAbstract = paperData.abstract || existing.abstract || '';
    const mergedAbstract = generateTextAbstract({ ...existing, ...paperData, abstract: candidateAbstract });

    const merged = {
      ...existing,
      ...paperData,
      id: existing.id,
      abstract: mergedAbstract,
      graphical_abstract_url: paperData.graphical_abstract_url || existing.graphical_abstract_url || '',
      is_new_notified: existing.is_new_notified !== undefined ? existing.is_new_notified : false,
    };
    pubs[existingIndex] = merged;
    savePublications(pubs);
    return { publication: merged, isNew: false };
  } else {
    const newRecord = {
      id: targetId,
      title: paperData.title || 'Untitled Publication',
      abstract: generateTextAbstract(paperData),
      authors: paperData.authors || 'Sunaja Devi K R et al.',
      journal: paperData.journal || 'Peer-reviewed Journal',
      publication_date: paperData.publication_date || `${paperData.year || new Date().getFullYear()}-01-01`,
      year: paperData.year || String(new Date().getFullYear()),
      link: paperData.link || (paperData.doi ? `https://doi.org/${paperData.doi}` : ''),
      doi: paperData.doi || '',
      graphical_abstract_url: paperData.graphical_abstract_url || '',
      is_new_notified: false, // New paper defaults to unnotified
      created_at: new Date().toISOString(),
    };
    pubs.unshift(newRecord);
    savePublications(pubs);
    return { publication: newRecord, isNew: true };
  }
}
