# Enterprise Footer — React Component

This repository contains a production-ready React `Footer` component built for a premium enterprise aesthetic. It uses:

- Framer Motion for entrance/staggered animations
- Lucide React for crisp SVG icons
- Tailwind CSS utility classes for layout and styling

Features
- 3-column layout (Name / Quick Links / Connect)
- Fade-up entrance per column with stagger
- Animated gradient background (subtle shimmer)
- Hover micro-interactions: icon motion, underline slide-in, ripple on click
- Scroll-to-top circular glowing button with progress ring
- Accessibility-aware (respects prefers-reduced-motion)

Files added
- `src/components/Footer.jsx` — main React component
- `package.json` — suggested dependencies and dev dependencies for a demo app

How to use
1. Create a React app (Vite recommended):

```bash
npm create vite@latest my-app -- --template react
cd my-app
```

2. Install dependencies:

```bash
npm install framer-motion lucide-react
# and if you want Tailwind support
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Copy `src/components/Footer.jsx` into your project and import it:

```jsx
import Footer from './components/Footer'

function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{/* page content */}</main>
      <Footer />
    </div>
  )
}
```

4. Ensure Tailwind base styles are included (if using Tailwind). The component uses Tailwind utility classes, and also includes a small embedded CSS snippet for ripple/divider animation.

Notes
- The component expects a modern React build environment.
- If you prefer GSAP instead of Framer Motion, the animation variants are simple to port.
- The `package.json` included is a suggested starting point for a demo environment.

If you want, I can scaffold a full Vite demo (index.html, App, Tailwind config) and run it locally — tell me to proceed and I'll create the demo files and update the TODOs.
# James-Website-Profile
A website showing my profile 

## Adding your CV for download

To enable the "Download CV" button on the About page:

- Place your CV file named `resume.pdf` inside the `assets/` directory (create `assets/` if it doesn't exist).
- The About page link already points to `assets/resume.pdf` and will trigger a download when clicked.
- I included `assets/CV-placeholder.txt` as a reminder — replace it with your actual `resume.pdf`.

Example: put your PDF at `assets/resume.pdf` and open `about.html` in a browser to test.
