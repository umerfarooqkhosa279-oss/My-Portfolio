import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'qr-placeholder.svg'],
      manifest: {
        name: 'Hospitality Portfolio CMS',
        short_name: 'PortfolioCMS',
        description: 'Portfolio and CMS for hospitality education professionals',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ]
});
