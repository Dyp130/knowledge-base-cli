const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { NOTES_DIR, ensureDirs, slugify, getConfig, saveConfig } = require('../utils/config');
const { writeNote, parseWikiLinks, updateBacklinks } = require('../utils/frontmatter');
const { getAllNotes } = require('../utils/search');

function create(title, options) {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    console.log(chalk.red('  Please provide a note title.'));
    return;
  }

  title = title.trim();
  ensureDirs();

  const tags = options.tag ? options.tag.split(',').map(t => t.trim()).filter(Boolean) : [];
  const now = new Date().toISOString();
  const slug = slugify(title);
  const filename = slug + '.md';
  const filePath = path.join(NOTES_DIR, filename);

  if (fs.existsSync(filePath)) {
    console.log(chalk.red('  Note already exists: ') + filename);
    return;
  }

  const content = options.content || '';
  const links = parseWikiLinks(content);

  const meta = {
    title,
    created: now,
    modified: now,
    tags,
    links,
  };

  try {
    writeNote(filePath, meta, content);
  } catch (err) {
    console.log(chalk.red('  Failed to create note: ') + err.message);
    return;
  }

  // Update backlinks
  const allNotes = getAllNotes();
  updateBacklinks(allNotes, filePath, links);

  // Update config
  const config = getConfig();
  if (config) {
    config.noteCount = Object.keys(allNotes).length + 1;
    saveConfig(config);
  }

  console.log('');
  console.log(chalk.green('  Note created!'));
  console.log('  ' + chalk.dim('Title: ') + title);
  console.log('  ' + chalk.dim('File:  ') + filename);
  if (tags.length > 0) {
    console.log('  ' + chalk.dim('Tags:  ') + tags.map(t => chalk.blue('#' + t)).join(' '));
  }
  if (links.length > 0) {
    console.log('  ' + chalk.dim('Links: ') + links.map(l => chalk.magenta('[[' + l + ']]')).join(' '));
  }
  console.log('');
}

module.exports = { create };
