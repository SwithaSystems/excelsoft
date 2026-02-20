#!/usr/bin/env node
// Copy public/* (e.g. sw.js) into dist so they are served at the root.
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const publicDir = path.join(root, "public");
const distDir = path.join(root, "dist");
if (!fs.existsSync(publicDir)) process.exit(0);
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}
const files = fs.readdirSync(publicDir);
for (const file of files) {
  const src = path.join(publicDir, file);
  if (fs.statSync(src).isFile()) {
    fs.copyFileSync(src, path.join(distDir, file));
    console.log("Copied public/" + file + " to dist/");
  }
}
