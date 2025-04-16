import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 또는 Vue 프로젝트라면 '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true, // 개발 환경에서 CSS/SCSS 소스맵 활성화
    preprocessorOptions: {
      scss: {
        // implementation 대신 additionalData 사용
        additionalData: `@use "@/styles/scss/_variables.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
