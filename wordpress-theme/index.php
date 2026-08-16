<?php
/**
 * Main template — fallback for blog index, archives and search.
 *
 * @package Onepage_Flow
 */

get_header();
?>

<section class="of-section">
	<div class="of-container">

		<?php if ( have_posts() ) : ?>

			<?php if ( ! is_front_page() ) : ?>
				<div class="of-section__head">
					<h1>
						<?php
						if ( is_home() ) {
							echo esc_html( get_the_title( get_option( 'page_for_posts' ) ) ? get_the_title( get_option( 'page_for_posts' ) ) : __( 'Blog', 'onepage-flow' ) );
						} elseif ( is_search() ) {
							/* translators: %s: search query. */
							printf( esc_html__( 'Search results for: %s', 'onepage-flow' ), esc_html( get_search_query() ) );
						} else {
							the_archive_title();
						}
						?>
					</h1>
					<?php the_archive_description(); ?>
				</div>
			<?php endif; ?>

			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( 'of-post' ); ?>>

					<?php if ( has_post_thumbnail() && ! is_singular() ) : ?>
						<a class="of-post__thumb" href="<?php the_permalink(); ?>">
							<?php the_post_thumbnail( 'large', array( 'loading' => 'lazy' ) ); ?>
						</a>
					<?php endif; ?>

					<p class="of-post__meta">
						<?php
						printf(
							/* translators: 1: post date, 2: author name. */
							esc_html__( '%1$s &middot; by %2$s', 'onepage-flow' ),
							esc_html( get_the_date() ),
							esc_html( get_the_author() )
						);
						?>
					</p>

					<?php if ( is_singular() ) : ?>
						<h1><?php the_title(); ?></h1>
					<?php else : ?>
						<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					<?php endif; ?>

					<div class="of-post__content">
						<?php
						if ( is_singular() ) {
							the_content();
							wp_link_pages(
								array(
									'before' => '<div class="of-pagination">',
									'after'  => '</div>',
								)
							);
						} else {
							the_excerpt();
							?>
							<a class="of-btn of-btn--ghost" href="<?php the_permalink(); ?>">
								<?php esc_html_e( 'Read more', 'onepage-flow' ); ?>
							</a>
							<?php
						}
						?>
					</div>
				</article>

				<?php
				if ( is_singular() && ( comments_open() || get_comments_number() ) ) {
					comments_template();
				}
				?>

			<?php endwhile; ?>

			<?php
			the_posts_pagination(
				array(
					'class'     => 'of-pagination',
					'mid_size'  => 2,
					'prev_text' => esc_html__( 'Previous', 'onepage-flow' ),
					'next_text' => esc_html__( 'Next', 'onepage-flow' ),
				)
			);
			?>

		<?php else : ?>

			<div class="of-section__head">
				<h1><?php esc_html_e( 'Nothing found', 'onepage-flow' ); ?></h1>
				<p><?php esc_html_e( 'Sorry, no content matched your request. Try a different search.', 'onepage-flow' ); ?></p>
			</div>
			<?php get_search_form(); ?>

		<?php endif; ?>

	</div>
</section>

<?php
get_footer();
