#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const sourceExamplesDir = path.resolve(__dirname, '../examples');
const targetRepoDir = path.resolve(__dirname, '../../babylonml-frontend'); // Assumes sibling directory
const targetExamplesDir = path.join(targetRepoDir, 'examples');

// --- Get CDN URL from command line arguments ---
const cdnUrl = process.argv[2];
if (!cdnUrl) {
  console.error('Error: Please provide the CDN URL as the first argument.');
  console.error('Usage: node scripts/sync-examples.js <your-cdn-url>');
  process.exit(1);
}

console.log(`Using CDN URL: ${cdnUrl}`);
console.log(`Source examples: ${sourceExamplesDir}`);
console.log(`Target examples: ${targetExamplesDir}`);

// --- Main async function ---
async function syncExamples() {
  try {
    // 1. Check if target repo exists
    try {
      await fs.access(targetRepoDir);
      console.log(`Target repository found: ${targetRepoDir}`);
    } catch (err) {
      console.error(`Error: Target repository directory not found at ${targetRepoDir}`);
      console.error('Please ensure babylonml-frontend is a sibling directory.');
      process.exit(1);
    }

    // 2. Remove existing target examples directory
    console.log(`Removing existing directory: ${targetExamplesDir}...`);
    await fs.rm(targetExamplesDir, { recursive: true, force: true });
    console.log('Existing target directory removed.');

    // 3. Copy examples directory recursively
    console.log(`Copying examples from ${sourceExamplesDir} to ${targetExamplesDir}...`);
    await fs.cp(sourceExamplesDir, targetExamplesDir, { recursive: true });
    console.log('Examples copied successfully.');

    // 4. Find and process HTML files
    console.log('Processing HTML files to replace script paths...');
    const htmlFiles = await findHtmlFiles(targetExamplesDir);
    let filesProcessed = 0;

    for (const filePath of htmlFiles) {
      try {
        let content = await fs.readFile(filePath, 'utf8');
        const originalContent = content;

        // Regex to find script tags pointing to local dist/babylonml(.min).js
        // It captures the part before the src value and the part after it.
        const scriptTagRegex = /(<script\s+[^>]*src\s*=\s*["'])(?:[^"']+\/)?dist\/babylonml(?:\.min)?\.js(["'][^>]*>)/gi;

        let replacementsMade = false;
        content = content.replace(scriptTagRegex, (match, prefix, suffix) => {
          console.log(`  - Replacing script path in: ${path.relative(targetRepoDir, filePath)}`);
          replacementsMade = true;
          return `${prefix}${cdnUrl}${suffix}`; // Replace with CDN URL
        });

        if (replacementsMade) {
          await fs.writeFile(filePath, content, 'utf8');
          filesProcessed++;
        }
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    }

    console.log(`Finished processing. ${filesProcessed} HTML file(s) updated.`);
    console.log('Sync complete!');

  } catch (err) {
    console.error('An error occurred during the sync process:', err);
    process.exit(1);
  }
}

// --- Helper function to find HTML files recursively ---
async function findHtmlFiles(dir) {
  let htmlFiles = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        htmlFiles = htmlFiles.concat(await findHtmlFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  } catch (err) {
    // Ignore errors like directory not existing initially
    if (err.code !== 'ENOENT') {
      console.error(`Error reading directory ${dir}:`, err);
    }
  }
  return htmlFiles;
}

// --- Run the sync process ---
syncExamples();
