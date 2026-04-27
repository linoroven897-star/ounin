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
  // DOM ELEMENTS (null-safe)
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
      name: 'Steam Combi Oven (18in)',
      price: 250,
      originalPrice: 399,
      image: 'assets/images/product-1a.jpg',
      imageHover: 'assets/images/product-1b.jpg',
      desc: '10-in-1 Multi-function - 18qt Family Size - Self-cleaning'
    },
    'compact': {
      id: 'compact',
      name: 'Steam Air Fry Oven (12L)',
      price: 250,
      originalPrice: 429,
      image: 'assets/images/product-2a.jpg',
      imageHover: 'assets/images/product-2b.jpg',
      desc: 'Steam & Crisp - 12L Capacity - 8-in-1'
    },
    'mini': {
      id: 'mini',
      name: 'Steam Combi Oven (24in)',
      price: 309,
      originalPrice: 699,
      image: 'assets/images/product-3a.jpg',
      imageHover: 'assets/images/product-3b.jpg',
      desc: 'XL Family Size - 25.4QT - 11-in-1'
    },
    'elite-bundle': {
      id: 'elite-bundle',
      name: 'Air Fryer Oven (12in)',
      price: 150,
      originalPrice: 299,
      image: 'assets/images/product-4a.jpg',
      imageHover: 'assets/images/product-4b.jpg',
      desc: 'Steam Infusion - Compact - 6-in-1'
    }
  };

  // ========================================
  // SEARCH DATA
  // ========================================
  const searchableItems = [
    { type: 'product', name: 'Ounin Pro Embedded Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Compact Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Mini Steam Oven', url: 'products.html' },
    { type: 'product', name: 'Ounin Elite Bundle', url: 'products.html' },
    { type: 'product', name: 'Premium Accessory Kit', url: 'products.html' },
    { type: 'product', name: 'Steam Oven Accessories', url: 'products.html' },
    { type: 'recipe', name: 'Garlic Steam Prawns', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Perfect Sourdough Bread', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Steam Roast Chicken', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Garden Vegetables', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Salmon with Herbs', url: 'recipe-detail.html' },
    { type: 'recipe', name: 'Crème Brûlée', url: 'recipe-detail.html' },
    { type: 'blog', name: 'The Art of Steaming', url: 'blog-steam-temperature.html' },
    { type: 'blog', name: 'Bakery-Quality Bread at Home', url: 'blog-bread.html' },
    { type: 'blog', name: 'Fish That Falls Apart', url: 'blog-fish.html' },
    { type: 'blog', name: 'Sunday Prep, Weeknight Ease', url: 'blog-meal-prep.html' },
    { type: 'blog', name: 'The Vegetable Revolution', url: 'blog-vegetables.html' },
    { type: 'blog', name: 'Steam Oven Care Guide', url: 'blog-care.html' },
    { type: 'blog', name: 'Beyond Cheesecake Desserts', url: 'blog-desserts.html' },
    { type: 'blog', name: 'Steam Oven vs Conventional', url: 'blog-oven-comparison.html' },
    { type: 'blog', name: 'The Golden Rule of Roast Chicken', url: 'blog-chicken.html' },
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
    if (!navbar) return;
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
    if (mobileMenu) mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile menu when clicking links
  document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // ========================================
  // SEARCH MODAL
  // ========================================
  function openSearch() {
    if (!searchModal) return;
    searchModal.classList.add('active');
    if (searchInput) searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.classList.remove('active');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '<p class="search-hint">Start typing to search...</p>';
    document.body.style.overflow = '';
  }

  function handleSearch(e) {
    if (!searchResults) return;
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length < 2) {
      searchResults.innerHTML = '<p class="search-hint">Search for products, recipes, or anything else...</p>';
      return;
    }

    const results = searchableItems.filter(function(item) { 
      return item.name.toLowerCase().includes(query);
    });

    if (results.length === 0) {
      searchResults.innerHTML = '<p class="search-hint">No results found</p>';
      return;
    }

    searchResults.innerHTML = results.map(function(result) {
      return '<a href="' + result.url + '" class="search-result-item">' +
        '<span class="search-result-type">' + result.type + '</span>' +
        '<span class="search-result-name">' + result.name + '</span>' +
      '</a>';
    }).join('');
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
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchModal && searchModal.classList.contains('active')) {
      closeSearch();
    }
  });

  // Search overlay click to close
  var searchOverlay = document.getElementById('search-overlay');
  if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
  }

  // Search top close button
  var searchCloseTop = document.getElementById('search-close-top');
  if (searchCloseTop) {
    searchCloseTop.addEventListener('click', closeSearch);
  }

  // ========================================
  // CART MANAGEMENT
  // ========================================
  function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
  }

  function loadCart() {
    try {
      var savedCart = localStorage.getItem('ounin-cart');
      if (savedCart) {
        var parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          cart = [];
          for (var i = 0; i < parsed.length; i++) {
            if (parsed[i] && parsed[i].id && parsed[i].name && parsed[i].price && parsed[i].qty > 0) {
              cart.push(parsed[i]);
            }
          }
        }
      } else {
        cart = [];
      }
    } catch (e) {
      cart = [];
    }
    updateCartUI();
  }

  function saveCart() {
    try {
      localStorage.setItem('ounin-cart', JSON.stringify(cart));
    } catch (e) {}
  }

  function switchMainImage(thumb) {
    var mainImg = document.getElementById('main-product-img');
    var thumbs = document.querySelectorAll('[id="main-product-img"] ~ div img, .product-gallery-thumbs img');
    if (mainImg) { mainImg.src = thumb.dataset.src || thumb.src; }
    // Reset all thumb borders
    document.querySelectorAll('[onclick="switchMainImage(this)"]').forEach(function(el) {
      el.style.borderColor = 'transparent';
    });
    // Highlight clicked thumb
    thumb.style.borderColor = 'var(--color-primary)';
  }
  window.switchMainImage = switchMainImage;

  function addToCart(productId, name, price) {
    if (!productId || !name || !price) return;
    
    var existingItem = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) { existingItem = cart[i]; break; }
    }
    
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      var productInfo = products[productId];
      var image = productInfo ? productInfo.image : 'assets/images/product-placeholder.jpg';
      cart.push({
        id: productId,
        name: name,
        price: price,
        qty: 1,
        image: image
      });
    }
    
    saveCart();
    updateCartUI();
    showToast(name + ' added to cart!');
  }

  function removeFromCart(productId) {
    if (!productId) return;
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id !== productId) newCart.push(cart[i]);
    }
    cart = newCart;
    saveCart();
    updateCartUI();
  }

  function updateQuantity(productId, delta) {
    if (!productId) return;
    var item = null;
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === productId) { item = cart[i]; break; }
    }
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
    var sum = 0;
    for (var i = 0; i < cart.length; i++) {
      sum += cart[i].price * cart[i].qty;
    }
    return sum;
  }

  function getCartItemCount() {
    var sum = 0;
    for (var i = 0; i < cart.length; i++) {
      sum += cart[i].qty;
    }
    return sum;
  }

  function updateCartCount(count) {
    if (cartCount) {
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  function updateCartUI() {
    var itemCount = getCartItemCount();
    var total = getCartTotal();
    
    // Validate cart - remove invalid items
    for (var i = cart.length - 1; i >= 0; i--) {
      if (!cart[i].id || !cart[i].name || !cart[i].price || cart[i].qty < 1) {
        cart.splice(i, 1);
      }
    }
    saveCart();
    itemCount = getCartItemCount();
    
    // Update cart count badge
    updateCartCount(itemCount);
    
    // Update cart drawer
    if (cartItemCount) {
      cartItemCount.textContent = itemCount;
    }
    
    if (cartSubtotal) {
      cartSubtotal.textContent = '$' + total.toLocaleString();
    }
    
    // Update cart items
    if (cartItems) {
      if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        cartItems.innerHTML = '';
        if (cartFooter) cartFooter.style.display = 'none';
      } else {
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';
        
        var itemsHTML = '';
        for (var i = 0; i < cart.length; i++) {
          var item = cart[i];
          itemsHTML += '<div class="cart-item">' +
            '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">' +
            '<div class="cart-item-info">' +
              '<p class="cart-item-name">' + item.name + '</p>' +
              '<p class="cart-item-price">$' + item.price.toLocaleString() + '</p>' +
              '<div class="cart-item-qty">' +
                '<button class="qty-btn" onclick="updateQuantity(\'' + item.id + '\', -1)">-</button>' +
                '<span>' + item.qty + '</span>' +
                '<button class="qty-btn" onclick="updateQuantity(\'' + item.id + '\', 1)">+</button>' +
              '</div>' +
              '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">Remove</button>' +
            '</div>' +
          '</div>';
        }
        cartItems.innerHTML = itemsHTML;
      }
    }
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose functions globally for onclick handlers
  window.updateQuantity = updateQuantity;
  window.removeFromCart = removeFromCart;
  window.updateCartCount = updateCartUI;
  window.loadCart = loadCart;
  window.clearCart = clearCart;

  if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
  }

  if (cartClose) {
    cartClose.addEventListener('click', closeCart);
  }

  // Close cart drawer on overlay click
  if (cartDrawer) {
    cartDrawer.addEventListener('click', function(e) {
      if (e.target === cartDrawer) {
        closeCart();
      }
    });
  }

  // Add to cart buttons
  document.querySelectorAll('.btn-add-cart').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var productId = btn.dataset.product;
      var price = parseInt(btn.dataset.price);
      var name = btn.dataset.name;
      addToCart(productId, name, price);
    });
  });

  // ========================================
  // QUICK VIEW
  // ========================================
  function openQuickView(productId) {
    var product = products[productId];
    if (!product) return;
    if (!quickViewContent) return;

    var featuresHTML = '';
    for (var f = 0; f < product.features.length; f++) {
      featuresHTML += '<li style="padding: 6px 0;">✓ ' + product.features[f] + '</li>';
    }

    var originalPriceHTML = product.originalPrice
      ? '<span style="text-decoration: line-through; color: #999; font-size: 18px; margin-left: 8px;">$' + product.originalPrice.toLocaleString() + '</span>'
      : '';

    quickViewContent.innerHTML = '<img src="' + product.image + '" alt="' + product.name + '" class="quick-view-img">' +
      '<div class="quick-view-info">' +
        '<h2 class="quick-view-title">' + product.name + '</h2>' +
        '<div class="quick-view-price">$' + product.price.toLocaleString() + ' ' + originalPriceHTML + '</div>' +
        '<p class="quick-view-desc">' + product.desc + '</p>' +
        '<ul style="margin-bottom: 24px; font-size: 14px; color: #666;">' + featuresHTML + '</ul>' +
        '<button class="btn btn-primary" onclick="addToCart(\'' + product.id + '\', \'' + product.name + '\', ' + product.price + '); closeQuickView();">Add to Cart</button>' +
      '</div>';

    if (quickViewModal) quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    if (quickViewModal) quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose globally
  window.closeQuickView = closeQuickView;

  // Quick view buttons
  document.querySelectorAll('.quick-view-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
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
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && quickViewModal && quickViewModal.classList.contains('active')) {
      closeQuickView();
    }
  });

  // ========================================
  // TOAST NOTIFICATION
  // ========================================
  function showToast(message) {
    if (!toast || !toastMessage) {
      // Fallback: create temporary toast
      var fallback = document.createElement('div');
      fallback.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#333;color:#fff;padding:12px 24px;border-radius:8px;z-index:99999;font-family:sans-serif;font-size:14px;';
      fallback.textContent = message;
      document.body.appendChild(fallback);
      setTimeout(function() {
        fallback.style.opacity = '0';
        fallback.style.transition = 'opacity 0.3s';
        setTimeout(function() { if (fallback.parentNode) fallback.remove(); }, 300);
      }, 3000);
      return;
    }
    
    toastMessage.textContent = message;
    toast.classList.add('active');
    
    setTimeout(function() {
      toast.classList.remove('active');
    }, 3000);
  }

  // Expose showToast globally for inline onclick handlers
  window.showToast = showToast;

  // ========================================
  // PRODUCT CAROUSEL
  // ========================================
  var carouselPosition = 0;
  var carouselItemWidth = 0;

  function updateCarousel() {
    if (!productTrack || !productCarousel) return;
    
    var containerWidth = productCarousel.offsetWidth;
    var items = productTrack.children;
    
    if (items.length === 0) return;
    
    carouselItemWidth = items[0].offsetWidth + 24; // Including gap
    var maxPosition = Math.max(0, items.length * carouselItemWidth - containerWidth);
    
    carouselPosition = Math.min(carouselPosition, maxPosition);
    carouselPosition = Math.max(0, carouselPosition);
    
    productTrack.style.transform = 'translateX(-' + carouselPosition + 'px)';
  }

  function moveCarousel(direction) {
    if (!productTrack || !productCarousel) return;
    
    var containerWidth = productCarousel.offsetWidth;
    var scrollAmount = containerWidth * 0.8;
    
    if (direction === 'next') {
      carouselPosition += scrollAmount;
    } else {
      carouselPosition -= scrollAmount;
    }
    
    updateCarousel();
  }

  if (productPrev) {
    productPrev.addEventListener('click', function() { moveCarousel('prev'); });
  }

  if (productNext) {
    productNext.addEventListener('click', function() { moveCarousel('next'); });
  }

  // Handle window resize
  window.addEventListener('resize', updateCarousel);

  // Initial carousel setup
  setTimeout(updateCarousel, 100);

  // ========================================
  // WISHLIST
  // ========================================
  function toggleWishlist(productId) {
    var index = -1;
    for (var i = 0; i < wishlist.length; i++) {
      if (wishlist[i] === productId) { index = i; break; }
    }
    
    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from wishlist');
    } else {
      wishlist.push(productId);
      showToast('Added to wishlist');
    }
    
    try { localStorage.setItem('ounin-wishlist', JSON.stringify(wishlist)); } catch (e) {}
    updateWishlistUI();
  }

  function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(function(btn) {
      var productId = btn.dataset.product;
      var isInWishlist = false;
      for (var i = 0; i < wishlist.length; i++) {
        if (wishlist[i] === productId) { isInWishlist = true; break; }
      }
      
      if (isInWishlist) {
        btn.classList.add('active');
        btn.style.backgroundColor = '#E53935';
        var svg = btn.querySelector('svg');
        if (svg) svg.style.stroke = 'white';
      } else {
        btn.classList.remove('active');
        btn.style.backgroundColor = 'white';
        var svg = btn.querySelector('svg');
        if (svg) svg.style.stroke = '#2C2C2C';
      }
    });
  }

  function loadWishlist() {
    try {
      var savedWishlist = localStorage.getItem('ounin-wishlist');
      if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
      }
    } catch (e) {}
    updateWishlistUI();
  }

  // Expose globally
  window.toggleWishlist = toggleWishlist;

  // Wishlist buttons
  document.querySelectorAll('.wishlist-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      toggleWishlist(btn.dataset.product);
    });
  });

  // ========================================
  // NEWSLETTER FORM
  // ========================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var emailInput = newsletterForm.querySelector('input[type="email"]');
      var email = emailInput ? emailInput.value : '';
      
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
    checkoutBtn.addEventListener('click', function() {
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
    var elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(function(el) {
      var rect = el.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight * 0.85;
      
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
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      
      var target = document.querySelector(href);
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
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showToast('Thank you for your message! We\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  // ========================================
  // PRODUCT FILTER (Products Page)
  // ========================================
  var filterBtns = document.querySelectorAll('.filter-btn');
  var productCards = document.querySelectorAll('.products-grid .product-card');

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var filter = btn.dataset.filter;
      
      // Update active state
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      
      // Filter products
      productCards.forEach(function(card) {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ========================================
  // PRECISION TECHNOLOGY CAROUSEL
  // ========================================
  var precisionCarousel = document.getElementById('precisionCarousel');
  var precisionSlides = precisionCarousel ? precisionCarousel.querySelectorAll('.prec-slide') : null;
  var precisionPrev = precisionCarousel ? precisionCarousel.querySelector('.prec-prev') : null;
  var precisionNext = precisionCarousel ? precisionCarousel.querySelector('.prec-next') : null;
  var precisionDots = precisionCarousel ? precisionCarousel.querySelectorAll('.prec-dot') : null;
  var precisionIndex = 0;

  function updatePrecisionCarousel() {
    if (!precisionSlides || !precisionSlides.length) return;
    for (var i = 0; i < precisionSlides.length; i++) {
      precisionSlides[i].classList.toggle('active', i === precisionIndex);
    }
    if (precisionDots) {
      for (var j = 0; j < precisionDots.length; j++) {
        precisionDots[j].classList.toggle('active', j === precisionIndex);
      }
    }
  }

  function movePrecisionCarousel(dir) {
    if (!precisionSlides || !precisionSlides.length) return;
    var total = precisionSlides.length;
    if (dir === 'next') {
      precisionIndex = (precisionIndex + 1) % total;
    } else {
      precisionIndex = (precisionIndex - 1 + total) % total;
    }
    updatePrecisionCarousel();
  }

  if (precisionPrev) {
    precisionPrev.addEventListener('click', function() { movePrecisionCarousel('prev'); });
  }

  if (precisionNext) {
    precisionNext.addEventListener('click', function() { movePrecisionCarousel('next'); });
  }

  if (precisionDots) {
    precisionDots.forEach(function(dot) {
      dot.addEventListener('click', function() {
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
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (cartDrawer && cartDrawer.classList.contains('active')) {
          closeCart();
        }
      }
    });
  }

  // FAQ Accordion
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length > 0) {
    faqItems.forEach(function(item) {
      var question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', function() {
          var isActive = item.classList.contains('active');
          // Close all
          faqItems.forEach(function(i) { i.classList.remove('active'); });
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
