import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowRight } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPostSkeleton = () => (
  <article className="bg-card border border-border rounded-xl overflow-hidden">
    <div className="md:flex">
      <div className="md:w-1/3">
        <Skeleton className="w-full h-48 md:h-full" />
      </div>
      <div className="p-6 md:w-2/3">
        <div className="flex flex-wrap items-center gap-4 mb-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  </article>
);

const BlogPage = () => {
  const { posts, loading } = useBlogPosts();

  return (
    <>
      <Helmet>
        <title>Blog - AnyFile Flow | Tips, Tutorials & Updates</title>
        <meta name="description" content="Read the latest tips, tutorials, and updates about file conversion, image editing, and productivity tools from AnyFile Flow." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://anyfileflow.com/blog" />
        <meta property="og:title" content="Blog - AnyFile Flow | Tips, Tutorials & Updates" />
        <meta property="og:description" content="Read the latest tips, tutorials, and updates about file conversion from AnyFile Flow." />
        <meta property="og:url" content="https://anyfileflow.com/blog" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <header className="mb-12 text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">Blog</h1>
              <p className="text-lg text-muted-foreground">
                Tips, tutorials, and updates from AnyFile Flow
              </p>
            </header>

            {loading ? (
              <div className="space-y-8">
                <BlogPostSkeleton />
                <BlogPostSkeleton />
                <BlogPostSkeleton />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-8">
                {posts.map((post) => (
                  <article key={post.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      {post.image && (
                        <div className="md:w-1/3">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className={`p-6 ${post.image ? 'md:w-2/3' : 'w-full'}`}>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {post.category}
                          </span>
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                          <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                            {post.title}
                          </Link>
                        </h2>
                        <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          Read more <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPage;
