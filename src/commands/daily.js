const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { DAILY_DIR, ensureDirs, getConfig, saveConfig } = require('../utils/config');
const { writeNote, readNote } = require('../utils/frontmatter');

function daily() {
  ensureDirs();

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const filename = dateStr + '.md';
  const filePath = path.join(DAILY_DIR, filename);

  let content = '';
  let meta;

  if (fs.existsSync(filePath)) {
    const existing = readNote(filePath);
    meta = existing;
    content = existing.content;
    console.log('');
    console.log(chalk.yellow('  Daily note already exists. Opening...'));
  } else {
    const dayName = today.toLocaleDateString(undefined, { weekday: 'long' });
    meta = {
      title: dateStr,
      created: today.toISOString(),
      modified: today.toISOString(),
      tags: ['daily'],
      links: [],
    };
    content = `# ${dateStr} ${dayName}\n\n## Notes\n\n\n## Tasks\n\n- [ ] \n\n## Reflections\n\n`;
    writeNote(filePath, meta, content);

    const config = getConfig();
    if (config) {
      config.noteCount = (config.noteCount || 0) + 1;
      saveConfig(config);
    }
  }

  console.log('');
  console.log('  ' + chalk.bold(meta.title || dateStr));
  console.log('  ' + chalk.dim('─'.repeat(40)));
  console.log(content.split('\n').map(l => '  ' + chalk.dim('│ ') + l).join('\n'));
  console.log('  ' + chalk.dim('─'.repeat(40)));
  console.log('  ' + chalk.dim('File: ') + filePath);
  console.log('');
}

module.exports = { daily };
