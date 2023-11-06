import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  clearScreen: false,
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
    viteSingleFile(),
  ],
  envPrefix: ['VITE_', 'TAURI_'],
  server: {
    port: 3000,
    strictPort: true,
  },
  build: {
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    minify: process.env.TAURI_DEBUG ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEBUG,
  },
});
