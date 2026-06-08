const fs = require('fs');
const path = require('path');
const vm = require('vm');

function checkSyntax(filePath) {
  console.log(`Checking syntax of: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ File does not exist: ${filePath}\n`);
    return 1;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract all <script> blocks that do not have an external src
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let blockIndex = 1;
  let totalErrors = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    const scriptContent = match[1].trim();
    if (!scriptContent) continue;

    // Skip if it is an external script reference
    if (match[0].includes('src=')) continue;

    try {
      new vm.Script(scriptContent, { filename: `${path.basename(filePath)} [Block ${blockIndex}]` });
      console.log(`  ✓ Script Block ${blockIndex} compiled successfully.`);
    } catch (err) {
      totalErrors++;
      console.error(`  ❌ Syntax error in Script Block ${blockIndex}:`);
      console.error(err.stack || err.message);
    }
    blockIndex++;
  }

  if (totalErrors === 0) {
    console.log(`✓ All script blocks in ${filePath} compiled perfectly with no syntax errors!\n`);
  } else {
    console.error(`❌ Found ${totalErrors} syntax errors in ${filePath}!\n`);
  }
  return totalErrors;
}

const baseDir = path.join(__dirname, '..');
const filesToCheck = [
  path.join(baseDir, 'admin', 'index.html'),
  path.join(baseDir, 'dashboard', 'index.html'),
  path.join(baseDir, 'cuenta', 'crear-cuenta.html'),
  path.join(baseDir, 'cuenta', 'login.html')
];

let totalErrors = 0;
filesToCheck.forEach(file => {
  totalErrors += checkSyntax(file);
});

if (totalErrors > 0) {
  console.error(`❌ Total compilation errors found: ${totalErrors}`);
  process.exit(1);
} else {
  console.log('✓ All core files compiled 100% perfectly with no JavaScript compilation/syntax errors!');
  process.exit(0);
}
