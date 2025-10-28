const fs = require('fs');
const path = require('path');

// Read root package.json
const pkg = require('../package.json');

// Read extension manifest.json
const manifestPath = path.join(__dirname, '../apps/extension/manifest.json');
const manifest = require(manifestPath);

// Update manifest version
manifest.version = pkg.version;

// Write back to manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log('✓ Synced version', pkg.version, 'to manifest.json');
