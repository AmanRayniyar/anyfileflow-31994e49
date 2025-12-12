import { Link } from "react-router-dom";
import { useBlogPosts } from "@/hooks/useBlog";
import LazyImage from "@/components/LazyImage";
import { Skeleton } from "@/components/ui/skeleton";

// Inline SVG Icons for performance
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BlogPostSkeleton = () => (
  <li>
    <article className="bg-card border border-border rounded-xl overflow-hidden h-full">
      <Skeleton className="w-full h-48" />
      <div className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        <Skeleton className="h-4 w-24" />
      </div>
    </article>
  </li>
);

const BlogPreview = () => {
  const { posts, loading } = useBlogPosts();
  const recentPosts = posts.slice(0, 3);

  if (!loading && recentPosts.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30" aria-labelledby="blog-section-heading">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 id="blog-section-heading" className="text-2xl md:text-3xl font-bold text-foreground">Latest from Blog</h2>
            <p className="text-muted-foreground mt-1">Tips, tutorials, and updates</p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:underline"
            aria-label="View all blog posts"
          >
            View all posts
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0" role="list">
          {loading ? (
            <>
              <BlogPostSkeleton />
              <BlogPostSkeleton />
              <BlogPostSkeleton />
            </>
          ) : (
            recentPosts.map((post) => (
              <li key={post.id}>
                <article className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {post.image && (
                    <LazyImage 
                      src={post.image} 
                      alt={`Featured image for ${post.title}`}
                      className="w-full h-48 object-cover"
                      wrapperClassName="w-full h-48"
                    />
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <time dateTime={new Date(post.createdAt).toISOString()} className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </time>
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {post.author}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      <Link 
                        to={`/blog/${post.slug}`} 
                        className="hover:text-primary transition-colors focus:text-primary"
                        aria-label={`Read full article: ${post.title}`}
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                    <Link 
                      to={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:underline"
                      aria-label={`Continue reading: ${post.title}`}
                    >
                      Read article: {post.title.length > 25 ? post.title.substring(0, 25) + '...' : post.title}
                      <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))
          )}
        </ul>

        <Link
          to="/blog"
          className="flex sm:hidden items-center justify-center gap-1 mt-6 text-sm font-medium text-primary hover:underline focus:underline"
          aria-label="View all blog posts"
        >
          View all posts
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default BlogPreview;
