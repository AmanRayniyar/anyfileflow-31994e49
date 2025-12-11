import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React - smallest possible
          if (id.includes('react-dom')) return 'react-dom';
          if (id.includes('node_modules/react/')) return 'react';
          if (id.includes('react-router')) return 'router';
          
          // Icons - separate chunk for tree shaking
          if (id.includes('lucide-react')) return 'icons';
          
          // Heavy libs - load on demand
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('react-helmet')) return 'helmet';
          
          // Tool-specific heavy libs
          if (id.includes('qrcode') || id.includes('html5-qrcode')) return 'qr';
          if (id.includes('pdf') || id.includes('qpdf')) return 'pdf';
          if (id.includes('recharts')) return 'charts';
          if (id.includes('react-image-crop')) return 'crop';
          
          // Utils - smaller separate chunks
          if (id.includes('date-fns')) return 'date';
          if (id.includes('clsx') || id.includes('tailwind-merge')) return 'utils';
          if (id.includes('zod')) return 'zod';
          if (id.includes('zustand')) return 'zustand';
        },
      },
    },
    chunkSizeWarningLimit: 500,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@neslinesli93/qpdf-wasm'],
  },
}));
