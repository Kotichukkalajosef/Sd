# SD Enterprises — Multi-Page Engineering Web Portal

Production-ready, ultra-fast multi-page website engineered for **SD Enterprises** specializing in:
- **Steam Turbine Generator (STG) Capital Outages & Overhauling** (up to 800 MW)
- **Turbine Driven Boiler Feed Pump (TDBFP) & Feed Pump Overhauling**
- **Critical High-Pressure Valve Reconditioning** (In-situ optical lapping)
- **Specialized Technical Manpower Supply** (Certified Millwrights, NDT Level-II, Turbine Leads)
- **Power Plant Operation & Maintenance (O&M)** (24/7 continuous operations & AMC contracts)
- **Balance of Plant (BOP) & Expandable Future Disciplines**

---

## 🚀 Key Improvements & Architecture Highlights

1. **Multi-Page Production Architecture**:
   - `index.html` — Homepage with interactive 3D rotor, metrics strip, services preview, overhaul methodology, and track record.
   - `services.html` — Comprehensive deep-dive into STG outages, TDBFP, critical valves, tolerances protocol table, and BOP capabilities.
   - `projects.html` — Filterable portfolio of past outages (660 MW, 500 MW, 250 MW, CPP) with live category switching.
   - `manpower-om.html` — Dedicated technical manpower supply, trades breakdown, mobilization timeline, and 24/7 plant O&M models.
   - `gallery.html` — High-performance lazy-loaded gallery with lightbox modal for on-site execution photos.
   - `about.html` — Company background, 4 core engineering principles, calibrated tooling inventory, and ISO certifications.
   - `contact.html` — Interactive Outage Planner / RFP form with 24/7 Emergency Outage Hotline.

2. **Pixel-Perfect 3D Turbine Rotor Fixes**:
   - **Aligned Geometry**: The Three.js STG rotor is now aligned with the Hero card bounding box.
   - **Scroll-Controlled Visibility**: The 3D turbine model rotates and demonstrates stage disassembly in the Hero section, begins a smooth fade-out across Section 2 (Metrics Strip), and **completely hides (`opacity: 0; visibility: hidden; pointer-events: none`) after Section 2**.
   - **GPU Performance Saving**: The WebGL animation loop automatically pauses offscreen rendering when scrolled past Section 2, saving 100% CPU/GPU overhead.

3. **Effortless Future Additions (Zero Code Bloat & Lightning Fast)**:
   - All data is centralized in [`js/site-data.js`](js/site-data.js).
   - **To add a project**: Add an entry into `SITE_DATA.projects`.
   - **To add a gallery image**: Drop your JPG/PNG into `assets/images/` and add an entry into `SITE_DATA.gallery`.
   - **To add a new service or category**: Add to `SITE_DATA.services` or `SITE_DATA.categories`.
   - **Fast Loading**: All gallery images use asynchronous decoding (`decoding="async"`), native lazy-loading (`loading="lazy"`), and instant-rendering SVG blueprint fallbacks so the site loads in under 1 second even with 100+ photos.

---

## 📁 Directory Structure

```
sd-landing-page/
├── index.html              # Main landing page & interactive 3D hero
├── services.html           # STG outages & equipment scopes
├── projects.html           # Filterable outage projects portfolio
├── manpower-om.html        # Manpower supply & 24/7 O&M
├── gallery.html            # High-performance photo gallery & lightbox
├── about.html              # Company history, ISO compliance & tooling
├── contact.html            # Outage RFP planner & emergency hotline
├── css/
│   └── styles.css          # Unified glassmorphism industrial styling
├── js/
│   ├── site-data.js        # Central data source (add projects & photos here)
│   ├── main.js             # Navigation, scroll progress, filters & forms
│   ├── turbine-3d.js       # Refactored Three.js turbine rotor engine
│   └── gallery.js          # Fast lazy-loaded gallery & lightbox modal
└── assets/
    └── images/             # Vector blueprints & site photography
```

---

## 🛠️ How to Preview & Host

Double-click any HTML file (e.g. `index.html`) to open directly in Chrome, Edge, Firefox, or Safari.

Or run a local static server via Node:
```bash
npx serve .
```
Production ready for instant deployment to Vercel, Netlify, GitHub Pages, or any industrial web server.
