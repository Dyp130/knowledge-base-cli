const chalk = require('chalk');
const { search } = require('../utils/search');

function searchNotes(query, options) {
  if (!query || typeof query !== 'string') {
    console.log(chalk.red('  Please provide a search query.'));
    return;
  }

  const results = search(query);
  const limit = parseInt(options.limit) || 10;

  console.log('');
  if (results.length === 0) {
    console.log(chalk.yellow('  No notes found matching: ') + chalk.bold(query));
    console.log('');
    return;
  }

  console.log('  ' + chalk.dim(`Found ${results.length} note(s) for: `) + chalk.bold(query));
  console.log('');

  const display = results.slice(0, limit);

  for (const r of display) {
    const scoreBar = r.score >= 60 ? chalk.green('●') :
                     r.score >= 30 ? chalk.yellow('●') :
                     chalk.dim('●');

    console.log('  ' + scoreBar + ' ' + chalk.cyan(r.title) + chalk.dim(`  (${r.relativePath})`));

    if (r.tags.length > 0) {
      console.log('    ' + r.tags.map(t => chalk.blue('#' + t)).join(' '));
    }

    // Highlight query in snippet
    const qLower = query.toLowerCase();
    const snipLower = r.snippet.toLowerCase();
    const idx = snipLower.indexOf(qLower);
    let snippet = r.snippet;
    if (idx >= 0) {
      snippet =
        r.snippet.substring(0, idx) +
        chalk.bgYellow.black(r.snippet.substring(idx, idx + query.length)) +
        r.snippet.substring(idx + query.length);
    }
    console.log('    ' + chalk.dim(snippet));
    console.log('');
  }

  if (results.length > limit) {
    console.log('  ' + chalk.dim(`...and ${results.length - limit} more. Use --limit to show more.`));
    console.log('');
  }
}

module.exports = { searchNotes };
