<?php
/**
 * Front page — the one-page layout.
 *
 * Sections are Customizer-driven: Appearance → Customize → Onepage Flow.
 *
 * @package Onepage_Flow
 */

get_header();

$hero_image = get_theme_mod( 'onepage_flow_hero_image', '' );
$hero_class = $hero_image ? 'of-hero of-hero--image' : 'of-hero';
$hero_style = $hero_image ? ' style="background-image:url(' . esc_url( $hero_image ) . ')"' : '';
?>

<section id="hero" class="<?php echo esc_attr( $hero_class ); ?>"<?php echo $hero_style; // phpcs:ignore WordPress.Security.EscapeOutput ?>>
	<div class="of-container">
		<h1><?php echo esc_html( get_theme_mod( 'onepage_flow_hero_title', __( 'Build something people actually use.', 'onepage-flow' ) ) ); ?></h1>
		<p class="of-hero__text">
			<?php echo esc_html( get_theme_mod( 'onepage_flow_hero_text', __( 'A fast, lightweight one-page WordPress theme with everything you need to launch — and nothing you do not.', 'onepage-flow' ) ) ); ?>
		</p>

		<div class="of-hero__actions">
			<?php
			$btn_text = get_theme_mod( 'onepage_flow_hero_btn_text', __( 'Get started', 'onepage-flow' ) );
			$btn_url  = get_theme_mod( 'onepage_flow_hero_btn_url', '#contact' );
			$alt_text = get_theme_mod( 'onepage_flow_hero_btn2_text', __( 'Learn more', 'onepage-flow' ) );
			$alt_url  = get_theme_mod( 'onepage_flow_hero_btn2_url', '#services' );
			?>
			<?php if ( $btn_text ) : ?>
				<a class="of-btn" href="<?php echo esc_url( $btn_url ); ?>"><?php echo esc_html( $btn_text ); ?></a>
			<?php endif; ?>
			<?php if ( $alt_text ) : ?>
				<a class="of-btn of-btn--ghost" href="<?php echo esc_url( $alt_url ); ?>"><?php echo esc_html( $alt_text ); ?></a>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php if ( get_theme_mod( 'onepage_flow_services_enable', true ) ) : ?>
<section id="services" class="of-section">
	<div class="of-container">
		<div class="of-section__head">
			<h2><?php echo esc_html( get_theme_mod( 'onepage_flow_services_title', __( 'What we do', 'onepage-flow' ) ) ); ?></h2>
			<p><?php echo esc_html( get_theme_mod( 'onepage_flow_services_text', __( 'Three things we are genuinely good at.', 'onepage-flow' ) ) ); ?></p>
		</div>

		<div class="of-grid of-grid--3">
			<?php
			$defaults = array(
				1 => array( __( 'Fast by default', 'onepage-flow' ), __( 'No bloated frameworks. Clean markup, minimal CSS, and scripts loaded in the footer.', 'onepage-flow' ) ),
				2 => array( __( 'SEO ready', 'onepage-flow' ), __( 'Semantic HTML, proper heading order, and full support for your favourite SEO plugin.', 'onepage-flow' ) ),
				3 => array( __( 'Fully editable', 'onepage-flow' ), __( 'Every section is controlled from the Customizer with a live preview — no code needed.', 'onepage-flow' ) ),
			);

			foreach ( $defaults as $i => $default ) :
				$title = get_theme_mod( "onepage_flow_service{$i}_title", $default[0] );
				$text  = get_theme_mod( "onepage_flow_service{$i}_text", $default[1] );
				if ( ! $title && ! $text ) {
					continue;
				}
				?>
				<article class="of-card">
					<div class="of-card__icon" aria-hidden="true"><?php echo esc_html( $i ); ?></div>
					<h3><?php echo esc_html( $title ); ?></h3>
					<p><?php echo esc_html( $text ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
<?php endif; ?>

<?php if ( get_theme_mod( 'onepage_flow_about_enable', true ) ) : ?>
<section id="about" class="of-section of-section--alt">
	<div class="of-container">
		<div class="of-grid of-grid--2 of-about">
			<div>
				<h2><?php echo esc_html( get_theme_mod( 'onepage_flow_about_title', __( 'About us', 'onepage-flow' ) ) ); ?></h2>
				<?php
				echo onepage_flow_text( // phpcs:ignore WordPress.Security.EscapeOutput
					get_theme_mod(
						'onepage_flow_about_text',
						__( 'We build simple products for people who value speed and clarity. Tell your story here — who you are, what you ship, and why it matters.', 'onepage-flow' )
					)
				);
				?>
				<div class="of-stats">
					<?php
					$stats = array(
						1 => array( '10+', __( 'Years experience', 'onepage-flow' ) ),
						2 => array( '250+', __( 'Projects shipped', 'onepage-flow' ) ),
						3 => array( '99%', __( 'Happy clients', 'onepage-flow' ) ),
					);
					foreach ( $stats as $i => $stat ) :
						$value = get_theme_mod( "onepage_flow_stat{$i}_value", $stat[0] );
						$label = get_theme_mod( "onepage_flow_stat{$i}_label", $stat[1] );
						if ( ! $value ) {
							continue;
						}
						?>
						<div class="of-stat">
							<div class="of-stat__value"><?php echo esc_html( $value ); ?></div>
							<div class="of-stat__label"><?php echo esc_html( $label ); ?></div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php $about_image = get_theme_mod( 'onepage_flow_about_image', '' ); ?>
			<?php if ( $about_image ) : ?>
				<div class="of-about__media">
					<img src="<?php echo esc_url( $about_image ); ?>" alt="" loading="lazy" decoding="async" width="720" height="520">
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
<?php endif; ?>

<?php
$latest = get_theme_mod( 'onepage_flow_blog_enable', true );
if ( $latest ) :
	$posts_query = new WP_Query(
		array(
			'posts_per_page'      => 3,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		)
	);
	if ( $posts_query->have_posts() ) :
		?>
	<section id="blog" class="of-section">
		<div class="of-container">
			<div class="of-section__head">
				<h2><?php echo esc_html( get_theme_mod( 'onepage_flow_blog_title', __( 'Latest from the blog', 'onepage-flow' ) ) ); ?></h2>
			</div>
			<div class="of-grid of-grid--3">
				<?php
				while ( $posts_query->have_posts() ) :
					$posts_query->the_post();
					?>
					<article <?php post_class( 'of-card' ); ?>>
						<?php if ( has_post_thumbnail() ) : ?>
							<a href="<?php the_permalink(); ?>" class="of-post__thumb">
								<?php the_post_thumbnail( 'medium_large', array( 'loading' => 'lazy' ) ); ?>
							</a>
						<?php endif; ?>
						<p class="of-post__meta"><?php echo esc_html( get_the_date() ); ?></p>
						<h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
						<p><?php echo esc_html( wp_trim_words( get_the_excerpt(), 22 ) ); ?></p>
					</article>
					<?php
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
	</section>
		<?php
	endif;
endif;
?>

<?php if ( get_theme_mod( 'onepage_flow_contact_enable', true ) ) : ?>
<section id="contact" class="of-section of-section--alt">
	<div class="of-container">
		<div class="of-contact">
			<h2><?php echo esc_html( get_theme_mod( 'onepage_flow_contact_title', __( 'Get in touch', 'onepage-flow' ) ) ); ?></h2>
			<p><?php echo esc_html( get_theme_mod( 'onepage_flow_contact_text', __( 'Have a project in mind? We usually reply within one business day.', 'onepage-flow' ) ) ); ?></p>

			<?php
			$email     = get_theme_mod( 'onepage_flow_contact_email', '' );
			$phone     = get_theme_mod( 'onepage_flow_contact_phone', '' );
			$shortcode = get_theme_mod( 'onepage_flow_contact_shortcode', '' );
			?>

			<div class="of-contact__links">
				<?php if ( $email ) : ?>
					<a class="of-btn" href="mailto:<?php echo esc_attr( antispambot( $email ) ); ?>"><?php echo esc_html( antispambot( $email ) ); ?></a>
				<?php endif; ?>
				<?php if ( $phone ) : ?>
					<a class="of-btn of-btn--ghost" href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
				<?php endif; ?>
			</div>

			<?php if ( $shortcode ) : ?>
				<div class="of-contact__form"><?php echo do_shortcode( wp_kses_post( $shortcode ) ); ?></div>
			<?php endif; ?>
		</div>
	</div>
</section>
<?php endif; ?>

<?php
get_footer();
