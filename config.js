/**
 * GLOBAL BACKGROUND IMAGE CONFIGURATION
 * 
 * This file manages all background images across your portfolio website.
 * Modify the BG_IMAGES object to change backgrounds globally or per-page.
 * 
 * USAGE:
 * 1. Global change: Update DEFAULT_BG to change background for all pages
 * 2. Per-page: Add data-bg="page-name" to each page's <body> tag
 * 
 * EXAMPLE:
 * <body data-bg="home">  <!-- Loads home.jpg background -->
 * <body data-bg="about"> <!-- Loads about.jpg background -->
 *
 */

const BG_CONFIG = {
  // Default background (applies to all pages unless overridden)
  DEFAULT_BG: 'home.jpg',
  
  // Per-page background images
  BG_IMAGES: {
    home: 'home.jpg',
    about: 'about.jpg',
    experience: 'experience.jpg',
    skills: 'skills.jpg',
    projects: 'projects.jpg',
    contact: 'contact.jpg'
  },
  
  // Overlay settings (0 = transparent, 1 = fully opaque)
  OVERLAY_OPACITY: 0.3,
  
  // Background blur effect (0 = no blur, higher = more blur)
  BG_BLUR: 2,
  
  // Filter settings for background image quality
  FILTERS: {
    brightness: 0.95,
    saturate: 0.9,
    contrast: 1.05
  }
};

/**
 * Initialize background system on page load
 * Automatically applies background based on data-bg attribute
 */
function initBackgroundSystem() {
  const body = document.body;
  const pageBg = body.getAttribute('data-bg') || 'home';
  
  // Apply background image from config
  const bgImage = BG_CONFIG.BG_IMAGES[pageBg] || BG_CONFIG.DEFAULT_BG;
  
  // Set CSS custom properties
  document.documentElement.style.setProperty('--bg-image', `url('${bgImage}')`);
  document.documentElement.style.setProperty('--bg-overlay', `rgba(0,0,0,${BG_CONFIG.OVERLAY_OPACITY})`);
  document.documentElement.style.setProperty('--bg-blur', `${BG_CONFIG.BG_BLUR}px`);
  
  console.log(`Background system initialized - Page: ${pageBg}, Image: ${bgImage}`);
}

/**
 * Dynamically change background image
 * @param {string} pageName - Key from BG_IMAGES (home, about, etc.)
 * @param {number} transitionDuration - Optional: transition time in ms (default 600ms)
 * 
 * EXAMPLE:
 * changeBackground('about'); // Changes to about.jpg
 * changeBackground('projects', 1000); // Changes with 1s transition
 */
function changeBackground(pageName, transitionDuration = 600) {
  const bgImage = BG_CONFIG.BG_IMAGES[pageName];
  
  if (!bgImage) {
    console.error(`Background image not found for page: ${pageName}`);
    console.log('Available pages:', Object.keys(BG_CONFIG.BG_IMAGES));
    return;
  }
  
  // Apply transition
  const body = document.body;
  body.style.transition = `background-image ${transitionDuration}ms var(--ease)`;
  
  // Change background
  document.documentElement.style.setProperty('--bg-image', `url('${bgImage}')`);
  
  console.log(`Background changed to: ${bgImage}`);
  
  // Reset transition after completion
  setTimeout(() => {
    body.style.transition = '';
  }, transitionDuration);
}

/**
 * Update overlay opacity
 * @param {number} opacity - Value between 0 and 1
 * 
 * EXAMPLE:
 * setOverlayOpacity(0.5); // 50% opacity overlay
 */
function setOverlayOpacity(opacity) {
  if (opacity < 0 || opacity > 1) {
    console.error('Opacity must be between 0 and 1');
    return;
  }
  BG_CONFIG.OVERLAY_OPACITY = opacity;
  document.documentElement.style.setProperty('--bg-overlay', `rgba(0,0,0,${opacity})`);
}

/**
 * Update background filter settings
 * @param {object} filters - Object with brightness, saturate, contrast values
 * 
 * EXAMPLE:
 * setBackgroundFilters({brightness: 1, saturate: 1, contrast: 1});
 */
function setBackgroundFilters(filters) {
  Object.assign(BG_CONFIG.FILTERS, filters);
  const filterString = `brightness(${filters.brightness || BG_CONFIG.FILTERS.brightness}) saturate(${filters.saturate || BG_CONFIG.FILTERS.saturate}) contrast(${filters.contrast || BG_CONFIG.FILTERS.contrast})`;
  // Note: Filters are applied via CSS, update styles.css body::before filter property
  console.log('Filters updated:', filterString);
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackgroundSystem);
} else {
  initBackgroundSystem();
}
