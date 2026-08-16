=== Onepage Flow ===

Contributors: Aman Rauniyar
Requires at least: 6.0
Tested up to: 6.8
Requires PHP: 7.4
Version: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A fast, lightweight, accessible one-page WordPress theme.

== File structure ==

onepage-flow/
├── style.css              Theme header + all styles
├── index.php              Blog / archive / search fallback
├── functions.php          Setup, enqueues, menus, widgets
├── header.php             <head>, sticky header, nav
├── footer.php             Footer widgets, copyright, back-to-top
├── front-page.php         The one-page layout (Hero → Services → About → Blog → Contact)
├── inc/
│   └── customizer.php     All Customizer panels, sections and controls
└── assets/
    └── js/
        ├── main.js        Mobile nav, scroll spy, back-to-top
        └── customizer.js  Live preview

== Installation ==

1. Put all files in a folder named exactly `onepage-flow`.
2. Zip that folder (the zip must contain the folder, not loose files).
3. WordPress admin → Appearance → Themes → Add New → Upload Theme → choose the zip → Install → Activate.

== Setup after activation ==

1. Settings → Reading → "Your homepage displays" → A static page → pick any page as Homepage.
   (front-page.php renders automatically; the chosen page's content is not used.)
2. Appearance → Customize → Onepage Flow → fill in Hero, Services, About, Contact, Colors, Footer.
3. Appearance → Menus → create a menu with Custom Links: #hero, #services, #about, #blog, #contact
   → assign to "Primary Menu (one-page anchors)".
4. Appearance → Widgets → add widgets to Footer Column 1–3 (optional).

== Features ==

* One-page front page, fully Customizer-driven with live-preview color control
* Custom logo, two nav menus, three footer widget areas
* Sticky header with accessible mobile toggle and scroll-spy active states
* Latest-posts section pulled from your blog
* Contact section with email, phone and support for any contact-form shortcode
* Full blog/archive/search/single fallback via index.php
* Translation ready (text domain: onepage-flow), no external fonts or libraries
* Respects prefers-reduced-motion, skip link, visible focus states
