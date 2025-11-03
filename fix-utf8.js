const fs = require('fs');
const path = require('path');

// This script recursively scans files and replaces common corrupted UTF-8 sequences
// Usage: node fix-utf8.js

const exts = ['.html', '.htm', '.js', '.json', '.md', '.njk', '.txt'];
const repoRoot = __dirname;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat && stat.isDirectory()) {
            if (file === '.git' || file === 'node_modules' || file === '_site') return;
            results = results.concat(walk(full));
        } else {
            if (exts.includes(path.extname(full).toLowerCase())) results.push(full);
        }
    });
    return results;
}

const files = walk(repoRoot);
let totalFilesChanged = 0;
let totalReplacements = 0;

const fixes = [
    // Common corrupted emoji sequences → intended emoji / symbol
    [/📖/g, '📖'],
    [/🤖/g, '🤖'],
    [/�/g, '�'],
    [/📦/g, '📦'],
    [/💾/g, '💾'],
    [/🗄️/g, '🗄️'],
    [/�/g, '�'],
    [/�/g, '�'],
    [/🧹/g, '🧹'],
    [/🔧/g, '🔧'],
    [/�/g, '�'],
    [/�/g, '�'],
    [/�/g, '�'],
    [/�/g, '�'],
    [/�/g, '�'],
    [/✅/g, '✅'],
    [/📚/g, '📚'],

    // Sequences often produced by double-encoding or PowerShell Set-Content errors
    [/ℹ️/g, 'ℹ️'],
    [//g, ''],
    [/'/g, "'"],
    [/'/g, "'"],
    [/"/g, '"'],
    [/â€\u0000/g, '"'],
    [/–/g, '–'],
    [/—/g, '—'],
    [/…/g, '…'],
    [//g, ''],

    // Common UTF-8 mis-encodings for accented characters
    [/á/g, 'á'],
    [/é/g, 'é'],
    [/í/g, 'í'],
    [/í/g, 'í'],
    [/ó/g, 'ó'],
    [/ú/g, 'ú'],
    [/ñ/g, 'ñ'],
    [/ñ/g, 'ñ'],
    [/Á/g, 'Á'],
    [/Ó/g, 'Ó'],

    // Arrows and other symbols
    [/→/g, '→'],
    [/→/g, '→'],
    [/â→/g, '→'],

    // Clean weird leftover bytes
    [/¢/g, '¢'],
    [/¿/g, '¿'],
    [/¡/g, '¡']
];

// Remove any residual sequences that start with the typical corrupted prefix ðŸ
// This is a catch-all to remove remaining garbled bytes (safe for logs/comments)
fixes.push([/ðŸ[^\s"'<>]*/g, '']);

files.forEach(file => {
    try {
        let content = fs.readFileSync(file, 'utf8');
        let original = content;
        let fileReplacements = 0;

        fixes.forEach(([pattern, replacement]) => {
            const before = content;
            content = content.replace(pattern, replacement);
            if (content !== before) {
                const diff = (before.match(new RegExp(pattern.source, 'g')) || []).length;
                fileReplacements += diff;
            }
        });

        if (fileReplacements > 0) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated ${file} — replacements: ${fileReplacements}`);
            totalFilesChanged++;
            totalReplacements += fileReplacements;
        }
    } catch (err) {
        console.error('Error processing', file, err.message);
    }
});

console.log('\nSummary:');
console.log(`Files scanned: ${files.length}`);
console.log(`Files modified: ${totalFilesChanged}`);
console.log(`Total replacements: ${totalReplacements}`);

if (totalFilesChanged === 0) console.log('No changes made — you may add more patterns to the fixes array.');
