import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string | null;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

interface DbBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  author: string;
  category: string;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const mapDbToPost = (db: DbBlogPost): BlogPost => ({
  id: db.id,
  title: db.title,
  slug: db.slug,
  excerpt: db.excerpt,
  content: db.content,
  image: db.image,
  author: db.author,
  category: db.category,
  tags: db.tags || [],
  createdAt: db.created_at,
  updatedAt: db.updated_at,
  published: db.published
});

const fetchBlogPostsPublic = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDbToPost);
};

const fetchBlogPostsAdmin = async (): Promise<BlogPost[]> => {
  const sessionToken = sessionStorage.getItem("anyfileflow_admin_session");
  if (!sessionToken) throw new Error("Admin session expired. Please login again.");

  const { data, error } = await supabase.functions.invoke("verify-admin", {
    body: { action: "blog-list", sessionToken },
  });

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error || "Failed to load blog posts");

  const rows = (data.posts ?? []) as DbBlogPost[];
  return rows.map(mapDbToPost);
};

export function useBlogPosts(options?: { admin?: boolean }) {
  const queryClient = useQueryClient();
  const isAdmin = !!options?.admin;

  const { data: posts = [], isLoading: loading, error } = useQuery({
    queryKey: ["blog-posts", isAdmin ? "admin" : "public"],
    queryFn: isAdmin ? fetchBlogPostsAdmin : fetchBlogPostsPublic,
    staleTime: isAdmin ? 0 : 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const addMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
      if (!isAdmin) {
        throw new Error("Not allowed");
      }

      const sessionToken = sessionStorage.getItem("anyfileflow_admin_session");
      if (!sessionToken) throw new Error("Admin session expired. Please login again.");

      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { action: "blog-create", sessionToken, post },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to create blog post");

      return mapDbToPost(data.post as DbBlogPost);
    },
    onSuccess: (newPost) => {
      queryClient.setQueryData<BlogPost[]>(["blog-posts", "admin"], (oldPosts) => {
        if (!oldPosts) return [newPost];
        return [newPost, ...oldPosts];
      });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
      if (!isAdmin) {
        throw new Error("Not allowed");
      }

      const sessionToken = sessionStorage.getItem("anyfileflow_admin_session");
      if (!sessionToken) throw new Error("Admin session expired. Please login again.");

      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { action: "blog-update", sessionToken, id, updates },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to update blog post");

      return mapDbToPost(data.post as DbBlogPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!isAdmin) {
        throw new Error("Not allowed");
      }

      const sessionToken = sessionStorage.getItem("anyfileflow_admin_session");
      if (!sessionToken) throw new Error("Admin session expired. Please login again.");

      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { action: "blog-delete", sessionToken, id },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed to delete blog post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const addPost = async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    return addMutation.mutateAsync(post);
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    return updateMutation.mutateAsync({ id, updates });
  };

  const deletePost = async (id: string) => {
    return deleteMutation.mutateAsync(id);
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug && post.published);
  };

  // Public pages should only see published posts; admin can see all
  const visiblePosts = isAdmin ? posts : posts.filter((p) => p.published);

  return {
    posts: visiblePosts.filter((p) => p.published),
    allPosts: visiblePosts,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to fetch posts") : null,
    addPost,
    updatePost,
    deletePost,
    getPostBySlug,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] }),
  };
}

