import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useBlogPosts, BlogPost } from "@/hooks/useBlog";
import { useToolsAdmin, DbTool } from "@/hooks/useTools";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, Lock, Loader2, Star, StarOff, Settings, FileText, Code, ChevronDown, ChevronUp, ExternalLink, Monitor, Sparkles, Play, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SESSION_TOKEN_KEY = "anyfileflow_admin_session";
const SESSION_TYPE_KEY = "anyfileflow_admin_type";

type AdminType = 'blog' | 'tools' | 'master';

const AdminPage = () => {
  const { allPosts, addPost, updatePost, deletePost } = useBlogPosts();
  const { tools, loading: toolsLoading, toggleEnabled, togglePopular, updateTool } = useToolsAdmin();
  
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

  // Tool editing state
  const [editingTool, setEditingTool] = useState<DbTool | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [showPreview, setShowPreview] = useState(false);
  const [inlineEditingCode, setInlineEditingCode] = useState<{ [key: string]: string }>({});
  const [savingToolId, setSavingToolId] = useState<string | null>(null);
  const [toolFormData, setToolFormData] = useState({
    name: "",
    description: "",
    custom_content: ""
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [secretCode, setSecretCode] = useState("");
  
  // Blog generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalTools, setTotalTools] = useState(200);
  const [isVerifying, setIsVerifying] = useState(false);
  const [adminType, setAdminType] = useState<AdminType | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const validateExistingSession = async () => {
      const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
      const storedType = sessionStorage.getItem(SESSION_TYPE_KEY) as AdminType | null;
      
      if (!storedToken) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-admin', {
          body: { action: 'validate-session', sessionToken: storedToken }
        });

        if (error || !data?.valid) {
          sessionStorage.removeItem(SESSION_TOKEN_KEY);
          sessionStorage.removeItem(SESSION_TYPE_KEY);
          setIsAuthenticated(false);
          setAdminType(null);
        } else {
          setIsAuthenticated(true);
          setAdminType(storedType || data.codeType);
        }
      } catch (error) {
        console.error('Session validation error:', error);
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
        sessionStorage.removeItem(SESSION_TYPE_KEY);
        setIsAuthenticated(false);
        setAdminType(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    validateExistingSession();
  }, []);

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretCode.trim()) {
      toast.error("Please enter the secret code");
      return;
    }

    setIsVerifying(true);

    try {
      // Try each code type: blog, tools, master
      const codeTypes: AdminType[] = ['blog', 'tools', 'master'];
      let authenticated = false;
      
      for (const codeType of codeTypes) {
        const { data, error } = await supabase.functions.invoke('verify-admin', {
          body: { code: secretCode, codeType }
        });

        if (!error && data?.valid && data?.sessionToken) {
          // Store session token and type securely in sessionStorage
          sessionStorage.setItem(SESSION_TOKEN_KEY, data.sessionToken);
          sessionStorage.setItem(SESSION_TYPE_KEY, codeType);
          setIsAuthenticated(true);
          setAdminType(codeType);
          toast.success(`Access granted as ${codeType} admin!`);
          setSecretCode("");
          authenticated = true;
          break;
        }
      }
      
      if (!authenticated) {
        toast.error("Invalid secret code");
      }
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = async () => {
    const storedToken = sessionStorage.getItem(SESSION_TOKEN_KEY);
    
    try {
      // Invalidate session server-side
      await supabase.functions.invoke('verify-admin', {
        body: { action: 'logout', sessionToken: storedToken }
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local session
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TYPE_KEY);
    setIsAuthenticated(false);
    setAdminType(null);
    toast.success("Logged out successfully");
  };

  // Blog functions
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

  // Tool functions
  const handleEditTool = (tool: DbTool) => {
    setEditingTool(tool);
    setToolFormData({
      name: tool.name,
      description: tool.description,
      custom_content: tool.custom_content || ""
    });
  };

  const toggleToolExpanded = (toolId: string) => {
    setExpandedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
      } else {
        newSet.add(toolId);
      }
      return newSet;
    });
  };

  const handleSaveTool = async () => {
    if (!editingTool) return;
    
    const result = await updateTool(editingTool.id, {
      name: toolFormData.name,
      description: toolFormData.description,
      custom_content: toolFormData.custom_content || null
    });

    if (result.success) {
      toast.success("Tool updated successfully!");
      setEditingTool(null);
    } else {
      toast.error(result.error || "Failed to update tool");
    }
  };

  const handleToggleEnabled = async (tool: DbTool) => {
    const result = await toggleEnabled(tool.id, !tool.enabled);
    if (result.success) {
      toast.success(`Tool ${!tool.enabled ? 'enabled' : 'disabled'}`);
    } else {
      toast.error(result.error || "Failed to update tool");
    }
  };

  const handleTogglePopular = async (tool: DbTool) => {
    const result = await togglePopular(tool.id, !tool.popular);
    if (result.success) {
      toast.success(`Tool ${!tool.popular ? 'marked as popular' : 'unmarked as popular'}`);
    } else {
      toast.error(result.error || "Failed to update tool");
    }
  };

  // Blog generator function
  const startBlogGeneration = async () => {
    setIsGenerating(true);
    setGenerationLogs([]);
    setGenerationProgress(0);
    let currentIndex = 0;
    const batchSize = 5;
    
    try {
      while (currentIndex < totalTools) {
        setGenerationLogs(prev => [...prev, `Processing batch ${currentIndex}-${Math.min(currentIndex + batchSize - 1, totalTools - 1)}...`]);
        
        const { data, error } = await supabase.functions.invoke('generate-blog-posts', {
          body: { startIndex: currentIndex, batchSize }
        });
        
        if (error) {
          setGenerationLogs(prev => [...prev, `Error: ${error.message}`]);
          break;
        }
        
        if (data?.processed) {
          data.processed.forEach((result: any) => {
            setGenerationLogs(prev => [...prev, `${result.id}: ${result.status}`]);
          });
        }
        
        currentIndex = data?.nextIndex || currentIndex + batchSize;
        setCurrentBatch(currentIndex);
        setGenerationProgress((currentIndex / totalTools) * 100);
        
        if (!data?.hasMore) break;
        
        // Wait between batches to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setGenerationLogs(prev => [...prev, "✅ Blog generation complete!"]);
      toast.success("Blog posts generated successfully!");
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "Unknown error";
      setGenerationLogs(prev => [...prev, `Error: ${errMsg}`]);
      toast.error("Blog generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  // Permission checks
  const canAccessBlog = adminType === 'blog' || adminType === 'master';
  const canAccessTools = adminType === 'tools' || adminType === 'master';

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <>
        <Helmet>
          <title>Admin Login - AnyFile Flow</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-muted-foreground">Checking session...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login - AnyFile Flow</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <main className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
              <div className="bg-card border border-border rounded-xl p-8">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
                  <p className="text-muted-foreground mt-2">Enter the secret code to access the admin panel</p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div>
                    <label htmlFor="secretCode" className="block text-sm font-medium mb-2">
                      Secret Code
                    </label>
                    <Input
                      id="secretCode"
                      type="password"
                      value={secretCode}
                      onChange={(e) => setSecretCode(e.target.value)}
                      placeholder="Enter secret code"
                      autoComplete="off"
                      disabled={isVerifying}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Access Admin Panel"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  // Blog Panel Component
  const BlogPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Blog Posts</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Post
          </Button>
        )}
      </div>

      {isCreating ? (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold">
            {editingPost ? "Edit Post" : "Create New Post"}
          </h3>

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
  );

  // Inline save tool code
  const handleInlineSaveCode = async (toolId: string) => {
    setSavingToolId(toolId);
    const codeContent = inlineEditingCode[toolId];
    
    const result = await updateTool(toolId, {
      custom_content: codeContent && codeContent.trim() ? codeContent : null
    });

    if (result.success) {
      toast.success("Tool code saved successfully!");
      // Clear the inline editing state for this tool
      setInlineEditingCode(prev => {
        const newState = { ...prev };
        delete newState[toolId];
        return newState;
      });
    } else {
      toast.error(result.error || "Failed to save tool code");
    }
    setSavingToolId(null);
  };

  // Get code for inline editing
  const getInlineCode = (tool: DbTool) => {
    return inlineEditingCode.hasOwnProperty(tool.id) 
      ? inlineEditingCode[tool.id] 
      : (tool.custom_content || "");
  };

  // Check if tool has unsaved changes
  const hasUnsavedChanges = (tool: DbTool) => {
    if (!inlineEditingCode.hasOwnProperty(tool.id)) return false;
    return inlineEditingCode[tool.id] !== (tool.custom_content || "");
  };

  // Tools Panel Component
  const ToolsPanel = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-foreground">Tools Management</h2>

      {toolsLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : editingTool ? (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Tool: {editingTool.id}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Monitor className="h-4 w-4 mr-1" />
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <a 
                href={`/tool/${editingTool.id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View Tool
                </Button>
              </a>
            </div>
          </div>

          <div className={showPreview ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : ""}>
            <div className="space-y-4">
              <div>
                <label htmlFor="toolName" className="block text-sm font-medium mb-1">Name</label>
                <Input
                  id="toolName"
                  value={toolFormData.name}
                  onChange={(e) => setToolFormData({ ...toolFormData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="toolDescription" className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  id="toolDescription"
                  value={toolFormData.description}
                  onChange={(e) => setToolFormData({ ...toolFormData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="toolCustomContent" className="block text-sm font-medium mb-1">
                  Custom Content (HTML/JavaScript)
                </label>
                <Textarea
                  id="toolCustomContent"
                  value={toolFormData.custom_content}
                  onChange={(e) => setToolFormData({ ...toolFormData, custom_content: e.target.value })}
                  rows={showPreview ? 15 : 10}
                  placeholder="Enter custom HTML, CSS, or JavaScript code for this tool..."
                  className="font-mono text-sm"
                />
              </div>
            </div>

            {showPreview && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Live Preview</label>
                <div className="border border-border rounded-lg bg-background p-4 min-h-[300px] overflow-auto">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(toolFormData.custom_content || "<p class='text-muted-foreground text-sm'>No custom content to preview</p>", {
                        ADD_TAGS: ['style'],
                        ADD_ATTR: ['style', 'class']
                      })
                    }} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveTool}>
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button variant="outline" onClick={() => { setEditingTool(null); setShowPreview(false); }}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground mb-4">
            {tools.length} tools found • Click on any tool to expand and edit its code inline
          </div>
          {tools.map((tool) => {
            const isExpanded = expandedTools.has(tool.id);
            const currentCode = getInlineCode(tool);
            const unsaved = hasUnsavedChanges(tool);
            const isSaving = savingToolId === tool.id;
            
            return (
              <div key={tool.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate">{tool.name}</h3>
                      {tool.popular && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      {tool.custom_content && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Has Code</span>
                      )}
                      {unsaved && (
                        <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded">Unsaved</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{tool.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: <code className="bg-muted px-1 rounded">{tool.id}</code> • {tool.category} • {tool.from_type} → {tool.to_type} • Type: {tool.tool_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`/tool/${tool.id}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleToolExpanded(tool.id)}
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Enabled</span>
                      <Switch
                        checked={tool.enabled}
                        onCheckedChange={() => handleToggleEnabled(tool)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePopular(tool)}
                      aria-label={tool.popular ? "Unmark as popular" : "Mark as popular"}
                    >
                      {tool.popular ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditTool(tool)} aria-label="Edit tool">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t border-border p-4 bg-muted/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Code Editor */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-foreground">Custom Content (HTML/Code)</label>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleInlineSaveCode(tool.id)}
                              disabled={isSaving || !unsaved}
                            >
                              {isSaving ? (
                                <>
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-3 w-3 mr-1" />
                                  Save Code
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                        <Textarea
                          value={currentCode}
                          onChange={(e) => setInlineEditingCode(prev => ({
                            ...prev,
                            [tool.id]: e.target.value
                          }))}
                          placeholder="Enter custom HTML, CSS, or JavaScript code for this tool..."
                          className="font-mono text-xs min-h-[250px] resize-y"
                        />
                      </div>
                      
                      {/* Live Preview */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Live Preview</label>
                        <div className="border border-border rounded-lg bg-background p-4 min-h-[250px] overflow-auto">
                          {currentCode ? (
                            <div 
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(currentCode, {
                                  ADD_TAGS: ['style'],
                                  ADD_ATTR: ['style', 'class']
                                })
                              }} 
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground italic">
                              No custom content. Enter HTML/code on the left to see a live preview.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

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
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Logged in as: {adminType} admin
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>

            {adminType === 'master' ? (
              <Tabs defaultValue="blog" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="blog" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Blog
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Tools
                  </TabsTrigger>
                  <TabsTrigger value="generator" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI Generator
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="blog">
                  <BlogPanel />
                </TabsContent>
                <TabsContent value="tools">
                  <ToolsPanel />
                </TabsContent>
                <TabsContent value="generator">
                  <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">AI Blog Generator</h2>
                      <p className="text-muted-foreground text-sm">Generate SEO-optimized 1500+ word blog posts for all 200 tools using AI.</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button 
                        onClick={startBlogGeneration} 
                        disabled={isGenerating}
                        size="lg"
                        className="w-full"
                      >
                        {isGenerating ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating... {currentBatch}/{totalTools}</>
                        ) : (
                          <><Play className="h-4 w-4 mr-2" /> Start Generating 200 Blog Posts</>
                        )}
                      </Button>
                      
                      {isGenerating && (
                        <Progress value={generationProgress} className="h-3" />
                      )}
                      
                      {generationLogs.length > 0 && (
                        <div className="bg-muted rounded-lg p-4 max-h-[400px] overflow-y-auto">
                          <div className="font-mono text-xs space-y-1">
                            {generationLogs.map((log, i) => (
                              <div key={i} className={log.includes("Error") ? "text-destructive" : log.includes("✅") ? "text-green-500" : "text-muted-foreground"}>
                                {log}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : canAccessBlog ? (
              <BlogPanel />
            ) : canAccessTools ? (
              <ToolsPanel />
            ) : null}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AdminPage;
