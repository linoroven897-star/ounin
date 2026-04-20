const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Mayn\\.openclaw\\workspace\\ounin-clone';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// Fix 1: Replace garbled promo bar emojis with clean text
const promoBarNew = `  <!-- PROMO BAR -->
  <div class="promo-bar">
    <div class="promo-track">
      <span class="promo-item">SUMMER SALE -- Up to 30% Off Steam Ovens</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Ships Within 48 Hours</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Restaurant-Quality Results at Home</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">2-Year Manufacturer Warranty</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Built for Home Chefs Who Demand More</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">The Perfect Gift for Any Kitchen</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Trusted by Thousands of Home Chefs</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">SUMMER SALE -- Up to 30% Off Steam Ovens</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Ships Within 48 Hours</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Restaurant-Quality Results at Home</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">2-Year Manufacturer Warranty</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Built for Home Chefs Who Demand More</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">The Perfect Gift for Any Kitchen</span>
      <span class="promo-item"> | </span>
      <span class="promo-item">Trusted by Thousands of Home Chefs</span>
    </div>
  </div>
`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('<!-- PROMO BAR -->')) {
    // Replace the whole promo bar section (from <!-- PROMO BAR --> to <!-- NAVBAR --> or just the promo bar div)
    content = content.replace(/<!-- PROMO BAR -->[\s\S]*?<\/div>\s*<\/div>\s*(<!-- NAVBAR -->|<!--\s*NAVBAR\s*-->)/, promoBarNew + '\n  <!-- NAVBAR -->');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed promo bar: ' + file);
  }
});

// Fix 2: Update USP section in index.html
const indexPath = path.join(dir, 'index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

const newUspCards = `        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
          </div>
          <h3 class="usp-title">2-Year Warranty</h3>
          <p class="usp-text">Full coverage with dedicated customer support</p>
        </div>
        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 class="usp-title">24/7 Support</h3>
          <p class="usp-text">Chefs and engineers ready to help</p>
        </div>
        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/></svg>
          </div>
          <h3 class="usp-title">Precision Control</h3>
          <p class="usp-text">1°C accuracy for perfect cooking results</p>
        </div>
        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          </div>
          <h3 class="usp-title">Easy Cleaning</h3>
          <p class="usp-text">Auto-clean cycle, effortless maintenance</p>
        </div>
        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="usp-title">Energy Efficient</h3>
          <p class="usp-text">Up to 40% less energy than conventional ovens</p>
        </div>
        <div class="usp-card">
          <div class="usp-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <h3 class="usp-title">50+ Auto Programs</h3>
          <p class="usp-text">One-touch recipes for every dish</p>
        </div>`;

// Replace existing usp-grid content
indexContent = indexContent.replace(/(<div class="usp-grid">)[\s\S]*?(<\/div>\s*<\/section>)/, '$1\n' + newUspCards + '\n$2');

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated USP section in index.html');

console.log('All done!');
