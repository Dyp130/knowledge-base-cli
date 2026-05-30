const { exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const { NOTES_DIR, slugify } = require('../utils/config');
const { getAllNotes } = require('../utils/search');

function openNote(title) {
  if (!title || typeof title !== 'string') {
    console.log(chalk.red('  Please provide a note title.'));
    return;
  }

  const allNotes = getAllNotes();
  let targetPath;

  for (const [filePath, note] of Object.entries(allNotes)) {
    const t = note.title || path.basename(filePath, '.md');
    if (slugify(t) === slugify(title) || t === title) {
      targetPath = filePath;
      break;
    }
  }

  if (!targetPath) {
    console.log(chalk.red('  Note not found: ') + title);
    return;
  }

  const relPath = path.relative(NOTES_DIR, targetPath);
  console.log(chalk.dim('  Opening ') + relPath + chalk.dim('...'));

  const resolvedPath = path.resolve(targetPath);
  let cmd;
  if (process.platform === 'win32') {
    cmd = `start "" "${resolvedPath}"`;
  } else if (process.platform === 'darwin') {
    cmd = `open "${resolvedPath}"`;
  } else {
    cmd = `xdg-open "${resolvedPath}"`;
  }

  exec(cmd, (err) => {
    if (err) {
      console.log(chalk.yellow('  Could not open editor. File: ') + resolvedPath);
    }
  });
}

module.exports = { openNote };
