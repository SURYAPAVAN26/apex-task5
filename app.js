// Wait for DOM Content to load
document.addEventListener("DOMContentLoaded", () => {
  
  /* ==========================================================================
     1. STATE MANAGEMENT & INITIALIZATION
     ========================================================================== */
  let state = {
    cart: JSON.parse(localStorage.getItem("aura_cart")) || [],
    favorites: JSON.parse(localStorage.getItem("aura_favorites")) || [],
    theme: localStorage.getItem("aura_theme") || "dark",
    currentView: "shop",
    filters: {
      search: "",
      category: "all",
      maxPrice: 350,
      sortBy: "featured"
    },
    // Dashboard smart home states
    connectedDevices: JSON.parse(localStorage.getItem("aura_devices")) || {
      "aura-glow-sphere": true,
      "aura-halo-speaker": true,
      "aura-horizon-soundbar": false,
      "aura-hexa-panels": true
    },
    orderHistory: JSON.parse(localStorage.getItem("aura_orders")) || []
  };

  // Device power consumption mapping (in Watts)
  const devicePowerLoads = {
    "aura-glow-sphere": 12,
    "aura-halo-speaker": 25,
    "aura-horizon-soundbar": 80,
    "aura-hexa-panels": 32
  };

  // DOM Elements Cache
  const elements = {
    // Nav
    navShopBtn: document.getElementById("navShopBtn"),
    navDashboardBtn: document.getElementById("navDashboardBtn"),
    navLogo: document.getElementById("navLogo"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeSunIcon: document.getElementById("themeSunIcon"),
    themeMoonIcon: document.getElementById("themeMoonIcon"),
    favTriggerBtn: document.getElementById("favTriggerBtn"),
    favCountBadge: document.getElementById("favCountBadge"),
    cartTriggerBtn: document.getElementById("cartTriggerBtn"),
    cartCountBadge: document.getElementById("cartCountBadge"),

    // Views
    shopView: document.getElementById("shopView"),
    dashboardView: document.getElementById("dashboardView"),

    // Hero Adjuster
    hueSlider: document.getElementById("hueSlider"),
    satSlider: document.getElementById("satSlider"),
    lightSlider: document.getElementById("lightSlider"),
    hueVal: document.getElementById("hueVal"),
    satVal: document.getElementById("satVal"),
    lightVal: document.getElementById("lightVal"),
    ambientOrb: document.getElementById("ambientOrb"),
    heroBgGlow: document.getElementById("heroBgGlow"),
    presetDots: document.querySelectorAll(".preset-dot"),
    heroShopBtn: document.getElementById("heroShopBtn"),
    heroDashboardBtn: document.getElementById("heroDashboardBtn"),

    // Catalog & Filter
    productGrid: document.getElementById("productGrid"),
    catalogSearch: document.getElementById("catalogSearch"),
    filterBtns: document.querySelectorAll(".filter-btn"),
    priceFilter: document.getElementById("priceFilter"),
    priceLimitVal: document.getElementById("priceLimitVal"),
    resultsCount: document.getElementById("resultsCount"),
    sortBy: document.getElementById("sortBy"),
    catCountAll: document.getElementById("catCountAll"),
    catCountLighting: document.getElementById("catCountLighting"),
    catCountSound: document.getElementById("catCountSound"),

    // Cart Drawer
    cartDrawer: document.getElementById("cartDrawer"),
    cartOverlay: document.getElementById("cartOverlay"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartShipping: document.getElementById("cartShipping"),
    cartTotal: document.getElementById("cartTotal"),
    checkoutBtn: document.getElementById("checkoutBtn"),

    // Checkout Modal
    checkoutModalOverlay: document.getElementById("checkoutModalOverlay"),
    closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),
    toPaymentBtn: document.getElementById("toPaymentBtn"),
    backToShippingBtn: document.getElementById("backToShippingBtn"),
    submitOrderBtn: document.getElementById("submitOrderBtn"),
    successContinueBtn: document.getElementById("successContinueBtn"),
    shippingForm: document.getElementById("shippingForm"),
    paymentForm: document.getElementById("paymentForm"),
    stepPanel1: document.getElementById("stepPanel1"),
    stepPanel2: document.getElementById("stepPanel2"),
    stepPanel3: document.getElementById("stepPanel3"),
    stepIndicator1: document.getElementById("stepIndicator1"),
    stepIndicator2: document.getElementById("stepIndicator2"),
    stepIndicator3: document.getElementById("stepIndicator3"),
    successOrderNumber: document.getElementById("successOrderNumber"),

    // Detail Modal
    detailsModalOverlay: document.getElementById("detailsModalOverlay"),
    closeDetailsBtn: document.getElementById("closeDetailsBtn"),
    detailsModalContent: document.getElementById("detailsModalContent"),

    // Dashboard
    deviceToggleCbs: document.querySelectorAll(".device-toggle-cb"),
    metricsPowerVal: document.getElementById("metricsPowerVal"),
    metricsSavingsVal: document.getElementById("metricsSavingsVal"),
    activeDayChartBar: document.getElementById("activeDayChartBar"),
    orderHistoryList: document.getElementById("orderHistoryList"),

    // Footers & Toasts
    toastContainer: document.getElementById("toastContainer"),
    footerShopLink: document.getElementById("footerShopLink"),
    footerDashLink: document.getElementById("footerDashLink"),

    // Mobile Nav
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    mobileNavDrawer: document.getElementById("mobileNavDrawer"),
    mobileNavOverlay: document.getElementById("mobileNavOverlay"),
    closeMobileNavBtn: document.getElementById("closeMobileNavBtn"),
    mobileNavShopBtn: document.getElementById("mobileNavShopBtn"),
    mobileNavDashboardBtn: document.getElementById("mobileNavDashboardBtn")
  };

  /* ==========================================================================
     2. TOAST SYSTEM
     ========================================================================== */
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    if (type === "success") {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    } else if (type === "warning") {
      icon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    }

    toast.innerHTML = `
      ${icon}
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);
    
    // Smooth remove
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ==========================================================================
     3. THEME TOGGLER
     ========================================================================== */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    state.theme = theme;
    localStorage.setItem("aura_theme", theme);

    if (theme === "light") {
      elements.themeSunIcon.style.display = "none";
      elements.themeMoonIcon.style.display = "block";
    } else {
      elements.themeSunIcon.style.display = "block";
      elements.themeMoonIcon.style.display = "none";
    }
  }

  elements.themeToggleBtn.addEventListener("click", () => {
    const nextTheme = state.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    showToast(`Switched to ${nextTheme === "dark" ? "Immersive Dark" : "Clean Light"} mode`, "info");
  });

  // Apply default setting
  applyTheme(state.theme);

  /* ==========================================================================
     4. INTERACTIVE AMBIENT ADJUSTER (Hero)
     ========================================================================== */
  function updateAmbientGlow() {
    const h = elements.hueSlider.value;
    const s = elements.satSlider.value;
    const l = elements.lightSlider.value;

    // Update Slider text label display values
    elements.hueVal.textContent = `${h}°`;
    elements.satVal.textContent = `${s}%`;
    elements.lightVal.textContent = `${l}%`;

    // Apply color to Orb
    elements.ambientOrb.style.background = `radial-gradient(circle, hsl(${h}, ${s}%, ${l + 10}%) 0%, hsl(${h}, ${s}%, ${l - 20}%) 100%)`;
    elements.ambientOrb.style.boxShadow = `0 0 50px hsl(${h}, ${s}%, ${l}%, 0.6), 0 0 100px hsl(${h}, ${s}%, ${l}%, 0.3)`;

    // Apply backing background aura glow
    elements.heroBgGlow.style.background = `radial-gradient(circle, hsl(${h}, ${s}%, ${l}%, 0.25) 0%, rgba(0,0,0,0) 70%)`;
  }

  [elements.hueSlider, elements.satSlider, elements.lightSlider].forEach(slider => {
    slider.addEventListener("input", () => {
      // Remove preset dot highlights since user custom-tuned
      elements.presetDots.forEach(dot => dot.classList.remove("active"));
      updateAmbientGlow();
    });
  });

  // Color Presets Clicking
  elements.presetDots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      elements.presetDots.forEach(d => d.classList.remove("active"));
      e.currentTarget.classList.add("active");

      // Pull settings from data attributes
      const h = e.currentTarget.dataset.h;
      const s = e.currentTarget.dataset.s;
      const l = e.currentTarget.dataset.l;

      // Animate sliders to value
      elements.hueSlider.value = h;
      elements.satSlider.value = s;
      elements.lightSlider.value = l;

      updateAmbientGlow();
      showToast("Color profile synchronized", "success");
    });
  });

  // Initial trigger
  updateAmbientGlow();

  /* ==========================================================================
     5. VIEW ROUTER
     ========================================================================== */
  function switchView(viewName) {
    if (viewName === "shop") {
      elements.shopView.style.display = "block";
      elements.dashboardView.classList.remove("active");
      elements.navShopBtn.classList.add("active");
      elements.navDashboardBtn.classList.remove("active");
      elements.mobileNavShopBtn.classList.add("active");
      elements.mobileNavDashboardBtn.classList.remove("active");
      state.currentView = "shop";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (viewName === "dashboard") {
      elements.shopView.style.display = "none";
      elements.dashboardView.classList.add("active");
      elements.navShopBtn.classList.remove("active");
      elements.navDashboardBtn.classList.add("active");
      elements.mobileNavShopBtn.classList.remove("active");
      elements.mobileNavDashboardBtn.classList.add("active");
      state.currentView = "dashboard";
      renderDashboard();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  elements.navShopBtn.addEventListener("click", () => switchView("shop"));
  elements.navDashboardBtn.addEventListener("click", () => switchView("dashboard"));
  elements.navLogo.addEventListener("click", () => switchView("shop"));
  elements.heroDashboardBtn.addEventListener("click", () => switchView("dashboard"));
  elements.footerDashLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("dashboard");
  });
  elements.footerShopLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchView("shop");
    setTimeout(() => {
      document.getElementById("catalogAnchor").scrollIntoView({ behavior: "smooth" });
    }, 100);
  });

  elements.heroShopBtn.addEventListener("click", () => {
    document.getElementById("catalogAnchor").scrollIntoView({ behavior: "smooth" });
  });

  /* ==========================================================================
     5b. MOBILE NAV DRAWER
     ========================================================================== */
  function openMobileNav() {
    elements.mobileNavDrawer.classList.add("active");
    elements.mobileNavOverlay.classList.add("active");
  }

  function closeMobileNav() {
    elements.mobileNavDrawer.classList.remove("active");
    elements.mobileNavOverlay.classList.remove("active");
  }

  elements.mobileMenuBtn.addEventListener("click", openMobileNav);
  elements.closeMobileNavBtn.addEventListener("click", closeMobileNav);
  elements.mobileNavOverlay.addEventListener("click", closeMobileNav);

  elements.mobileNavShopBtn.addEventListener("click", () => {
    closeMobileNav();
    switchView("shop");
  });

  elements.mobileNavDashboardBtn.addEventListener("click", () => {
    closeMobileNav();
    switchView("dashboard");
  });

  /* ==========================================================================
     6. SHOPPING CATALOG - FILTERS & DISPLAY
     ========================================================================== */
  function updateCategoryCounts() {
    let countLighting = 0;
    let countSound = 0;

    products.forEach(p => {
      if (p.category === "lighting") countLighting++;
      if (p.category === "sound") countSound++;
    });

    elements.catCountAll.textContent = products.length;
    elements.catCountLighting.textContent = countLighting;
    elements.catCountSound.textContent = countSound;
  }

  function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 !== 0;
    let starsHtml = "";
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHtml += "★";
      } else if (i === fullStars && hasHalf) {
        starsHtml += "⯪";
      } else {
        starsHtml += "☆";
      }
    }
    return starsHtml;
  }

  function renderProducts() {
    elements.productGrid.innerHTML = "";

    // Apply Filter rules
    let filtered = products.filter(p => {
      // Search text match (Name, description, specs)
      const query = state.filters.search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) || 
                          p.tagline.toLowerCase().includes(query);
      
      // Category match
      const matchCat = state.filters.category === "all" || p.category === state.filters.category;
      
      // Price limit match
      const matchPrice = p.price <= state.filters.maxPrice;

      return matchSearch && matchCat && matchPrice;
    });

    // Apply Sorting rules
    if (state.filters.sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.filters.sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.filters.sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    elements.resultsCount.textContent = `Showing ${filtered.length} products`;

    if (filtered.length === 0) {
      elements.productGrid.innerHTML = `
        <div class="cart-empty-state" style="grid-column: 1 / -1; padding: 60px 0;">
          <div class="cart-empty-icon">🔎</div>
          <p>No products found matching your filters.</p>
          <button class="btn-secondary" id="clearFiltersBtn" style="margin-top: 12px;">Reset Filters</button>
        </div>
      `;
      document.getElementById("clearFiltersBtn")?.addEventListener("click", resetFilters);
      return;
    }

    // Generate product grid UI
    filtered.forEach(p => {
      const isFav = state.favorites.includes(p.id);
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;
      
      card.innerHTML = `
        <div class="product-image-container">
          <button class="fav-card-btn ${isFav ? "favorited" : ""}" aria-label="Add to favorites">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          </button>
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
        </div>
        
        <div class="product-cat">${p.categoryLabel}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-tagline">${p.tagline}</p>
        
        <div class="product-rating">
          <span class="stars">${getRatingStars(p.rating)}</span>
          <span style="color: var(--text-muted);">(${p.reviews})</span>
        </div>
        
        <div class="product-footer">
          <div class="product-price">$${p.price}</div>
          <button class="card-cart-btn" aria-label="Add ${p.name} to Cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5v14"></path></svg>
          </button>
        </div>
      `;

      // Set up click handlers
      card.querySelector(".fav-card-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(p.id);
      });

      card.querySelector(".card-cart-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(p.id);
      });

      card.querySelector(".product-name").addEventListener("click", () => {
        openDetailModal(p);
      });

      elements.productGrid.appendChild(card);
    });
  }

  // Filter Actions listeners
  elements.catalogSearch.addEventListener("input", (e) => {
    state.filters.search = e.target.value;
    renderProducts();
  });

  elements.filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      elements.filterBtns.forEach(b => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      
      state.filters.category = e.currentTarget.dataset.category;
      renderProducts();
    });
  });

  elements.priceFilter.addEventListener("input", (e) => {
    const val = e.target.value;
    elements.priceLimitVal.textContent = `$${val}`;
    state.filters.maxPrice = parseFloat(val);
    renderProducts();
  });

  elements.sortBy.addEventListener("change", (e) => {
    state.filters.sortBy = e.target.value;
    renderProducts();
  });

  function resetFilters() {
    state.filters = {
      search: "",
      category: "all",
      maxPrice: 350,
      sortBy: "featured"
    };

    elements.catalogSearch.value = "";
    elements.priceFilter.value = 350;
    elements.priceLimitVal.textContent = "$350";
    elements.sortBy.value = "featured";
    
    elements.filterBtns.forEach(b => {
      b.classList.remove("active");
      if (b.dataset.category === "all") b.classList.add("active");
    });

    renderProducts();
  }

  /* ==========================================================================
     7. FAVORITES SYSTEM
     ========================================================================== */
  function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    const prod = products.find(p => p.id === id);

    if (idx === -1) {
      state.favorites.push(id);
      showToast(`${prod.name} added to Favorites`, "success");
    } else {
      state.favorites.splice(idx, 1);
      showToast(`${prod.name} removed from Favorites`, "info");
    }

    localStorage.setItem("aura_favorites", JSON.stringify(state.favorites));
    updateFavoritesBadge();
    renderProducts();
  }

  function updateFavoritesBadge() {
    const count = state.favorites.length;
    if (count > 0) {
      elements.favCountBadge.textContent = count;
      elements.favCountBadge.style.display = "block";
    } else {
      elements.favCountBadge.style.display = "none";
    }
  }

  // View Favorites triggers Filter Toggle
  elements.favTriggerBtn.addEventListener("click", () => {
    if (state.favorites.length === 0) {
      showToast("No favorites saved yet. Heart some items in the shop!", "warning");
      return;
    }

    // Toggle filter logic to show only favorited items
    elements.filterBtns.forEach(b => b.classList.remove("active"));
    state.filters.category = "all";
    state.filters.maxPrice = 350;
    elements.priceFilter.value = 350;
    elements.priceLimitVal.textContent = "$350";
    
    // Custom filter mapping
    elements.productGrid.innerHTML = "";
    let filtered = products.filter(p => state.favorites.includes(p.id));
    elements.resultsCount.textContent = `Showing ${filtered.length} favorites`;

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;
      card.innerHTML = `
        <div class="product-image-container">
          <button class="fav-card-btn favorited" aria-label="Remove from favorites">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          </button>
          <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy">
        </div>
        
        <div class="product-cat">${p.categoryLabel}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-tagline">${p.tagline}</p>
        
        <div class="product-rating">
          <span class="stars">${getRatingStars(p.rating)}</span>
          <span style="color: var(--text-muted);">(${p.reviews})</span>
        </div>
        
        <div class="product-footer">
          <div class="product-price">$${p.price}</div>
          <button class="card-cart-btn" aria-label="Add to cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5v14"></path></svg>
          </button>
        </div>
      `;

      card.querySelector(".fav-card-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFavorite(p.id);
        // Refresh display if currently looking at Favorites tab
        elements.favTriggerBtn.click();
      });

      card.querySelector(".card-cart-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(p.id);
      });

      card.querySelector(".product-name").addEventListener("click", () => {
        openDetailModal(p);
      });

      elements.productGrid.appendChild(card);
    });

    document.getElementById("catalogAnchor").scrollIntoView({ behavior: "smooth" });
  });

  /* ==========================================================================
     8. SHOPPING CART SYSTEM
     ========================================================================== */
  function openCartDrawer() {
    elements.cartDrawer.classList.add("active");
    elements.cartOverlay.classList.add("active");
  }

  function closeCartDrawer() {
    elements.cartDrawer.classList.remove("active");
    elements.cartOverlay.classList.remove("active");
  }

  elements.cartTriggerBtn.addEventListener("click", openCartDrawer);
  elements.closeCartBtn.addEventListener("click", closeCartDrawer);
  elements.cartOverlay.addEventListener("click", closeCartDrawer);

  function addToCart(id) {
    const item = state.cart.find(c => c.id === id);
    const prod = products.find(p => p.id === id);

    if (item) {
      item.qty += 1;
    } else {
      state.cart.push({ id, qty: 1 });
    }

    localStorage.setItem("aura_cart", JSON.stringify(state.cart));
    updateCartDOM();
    showToast(`${prod.name} added to shopping cart`, "success");
    animateCartBadge();
  }

  function updateCartQty(id, change) {
    const item = state.cart.find(c => c.id === id);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
      const idx = state.cart.indexOf(item);
      state.cart.splice(idx, 1);
    }

    localStorage.setItem("aura_cart", JSON.stringify(state.cart));
    updateCartDOM();
  }

  function removeFromCart(id) {
    const idx = state.cart.findIndex(c => c.id === id);
    if (idx === -1) return;

    const prod = products.find(p => p.id === id);
    state.cart.splice(idx, 1);
    
    localStorage.setItem("aura_cart", JSON.stringify(state.cart));
    updateCartDOM();
    showToast(`${prod.name} removed from cart`, "info");
  }

  function animateCartBadge() {
    elements.cartCountBadge.classList.add("cart-shake");
    setTimeout(() => {
      elements.cartCountBadge.classList.remove("cart-shake");
    }, 400);
  }

  function updateCartDOM() {
    elements.cartItemsList.innerHTML = "";
    
    let subtotal = 0;
    let totalItemsCount = 0;

    if (state.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🛒</div>
          <p>Your shopping cart is empty.</p>
          <button class="glow-btn" id="cartShopBackBtn" style="margin-top: 8px;">Explore Ambient Store</button>
        </div>
      `;
      document.getElementById("cartShopBackBtn")?.addEventListener("click", () => {
        closeCartDrawer();
        elements.heroShopBtn.click();
      });
      elements.checkoutBtn.disabled = true;
      elements.checkoutBtn.style.opacity = "0.5";
    } else {
      elements.checkoutBtn.disabled = false;
      elements.checkoutBtn.style.opacity = "1";

      state.cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (!prod) return;

        subtotal += prod.price * item.qty;
        totalItemsCount += item.qty;

        const cartCard = document.createElement("div");
        cartCard.className = "cart-item";
        cartCard.innerHTML = `
          <img src="${prod.image}" alt="${prod.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <div class="cart-item-title">${prod.name}</div>
              <div class="cart-item-price">$${prod.price}</div>
            </div>
            
            <div class="cart-qty-controller">
              <button class="qty-btn" data-id="${item.id}" data-change="-1">-</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}">&times;</button>
        `;

        // Listeners for quantity and remove
        cartCard.querySelectorAll(".qty-btn").forEach(btn => {
          btn.addEventListener("click", (e) => {
            const id = e.target.dataset.id;
            const change = parseInt(e.target.dataset.change);
            updateCartQty(id, change);
          });
        });

        cartCard.querySelector(".cart-item-remove").addEventListener("click", (e) => {
          removeFromCart(e.target.dataset.id);
        });

        elements.cartItemsList.appendChild(cartCard);
      });
    }

    // Calculations
    elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    elements.cartTotal.textContent = `$${subtotal.toFixed(2)}`; // Free standard shipping

    // Badge Updates
    if (totalItemsCount > 0) {
      elements.cartCountBadge.textContent = totalItemsCount;
      elements.cartCountBadge.style.display = "block";
    } else {
      elements.cartCountBadge.style.display = "none";
    }
  }

  // Initial cart draw
  updateCartDOM();
  updateFavoritesBadge();
  updateCategoryCounts();
  renderProducts();

  /* ==========================================================================
     9. DETAILED PRODUCT MODAL
     ========================================================================== */
  function openDetailModal(p) {
    elements.detailsModalContent.innerHTML = `
      <div class="detail-img-box">
        <img src="${p.image}" alt="${p.name}" class="detail-img">
      </div>
      <div class="detail-info">
        <div class="product-cat">${p.categoryLabel}</div>
        <h2 class="detail-title">${p.name}</h2>
        <div class="product-rating">
          <span class="stars">${getRatingStars(p.rating)}</span>
          <span style="color: var(--text-muted); font-size: 0.85rem;">(${p.reviews} Verified Customer Reviews)</span>
        </div>
        <div class="detail-price">$${p.price}</div>
        <p class="detail-desc">${p.description}</p>
        
        <div>
          <div class="detail-bullet-title">Key Ambient Features:</div>
          <ul class="detail-bullets">
            ${p.features.map(f => `<li>${f}</li>`).join("")}
          </ul>
        </div>
        
        <div>
          <div class="detail-bullet-title">Technical Specifications:</div>
          <table class="detail-specs-table">
            ${Object.entries(p.specs).map(([k, v]) => `
              <tr>
                <td>${k}</td>
                <td>${v}</td>
              </tr>
            `).join("")}
          </table>
        </div>
        
        <button class="glow-btn" id="detailModalAddBtn" style="margin-top: 16px; justify-content: center;">
          Add to Cart &bull; $${p.price}
        </button>
      </div>
    `;

    document.getElementById("detailModalAddBtn").addEventListener("click", () => {
      addToCart(p.id);
      closeDetailModal();
    });

    elements.detailsModalOverlay.classList.add("active");
  }

  function closeDetailModal() {
    elements.detailsModalOverlay.classList.remove("active");
  }

  elements.closeDetailsBtn.addEventListener("click", closeDetailModal);
  elements.detailsModalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.detailsModalOverlay) closeDetailModal();
  });

  /* ==========================================================================
     10. DYNAMIC MULTI-STEP CHECKOUT
     ========================================================================== */
  function openCheckout() {
    closeCartDrawer();
    // Reset stepper views
    elements.stepPanel1.classList.add("active");
    elements.stepPanel2.classList.remove("active");
    elements.stepPanel3.classList.remove("active");
    
    elements.stepIndicator1.className = "step-indicator active";
    elements.stepIndicator2.className = "step-indicator";
    elements.stepIndicator3.className = "step-indicator";

    elements.checkoutModalOverlay.classList.add("active");
  }

  function closeCheckout() {
    elements.checkoutModalOverlay.classList.remove("active");
  }

  elements.checkoutBtn.addEventListener("click", openCheckout);
  elements.closeCheckoutBtn.addEventListener("click", closeCheckout);
  elements.checkoutModalOverlay.addEventListener("click", (e) => {
    if (e.target === elements.checkoutModalOverlay) closeCheckout();
  });

  // Step 1 Submission: Shipping Validation
  elements.shippingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    // Move to step 2
    elements.stepPanel1.classList.remove("active");
    elements.stepPanel2.classList.add("active");
    
    elements.stepIndicator1.className = "step-indicator completed";
    elements.stepIndicator2.className = "step-indicator active";
  });

  elements.backToShippingBtn.addEventListener("click", () => {
    // Step back
    elements.stepPanel2.classList.remove("active");
    elements.stepPanel1.classList.add("active");
    
    elements.stepIndicator1.className = "step-indicator active";
    elements.stepIndicator2.className = "step-indicator";
  });

  // Step 2 Submission: Payment Validation & Completion
  elements.paymentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Simulate Order Submission
    const orderNumber = "AURA-" + Math.floor(100000 + Math.random() * 900000);
    elements.successOrderNumber.textContent = `#${orderNumber}`;

    // Compile order details
    const orderItems = state.cart.map(item => {
      const prod = products.find(p => p.id === item.id);
      return {
        name: prod.name,
        price: prod.price,
        qty: item.qty
      };
    });

    const newOrder = {
      orderId: orderNumber,
      date: new Date().toLocaleDateString(),
      items: orderItems,
      total: state.cart.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.id);
        return sum + (prod.price * item.qty);
      }, 0)
    };

    // Save to order history list
    state.orderHistory.unshift(newOrder);
    localStorage.setItem("aura_orders", JSON.stringify(state.orderHistory));

    // Clear cart state
    state.cart = [];
    localStorage.setItem("aura_cart", JSON.stringify(state.cart));
    updateCartDOM();

    // Trigger Success screen
    elements.stepPanel2.classList.remove("active");
    elements.stepPanel3.classList.add("active");
    
    elements.stepIndicator2.className = "step-indicator completed";
    elements.stepIndicator3.className = "step-indicator completed";
    
    showToast("Secure payment processed!", "success");
    
    // Dynamic tracking package progression simulation after checkout
    const trackingNodes = document.querySelectorAll(".tracking-node");
    setTimeout(() => {
      trackingNodes[2].classList.add("active"); // In transit active
      showToast("Order loaded for carrier dispatch", "info");
    }, 4000);
  });

  elements.successContinueBtn.addEventListener("click", () => {
    closeCheckout();
    switchView("shop");
  });

  /* ==========================================================================
     11. INTEGRATED DASHBOARD - ANALYTICS & ENERGY MODES
     ========================================================================== */
  function renderDashboard() {
    // 1. Render Order History
    elements.orderHistoryList.innerHTML = "";
    
    if (state.orderHistory.length === 0) {
      elements.orderHistoryList.innerHTML = `
        <div class="cart-empty-state" style="padding: 30px 0;">
          <p>No transactions registered under this account.</p>
        </div>
      `;
    } else {
      state.orderHistory.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.className = "history-item";
        
        const namesList = order.items.map(i => `${i.name} (x${i.qty})`).join(", ");
        
        orderCard.innerHTML = `
          <div class="history-item-header">
            <span>Order ${order.orderId}</span>
            <span>Placed: ${order.date}</span>
          </div>
          <div class="history-item-summary">
            <span class="history-item-names">${namesList}</span>
            <span class="history-item-price">$${order.total.toFixed(2)}</span>
          </div>
        `;
        elements.orderHistoryList.appendChild(orderCard);
      });
    }

    // 2. Render Checkbox active states from local values
    elements.deviceToggleCbs.forEach(cb => {
      const devId = cb.dataset.id;
      cb.checked = state.connectedDevices[devId] !== undefined ? state.connectedDevices[devId] : false;
    });

    recalculatePowerAnalytics();
  }

  function recalculatePowerAnalytics() {
    let totalLoad = 0;
    let activeCount = 0;
    let maxCapacity = 0;

    elements.deviceToggleCbs.forEach(cb => {
      const devId = cb.dataset.id;
      const deviceLoad = devicePowerLoads[devId];
      maxCapacity += deviceLoad;

      if (cb.checked) {
        totalLoad += deviceLoad;
        activeCount++;
        state.connectedDevices[devId] = true;
      } else {
        state.connectedDevices[devId] = false;
      }
    });

    localStorage.setItem("aura_devices", JSON.stringify(state.connectedDevices));

    // Update power metric count
    elements.metricsPowerVal.innerHTML = `${totalLoad} <span>Watts</span>`;

    // Compute relative estimated savings index (e.g. 1 - (actualLoad / maxLoad))
    const savingsIndex = maxCapacity > 0 ? Math.round((1 - (totalLoad / maxCapacity)) * 100) : 100;
    elements.metricsSavingsVal.textContent = `${savingsIndex}%`;

    // Update chart "Today" bar column height
    // Map max watts load scale (say 150W is 100% chart height)
    const maxHeightScale = 150; 
    const barHeightPercent = Math.min((totalLoad / maxHeightScale) * 100, 100);
    
    // Apply layout heights dynamically
    elements.activeDayChartBar.style.height = `${barHeightPercent}%`;
    elements.activeDayChartBar.setAttribute("data-value", totalLoad);
  }

  // Bind change listeners to toggle switches
  elements.deviceToggleCbs.forEach(cb => {
    cb.addEventListener("change", (e) => {
      recalculatePowerAnalytics();
      const devName = e.target.closest(".device-toggle-item").querySelector(".device-name").textContent;
      showToast(`${devName} turned ${e.target.checked ? "ON" : "OFF"}. Power metrics adjusted.`, "info");
    });
  });

});
