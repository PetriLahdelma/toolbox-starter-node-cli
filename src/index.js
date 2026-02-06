#!/usr/bin/env node
// @ts-check

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageJsonPath = path.resolve(currentDir, "../package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

/**
 * @typedef {{ stdout: { write: (msg: string) => unknown }, stderr: { write: (msg: string) => unknown } }} IoLike
 */

/**
 * @typedef {{
 *   version: string,
 *   platform: string,
 *   arch: string,
 *   pid: number,
 *   execPath: string,
 *   env: NodeJS.ProcessEnv,
 *   cwd: () => string
 * }} RuntimeLike
 */

function helpText() {
  return [
    `${packageJson.name} v${packageJson.version}`,
    "",
    "Usage:",
    `  ${packageJson.name} <command> [options]`,
    `  ${packageJson.name} --help`,
    `  ${packageJson.name} --version`,
    "",
    "Commands:",
    "  help                        Show this help output",
    "  greet [name] [--upper]      Print a greeting",
    "  doctor [--json]             Print runtime diagnostics",
    "",
    "Examples:",
    `  ${packageJson.name} greet Petra`,
    `  ${packageJson.name} greet Petra --upper`,
    `  ${packageJson.name} doctor --json`
  ].join("\n");
}

function greetHelpText() {
  return [
    "Usage:",
    `  ${packageJson.name} greet [name] [--upper]`,
    "",
    "Options:",
    "  --upper, -u    Uppercase the greeting"
  ].join("\n");
}

function doctorHelpText() {
  return [
    "Usage:",
    `  ${packageJson.name} doctor [--json]`,
    "",
    "Options:",
    "  --json         Print diagnostics as JSON"
  ].join("\n");
}

/**
 * @param {IoLike} io
 */
function createWriters(io) {
  /** @param {string} line */
  const writeOut = (line) => io.stdout.write(`${line}\n`);
  /** @param {string} line */
  const writeErr = (line) => io.stderr.write(`${line}\n`);

  return {
    writeOut,
    writeErr
  };
}

/**
 * @param {string[]} args
 * @param {Set<string>} allowedFlags
 */
function findUnknownFlags(args, allowedFlags) {
  return args.filter((arg) => arg.startsWith("-") && !allowedFlags.has(arg));
}

/**
 * @param {string[]} args
 * @param {IoLike} io
 */
function runGreet(args, io) {
  const { writeOut, writeErr } = createWriters(io);

  if (args.includes("--help") || args.includes("-h")) {
    writeOut(greetHelpText());
    return 0;
  }

  const unknownFlags = findUnknownFlags(args, new Set(["--upper", "-u"]));
  if (unknownFlags.length > 0) {
    writeErr(`Unknown option(s): ${unknownFlags.join(", ")}`);
    writeErr(`Run '${packageJson.name} greet --help' for usage.`);
    return 1;
  }

  const upper = args.includes("--upper") || args.includes("-u");
  const nameArg = args.find((arg) => !arg.startsWith("-"));
  const name = nameArg || "friend";
  const greeting = `Hello, ${name}.`;

  writeOut(upper ? greeting.toUpperCase() : greeting);
  return 0;
}

/**
 * @param {RuntimeLike} runtime
 */
function createDoctorReport(runtime) {
  return {
    node: runtime.version,
    platform: runtime.platform,
    arch: runtime.arch,
    pid: runtime.pid,
    executable: runtime.execPath,
    cwd: runtime.cwd(),
    ci: runtime.env.CI === "true" || runtime.env.CI === "1"
  };
}

/**
 * @param {string[]} args
 * @param {IoLike} io
 * @param {RuntimeLike} runtime
 */
function runDoctor(args, io, runtime) {
  const { writeOut, writeErr } = createWriters(io);

  if (args.includes("--help") || args.includes("-h")) {
    writeOut(doctorHelpText());
    return 0;
  }

  const unknownFlags = findUnknownFlags(args, new Set(["--json"]));
  if (unknownFlags.length > 0) {
    writeErr(`Unknown option(s): ${unknownFlags.join(", ")}`);
    writeErr(`Run '${packageJson.name} doctor --help' for usage.`);
    return 1;
  }

  const report = createDoctorReport(runtime);

  if (args.includes("--json")) {
    writeOut(JSON.stringify(report, null, 2));
    return 0;
  }

  writeOut(`node: ${report.node}`);
  writeOut(`platform: ${report.platform}`);
  writeOut(`arch: ${report.arch}`);
  writeOut(`pid: ${report.pid}`);
  writeOut(`executable: ${report.executable}`);
  writeOut(`cwd: ${report.cwd}`);
  writeOut(`ci: ${report.ci}`);

  return 0;
}

/**
 * @param {string[]} args
 * @param {IoLike} [io]
 * @param {RuntimeLike} [runtime]
 */
export function run(args, io = process, runtime = process) {
  const { writeOut, writeErr } = createWriters(io);

  if (!Array.isArray(args)) {
    writeErr("Expected args to be an array of strings.");
    return 1;
  }

  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    writeOut(helpText());
    return 0;
  }

  if (args.includes("--version") || args.includes("-v")) {
    writeOut(`${packageJson.name} v${packageJson.version}`);
    return 0;
  }

  const [command, ...rest] = args;

  if (command === "help") {
    writeOut(helpText());
    return 0;
  }

  if (command === "greet") {
    return runGreet(rest, io);
  }

  if (command === "doctor") {
    return runDoctor(rest, io, runtime);
  }

  writeErr(`Unknown command: ${command}`);
  writeErr("Available commands: help, greet, doctor");
  writeErr(`Run '${packageJson.name} --help' for usage.`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  process.exitCode = run(process.argv.slice(2), process, process);
}
