const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Mayn\\.openclaw\\workspace\\ounin-clone';
const fontLink = '  <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap" rel="stylesheet">';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('Comfortaa')) {
    console.log('Skipped (already has): ' + file);
    return;
  }
  // Insert before </head>
  content = content.replace('</head>', fontLink + '\n</head>');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Added Comfortaa to: ' + file);
});

console.log('Done!');
