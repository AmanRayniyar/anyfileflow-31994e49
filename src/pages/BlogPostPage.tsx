import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { getPostBySlug } = useBlogPosts();
  const post = slug ? getPostBySlug(slug) : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - AnyFile Flow Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://anyfileflow.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <article className="max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            {post.image && (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl mb-8"
              />
            )}

            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  {post.category}
                </span>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <footer className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;
