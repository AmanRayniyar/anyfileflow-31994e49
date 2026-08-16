/**
 * Customizer live preview (postMessage transport).
 */
(function ($) {
	'use strict';

	wp.customize('blogname', function (value) {
		value.bind(function (to) {
			$('.of-brand__title').text(to);
		});
	});

	wp.customize('blogdescription', function (value) {
		value.bind(function (to) {
			$('.of-brand__tagline').text(to);
		});
	});

	wp.customize('onepage_flow_primary_color', function (value) {
		value.bind(function (to) {
			document.documentElement.style.setProperty('--of-primary', to);
		});
	});
})(jQuery);
