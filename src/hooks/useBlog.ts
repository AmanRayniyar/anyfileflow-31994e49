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

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map(mapDbToPost);
};

export function useBlogPosts() {
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const addMutation = useMutation({
    mutationFn: async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          image: post.image || null,
          author: post.author,
          category: post.category,
          tags: post.tags,
          published: post.published
        })
        .select()
        .single();

      if (error) throw error;
      return mapDbToPost(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlogPost> }) => {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt;
      if (updates.content !== undefined) dbUpdates.content = updates.content;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.author !== undefined) dbUpdates.author = updates.author;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.published !== undefined) dbUpdates.published = updates.published;

      const { error } = await supabase
        .from("blog_posts")
        .update(dbUpdates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) throw error;
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
    return posts.find(post => post.slug === slug && post.published);
  };

  const publishedPosts = posts.filter(post => post.published);

  return {
    posts: publishedPosts,
    allPosts: posts,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to fetch posts") : null,
    addPost,
    updatePost,
    deletePost,
    getPostBySlug,
    refetch: () => queryClient.invalidateQueries({ queryKey: ["blog-posts"] })
  };
}
