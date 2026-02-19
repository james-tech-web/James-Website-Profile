# Global Background Image System - Documentation

## Overview
This website uses a centralized, global background image management system that allows you to easily set or change background images across all pages without editing individual HTML files.

## Quick Start

### Option 1: Using data-bg Attribute (Recommended)
Add the `data-bg` attribute to each page's `<body>` tag:

```html
<!-- index.html -->
<body data-bg="home">

<!-- about.html -->
<body data-bg="about">

<!-- experience.html -->
<body data-bg="experience">

<!-- skills.html -->
<body data-bg="skills">

<!-- projects.html -->
<body data-bg="projects">

<!-- contact.html -->
<body data-bg="contact">
```

### Option 2: Global Change via CSS Variables
Edit the `--bg-image` variable in `styles.css`:

```css
:root {
  --bg-image: url('your-image.jpg'); /* Changes for all pages */
}
```

---

## Configuration Files

### 1. **styles.css** - Core Styles
Location: `/styles.css`

Contains:
- CSS custom properties for background management
- `body::before` pseudo-element that applies the background
- `body::after` pseudo-element for overlay effect
- Auto page-specific backgrounds using `data-bg` selectors

```css
/* Examples from styles.css */
body[data-bg="home"]::before { --bg-image: url('home.jpg'); }
body[data-bg="about"]::before { --bg-image: url('about.jpg'); }
```

### 2. **config.js** - JavaScript Configuration
Location: `/config.js`

Includes:
- `BG_CONFIG` object with all background settings
- Helper functions to change backgrounds dynamically
- Overlay and filter controls

**Load in HTML:**
```html
<script src="config.js"></script>
```

---

## How to Use

### Method 1: Basic Setup (Add to Each Page)
1. Add `config.js` to your pages: `<script src="config.js"></script>`
2. Add `data-bg` attribute to body tag: `<body data-bg="home">`
3. Done! Background loads automatically

### Method 2: Global Settings
Edit `config.js`:
```javascript
const BG_CONFIG = {
  DEFAULT_BG: 'home.jpg',      // Default background
  OVERLAY_OPACITY: 0.3,        // Overlay darkness (0-1)
  BG_BLUR: 2,                  // Background blur (0+)
  FILTERS: {
    brightness: 0.95,
    saturate: 0.9,
    contrast: 1.05
  }
};
```

### Method 3: Dynamic Changes via JavaScript
```javascript
// Change background for current page
changeBackground('about');

// Change with custom transition duration (milliseconds)
changeBackground('projects', 1000);

// Update overlay opacity
setOverlayOpacity(0.5);  // 50% dark
setOverlayOpacity(0.2);  // 20% dark

// Modify filters
setBackgroundFilters({
  brightness: 1.0,
  saturate: 1.0,
  contrast: 1.0
});
```

---

## File Naming Convention

Background images should follow this naming pattern:
- `home.jpg` - Homepage background
- `about.jpg` - About page background
- `experience.jpg` - Experience page background
- `skills.jpg` - Skills page background
- `projects.jpg` - Projects page background
- `contact.jpg` - Contact page background

**Location**: Place all background images in the root project directory.

---

## Adding New Background Images

### Step 1: Upload Image
Place new image file in project root (e.g., `my-background.jpg`)

### Step 2: Register in config.js
```javascript
BG_CONFIG.BG_IMAGES = {
  home: 'home.jpg',
  about: 'about.jpg',
  myNewPage: 'my-background.jpg',  // ← Add here
  ...
}
```

### Step 3: Use on Page
```html
<body data-bg="myNewPage">
```

---

## Styling Background Behavior

### Control Overlay Darkness
Edit `--bg-overlay` in styles.css:
```css
:root {
  --bg-overlay: rgba(0,0,0,0.3);  /* 0.1 = light, 0.5 = dark, 0.9 = very dark */
}
```

### Adjust Image Filters
Edit filter properties on `body::before` in styles.css:
```css
body::before {
  filter: brightness(0.95) saturate(0.9) contrast(1.05);
  /* brightness: 0-2 (0.5=darker, 1=normal, 1.5=brighter) */
  /* saturate: 0-2 (0=grayscale, 1=normal, 2=very saturated) */
  /* contrast: 0-3 (0.5=low contrast, 1=normal, 2=high contrast) */
}
```

### Control Background Blur
Edit `body::before` in styles.css:
```css
body::before {
  backdrop-filter: blur(2px);  /* Change 2px to desired blur amount */
}
```

---

## Advanced Usage

### Dynamic Background with Smooth Transition
```javascript
// Change background with 2-second transition
changeBackground('projects', 2000);
```

### Set Light Overlay for Better Readability
```javascript
setOverlayOpacity(0.5);  // Darker overlay = better text readability
```

### Restore Original Filters
```javascript
setBackgroundFilters({
  brightness: 1.0,
  saturate: 1.0,
  contrast: 1.0
});
```

---

## HTML Implementation Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Portfolio - About</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body data-bg="about">
    <header><!-- Header content --></header>
    <nav><!-- Navigation --></nav>
    <section><!-- Page content --></section>
    
    <!-- Load background config system -->
    <script src="config.js"></script>
</body>
</html>
```

---

## Performance Considerations

1. **Image Optimization**: Use compressed, optimized images (max 2MB)
2. **Lazy Loading**: Background images load on-demand per page
3. **Fixed Positioning**: Background stays fixed on scroll (no reflow cost)
4. **Transitions**: Smooth CSS transitions use minimal CPU

---

## Troubleshooting

### Background Not Showing
- ✅ Verify image file exists in root directory
- ✅ Check file name matches exactly in config
- ✅ Ensure `data-bg` attribute is present on body tag
- ✅ Verify `config.js` is loaded

### Overlay Too Dark/Light
- Edit `--bg-overlay` opacity in styles.css
- Or use `setOverlayOpacity(0.x)` in JavaScript

### Image Looks Blurry
- Check image resolution (recommended: 1920×1080+)
- Adjust `backdrop-filter: blur()` value in styles.css

---

## Browser Support
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari 14+, Chrome Android)

---

## Summary
This system provides:
- ✅ Centralized background management
- ✅ Per-page customization via `data-bg` attribute
- ✅ Dynamic JavaScript control
- ✅ Smooth transitions
- ✅ Easy to maintain and modify
- ✅ Fully responsive
- ✅ Performance optimized
