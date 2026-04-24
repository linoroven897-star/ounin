// Auth System - Shopify Storefront API

const SHOPIFY_DOMAIN = 'ounin.myshopify.com';
const STOREFRONT_TOKEN = '53bc4de5c4494487da5984ba38c2ffc4';
const API_VERSION = '2024-01';

const API_URL = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

// GraphQL helper
async function shopifyFetch(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

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

// Get current user from sessionStorage (access token stored after login)
function getCurrentUser() {
  try {
    const tokenData = sessionStorage.getItem('shopifyCustomerToken');
    if (!tokenData) return null;
    const { accessToken, expiresAt } = JSON.parse(tokenData);
    if (new Date(expiresAt) < new Date()) {
      sessionStorage.removeItem('shopifyCustomerToken');
      return null;
    }
    return { accessToken };
  } catch (e) {
    return null;
  }
}

// Register new customer via Shopify
async function register(name, email, password) {
  try {
    const mutation = `
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            acceptsMarketing
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ');
    const data = await shopifyFetch(mutation, {
      input: { firstName, lastName, email, password }
    });

    const result = data.customerCreate;
    if (result.customerUserErrors.length > 0) {
      return { success: false, message: result.customerUserErrors[0].message };
    }

    // Auto-login after registration
    const loginResult = await login(email, password);
    return loginResult;
  } catch (e) {
    console.warn('register: error', e);
    return { success: false, message: 'Registration failed. Please try again.' };
  }
}

// Login via Shopify Storefront
async function login(email, password) {
  try {
    const mutation = `
      mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    const data = await shopifyFetch(mutation, {
      input: { email, password }
    });

    const result = data.customerAccessTokenCreate;
    if (result.customerUserErrors.length > 0) {
      return { success: false, message: result.customerUserErrors[0].message };
    }

    const { accessToken, expiresAt } = result.customerAccessToken;
    sessionStorage.setItem('shopifyCustomerToken', JSON.stringify({ accessToken, expiresAt }));

    // Fetch customer details
    const customer = await getCustomer(accessToken);
    return { success: true, user: { ...customer, accessToken } };
  } catch (e) {
    console.warn('login: error', e);
    return { success: false, message: 'Login failed. Please try again.' };
  }
}

// Logout
function logout() {
  try {
    sessionStorage.removeItem('shopifyCustomerToken');
    sessionStorage.setItem('showLoginAfterLogout', '1');
    window.location.href = 'index.html';
  } catch (e) {
    window.location.href = 'index.html';
  }
}

// Fetch customer data from Shopify
async function getCustomer(accessToken) {
  const query = `
    query getCustomer($accessToken: String!) {
      customer(customerAccessToken: $accessToken) {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        defaultAddress {
          address1
          address2
          city
          province
          zip
          country
          phone
        }
        addresses(first: 5) {
          edges {
            node {
              id
              address1
              address2
              city
              province
              zip
              country
              phone
              firstName
              lastName
            }
          }
        }
        orders(first: 10, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              name
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice { amount currencyCode }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    originalTotalPrice { amount currencyCode }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query, { accessToken });
  return data.customer;
}

// Update user profile
async function updateProfile(data) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Not logged in' };

    const mutation = `
      mutation customerUpdate($customer: CustomerUpdateInput!) {
        customerUpdate(customer: $customer) {
          customer {
            firstName
            lastName
            email
            phone
          }
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    const input = {};
    if (data.name !== undefined) {
      const [firstName, ...rest] = data.name.split(' ');
      input.firstName = firstName;
      input.lastName = rest.join(' ');
    }
    if (data.email !== undefined) input.email = data.email;
    if (data.phone !== undefined) input.phone = data.phone;

    const result = await shopifyFetch(mutation, { customer: input });
    if (result.customerUpdate.customerUserErrors.length > 0) {
      return { success: false, message: result.customerUpdate.customerUserErrors[0].message };
    }
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to update profile' };
  }
}

// Change password
async function changePassword(currentPassword, newPassword) {
  try {
    const mutation = `
      mutation customerUpdate($customer: CustomerUpdateInput!) {
        customerUpdate(customer: $customer) {
          customerUserErrors {
            field
            message
            code
          }
        }
      }
    `;
    const result = await shopifyFetch(mutation, {
      customer: { password: newPassword }
    });
    if (result.customerUpdate.customerUserErrors.length > 0) {
      return { success: false, message: result.customerUpdate.customerUserErrors[0].message };
    }
    return { success: true, message: 'Password updated successfully' };
  } catch (e) {
    return { success: false, message: 'Failed to change password' };
  }
}

// Add order (local tracking since Shopify checkout is external)
function addOrder(order) {
  // Orders via Shopify checkout are tracked automatically
  // This is for local order history if needed
  console.log('Order placed:', order);
}

// Add to wishlist (local storage)
function addToWishlist(item) {
  try {
    const user = getCurrentUser();
    if (!user) return { success: false, message: 'Please login first' };
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.find(w => w.name === item.name)) {
      return { success: false, message: 'Item already in wishlist' };
    }
    wishlist.push(item);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    return { success: true };
  } catch (e) {
    return { success: false, message: 'Failed to add to wishlist' };
  }
}

// Remove from wishlist
function removeFromWishlist(itemName) {
  try {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const filtered = wishlist.filter(w => w.name !== itemName);
    localStorage.setItem('wishlist', JSON.stringify(filtered));
  } catch (e) {}
}

// Get wishlist
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist') || '[]');
  } catch (e) { return []; }
}

// Add points (local tracking)
function addPoints(amount, title) {
  // Points are tracked locally; Shopify doesn't have a native points system
  try {
    const history = JSON.parse(localStorage.getItem('pointsHistory') || '[]');
    history.unshift({ type: 'earned', amount, title, date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('pointsHistory', JSON.stringify(history));
  } catch (e) {}
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

// Setup auth modal event listeners
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

  var accountBtns = document.querySelectorAll('[aria-label="Account"]');
  for (var i = 0; i < accountBtns.length; i++) {
    accountBtns[i].addEventListener('click', function(e) {
      if (!getCurrentUser()) {
        e.preventDefault();
        openAuthModal(false);
      }
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', async function() {
      var emailEl = document.getElementById('login-email');
      var passwordEl = document.getElementById('login-password');
      var errEl = document.getElementById('login-error');
      var sucEl = document.getElementById('login-success');
      var email = emailEl ? emailEl.value : '';
      var password = passwordEl ? passwordEl.value : '';
      if (errEl) errEl.classList.remove('show');
      var result = await login(email, password);
      if (result.success) {
        if (sucEl) { sucEl.textContent = 'Login successful!'; sucEl.classList.add('show'); }
        if (typeof showToast === 'function') showToast('Welcome back, ' + (result.user.firstName || result.user.email) + '!');
        setTimeout(function() { location.reload(); }, 800);
      } else {
        if (errEl) { errEl.textContent = result.message; errEl.classList.add('show'); }
      }
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', async function() {
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
      var result = await register(name, email, password);
      if (result.success) {
        if (typeof showToast === 'function') showToast('Welcome to Ounin!');
        setTimeout(function() { location.reload(); }, 800);
      } else {
        if (errEl) { errEl.textContent = result.message; errEl.classList.add('show'); }
      }
    });
  }
});
