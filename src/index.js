#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageJsonPath = path.resolve(currentDir, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

function helpText() {
  return [
    `${packageJson.name} v${packageJson.version}`,
    "",
    "Usage:",
    `  ${packageJson.name} <command> [args]`,
    `  ${packageJson.name} --help`,
    `  ${packageJson.name} --version`,
    "",
    "Commands:",
    "  greet <name>   Print a greeting",
    "  doctor         Print runtime diagnostics"
  ].join("\n");
}

export function run(args, io = process) {
  const writeOut = (line) => io.stdout.write(`${line}\n`);
  const writeErr = (line) => io.stderr.write(`${line}\n`);

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    writeOut(helpText());
    return 0;
  }

  if (args.includes("--version") || args.includes("-v")) {
    writeOut(`${packageJson.name} v${packageJson.version}`);
    return 0;
  }

  const [command, ...rest] = args;

  if (command === "greet") {
    const name = rest[0] || "friend";
    writeOut(`Hello, ${name}.`);
    return 0;
  }

  if (command === "doctor") {
    writeOut(`node: ${process.version}`);
    writeOut(`platform: ${process.platform}`);
    writeOut(`cwd: ${process.cwd()}`);
    return 0;
  }

  writeErr(`Unknown command: ${command}`);
  writeErr(`Run '${packageJson.name} --help' for usage.`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  process.exitCode = run(process.argv.slice(2));
}
