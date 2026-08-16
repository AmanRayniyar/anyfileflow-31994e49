<?php
/**
 * Footer template.
 *
 * @package Onepage_Flow
 */

?>
</main><!-- #main -->

<footer class="of-footer" role="contentinfo">
	<div class="of-container">
		<?php if ( is_active_sidebar( 'footer-1' ) || is_active_sidebar( 'footer-2' ) || is_active_sidebar( 'footer-3' ) ) : ?>
			<div class="of-footer__widgets">
				<?php for ( $i = 1; $i <= 3; $i++ ) : ?>
					<?php if ( is_active_sidebar( 'footer-' . $i ) ) : ?>
						<div class="of-footer__col"><?php dynamic_sidebar( 'footer-' . $i ); ?></div>
					<?php endif; ?>
				<?php endfor; ?>
			</div>
		<?php endif; ?>

		<div class="of-footer__bottom">
			<p>
				<?php
				$copyright = get_theme_mod( 'onepage_flow_footer_text', '' );
				if ( $copyright ) {
					echo wp_kses_post( $copyright );
				} else {
					printf(
						/* translators: 1: year, 2: site name. */
						esc_html__( '&copy; %1$s %2$s. All rights reserved.', 'onepage-flow' ),
						esc_html( gmdate( 'Y' ) ),
						esc_html( get_bloginfo( 'name' ) )
					);
				}
				?>
			</p>

			<?php
			if ( has_nav_menu( 'footer' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'footer',
						'container'      => 'nav',
						'depth'          => 1,
						'menu_class'     => 'of-nav-footer',
					)
				);
			}
			?>
		</div>
	</div>
</footer>

<button class="of-top" aria-label="<?php esc_attr_e( 'Back to top', 'onepage-flow' ); ?>">&uarr;</button>

<?php wp_footer(); ?>
</body>
</html>
