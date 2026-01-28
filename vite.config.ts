// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: true,
//     open: false
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001, // พอร์ตที่ใช้รัน Frontend
    host: true,
    open: false,
    proxy: {
      // เมื่อ Frontend เรียกไปที่ /api มันจะส่งต่อไปที่ Backend (พอร์ต 5000) ให้โดยอัตโนมัติ
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3001,      // ล็อกพอร์ตเป็น 3001 ให้ตรงกับ .env
//     strictPort: true, // ถ้าพอร์ต 3001 ไม่ว่าง ให้แจ้งเตือน (ช่วยให้เราหาตัวที่ค้างอยู่เจอ)
//     host: true,
//     open: false,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000', // ส่งต่อไปยัง Backend
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   }
// })