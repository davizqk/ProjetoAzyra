
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Azyra - Registro de Atrasos",
        short_name: "Azyra",
        description: "Tela de registro de atrasos por QR Code",
        theme_color: "#CEE0F2",
        background_color: "#CEE0F2",
        display: "fullscreen",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/logo-qrcode.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/logo-qrcode.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
