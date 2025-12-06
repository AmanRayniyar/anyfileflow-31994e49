import { useState, useEffect } from "react";
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

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setPosts((data || []).map(mapDbToPost));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data, error: insertError } = await supabase
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

      if (insertError) throw insertError;
      
      const newPost = mapDbToPost(data);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to add post");
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
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

      const { error: updateError } = await supabase
        .from("blog_posts")
        .update(dbUpdates)
        .eq("id", id);

      if (updateError) throw updateError;

      setPosts(prev =>
        prev.map(post =>
          post.id === id
            ? { ...post, ...updates, updatedAt: new Date().toISOString() }
            : post
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Failed to delete post");
    }
  };

  const getPostBySlug = (slug: string) => {
    return posts.find(post => post.slug === slug && post.published);
  };

  const publishedPosts = posts.filter(post => post.published);

  return {
    posts: publishedPosts,
    allPosts: posts,
    loading,
    error,
    addPost,
    updatePost,
    deletePost,
    getPostBySlug,
    refetch: fetchPosts
  };
}
