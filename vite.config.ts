import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 또는 Vue 프로젝트라면 '@vitejs/plugin-vue'
import path from 'path';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true, // 개발 환경에서 CSS/SCSS 소스맵 활성화
    preprocessorOptions: {
      scss: {
        // implementation 대신 additionalData 사용
        additionalData: `
          @use "@/assets/scss/common/_variables.scss" as *;
          @use "@/assets/scss/common/_mixins.scss" as *;
          @use "@/assets/scss/common/_functions.scss" as *;
        `,
      },
    },
    modules: {
      // CSS 모듈 클래스명 생성 규칙 설정
      // generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    postcss: {
      plugins: [
        postcssPresetEnv({
          stage: 3, // 안정적인 기능 사용
          features: {
            'nesting-rules': true, // CSS 중첩 규칙 활성화
            'custom-properties': true, // CSS 변수 활성화
            'custom-media-queries': true, // 커스텀 미디어 쿼리 활성화
          },
        }),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
});
