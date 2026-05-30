const path = require('path');
const chalk = require('chalk');
const { slugify } = require('../utils/config');
const { readNote, writeNote } = require('../utils/frontmatter');
const { getAllNotes } = require('../utils/search');

function link(fromTitle, toTitle) {
  if (!fromTitle || !toTitle) {
    console.log(chalk.red('  Please provide both source and target note titles.'));
    return;
  }

  const allNotes = getAllNotes();

  let fromPath, toPath;
  for (const [filePath, note] of Object.entries(allNotes)) {
    const title = note.title || path.basename(filePath, '.md');
    const slug = slugify(title);
    if (slug === slugify(fromTitle) || title === fromTitle) fromPath = filePath;
    if (slug === slugify(toTitle) || title === toTitle) toPath = filePath;
  }

  if (!fromPath) {
    console.log(chalk.red('  Source note not found: ') + fromTitle);
    return;
  }
  if (!toPath) {
    console.log(chalk.red('  Target note not found: ') + toTitle);
    return;
  }

  const fromNote = readNote(fromPath);
  const toNote = readNote(toPath);
  const toName = toNote.title || path.basename(toPath, '.md');

  // Add link to fromNote's frontmatter
  const links = fromNote.links || [];
  if (!links.includes(toName)) {
    links.push(toName);
    fromNote.links = links;
    fromNote.modified = new Date().toISOString();
    writeNote(fromPath, fromNote, fromNote.content);
  }

  // Add backlink to toNote's frontmatter
  const fromName = fromNote.title || path.basename(fromPath, '.md');
  const toLinks = toNote.links || [];
  if (!toLinks.includes(fromName)) {
    toLinks.push(fromName);
    toNote.links = toLinks;
    toNote.modified = new Date().toISOString();
    writeNote(toPath, toNote, toNote.content);
  }

  console.log('');
  console.log(chalk.green('  Link created!'));
  console.log('  ' + chalk.cyan(fromName) + chalk.dim(' → ') + chalk.magenta('[[' + toName + ']]'));
  console.log('');
}

function showLinks(title) {
  if (!title) {
    console.log(chalk.red('  Please provide a note title.'));
    return;
  }

  const allNotes = getAllNotes();
  let targetPath, targetNote;

  for (const [filePath, note] of Object.entries(allNotes)) {
    const t = note.title || path.basename(filePath, '.md');
    if (slugify(t) === slugify(title) || t === title) {
      targetPath = filePath;
      targetNote = note;
      break;
    }
  }

  if (!targetNote) {
    console.log(chalk.red('  Note not found: ') + title);
    return;
  }

  const targetName = targetNote.title || path.basename(targetPath, '.md');
  const backlinks = [];
  for (const [filePath, note] of Object.entries(allNotes)) {
    if (filePath === targetPath) continue;
    if ((note.links || []).includes(targetName)) {
      backlinks.push({ title: note.title || path.basename(filePath, '.md'), path: filePath });
    }
  }

  console.log('');
  console.log('  ' + chalk.bold(targetNote.title || targetName));
  console.log('');

  const outgoing = targetNote.links || [];
  if (outgoing.length > 0) {
    console.log('  ' + chalk.dim('Outgoing links:'));
    for (const link of outgoing) {
      console.log('    ' + chalk.magenta('[[' + link + ']]'));
    }
    console.log('');
  }

  if (backlinks.length > 0) {
    console.log('  ' + chalk.dim('Backlinks:'));
    for (const bl of backlinks) {
      console.log('    ' + chalk.cyan(bl.title));
    }
    console.log('');
  }

  if (outgoing.length === 0 && backlinks.length === 0) {
    console.log(chalk.yellow('  No links yet.'));
    console.log('');
  }
}

module.exports = { link, showLinks };
