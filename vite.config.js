import { defineConfig } from "vite";

export default defineConfig({
    base: "./", // Ensure relative paths
    build: {
        outDir: "dist",
    }
});
