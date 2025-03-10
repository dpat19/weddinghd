import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'



// https://vite.dev/config/
export default defineConfig({
  base: "/weddinghd",
  plugins: [
    react(),
    tailwindcss(),
    
  ],
  assetsInclude: ['**/*.JPG', '**/*.jpeg', '**/*.png', '**/*.gif', '**/*.svg'],
  optimizeDeps: {
    include: [
      '@mui/material',       
      '@mui/icons-material', 
    ]
  }
})
