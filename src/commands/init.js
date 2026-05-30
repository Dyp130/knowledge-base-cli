const chalk = require('chalk');
const { KB_DIR, NOTES_DIR, DAILY_DIR, saveConfig, ensureDirs } = require('../utils/config');

function init() {
  ensureDirs();

  const config = {
    version: '1.0.0',
    created: new Date().toISOString(),
    noteCount: 0,
  };

  saveConfig(config);

  console.log('');
  console.log(chalk.green('  Knowledge base initialized!'));
  console.log('');
  console.log('  ' + chalk.dim('Location:') + ' ' + KB_DIR);
  console.log('  ' + chalk.dim('Notes:   ') + ' ' + NOTES_DIR);
  console.log('  ' + chalk.dim('Daily:   ') + ' ' + DAILY_DIR);
  console.log('');
  console.log('  Get started:');
  console.log('    ' + chalk.cyan('kb new "My First Note"'));
  console.log('    ' + chalk.cyan('kb daily'));
  console.log('');
}

module.exports = { init };
