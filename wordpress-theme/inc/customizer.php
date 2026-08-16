<?php
/**
 * Customizer settings for Onepage Flow.
 *
 * @package Onepage_Flow
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register panel, sections, settings and controls.
 *
 * @param WP_Customize_Manager $wp_customize Customizer object.
 */
function onepage_flow_customize_register( $wp_customize ) {

	// Live preview for core fields.
	$wp_customize->get_setting( 'blogname' )->transport        = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';

	$wp_customize->add_panel(
		'onepage_flow_panel',
		array(
			'title'       => __( 'Onepage Flow', 'onepage-flow' ),
			'description' => __( 'Everything on your one-page front page is edited here.', 'onepage-flow' ),
			'priority'    => 20,
		)
	);

	/**
	 * Helper to register a setting + control in one go.
	 *
	 * @param string $id       Setting id.
	 * @param string $section  Section id.
	 * @param string $label    Control label.
	 * @param mixed  $default  Default value.
	 * @param string $type     Control type.
	 */
	$add = function ( $id, $section, $label, $default = '', $type = 'text' ) use ( $wp_customize ) {
		$sanitize = 'sanitize_text_field';
		if ( 'url' === $type ) {
			$sanitize = 'esc_url_raw';
		} elseif ( 'email' === $type ) {
			$sanitize = 'sanitize_email';
		} elseif ( 'textarea' === $type ) {
			$sanitize = 'wp_kses_post';
		} elseif ( 'checkbox' === $type ) {
			$sanitize = 'onepage_flow_sanitize_checkbox';
		}

		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $default,
				'sanitize_callback' => $sanitize,
				'transport'         => 'refresh',
			)
		);

		$wp_customize->add_control(
			$id,
			array(
				'label'   => $label,
				'section' => $section,
				'type'    => 'checkbox' === $type ? 'checkbox' : ( 'textarea' === $type ? 'textarea' : 'text' ),
			)
		);
	};

	/* ------------------------------------------------------------------
	 * Theme colors
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_colors',
		array(
			'title' => __( 'Colors', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$wp_customize->add_setting(
		'onepage_flow_primary_color',
		array(
			'default'           => '#2563eb',
			'sanitize_callback' => 'sanitize_hex_color',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize,
			'onepage_flow_primary_color',
			array(
				'label'   => __( 'Primary color', 'onepage-flow' ),
				'section' => 'onepage_flow_colors',
			)
		)
	);

	/* ------------------------------------------------------------------
	 * Hero
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_hero',
		array(
			'title' => __( 'Hero section', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_hero_title', 'onepage_flow_hero', __( 'Headline', 'onepage-flow' ), __( 'Build something people actually use.', 'onepage-flow' ) );
	$add( 'onepage_flow_hero_text', 'onepage_flow_hero', __( 'Sub-headline', 'onepage-flow' ), __( 'A fast, lightweight one-page WordPress theme with everything you need to launch — and nothing you do not.', 'onepage-flow' ), 'textarea' );
	$add( 'onepage_flow_hero_btn_text', 'onepage_flow_hero', __( 'Primary button text', 'onepage-flow' ), __( 'Get started', 'onepage-flow' ) );
	$add( 'onepage_flow_hero_btn_url', 'onepage_flow_hero', __( 'Primary button URL', 'onepage-flow' ), '#contact', 'url' );
	$add( 'onepage_flow_hero_btn2_text', 'onepage_flow_hero', __( 'Secondary button text', 'onepage-flow' ), __( 'Learn more', 'onepage-flow' ) );
	$add( 'onepage_flow_hero_btn2_url', 'onepage_flow_hero', __( 'Secondary button URL', 'onepage-flow' ), '#services', 'url' );

	$wp_customize->add_setting(
		'onepage_flow_hero_image',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'onepage_flow_hero_image',
			array(
				'label'       => __( 'Background image', 'onepage-flow' ),
				'description' => __( 'Optional. A dark overlay is applied automatically for text contrast.', 'onepage-flow' ),
				'section'     => 'onepage_flow_hero',
			)
		)
	);

	/* ------------------------------------------------------------------
	 * Services
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_services',
		array(
			'title' => __( 'Services section', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_services_enable', 'onepage_flow_services', __( 'Show this section', 'onepage-flow' ), true, 'checkbox' );
	$add( 'onepage_flow_services_title', 'onepage_flow_services', __( 'Section title', 'onepage-flow' ), __( 'What we do', 'onepage-flow' ) );
	$add( 'onepage_flow_services_text', 'onepage_flow_services', __( 'Section intro', 'onepage-flow' ), __( 'Three things we are genuinely good at.', 'onepage-flow' ), 'textarea' );

	for ( $i = 1; $i <= 3; $i++ ) {
		/* translators: %d: service number. */
		$add( "onepage_flow_service{$i}_title", 'onepage_flow_services', sprintf( __( 'Service %d — title', 'onepage-flow' ), $i ) );
		/* translators: %d: service number. */
		$add( "onepage_flow_service{$i}_text", 'onepage_flow_services', sprintf( __( 'Service %d — description', 'onepage-flow' ), $i ), '', 'textarea' );
	}

	/* ------------------------------------------------------------------
	 * About
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_about',
		array(
			'title' => __( 'About section', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_about_enable', 'onepage_flow_about', __( 'Show this section', 'onepage-flow' ), true, 'checkbox' );
	$add( 'onepage_flow_about_title', 'onepage_flow_about', __( 'Title', 'onepage-flow' ), __( 'About us', 'onepage-flow' ) );
	$add( 'onepage_flow_about_text', 'onepage_flow_about', __( 'Text', 'onepage-flow' ), '', 'textarea' );

	$wp_customize->add_setting(
		'onepage_flow_about_image',
		array(
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Image_Control(
			$wp_customize,
			'onepage_flow_about_image',
			array(
				'label'   => __( 'Image', 'onepage-flow' ),
				'section' => 'onepage_flow_about',
			)
		)
	);

	for ( $i = 1; $i <= 3; $i++ ) {
		/* translators: %d: stat number. */
		$add( "onepage_flow_stat{$i}_value", 'onepage_flow_about', sprintf( __( 'Stat %d — value', 'onepage-flow' ), $i ) );
		/* translators: %d: stat number. */
		$add( "onepage_flow_stat{$i}_label", 'onepage_flow_about', sprintf( __( 'Stat %d — label', 'onepage-flow' ), $i ) );
	}

	/* ------------------------------------------------------------------
	 * Blog
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_blog',
		array(
			'title' => __( 'Latest posts section', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_blog_enable', 'onepage_flow_blog', __( 'Show latest posts', 'onepage-flow' ), true, 'checkbox' );
	$add( 'onepage_flow_blog_title', 'onepage_flow_blog', __( 'Section title', 'onepage-flow' ), __( 'Latest from the blog', 'onepage-flow' ) );

	/* ------------------------------------------------------------------
	 * Contact
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_contact',
		array(
			'title' => __( 'Contact section', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_contact_enable', 'onepage_flow_contact', __( 'Show this section', 'onepage-flow' ), true, 'checkbox' );
	$add( 'onepage_flow_contact_title', 'onepage_flow_contact', __( 'Title', 'onepage-flow' ), __( 'Get in touch', 'onepage-flow' ) );
	$add( 'onepage_flow_contact_text', 'onepage_flow_contact', __( 'Text', 'onepage-flow' ), '', 'textarea' );
	$add( 'onepage_flow_contact_email', 'onepage_flow_contact', __( 'Email address', 'onepage-flow' ), '', 'email' );
	$add( 'onepage_flow_contact_phone', 'onepage_flow_contact', __( 'Phone number', 'onepage-flow' ) );
	$add( 'onepage_flow_contact_shortcode', 'onepage_flow_contact', __( 'Contact form shortcode', 'onepage-flow' ), '', 'textarea' );

	/* ------------------------------------------------------------------
	 * Footer
	 * ---------------------------------------------------------------- */
	$wp_customize->add_section(
		'onepage_flow_footer',
		array(
			'title' => __( 'Footer', 'onepage-flow' ),
			'panel' => 'onepage_flow_panel',
		)
	);

	$add( 'onepage_flow_footer_text', 'onepage_flow_footer', __( 'Copyright text', 'onepage-flow' ), '', 'textarea' );

	// Selective refresh partials.
	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial(
			'blogname',
			array(
				'selector'        => '.of-brand__title',
				'render_callback' => function () {
					return get_bloginfo( 'name', 'display' );
				},
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'blogdescription',
			array(
				'selector'        => '.of-brand__tagline',
				'render_callback' => function () {
					return get_bloginfo( 'description', 'display' );
				},
			)
		);
	}
}
add_action( 'customize_register', 'onepage_flow_customize_register' );

/**
 * Sanitize checkbox values.
 *
 * @param mixed $checked Raw value.
 * @return bool
 */
function onepage_flow_sanitize_checkbox( $checked ) {
	return ( isset( $checked ) && true === (bool) $checked );
}

/**
 * Enqueue Customizer live-preview script.
 */
function onepage_flow_customize_preview_js() {
	wp_enqueue_script(
		'onepage-flow-customizer',
		get_template_directory_uri() . '/assets/js/customizer.js',
		array( 'customize-preview' ),
		ONEPAGE_FLOW_VERSION,
		true
	);
}
add_action( 'customize_preview_init', 'onepage_flow_customize_preview_js' );
