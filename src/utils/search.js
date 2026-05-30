const fs = require('fs');
const path = require('path');
const { NOTES_DIR } = require('./config');
const { readNote } = require('./frontmatter');

function getAllNotes() {
  const notes = {};
  if (!fs.existsSync(NOTES_DIR)) return notes;

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.name.endsWith('.md')) {
        try {
          const note = readNote(fullPath);
          notes[fullPath] = note;
        } catch {
          // Skip unreadable files
        }
      }
    }
  }
  walk(NOTES_DIR);
  return notes;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function search(query) {
  const allNotes = getAllNotes();
  const q = query.toLowerCase();
  const results = [];

  for (const [filePath, note] of Object.entries(allNotes)) {
    let score = 0;
    const title = (note.title || path.basename(filePath, '.md')).toLowerCase();
    const tags = (note.tags || []).join(' ').toLowerCase();

    // Title scoring
    if (title === q) {
      score += 100;
    } else if (title.includes(q)) {
      score += 50;
    } else if (title.split(/[\s-]+/).some(w => w.startsWith(q))) {
      score += 30;
    }

    // Tag scoring
    for (const tag of note.tags || []) {
      if (tag.toLowerCase() === q) {
        score += 40;
      } else if (tag.toLowerCase().includes(q)) {
        score += 20;
      }
    }

    // Body scoring
    const body = note.content.toLowerCase();
    const bodyMatches = (body.match(new RegExp(escapeRegex(q), 'gi')) || []).length;
    score += Math.min(bodyMatches * 5, 30);

    if (score > 0) {
      results.push({
        filePath,
        title: note.title || path.basename(filePath, '.md'),
        tags: note.tags || [],
        score,
        snippet: getSnippet(note.content, q),
        created: note.created,
        relativePath: path.relative(NOTES_DIR, filePath),
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

function getSnippet(content, query) {
  const q = query.toLowerCase();
  const idx = content.toLowerCase().indexOf(q);
  if (idx === -1) return content.substring(0, 120);
  const start = Math.max(0, idx - 40);
  const end = Math.min(content.length, idx + query.length + 60);
  let snippet = content.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  return snippet;
}

module.exports = { getAllNotes, search };
