<?php
/**
 * Header template.
 *
 * @package Onepage_Flow
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'Skip to content', 'onepage-flow' ); ?></a>

<header class="of-header" role="banner">
	<div class="of-container of-header__inner">
		<div class="of-brand">
			<?php if ( has_custom_logo() ) : ?>
				<div class="of-custom-logo-link"><?php the_custom_logo(); ?></div>
			<?php else : ?>
				<div>
					<a class="of-brand__title" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
						<?php bloginfo( 'name' ); ?>
					</a>
					<?php $description = get_bloginfo( 'description', 'display' ); ?>
					<?php if ( $description ) : ?>
						<span class="of-brand__tagline"><?php echo esc_html( $description ); ?></span>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>

		<button class="of-nav-toggle" aria-expanded="false" aria-controls="primary-navigation">
			<span></span><span></span><span></span>
			<span class="screen-reader-text"><?php esc_html_e( 'Toggle menu', 'onepage-flow' ); ?></span>
		</button>

		<nav id="primary-navigation" class="of-nav" aria-label="<?php esc_attr_e( 'Primary', 'onepage-flow' ); ?>">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'depth'          => 1,
					)
				);
			} else {
				$home = is_front_page() ? '' : esc_url( home_url( '/' ) );
				?>
				<ul>
					<li><a href="<?php echo esc_url( $home . '#hero' ); ?>"><?php esc_html_e( 'Home', 'onepage-flow' ); ?></a></li>
					<li><a href="<?php echo esc_url( $home . '#services' ); ?>"><?php esc_html_e( 'Services', 'onepage-flow' ); ?></a></li>
					<li><a href="<?php echo esc_url( $home . '#about' ); ?>"><?php esc_html_e( 'About', 'onepage-flow' ); ?></a></li>
					<li><a href="<?php echo esc_url( $home . '#contact' ); ?>"><?php esc_html_e( 'Contact', 'onepage-flow' ); ?></a></li>
				</ul>
			<?php } ?>
		</nav>
	</div>
</header>

<main id="main" class="of-main" role="main">
