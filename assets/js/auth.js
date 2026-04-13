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
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
}

// Register new user
function register(name, email, password) {
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
}

// Login user
function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  
  localStorage.setItem('currentUser', JSON.stringify(user));
  return { success: true, user };
}

// Logout user
function logout() {
  localStorage.removeItem('currentUser');
  // Set flag to show login popup after redirect
  sessionStorage.setItem('showLoginAfterLogout', '1');
  // Redirect to index
  window.location.href = 'index.html';
}

// Get all users
function getUsers() {
  const usersData = localStorage.getItem('users');
  return usersData ? JSON.parse(usersData) : [];
}

// Save all users
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Add points to user
function addPoints(amount, title) {
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
  const user = getCurrentUser();
  if (!user) return 0;
  return getTierInfo(user.tier).discount;
}

// Add order to user
function addOrder(order) {
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
}

// Add to wishlist
function addToWishlist(item) {
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
}

// Remove from wishlist
function removeFromWishlist(itemName) {
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAuth);
