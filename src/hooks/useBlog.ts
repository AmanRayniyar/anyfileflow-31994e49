import { useState, useEffect } from "react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

const STORAGE_KEY = "anyfileflow_blog_posts";

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Convert JPG to PNG Without Losing Quality",
    slug: "convert-jpg-to-png-without-losing-quality",
    excerpt: "Learn the best practices for converting JPG images to PNG format while maintaining the highest image quality.",
    content: `<h2>Understanding JPG and PNG Formats</h2>
<p>JPG and PNG are two of the most popular image formats on the web. While JPG uses lossy compression, PNG uses lossless compression, making it ideal for images that require transparency or high quality.</p>

<h2>Why Convert JPG to PNG?</h2>
<p>There are several reasons you might want to convert a JPG to PNG:</p>
<ul>
<li>You need transparency support</li>
<li>You want to preserve image quality for editing</li>
<li>You need a format suitable for graphics and logos</li>
</ul>

<h2>How to Use Our Converter</h2>
<p>Our JPG to PNG converter is simple and fast. Just drag and drop your image, and we'll convert it instantly in your browser. No upload to servers means your files stay private.</p>`,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=400&fit=crop",
    author: "Aman Rauniyar",
    category: "Tutorials",
    tags: ["jpg", "png", "image conversion"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    published: true
  },
  {
    id: "2",
    title: "Top 10 Free Online Tools for Content Creators",
    slug: "top-10-free-online-tools-content-creators",
    excerpt: "Discover the best free online tools that every content creator should have in their toolkit.",
    content: `<h2>Essential Tools for Modern Creators</h2>
<p>As a content creator, having the right tools can make all the difference in your workflow and the quality of your output.</p>

<h2>1. Image Converters</h2>
<p>Convert between different image formats instantly without losing quality.</p>

<h2>2. Video Compressors</h2>
<p>Reduce video file sizes for faster uploads and better streaming.</p>

<h2>3. Audio Editors</h2>
<p>Cut, trim, and enhance your audio files with easy-to-use tools.</p>`,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=400&fit=crop",
    author: "Aman Rauniyar",
    category: "Tips",
    tags: ["tools", "content creation", "productivity"],
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
    published: true
  },
  {
    id: "3",
    title: "Understanding File Compression: A Complete Guide",
    slug: "understanding-file-compression-complete-guide",
    excerpt: "Everything you need to know about file compression, from basic concepts to advanced techniques.",
    content: `<h2>What is File Compression?</h2>
<p>File compression is the process of reducing the size of a file by encoding its data more efficiently.</p>

<h2>Types of Compression</h2>
<p>There are two main types: lossy and lossless compression. Each has its own use cases and trade-offs.</p>

<h2>When to Use Each Type</h2>
<p>Lossless compression is perfect for text and data files, while lossy compression works well for media files.</p>`,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    author: "Aman Rauniyar",
    category: "Guides",
    tags: ["compression", "files", "tutorial"],
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
    published: true
  }
];

export function useBlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      setPosts(defaultPosts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPosts));
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
  };

  const addPost = (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const newPosts = [newPost, ...posts];
    savePosts(newPosts);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const newPosts = posts.map((post) =>
      post.id === id
        ? { ...post, ...updates, updatedAt: new Date().toISOString() }
        : post
    );
    savePosts(newPosts);
  };

  const deletePost = (id: string) => {
    const newPosts = posts.filter((post) => post.id !== id);
    savePosts(newPosts);
  };

  const getPostBySlug = (slug: string) => {
    return posts.find((post) => post.slug === slug && post.published);
  };

  const publishedPosts = posts.filter((post) => post.published);

  return {
    posts: publishedPosts,
    allPosts: posts,
    addPost,
    updatePost,
    deletePost,
    getPostBySlug
  };
}
