const fs = require('fs');
const path = require('path');

const dir = 'C:\\Users\\Mayn\\.openclaw\\workspace\\ounin-clone';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const navActionsSearch = `        <div class="navbar-actions">
          <button class="nav-btn" aria-label="Search" id="search-btn" onclick="window.location.href='search.html'">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/></svg>
          </button>
          <a href="account.html" class="nav-btn" aria-label="Account" id="account-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </a>
          <button class="nav-btn cart-wrapper" aria-label="Cart" id="cart-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="cart-count" id="cart-count">0</span>
          </button>
          <button class="nav-btn mobile-menu-btn" aria-label="Menu" id="mobile-menu-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>`;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Skip if already has complete navbar-actions (search + account + cart)
  if (content.includes('id="account-btn"')) return;

  // If has navbar-actions but missing account-btn, replace it
  if (content.includes('navbar-actions')) {
    // Replace incomplete navbar-actions with complete one
    // Replace the incomplete navbar-actions (that only has cart) with the full version
    content = content.replace(/<div class="navbar-actions">\s*<button class="nav-btn cart-wrapper"[^<]*<\/button>\s*<\/div>/, navActionsSearch);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed navbar-actions: ' + file);
  }
});

console.log('Done!');
