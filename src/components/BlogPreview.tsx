import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";
import LazyImage from "@/components/LazyImage";

const BlogPreview = () => {
  const { posts } = useBlogPosts();
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) return null;

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
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0" role="list">
          {recentPosts.map((post) => (
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
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </time>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" aria-hidden="true" />
                      {post.author}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors focus:text-primary">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus:underline"
                    aria-label={`Read more about ${post.title}`}
                  >
                    Read more
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <Link
          to="/blog"
          className="flex sm:hidden items-center justify-center gap-1 mt-6 text-sm font-medium text-primary hover:underline focus:underline"
          aria-label="View all blog posts"
        >
          View all posts
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default BlogPreview;
