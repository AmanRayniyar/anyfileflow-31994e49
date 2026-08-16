/**
 * Onepage Flow — front-end behaviour.
 * Vanilla JS, no dependencies, loaded in the footer.
 */
(function () {
	'use strict';

	/* -------- Mobile navigation -------- */
	var toggle = document.querySelector('.of-nav-toggle');
	var nav = document.getElementById('primary-navigation');

	if (toggle && nav) {
		toggle.addEventListener('click', function () {
			var open = nav.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		});

		// Close the menu after tapping an anchor link.
		nav.addEventListener('click', function (event) {
			if (event.target.tagName === 'A') {
				nav.classList.remove('is-open');
				toggle.setAttribute('aria-expanded', 'false');
			}
		});
	}

	/* -------- Sticky-header offset for anchor links -------- */
	var header = document.querySelector('.of-header');
	if (header) {
		document.documentElement.style.scrollPaddingTop = header.offsetHeight + 12 + 'px';
	}

	/* -------- Scroll spy: highlight the active section -------- */
	var links = Array.prototype.slice.call(
		document.querySelectorAll('.of-nav a[href*="#"]')
	);
	var sections = links
		.map(function (link) {
			var hash = link.hash;
			return hash ? document.querySelector(hash) : null;
		})
		.filter(Boolean);

	if (sections.length && 'IntersectionObserver' in window) {
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) {
						return;
					}
					links.forEach(function (link) {
						var parent = link.parentElement;
						var active = link.hash === '#' + entry.target.id;
						if (parent) {
							parent.classList.toggle('current-menu-item', active);
						}
					});
				});
			},
			{ rootMargin: '-45% 0px -50% 0px' }
		);
		sections.forEach(function (section) {
			observer.observe(section);
		});
	}

	/* -------- Back to top -------- */
	var topBtn = document.querySelector('.of-top');
	if (topBtn) {
		var onScroll = function () {
			topBtn.classList.toggle('is-visible', window.scrollY > 600);
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		topBtn.addEventListener('click', function () {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}
})();
