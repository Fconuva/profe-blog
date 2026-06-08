const fs = require('fs');
const content = fs.readFileSync('admin/index.html', 'utf8');
const lines = content.split('\n');
for (let i = 1499; i <= 1512; i++) {
    console.log(`${i+1}: ${lines[i]}`);
    if (lines[i]) {
        const codes = [];
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char.charCodeAt(0) > 127) {
                codes.push(`${char} (U+${char.charCodeAt(0).toString(16).toUpperCase()})`);
            }
        }
        if (codes.length > 0) {
            console.log(`   Non-ASCII characters: ${codes.join(', ')}`);
        }
    }
}
