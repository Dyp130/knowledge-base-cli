const fs = require('fs');
const path = require('path');
const os = require('os');

const KB_DIR = path.join(os.homedir(), '.kb');
const NOTES_DIR = path.join(KB_DIR, 'notes');
const DAILY_DIR = path.join(NOTES_DIR, 'daily');
const CONFIG_FILE = path.join(KB_DIR, 'config.json');

function getConfig() {
  try {
    if (!fs.existsSync(CONFIG_FILE)) return null;
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  } catch {
    return null;
  }
}

function saveConfig(config) {
  if (!fs.existsSync(KB_DIR)) {
    fs.mkdirSync(KB_DIR, { recursive: true });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

function ensureDirs() {
  if (!fs.existsSync(NOTES_DIR)) {
    fs.mkdirSync(NOTES_DIR, { recursive: true });
  }
  if (!fs.existsSync(DAILY_DIR)) {
    fs.mkdirSync(DAILY_DIR, { recursive: true });
  }
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9一-鿿]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

module.exports = { KB_DIR, NOTES_DIR, DAILY_DIR, CONFIG_FILE, getConfig, saveConfig, ensureDirs, slugify };
