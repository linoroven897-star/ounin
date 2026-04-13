const fs = require('fs');
const path = require('path');

const authModalHTML = `
  <!-- AUTH MODAL -->
  <div class="auth-modal" id="auth-modal">
    <div class="auth-modal-overlay" id="auth-overlay"></div>
    <div class="auth-modal-content">
      <button class="auth-modal-close" id="auth-close"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
      <div class="auth-form" id="login-form">
        <div class="auth-header"><h2 class="auth-title">Welcome Back</h2><p class="auth-subtitle">Sign in to your Ounin account</p></div>
        <div class="auth-fields"><div class="auth-error" id="login-error"></div><div class="auth-success" id="login-success"></div><div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="login-email" placeholder="your@email.com"></div><div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="login-password" placeholder="Enter your password"></div><button class="auth-submit-btn" id="login-btn">Sign In</button><p class="auth-switch">Don't have an account? <a href="#" id="show-register">Create one</a></p></div>
      </div>
      <div class="auth-form" id="register-form" style="display: none;">
        <div class="auth-header"><h2 class="auth-title">Create Account</h2><p class="auth-subtitle">Join Ounin and get 100 welcome points</p></div>
        <div class="auth-fields"><div class="auth-error" id="register-error"></div><div class="form-group"><label class="form-label">Full Name</label><input type="text" class="form-input" id="register-name" placeholder="John Smith"></div><div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" id="register-email" placeholder="your@email.com"></div><div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="register-password" placeholder="Create a password"></div><div class="form-group"><label class="form-label">Confirm Password</label><input type="password" class="form-input" id="register-confirm" placeholder="Confirm your password"></div><button class="auth-submit-btn" id="register-btn">Create Account</button><p class="auth-switch">Already have an account? <a href="#" id="show-login">Sign in</a></p></div>
      </div>
    </div>
  </div>`;

const authScript = `
  <script>
    const am=document.getElementById('auth-modal'),ao=document.getElementById('auth-overlay'),ac=document.getElementById('auth-close'),lf=document.getElementById('login-form'),rf=document.getElementById('register-form');
    function oam(r){am.classList.add('active');lf.style.display=r?'none':'block';rf.style.display=r?'block':'none';document.querySelectorAll('.auth-fields input').forEach(i=>i.value='');document.querySelectorAll('.auth-error,.auth-success').forEach(e=>e.classList.remove('show'))}
    ao&&ao.addEventListener('click',()=>am.classList.remove('active'));
    ac&&ac.addEventListener('click',()=>am.classList.remove('active'));
    document.getElementById('show-register')&&document.getElementById('show-register').addEventListener('click',e=>{e.preventDefault();oam(!0)});
    document.getElementById('show-login')&&document.getElementById('show-login').addEventListener('click',e=>{e.preventDefault();oam(!1)});
    document.getElementById('login-btn')&&document.getElementById('login-btn').addEventListener('click',()=>{const e=document.getElementById('login-email').value,p=document.getElementById('login-password').value,err=document.getElementById('login-error'),suc=document.getElementById('login-success');err&&err.classList.remove('show');const r=login(e,p);if(r.success){suc&&(suc.textContent='Login successful!',suc.classList.add('show'));setTimeout(()=>{am.classList.remove('active');updateAuthUI();showToast('Welcome back, '+r.user.name+'!')},500)}else{err&&(err.textContent=r.message,err.classList.add('show'))}});
    document.getElementById('register-btn')&&document.getElementById('register-btn').addEventListener('click',()=>{const n=document.getElementById('register-name').value,e=document.getElementById('register-email').value,p=document.getElementById('register-password').value,c=document.getElementById('register-confirm').value,err=document.getElementById('register-error');err&&err.classList.remove('show');if(!n||!e||!p){err&&(err.textContent='Please fill in all fields',err.classList.add('show'));return}if(p!==c){err&&(err.textContent='Passwords do not match',err.classList.add('show'));return}const r=register(n,e,p);if(r.success){am.classList.remove('active');updateAuthUI();showToast('Welcome to Ounin! You got 100 welcome points!')}else{err&&(err.textContent=r.message,err.classList.add('show'))}});
    const ab=document.querySelector('a[aria-label="Account"]');ab&&ab.addEventListener('click',e=>{if(!getCurrentUser()){e.preventDefault();oam(!1)}});
  </script>`;

// Get all blog files
const blogDir = __dirname;
const blogFiles = fs.readdirSync(blogDir).filter(f => f.startsWith('blog-') && f.endsWith('.html'));

blogFiles.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if auth modal already exists
  if (content.includes('id="auth-modal"')) {
    console.log('Already has auth modal:', file);
    return;
  }
  
  // Add auth modal before </body>
  content = content.replace('</body>', authModalHTML + '\n' + authScript + '\n</body>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Added auth modal to:', file);
});
