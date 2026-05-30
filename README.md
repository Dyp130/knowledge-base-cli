# kb-cli

A personal knowledge base CLI with wiki-style links, tags, and full-text search. Notes are stored as plain markdown files in `~/.kb/notes/` — portable, editor-friendly, and version-control ready.

## Features

- **Wiki links** — `[[bidirectional links]]` with backlink tracking
- **Tags** — organize notes with frontmatter tags
- **Full-text search** — scored search across titles, tags, and body
- **Daily notes** — one command to create or open today's note
- **Plain markdown** — all notes are `.md` files, readable by any editor
- **Zero config** — just `kb init` and start writing

## Installation

```bash
npm install -g github:Dyp130/knowledge-base-cli
```

## Quick Start

```bash
# Initialize your knowledge base
kb init

# Create a note
kb new "Getting Started with React" -t react,javascript

# Create or open today's daily note
kb daily

# Search all notes
kb search "react hooks"

# List all notes
kb list

# Filter by tag
kb list -t react

# Show all tags with counts
kb tags

# Link two notes (bidirectional)
kb link "Note A" "Note B"

# Show links for a note
kb links "Note A"

# Open a note in your default editor
kb open "Getting Started with React"
```

## How It Works

Notes are stored as markdown files with YAML frontmatter:

```markdown
---
title: "Getting Started with React"
created: 2025-05-30T00:00:00.000Z
modified: 2025-05-30T00:00:00.000Z
tags: [react, javascript]
links: [useState Hook, JSX Basics]
---

# Getting Started with React

React is a library for building user interfaces...

See also: [[useState Hook]] and [[JSX Basics]]
```

All data lives in `~/.kb/` — back it up, sync it, or version it with git.

## Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `kb init` | — | Initialize a new knowledge base |
| `kb new <title>` | — | Create a note with title and optional tags |
| `kb daily` | — | Create or open today's daily note |
| `kb search <query>` | `kb s` | Full-text search with relevance scoring |
| `kb list` | `kb ls` | List all notes, optionally filter by tag |
| `kb tags` | — | Show all tags with usage counts |
| `kb link <from> <to>` | — | Create bidirectional link between notes |
| `kb links <title>` | — | Show outgoing and incoming links for a note |
| `kb open <title>` | `kb o` | Open a note in your default editor |

## Options

| Option | Applies to | Description |
|--------|-----------|-------------|
| `-t, --tag <tags>` | `new`, `list` | Comma-separated tags or tag filter |
| `-c, --content <text>` | `new` | Note body content |
| `-l, --limit <n>` | `search` | Max search results (default: 10) |

## License

MIT
