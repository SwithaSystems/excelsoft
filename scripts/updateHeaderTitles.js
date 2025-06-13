#!/usr/bin/env node
/**
 * updateHeaderTitles.js
 *
 * Traverses the project source files and replaces hard-coded
 * string values of the `headerText` prop for the `<Header>` component
 * with the corresponding constants declared in `app/config/stringLiterals.js`.
 *
 * Usage:
 *   node scripts/updateHeaderTitles.js
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const projectRoot = path.resolve(__dirname, "..");
const literalsFile = path.join(projectRoot, "app", "config", "stringLiterals.js");

if (!fs.existsSync(literalsFile)) {
  console.error(`stringLiterals.js not found at ${literalsFile}`);
  process.exit(1);
}

// Step 1: build mapping { value: CONSTANT_NAME }
const literalsSource = fs.readFileSync(literalsFile, "utf8");
const regexConst = /const\s+(\w+)\s*=\s*"([^"]+)"/g;
/** @type {Record<string,string>} */
const valueToConstMap = {};
let m;
while ((m = regexConst.exec(literalsSource))) {
  const [, constName, constValue] = m;
  valueToConstMap[constValue] = constName;
}

// Step 2: scan source files
const tsxFiles = glob.sync("{app,components}/**/*.{ts,tsx,js,jsx}", {
  cwd: projectRoot,
  absolute: true,
  ignore: ["**/node_modules/**", "**/config/**"],
});

const headerRegex = /<Header([^>]*?)headerText="([^"]+)"([^>]*)\/>/g;
let totalReplaced = 0;

for (const file of tsxFiles) {
  let source = fs.readFileSync(file, "utf8");
  const constantsUsed = new Set();
  let changed = false;

  source = source.replace(headerRegex, (fullMatch, before, title, after) => {
    const constName = valueToConstMap[title];
    if (!constName) return fullMatch;
    constantsUsed.add(constName);
    changed = true;
    totalReplaced += 1;
    return `<Header${before}headerText={${constName}}${after}/>`;
  });

  if (changed) {
    const relativePath = path.relative(path.dirname(file), literalsFile)
      .replace(/\\/g, "/")
      .replace(/\.js$/, "");
    const importPath = `./${relativePath}`;

    const importRegex = /import\s+\{([^}]*)\}\s+from\s+["'][^"']+stringLiterals["'];?/;
    if (importRegex.test(source)) {
      source = source.replace(importRegex, (match, p1) => {
        const existing = p1.split(",").map((s) => s.trim()).filter(Boolean);
        const merged = Array.from(new Set([...existing, ...constantsUsed]));
        return `import { ${merged.join(", ")} } from '${importPath}';`;
      });
    } else {
      source = `import { ${Array.from(constantsUsed).join(", ")} } from '${importPath}';\n` + source;
    }

    fs.writeFileSync(file, source, "utf8");
    console.log(`Updated ${path.relative(projectRoot, file)} – replaced ${constantsUsed.size} header titles`);
  }
}

console.log(`\nHeader title replacement complete. Total replacements: ${totalReplaced}`);
