const path = require('path');
const chalk = require('chalk');
const { NOTES_DIR } = require('../utils/config');
const { getAllNotes } = require('../utils/search');

function listNotes(options) {
  const allNotes = getAllNotes();
  const noteEntries = Object.entries(allNotes);
  const tagFilter = options.tag ? options.tag.toLowerCase() : null;

  console.log('');
  console.log('  ' + chalk.bold('Knowledge Base'));
  console.log('  ' + chalk.dim(`Location: ${NOTES_DIR}`));
  console.log('  ' + chalk.dim(`Total notes: ${noteEntries.length}`));
  console.log('');

  if (noteEntries.length === 0) {
    console.log(chalk.yellow('  No notes yet. Create one with: kb new "Title"'));
    console.log('');
    return;
  }

  for (const [filePath, note] of noteEntries) {
    if (tagFilter && !(note.tags || []).some(t => t.toLowerCase() === tagFilter)) {
      continue;
    }

    const relPath = path.relative(NOTES_DIR, filePath);
    const dateStr = note.created ? new Date(note.created).toLocaleDateString() : '';

    console.log('  ' + chalk.cyan(note.title || path.basename(filePath, '.md')) + chalk.dim(`  (${relPath})`));

    const parts = [];
    if (dateStr) parts.push(chalk.dim(dateStr));
    if ((note.tags || []).length > 0) {
      parts.push(note.tags.map(t => chalk.blue('#' + t)).join(' '));
    }
    if ((note.links || []).length > 0) {
      parts.push(chalk.dim(`→ ${note.links.length} links`));
    }
    if (parts.length > 0) {
      console.log('    ' + parts.join('  '));
    }
  }
  console.log('');
}

function listTags() {
  const allNotes = getAllNotes();
  const tagCount = {};

  for (const note of Object.values(allNotes)) {
    for (const tag of note.tags || []) {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    }
  }

  const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);

  console.log('');
  if (sorted.length === 0) {
    console.log(chalk.yellow('  No tags found.'));
  } else {
    console.log('  ' + chalk.bold('Tags'));
    console.log('');
    for (const [tag, count] of sorted) {
      const bar = chalk.dim('█'.repeat(Math.min(count, 20)));
      console.log('  ' + chalk.blue('#' + tag) + '  ' + chalk.dim(`(${count})`) + '  ' + bar);
    }
  }
  console.log('');
}

module.exports = { listNotes, listTags };
