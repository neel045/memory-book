import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {
                target: "https://memory-book-api.onrender.com",
                changeOrigin: true,
                secure: false,
            },
            "/img": {
                target: "https://memory-book-api.onrender.com",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    plugins: [react()],
})
