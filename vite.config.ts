// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // 자동 경로 별칭 설정 -> 복잡한 상대경로 대신, '@'로 특정 경로 위치로 바로 참조가능
//   resolve: {
//     alias: [{ find: "@", replacement: "/src" }],
//   },
// });
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 자동 경로 별칭 설정 -> 복잡한 상대경로 대신, '@'로 특정 경로 위치로 바로 참조가능
      "@": path.resolve(__dirname, "src"),
    },
  },
});
