import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import compression from "vite-plugin-compression2";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      svelte(),
      compression( {algorithm: 'brotliCompress'})
  ],
  server: {
    cors: false,
  }
})
