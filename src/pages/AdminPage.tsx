import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlogPosts, BlogPost } from "@/hooks/useBlog";
import { Plus, Edit, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const { allPosts, addPost, updatePost, deletePost } = useBlogPosts();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    author: "Aman Rauniyar",
    category: "",
    tags: "",
    published: true
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      author: "Aman Rauniyar",
      category: "",
      tags: "",
      published: true
    });
    setEditingPost(null);
    setIsCreating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...formData,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
    };

    if (editingPost) {
      updatePost(editingPost.id, postData);
      toast.success("Post updated successfully!");
    } else {
      addPost(postData);
      toast.success("Post created successfully!");
    }
    
    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsCreating(true);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image || "",
      author: post.author,
      category: post.category,
      tags: post.tags.join(", "),
      published: post.published
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePost(id);
      toast.success("Post deleted successfully!");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - AnyFile Flow</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-foreground">Blog Admin Panel</h1>
              {!isCreating && (
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" /> New Post
                </Button>
              )}
            </div>

            {isCreating ? (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </h2>

                <div className="grid gap-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: editingPost ? formData.slug : generateSlug(e.target.value)
                        });
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-medium mb-1">Content (HTML)</label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={10}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium mb-1">Featured Image URL</label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium mb-1">Author</label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="rounded"
                    />
                    <label htmlFor="published" className="text-sm">Published</label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" /> {editingPost ? "Update" : "Create"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                {allPosts.length === 0 ? (
                  <div className="text-center py-12 bg-card border border-border rounded-xl">
                    <p className="text-muted-foreground">No posts yet. Create your first post!</p>
                  </div>
                ) : (
                  allPosts.map((post) => (
                    <div key={post.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                          {post.published ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString()} • {post.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(post)} aria-label="Edit post">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} aria-label="Delete post">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminPage;
