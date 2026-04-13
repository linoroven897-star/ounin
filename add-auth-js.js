const fs = require('fs');
const path = require('path');

const blogDir = __dirname;
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has auth.js
  if (content.includes('auth.js')) {
    return;
  }
  
  // Add auth.js after main.js
  if (content.includes('main.js')) {
    content = content.replace('main.js"></script>', 'main.js"></script>\n  <script src="assets/js/auth.js"></script>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Added auth.js to:', file);
  }
});
