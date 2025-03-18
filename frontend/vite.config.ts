import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@ffmpeg/ffmpeg"], // Exclude FFmpeg from dependency optimization
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Fix for commonjs compatibility
    },
  },
});
