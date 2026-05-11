const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "src");
const outputDir = path.join(root, "dist");

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
      continue;
    }

    if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDirectory(sourceDir, outputDir);

console.log(`Build completed: ${outputDir}`);
