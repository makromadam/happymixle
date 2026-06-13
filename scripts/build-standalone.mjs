import { copyFile, readFile, rm, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { build } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"

const root = resolve(import.meta.dirname, "..")
const outDir = resolve(root, ".standalone-build")
const output = resolve(root, "Happy Mixle (standalone).html")

await rm(outDir, { recursive: true, force: true })

await build({
  root,
  base: "./",
  publicDir: false,
  plugins: [react(), viteSingleFile()],
  build: {
    outDir,
    emptyOutDir: true,
    target: "es2020",
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})

const builtIndex = resolve(outDir, "index.html")
let html = await readFile(builtIndex, "utf8")

// Standalone files cannot resolve root-relative metadata or fallback images.
html = html
  .replace(/<link rel="canonical"[^>]*>/g, "")
  .replace(/<link rel="icon"[^>]*>/g, "")
  .replace(/<meta property="og:image"[^>]*>/g, "")
  .replace(/background-image:\s*url\((["']?)\/fallback-human\.png\1\);?/g, "")

await writeFile(builtIndex, html)
await copyFile(builtIndex, output)
await rm(outDir, { recursive: true, force: true })

console.log(`Standalone hazır: ${output}`)
