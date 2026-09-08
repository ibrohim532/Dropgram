/**
 * DropGram — applies API_ID / API_HASH from .env into app/js/lib/config.js
 * Run automatically before build/serve (see package.json), or manually:
 *   node scripts/apply-env.js
 * Requires a .env file at the project root (copy .env.example -> .env first).
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const envPath = path.join(root, '.env');
const configPath = path.join(root, 'app/js/lib/config.js');

if (!fs.existsSync(envPath)) {
  console.error('[dropgram] .env not found. Copy .env.example to .env and fill in your API_ID / API_HASH from https://my.telegram.org');
  process.exit(1);
}

const env = {};
fs.readFileSync(envPath, 'utf8').split('\n').forEach(function (line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const idx = trimmed.indexOf('=');
  if (idx === -1) return;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
});

if (!env.API_ID || !env.API_HASH) {
  console.error('[dropgram] .env is missing API_ID or API_HASH');
  process.exit(1);
}

let config = fs.readFileSync(configPath, 'utf8');
config = config.replace(/id:\s*\d+,/, 'id: ' + env.API_ID + ',');
config = config.replace(/hash:\s*'[^']*',/, "hash: '" + env.API_HASH + "',");
fs.writeFileSync(configPath, config, 'utf8');

console.log('[dropgram] API_ID / API_HASH from .env applied to app/js/lib/config.js');
