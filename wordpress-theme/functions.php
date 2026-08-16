<?php
/**
 * Onepage Flow theme functions.
 *
 * @package Onepage_Flow
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ONEPAGE_FLOW_VERSION', '1.0.0' );

/**
 * Theme setup.
 */
function onepage_flow_setup() {
	load_theme_textdomain( 'onepage-flow', get_template_directory() . '/languages' );

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'customize-selective-refresh-widgets' );

	add_theme_support(
		'html5',
		array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' )
	);

	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 240,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu (one-page anchors)', 'onepage-flow' ),
			'footer'  => __( 'Footer Menu', 'onepage-flow' ),
		)
	);

	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'onepage_flow_setup' );

/**
 * Content width.
 */
function onepage_flow_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'onepage_flow_content_width', 1140 );
}
add_action( 'after_setup_theme', 'onepage_flow_content_width', 0 );

/**
 * Enqueue styles and scripts.
 */
function onepage_flow_scripts() {
	wp_enqueue_style(
		'onepage-flow-style',
		get_stylesheet_uri(),
		array(),
		ONEPAGE_FLOW_VERSION
	);

	// Inject Customizer colors as CSS variables (no extra HTTP request).
	$primary = get_theme_mod( 'onepage_flow_primary_color', '#2563eb' );
	$custom  = ':root{--of-primary:' . esc_attr( $primary ) . ';}';
	wp_add_inline_style( 'onepage-flow-style', $custom );

	wp_enqueue_script(
		'onepage-flow-script',
		get_template_directory_uri() . '/assets/js/main.js',
		array(),
		ONEPAGE_FLOW_VERSION,
		true
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'onepage_flow_scripts' );

/**
 * Register widget areas.
 */
function onepage_flow_widgets_init() {
	for ( $i = 1; $i <= 3; $i++ ) {
		register_sidebar(
			array(
				/* translators: %d: widget area number. */
				'name'          => sprintf( __( 'Footer Column %d', 'onepage-flow' ), $i ),
				'id'            => 'footer-' . $i,
				'description'   => __( 'Widgets shown in the footer.', 'onepage-flow' ),
				'before_widget' => '<section id="%1$s" class="widget %2$s">',
				'after_widget'  => '</section>',
				'before_title'  => '<h3 class="widget-title">',
				'after_title'   => '</h3>',
			)
		);
	}
}
add_action( 'widgets_init', 'onepage_flow_widgets_init' );

/**
 * Load the Customizer settings.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Small helper: escaped multiline text output.
 *
 * @param string $text Raw text.
 * @return string
 */
function onepage_flow_text( $text ) {
	return wp_kses_post( wpautop( $text ) );
}
