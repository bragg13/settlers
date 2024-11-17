/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/frontend',

  server: {
    port: 4200,
    host: 'localhost',
    hmr: {
      // Reduce HMR polling interval
      overlay: false,
      // Increase the timeout
      timeout: 5000,
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../dist/packages/frontend',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [],
    },
    // Reduce source map generation in dev
    sourcemap: false,
  },

  optimizeDeps: {
    // Exclude heavy dependencies from optimization if not frequently changed
    exclude: ['three'], // Add your heavy dependencies
  },
});
