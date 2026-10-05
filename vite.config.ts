import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// React development server and production bundle.
export default defineConfig({ plugins: [react()] });
