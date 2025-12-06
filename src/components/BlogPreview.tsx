import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";

const BlogPreview = () => {
  const { posts } = useBlogPosts();
  const recentPosts = posts.slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Latest from Blog</h2>
            <p className="text-muted-foreground mt-1">Tips, tutorials, and updates</p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <article key={post.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
              )}
              <div className="p-5">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {post.author}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>

        <Link
          to="/blog"
          className="flex sm:hidden items-center justify-center gap-1 mt-6 text-sm font-medium text-primary hover:underline"
        >
          View all posts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default BlogPreview;
