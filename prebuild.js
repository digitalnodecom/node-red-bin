#!/usr/bin/env node

/**
 * Prebuild script to fix ESM packages that @yao-pkg/pkg can't bundle.
 *
 * 1. Bundles `got` (ESM-only) into a single CJS file using esbuild
 * 2. Patches Node-RED sources to require() the CJS bundle instead of import('got')
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Step 1: Bundle got into a single CJS file
const gotBundlePath = path.join(__dirname, 'node_modules', 'got-cjs-bundle.js');
console.log('[prebuild] Bundling got as CJS...');
execSync(
  `npx esbuild node_modules/got/dist/source/index.js --bundle --platform=node --format=cjs --outfile=${gotBundlePath}`,
  { cwd: __dirname, stdio: 'inherit' }
);

// Step 2: Patch Node-RED files to use the CJS bundle
const patches = [
  {
    file: 'node_modules/@node-red/nodes/core/network/21-httprequest.js',
    from: /const \{ got \} = await import\('got'\)/,
    to: "const { got } = require('../../../../got-cjs-bundle.js'); /* patched */"
  },
  {
    file: 'node_modules/@node-red/runtime/lib/telemetry/index.js',
    from: /got = \(await import\('got'\)\)\.got/,
    to: "got = require('../../../../got-cjs-bundle.js') /* patched */"
  }
];

for (const patch of patches) {
  const filePath = path.join(__dirname, patch.file);
  if (!fs.existsSync(filePath)) {
    console.warn(`[prebuild] Warning: ${patch.file} not found, skipping`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (patch.from.test(content)) {
    content = content.replace(patch.from, patch.to);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[prebuild] Patched: ${patch.file}`);
  } else {
    console.log(`[prebuild] Already patched or no match: ${patch.file}`);
  }
}

console.log('[prebuild] Done');
