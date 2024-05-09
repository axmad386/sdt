import { defineConfig } from "vite";
import { lunoxView } from "@lunoxjs/view/vite";
import { reactConfig } from "@lunoxjs/view-plugin-react/vite";
export default defineConfig({
  plugins: [lunoxView(reactConfig())],
});
