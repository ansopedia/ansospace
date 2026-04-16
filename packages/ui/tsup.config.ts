import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/lib/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  // banner: {
  //   js: "'use client';",
  // },
  onSuccess: async () => {
    const distStylesDir = path.join(process.cwd(), "dist/styles");
    if (!fs.existsSync(distStylesDir)) {
      fs.mkdirSync(distStylesDir, { recursive: true });
    }
    fs.copyFileSync(path.join(process.cwd(), "src/styles/globals.css"), path.join(distStylesDir, "globals.css"));
    fs.copyFileSync(
      path.join(process.cwd(), "postcss.config.mjs"),
      path.join(process.cwd(), "dist/postcss.config.mjs")
    );
  },
});
