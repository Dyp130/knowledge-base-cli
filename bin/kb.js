#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const { init } = require('../src/commands/init');
const { create } = require('../src/commands/new');
const { daily } = require('../src/commands/daily');
const { searchNotes } = require('../src/commands/search');
const { listNotes, listTags } = require('../src/commands/list');
const { link, showLinks } = require('../src/commands/link');
const { openNote } = require('../src/commands/open');
const { getConfig } = require('../src/utils/config');

const program = new Command();

program
  .name('kb')
  .description(chalk.cyan('📚 Personal Knowledge Base CLI'))
  .version('1.0.0');

// kb init
program
  .command('init')
  .description('Initialize a new knowledge base')
  .action(() => init());

// kb new <title>
program
  .command('new')
  .description('Create a new note')
  .argument('<title>', 'Note title')
  .option('-t, --tag <tags>', 'Comma-separated tags (e.g. "javascript, tutorial")')
  .option('-c, --content <text>', 'Note content')
  .action((title, options) => create(title, options));

// kb daily
program
  .command('daily')
  .description('Create or open today\'s daily note')
  .action(() => daily());

// kb search <query>
program
  .command('search')
  .alias('s')
  .description('Full-text search across all notes')
  .argument('<query>', 'Search query')
  .option('-l, --limit <n>', 'Max results to show', '10')
  .action((query, options) => searchNotes(query, options));

// kb list
program
  .command('list')
  .alias('ls')
  .description('List all notes')
  .option('-t, --tag <tag>', 'Filter by tag')
  .action((options) => listNotes(options));

// kb tags
program
  .command('tags')
  .description('Show all tags with counts')
  .action(() => listTags());

// kb link <from> <to>
program
  .command('link')
  .description('Create bidirectional link between two notes')
  .argument('<from>', 'Source note title')
  .argument('<to>', 'Target note title')
  .action((from, to) => link(from, to));

// kb links <title>
program
  .command('links')
  .description('Show all links for a note (outgoing + backlinks)')
  .argument('<title>', 'Note title')
  .action((title) => showLinks(title));

// kb open <title>
program
  .command('open')
  .alias('o')
  .description('Open a note in default editor')
  .argument('<title>', 'Note title')
  .action((title) => openNote(title));

// Check if kb is initialized for subcommands that need it
program.hook('preAction', (thisCommand, actionCommand) => {
  const noInitRequired = ['init'];
  if (!noInitRequired.includes(actionCommand.name())) {
    const config = getConfig();
    if (!config) {
      console.log('');
      console.log(chalk.yellow('  No knowledge base found. Run ') + chalk.cyan('kb init') + chalk.yellow(' first.'));
      console.log('');
      process.exit(1);
    }
  }
});

// Default: show help
program.action(() => {
  program.outputHelp();
});

program.parse();
