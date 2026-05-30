const matter = require('gray-matter');
const fs = require('fs');
const path = require('path');

function readNote(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  return {
    title: data.title || '',
    tags: data.tags || [],
    created: data.created || '',
    modified: data.modified || '',
    links: data.links || [],
    content: content.trim(),
  };
}

function writeNote(filePath, meta, content) {
  const frontmatter = {
    title: meta.title,
    created: meta.created,
    modified: meta.modified,
    tags: meta.tags || [],
    links: meta.links || [],
  };
  const body = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, body);
}

function parseWikiLinks(content) {
  const regex = /\[\[([^\]]+)\]\]/g;
  const links = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    links.push(match[1].trim());
  }
  return [...new Set(links)];
}

function updateBacklinks(allNotes, currentFile, outgoingLinks) {
  const currentTitle = path.basename(currentFile, '.md');
  const results = { added: [], removed: [] };

  for (const [filePath, note] of Object.entries(allNotes)) {
    if (filePath === currentFile) continue;
    const noteLinks = note.links || [];
    const hasLink = noteLinks.includes(currentTitle);

    if (outgoingLinks.includes(path.basename(filePath, '.md')) && !hasLink) {
      noteLinks.push(currentTitle);
      note.links = [...new Set(noteLinks)];
      writeNote(filePath, { ...note, links: note.links }, note.content);
      results.added.push(note.title || path.basename(filePath, '.md'));
    }
  }
  return results;
}

module.exports = { readNote, writeNote, parseWikiLinks, updateBacklinks };
