import { execFileSync } from "node:child_process";

const expectedFiles = new Set([
  "CHANGELOG.md",
  "LICENSE",
  "README.md",
  "dist/index.js",
  "package.json"
]);

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const output = execFileSync(npmCommand, ["pack", "--json", "--dry-run"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "inherit"]
});

const [packResult] = JSON.parse(output);

if (!packResult || !Array.isArray(packResult.files)) {
  throw new Error("npm pack did not return a readable file manifest.");
}

const actualFiles = new Set(packResult.files.map((entry) => entry.path));
const missingFiles = [...expectedFiles].filter((file) => !actualFiles.has(file));
const unexpectedFiles = [...actualFiles].filter((file) => !expectedFiles.has(file));

if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
  if (missingFiles.length > 0) {
    console.error(`Missing tarball entries: ${missingFiles.join(", ")}`);
  }
  if (unexpectedFiles.length > 0) {
    console.error(`Unexpected tarball entries: ${unexpectedFiles.join(", ")}`);
  }
  process.exit(1);
}

console.log(
  `Pack manifest ok: ${packResult.filename} (${packResult.entryCount} files, ${packResult.unpackedSize} bytes unpacked)`
);
