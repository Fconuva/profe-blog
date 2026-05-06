const fs = require('fs');

// Fix pedro_paramo JSON
let c = fs.readFileSync('pedro_paramo_nm3_2026_base.json', 'utf8');

// The problem: inside HTML strings in the JSON, there are unescaped double quotes  
// like "En su nombre..." which break JSON parsing.
// Strategy: replace inner dialogue double quotes with curly/typographic quotes  
// inside HTML property values.

// First, let's find the exact issues
let lines = c.split('\n');
let fixedLines = [];
let fixCount = 0;

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Only process lines that contain html properties
  if (line.includes('"html"')) {
    // Extract the HTML content between the outer quotes
    let match = line.match(/^(\s*\{"html":\s*")(.*)("\}[,]?\s*)$/);
    if (match) {
      let prefix = match[1];
      let content = match[2];
      let suffix = match[3];
      
      // In the content, find unescaped double quotes that aren't part of HTML attributes
      // HTML attributes use style='...' (single quotes), so any double quote in content
      // that isn't escaped (\") is a problem
      
      // Replace remaining unescaped double quotes in the text content with curly quotes
      // But we need to be careful about HTML attribute quotes
      let fixed = content;
      
      // Find pairs of unescaped quotes in text (not HTML attrs)
      // Replace " that appears after > or text with \u201c (opening) and \u201d (closing)
      let inQuote = false;
      let chars = [...fixed];
      let result = [];
      
      for (let j = 0; j < chars.length; j++) {
        if (chars[j] === '"' && (j === 0 || chars[j-1] !== '\\')) {
          // This is an unescaped double quote in the content
          // Check if it's part of an HTML attribute (preceded by = or inside a tag)
          // Actually in our HTML, all attributes use single quotes, so any unescaped " is text content
          if (!inQuote) {
            result.push('\u201c');
            inQuote = true;
          } else {
            result.push('\u201d');
            inQuote = false;
          }
          fixCount++;
        } else {
          result.push(chars[j]);
        }
      }
      
      fixedLines.push(prefix + result.join('') + suffix);
    } else {
      fixedLines.push(line);
    }
  } else {
    fixedLines.push(line);
  }
}

let fixedContent = fixedLines.join('\n');

// Validate
try {
  JSON.parse(fixedContent);
  console.log('Pedro JSON is now VALID. Fixed ' + fixCount + ' inner quotes.');
  fs.writeFileSync('pedro_paramo_nm3_2026_base.json', fixedContent, 'utf8');
  console.log('File saved.');
} catch (e) {
  console.log('Still broken:', e.message);
  // Write to debug file
  fs.writeFileSync('_pedro_debug.json', fixedContent, 'utf8');
  console.log('Debug file written to _pedro_debug.json');
}

// Also check maus
try {
  JSON.parse(fs.readFileSync('maus_nm4_2026_base.json', 'utf8'));
  console.log('Maus JSON is VALID.');
} catch (e) {
  console.log('Maus JSON has error:', e.message);
}
