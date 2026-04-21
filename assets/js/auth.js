// Auth System - Login/Register/Logout using localStorage

// Initialize auth state on page load
function initAuth() {
  updateAuthUI();
}

// Update UI based on auth state
function updateAuthUI() {
  const user = getCurrentUser();
  const accountBtns = document.querySelectorAll('[data-auth-account]');
  
  accountBtns.forEach(btn => {
    if (user) {
      btn.href = 'account.html';
      btn.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
      `;
    }
  });
}

// Get current user from localStorage
function getCurrentUser() {
  try {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.warn('getCurrentUser: localStorage read error', e);
    return null;
  }
}

// Register new user
function register(name, email, password) {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered' };
    }
    
    // Create new user with Bronze tier
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password, // In production, this should be hashed
      tier: 'bronze',
      points: 100, // Welcome bonus
      lifetimePoints: 100,
      orders: [],
      wishlist: [],
      pointsHistory: [
        { type: 'earned', amount: 100, title: 'Welcome Bonus', date: new Date().toISOString().split('T')[0] }
      ],
      addresses: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
  } catch (e) {
    console.warn('register: error', e);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
}

// Login user
function login(email, password) {
  try {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true, user };
  } catch (e) {
    console.warn('login: error', e);
    return { success: false, message: 'Login failed. Please try again.' };
  }
}

// Logout user
function logout() {
  try {
    localStorage.removeItem('currentUser');
    // Set flag to show login popup after redirect
    sessionStorage.setItem('showLoginAfterLogout', '1');
    // Redirect to index
    window.location.href = 'index.html';
  } catch (e) {
    console.warn('logout: error', e);
    window.location.href = 'index.html';
  }
}

// Update user profile
function updateProfile(data) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };
    
    // Update allowed fields
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.birthday !== undefined) user.birthday = data.birthday;
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return { success: true, user };
  } catch (e) {
    console.warn('updateProfile: error', e);
    return { success: false, message: 'Failed to update profile' };
  }
}

// Change password
function changePassword(currentPassword, newPassword) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };
    
    // Verify current password
    if (user.password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }
    
    // Update password
    user.password = newPassword;
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    return { success: true, message: 'Password updated successfully' };
  } catch (e) {
    console.warn('changePassword: error', e);
    return { success: false, message: 'Failed to change password' };
  }
}

// Get all users
function getUsers() {
  try {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  } catch (e) {
    console.warn('getUsers: localStorage read error', e);
    return [];
  }
}

// Save all users
function saveUsers(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (e) {
    console.warn('saveUsers: localStorage write error', e);
  }
}

// Add points to user
function addPoints(amount, title) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    user.points += amount;
    user.lifetimePoints += amount;
    user.pointsHistory.unshift({
      type: 'earned',
      amount,
      title,
      date: new Date().toISOString().split('T')[0]
    });
    
    // Check for tier upgrade
    updateTier(user);
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (e) {
    console.warn('addPoints: error', e);
  }
}

// Update membership tier based on lifetime points
function updateTier(user) {
  const points = user.lifetimePoints;
  
  if (points >= 7500) {
    user.tier = 'platinum';
  } else if (points >= 3750) {
    user.tier = 'gold';
  } else if (points >= 1500) {
    user.tier = 'silver';
  } else {
    user.tier = 'bronze';
  }
}

// Get tier display info
function getTierInfo(tier) {
  const tiers = {
    bronze: { name: 'Bronze Member', discount: 0.05, color: '#CD7F32', next: 'silver', needed: 1500 },
    silver: { name: 'Silver Member', discount: 0.10, color: '#C0C0C0', next: 'gold', needed: 3750 },
    gold: { name: 'Gold Member', discount: 0.15, color: '#FFD700', next: 'platinum', needed: 7500 },
    platinum: { name: 'Platinum Member', discount: 0.20, color: '#E5E4E2', next: null, needed: 0 }
  };
  return tiers[tier] || tiers.bronze;
}

// Get discount for current user
function getUserDiscount() {
  try {
    const user = getCurrentUser();
    if (!user) return 0;
    return getTierInfo(user.tier).discount;
  } catch (e) {
    console.warn('getUserDiscount: error', e);
    return 0;
  }
}

// Add order to user
function addOrder(order) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    user.orders.unshift(order);
    
    // Add points for purchase (1 point per $1)
    const pointsEarned = Math.floor(order.total);
    addPoints(pointsEarned, `Purchase: Order ${order.id}`);
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (e) {
    console.warn('addOrder: error', e);
  }
}

// Add to wishlist
function addToWishlist(item) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Please login first' };
    
    if (user.wishlist.find(w => w.name === item.name)) {
      return { success: false, message: 'Item already in wishlist' };
    }
    
    user.wishlist.push(item);
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    return { success: true };
  } catch (e) {
    console.warn('addToWishlist: error', e);
    return { success: false, message: 'Failed to add to wishlist' };
  }
}

// Remove from wishlist
function removeFromWishlist(itemName) {
  try {
    const user = getCurrentUser();
    if (!user) return;
    
    user.wishlist = user.wishlist.filter(w => w.name !== itemName);
    
    // Update in users array
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = user;
      saveUsers(users);
    }
    
    localStorage.setItem('currentUser', JSON.stringify(user));
  } catch (e) {
    console.warn('removeFromWishlist: error', e);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAuth);

// Open auth modal (showRegister = false shows login form, true shows register form)
function openAuthModal(showRegister) {
  var modal = document.getElementById('auth-modal');
  if (!modal) return;
  var loginForm = document.getElementById('login-form');
  var registerForm = document.getElementById('register-form');
  modal.classList.add('active');
  if (loginForm) loginForm.style.display = showRegister ? 'none' : 'block';
  if (registerForm) registerForm.style.display = showRegister ? 'block' : 'none';
  // Clear fields
  var fields = modal.querySelectorAll('.auth-fields input');
  for (var i = 0; i < fields.length; i++) { fields[i].value = ''; }
  var errs = modal.querySelectorAll('.auth-error,.auth-success');
  for (var j = 0; j < errs.length; j++) { errs[j].classList.remove('show'); }
}

// Close auth modal
function closeAuthModal() {
  var modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
}

// Setup auth modal event listeners (call after DOM is ready)
document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('auth-modal');
  var overlay = document.getElementById('auth-overlay');
  var closeBtn = document.getElementById('auth-close');
  var showRegisterLink = document.getElementById('show-register');
  var showLoginLink = document.getElementById('show-login');
  var loginBtn = document.getElementById('login-btn');
  var registerBtn = document.getElementById('register-btn');

  if (overlay) overlay.addEventListener('click', closeAuthModal);
  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (showRegisterLink) showRegisterLink.addEventListener('click', function(e) { e.preventDefault(); openAuthModal(true); });
  if (showLoginLink) showLoginLink.addEventListener('click', function(e) { e.preventDefault(); openAuthModal(false); });

  // Account nav link click handler
  var accountBtns = document.querySelectorAll('[aria-label="Account"]');
  for (var i = 0; i < accountBtns.length; i++) {
    accountBtns[i].addEventListener('click', function(e) {
      if (!getCurrentUser()) {
        e.preventDefault();
        openAuthModal(false);
      }
    });
  }

  // Login form submission
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      var emailEl = document.getElementById('login-email');
      var passwordEl = document.getElementById('login-password');
      var errEl = document.getElementById('login-error');
      var sucEl = document.getElementById('login-success');
      var email = emailEl ? emailEl.value : '';
      var password = passwordEl ? passwordEl.value : '';
      if (errEl) errEl.classList.remove('show');
      var result = login(email, password);
      if (result.success) {
        if (sucEl) { sucEl.textContent = 'Login successful!'; sucEl.classList.add('show'); }
        if (typeof showToast === 'function') showToast('Welcome back, ' + result.user.name + '!');
        setTimeout(function() { location.reload(); }, 800);
      } else {
        if (errEl) { errEl.textContent = result.message; errEl.classList.add('show'); }
      }
    });
  }

  // Register form submission
  if (registerBtn) {
    registerBtn.addEventListener('click', function() {
      var nameEl = document.getElementById('register-name');
      var emailEl = document.getElementById('register-email');
      var passwordEl = document.getElementById('register-password');
      var confirmEl = document.getElementById('register-confirm');
      var errEl = document.getElementById('register-error');
      var name = nameEl ? nameEl.value : '';
      var email = emailEl ? emailEl.value : '';
      var password = passwordEl ? passwordEl.value : '';
      var confirm = confirmEl ? confirmEl.value : '';
      if (errEl) errEl.classList.remove('show');
      if (!name || !email || !password) {
        if (errEl) { errEl.textContent = 'Please fill in all fields'; errEl.classList.add('show'); }
        return;
      }
      if (password !== confirm) {
        if (errEl) { errEl.textContent = 'Passwords do not match'; errEl.classList.add('show'); }
        return;
      }
      if (password.length < 6) {
        if (errEl) { errEl.textContent = 'Password must be at least 6 characters'; errEl.classList.add('show'); }
        return;
      }
      var result = register(name, email, password);
      if (result.success) {
        if (typeof showToast === 'function') showToast('Welcome to Ounin! You got 100 welcome points!');
        setTimeout(function() { location.reload(); }, 800);
      } else {
        if (errEl) { errEl.textContent = result.message; errEl.classList.add('show'); }
      }
    });
  }
});
