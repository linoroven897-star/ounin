/**
 * OUNIN - Premium Steam Ovens
 * Main JavaScript
 */

(function() {
  'use strict';

  // ========================================
  // STATE
  // ========================================
  let cart = [];
  let wishlist = [];

  // ========================================
  // DOM ELEMENTS
  // ========================================
  const navbar = document.querySelector('.navbar');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const searchBtn = document.getElementById('search-btn');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const cartBtn = document.getElementById('cart-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartClose = document.getElementById('cart-close');
  const cartContent = document.getElementById('cart-content');
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  const cartItemCount = document.getElementById('cart-item-count');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const quickViewModal = document.getElementById('quick-view-modal');
  const quickViewOverlay = document.getElementById('quick-view-overlay');
  const quickViewClose = document.getElementById('quick-view-close');
  const quickViewContent = document.getElementById('quick-view-content');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const productCarousel = document.getElementById('product-carousel');
  const productTrack = document.getElementById('product-track');
  const productPrev = document.getElementById('product-prev');
  const productNext = document.getElementById('product-next');
  const newsletterForm = document.getElementById('newsletter-form');
  const checkoutBtn = document.getElementById('checkout-btn');

  // ========================================
  // PRODUCT DATA
  // ========================================
  const products = {
    'pro-embedded': {
      id: 'pro-embedded',
      name: 'Ounin Pro Embedded',
      price: 1299,
      originalPrice: 1499,
      image: 'assets/images/product-1a.jpg',
      imageHover: 'assets/images/product-1b.jpg',
      desc: '75L Capacity • 12 Cooking Modes • WiFi Connected. Our flagship embedded steam oven with precision temperature control and smart home integration.',
      features: ['75L capacity', '12 cooking modes', 'WiFi connected', 'Steam injection system', 'Touchscreen display', 'Child lock']
    },
    'compact': {
      id: 'compact',
      name: 'Ounin Compact',
      price: 699,
      image: 'assets/images/product-2a.jpg',
      imageHover: 'assets/images/product-2b.jpg',
      desc: '40L Capacity • 8 Cooking Modes • Countertop Design. Perfect for smaller kitchens without compromising on performance.',
      features: ['40L capacity', '8 cooking modes', 'Countertop design', 'Compact footprint', 'Easy installation', 'Digital display']
    },
    'mini': {
      id: 'mini',
      name: 'Ounin Mini',
      price: 399,
      image: 'assets/images/product-3a.jpg',
      imageHover: 'assets/images/product-3b.jpg',
      desc: '25L Capacity • 5 Cooking Modes • Portable. Entry-level steam oven perfect for beginners and small households.',
      features: ['25L capacity', '5 cooking modes', 'Lightweight design', 'Budget-friendly', 'Simple controls', 'Quick heat-up']
    },
    'elite-bundle': {
      id: 'elite-bundle',
      name: 'Ounin Elite Bundle',
      price: 1599,
      originalPrice: 1999,
      image: 'assets/images/product-4a.jpg',
      imageHover: 'assets/images/product-4b.jpg',
      desc: 'Pro Oven + Premium Accessories Kit + Chef Cookbook. Our complete package for the serious home chef.',
      features: ['Pro embedded oven', 'Steam tray', 'Wire rack', 'Cleaning kit', 'Exclusive cookbook', 'Recipe cards']
    },
    'accessory-kit': {
      id: 'accessory-kit',
      name: 'Premium Accessory Kit',
      price: 149,
      image: 'assets/images/product-5a.jpg',
      imageHover: 'assets/images/product-5b.jpg',
      desc: 'Steam Tray • Wire Rack • Cookbook • Cleaning Kit. Everything you need to get the most from your Ounin oven.',
      features: ['Steam tray', 'Wire rack', 'Ceramic dish', 'Cleaning kit', 'Recipe cookbook', 'Storage bag']
    }
  };

  // ========================================
  // SEARCH DATA
  // ========================================
  const searchableItems = [
    // Products
    { type: 'product', name: 'Ounin Pro Embedded Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Compact Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Mini Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Elite Bundle', url: 'products.html' },
    { type: 'product', name: 'Premium Accessory Kit', url: 'products.html' },
    { type: 'product', name: 'Steam Oven Accessories', url: 'products.html' },
    // Recipes
    { type: 'recipe', name: 'Garlic Steam Prawns', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Perfect Sourdough Bread', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Steam Roast Chicken', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Garden Vegetables', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Salmon with Herbs', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Crème Brûlée', url: 'recipe-detail.html' },
    // Blog
    { type: 'blog', name: 'The Art of Steaming', url: 'blog-steam-temperature.html' },
    { type: 'blog', name: 'Bakery-Quality Bread at Home', url: 'blog-bread.html' },
    { type: 'blog', name: 'Fish That Falls Apart', url: 'blog-fish.html' },
    { type: 'blog', name: 'Sunday Prep, Weeknight Ease', url: 'blog-meal-prep.html' },
    { type: 'blog', name: 'The Vegetable Revolution', url: 'blog-vegetables.html' },
    { type: 'blog', name: 'Steam Oven Care Guide', url: 'blog-care.html' },
    { type: 'blog', name: 'Beyond Cheesecake Desserts', url: 'blog-desserts.html' },
    { type: 'blog', name: 'Steam Oven vs Conventional', url: 'blog-oven-comparison.html' },
    { type: 'blog', name: 'The Golden Rule of Roast Chicken', url: 'blog-chicken.html' },
    // Pages
    { type: 'page', name: 'Our Story', url: 'about.html' },
    { type: 'page', name: 'Contact Us', url: 'contact.html' },
    { type: 'page', name: 'Shop All Products', url: 'products.html' },
    { type: 'page', name: 'Recipes', url: 'recipes.html' },
    { type: 'page', name: 'Blog', url: 'blog.html' },
    { type: 'page', name: 'FAQ', url: 'faq.html' },
    { type: 'page', name: 'Cookie Policy', url: 'faq.html' }
  ];

  // ========================================
  // NAVBAR SCROLL
  // ========================================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  // ========================================
  // MOBILE MENU
  // ========================================
  function openMobileMenu() {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking links
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ========================================
  // SEARCH MODAL
  // ========================================
  function openSearch() {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '<p class="search-hint">Start typing to search...</p>';
    document.body.style.overflow = '';
  }

  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '<p class="search-hint">Search for products, recipes, or anything else...</p>';
      return;
    }

    const results = searchableItems.filter(item => 
      item.name.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-hint">No results found</p>';
      return;
    }

    searchResults.innerHTML = results.map(result => `
      <a href="${result.url}" class="search-result-item">
        <span class="search-result-type">${result.type}</span>
        <span class="search-result-name">${result.name}</span>
      </a>
    `).join('');
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Close search on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  // Search overlay click to close
  const searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
  }

  // Search top close button
  const searchCloseTop = document.getElementById('search-close-top');
  if (searchCloseTop) {
    searchCloseTop.addEventListener('click', closeSearch);
  }

  // ========================================
  // CART MANAGEMENT
  // ========================================
  function loadCart() {
    const savedCart = localStorage.getItem('ounin-cart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    updateCartUI();
  }

  function saveCart() {
    localStorage.setItem('ounin-cart', JSON.stringify(cart));
  }

  function addToCart(productId, name, price) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({
        id: productId,
        name: name,
        price: price,
        qty: 1,
        image: products[productId]?.image || 'assets/images/product-placeholder.jpg'
      });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${name} added to cart!`);
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        removeFromCart(productId);
      } else {
        saveCart();
        updateCartUI();
      }
    }
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function updateCartUI() {
    const itemCount = getCartItemCount();
    const total = getCartTotal();
    
    // Update cart count badge
    if (cartCount) {
      cartCount.textContent = itemCount;
      cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
    }
    
    // Update cart drawer
    if (cartItemCount) {
      cartItemCount.textContent = itemCount;
    }
    
    if (cartSubtotal) {
      cartSubtotal.textContent = `$${total.toLocaleString()}`;
    }
    
    // Update cart items
    if (cartItems) {
      if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartItems.innerHTML = '';
        if (cartFooter) cartFooter.style.display = 'none';
      } else {
        cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';
        
        cartItems.innerHTML = cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
              <p class="cart-item-name">${item.name}</p>
              <p class="cart-item-price">$${item.price.toLocaleString()}</p>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
              </div>
              <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  function openCart() {
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose functions globally for onclick handlers
  window.updateQuantity = updateQuantity;
  window.removeFromCart = removeFromCart;

  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  // Close cart drawer on overlay click
  if (cartDrawer) {
    cartDrawer.addEventListener('click', (e) => {
      if (e.target === cartDrawer) {
        closeCart();
      }
    });
  }

  // Add to cart buttons
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = btn.dataset.product;
      const price = parseInt(btn.dataset.price);
      const name = btn.dataset.name;
      addToCart(productId, name, price);
    });
  });

  // ========================================
  // QUICK VIEW
  // ========================================
  function openQuickView(productId) {
    const product = products[productId];
    if (!product) return;

    quickViewContent.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="quick-view-img">
      <div class="quick-view-info">
        <h2 class="quick-view-title">${product.name}</h2>
        <div class="quick-view-price">
          $${product.price.toLocaleString()}
          ${product.originalPrice ? `<span style="text-decoration: line-through; color: #999; font-size: 18px; margin-left: 8px;">$${product.originalPrice.toLocaleString()}</span>` : ''}
        </div>
        <p class="quick-view-desc">${product.desc}</p>
        <ul style="margin-bottom: 24px; font-size: 14px; color: #666;">
          ${product.features.map(f => `<li style="padding: 6px 0;">✓ ${f}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" onclick="addToCart('${product.id}', '${product.name}', ${product.price}); closeQuickView();">Add to Cart</button>
      </div>
    `;

    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose globally
  window.closeQuickView = closeQuickView;

  // Quick view buttons
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openQuickView(btn.dataset.product);
    });
  });

  if (quickViewClose) {
    quickViewClose.addEventListener('click', closeQuickView);
  }

  if (quickViewOverlay) {
    quickViewOverlay.addEventListener('click', closeQuickView);
  }

  // Close quick view on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quickViewModal.classList.contains('active')) {
      closeQuickView();
    }
  });

  // ========================================
  // TOAST NOTIFICATION
  // ========================================
  function showToast(message) {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  // ========================================
  // PRODUCT CAROUSEL
  // ========================================
  let carouselPosition = 0;
  let carouselItemWidth = 0;

  function updateCarousel() {
    if (!productTrack || !productCarousel) return;
    
    const containerWidth = productCarousel.offsetWidth;
    const items = productTrack.children;
    
    if (items.length === 0) return;
    
    carouselItemWidth = items[0].offsetWidth + 24; // Including gap
    const maxPosition = Math.max(0, items.length * carouselItemWidth - containerWidth);
    
    carouselPosition = Math.min(carouselPosition, maxPosition);
    carouselPosition = Math.max(0, carouselPosition);
    
    productTrack.style.transform = `translateX(-${carouselPosition}px)`;
  }

  function moveCarousel(direction) {
    if (!productTrack || !productCarousel) return;
    
    const containerWidth = productCarousel.offsetWidth;
    const scrollAmount = containerWidth * 0.8;
    
    if (direction === 'next') {
      carouselPosition += scrollAmount;
    } else {
      carouselPosition -= scrollAmount;
    }
    
    updateCarousel();
  }

  if (productPrev) {
    productPrev.addEventListener('click', () => moveCarousel('prev'));
  }

  if (productNext) {
    productNext.addEventListener('click', () => moveCarousel('next'));
  }

  // Handle window resize
  window.addEventListener('resize', updateCarousel);

  // Initial carousel setup
  setTimeout(updateCarousel, 100);

  // ========================================
  // WISHLIST
  // ========================================
  function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from wishlist');
    } else {
      wishlist.push(productId);
      showToast('Added to wishlist');
    }
    
    localStorage.setItem('ounin-wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
  }

  function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const productId = btn.dataset.product;
      const isInWishlist = wishlist.includes(productId);
      
      if (isInWishlist) {
        btn.classList.add('active');
        btn.style.backgroundColor = '#E53935';
        btn.querySelector('svg').style.stroke = 'white';
      } else {
        btn.classList.remove('active');
        btn.style.backgroundColor = 'white';
        btn.querySelector('svg').style.stroke = '#2C2C2C';
      }
    });
  }

  function loadWishlist() {
    const savedWishlist = localStorage.getItem('ounin-wishlist');
    if (savedWishlist) {
      wishlist = JSON.parse(savedWishlist);
    }
    updateWishlistUI();
  }

  // Expose globally
  window.toggleWishlist = toggleWishlist;

  // Wishlist buttons
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleWishlist(btn.dataset.product);
    });
  });

  // ========================================
  // NEWSLETTER FORM
  // ========================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      if (email) {
        showToast('Thank you for subscribing!');
        newsletterForm.reset();
      }
    });
  }

  // ========================================
  // CHECKOUT
  // ========================================
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
      }
      window.location.href = 'cart.html';
    });
  }

  // ========================================
  // SCROLL ANIMATIONS
  // ========================================
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.85;
      
      if (isVisible) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', handleScrollAnimations);
  handleScrollAnimations(); // Initial check

  // ========================================
  // SMOOTH SCROLL
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ========================================
  // CONTACT FORM
  // ========================================
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for your message! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // ========================================
  // PRODUCT FILTER (Products Page)
  // ========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.products-grid .product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter products
      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================
  // ========================================
  // PRECISION TECHNOLOGY CAROUSEL
  // ========================================
  const precisionCarousel = document.getElementById('precisionCarousel');
  const precisionTrack = precisionCarousel?.querySelector('.prec-track');
  const precisionSlides = precisionCarousel?.querySelectorAll('.prec-slide');
  const precisionPrev = precisionCarousel?.querySelector('.prec-prev');
  const precisionNext = precisionCarousel?.querySelector('.prec-next');
  const precisionDots = precisionCarousel?.querySelectorAll('.prec-dot');
  let precisionIndex = 0;

  function updatePrecisionCarousel() {
    if (!precisionSlides.length) return;
    precisionSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === precisionIndex);
    });
    precisionDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === precisionIndex);
    });
  }

  function movePrecisionCarousel(dir) {
    const total = precisionSlides.length;
    if (dir === 'next') {
      precisionIndex = (precisionIndex + 1) % total;
    } else {
      precisionIndex = (precisionIndex - 1 + total) % total;
    }
    updatePrecisionCarousel();
  }

  if (precisionPrev) {
    precisionPrev.addEventListener('click', () => movePrecisionCarousel('prev'));
  }

  if (precisionNext) {
    precisionNext.addEventListener('click', () => movePrecisionCarousel('next'));
  }

  if (precisionDots) {
    precisionDots.forEach(dot => {
      dot.addEventListener('click', () => {
        precisionIndex = parseInt(dot.dataset.index);
        updatePrecisionCarousel();
      });
    });
  }

  // ========================================
  // INIT
  // ========================================
  function init() {
    loadCart();
    loadWishlist();
    handleNavbarScroll();
    updateCarousel();

    // Close modals on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (cartDrawer && cartDrawer.classList.contains('active')) {
          closeCart();
        }
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          // Close all
          faqItems.forEach(i => i.classList.remove('active'));
          // Open clicked if wasn't active
          if (!isActive) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
