// @ts-check

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { run } from "../src/index.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(currentDir, "../package.json"), "utf8")
);

function createIo() {
  /** @type {string[]} */
  const out = [];
  /** @type {string[]} */
  const err = [];

  return {
    stdout: { write: /** @param {string} msg */ (msg) => out.push(msg) },
    stderr: { write: /** @param {string} msg */ (msg) => err.push(msg) },
    readOut: () => out.join(""),
    readErr: () => err.join("")
  };
}

test("help output returns success", () => {
  const io = createIo();
  const code = run(["--help"], io);

  assert.equal(code, 0);
  assert.match(io.readOut(), /Usage:/);
  assert.match(io.readOut(), /doctor \[--json\]/);
});

test("version output returns success", () => {
  const io = createIo();
  const code = run(["--version"], io);

  assert.equal(code, 0);
  assert.match(io.readOut(), new RegExp(`v${packageJson.version.replaceAll(".", "\\.")}`));
});

test("greet command prints greeting", () => {
  const io = createIo();
  const code = run(["greet", "Petri"], io);

  assert.equal(code, 0);
  assert.match(io.readOut(), /Hello, Petri\./);
});

test("greet command supports uppercase flag", () => {
  const io = createIo();
  const code = run(["greet", "Petri", "--upper"], io);

  assert.equal(code, 0);
  assert.match(io.readOut(), /HELLO, PETRI\./);
});

test("greet command rejects unknown flags", () => {
  const io = createIo();
  const code = run(["greet", "--invalid"], io);

  assert.equal(code, 1);
  assert.match(io.readErr(), /Unknown option/);
});

test("doctor command supports JSON output", () => {
  const io = createIo();
  const code = run(["doctor", "--json"], io, {
    version: "v20.0.0",
    platform: "darwin",
    arch: "arm64",
    pid: 123,
    execPath: "/usr/local/bin/node",
    env: { CI: "true" },
    cwd: () => "/tmp/project"
  });

  assert.equal(code, 0);
  const parsed = JSON.parse(io.readOut());
  assert.equal(parsed.node, "v20.0.0");
  assert.equal(parsed.platform, "darwin");
  assert.equal(parsed.ci, true);
});

test("doctor command supports human-readable output", () => {
  const io = createIo();
  const code = run(["doctor"], io, {
    version: "v22.0.0",
    platform: "linux",
    arch: "x64",
    pid: 456,
    execPath: "/usr/bin/node",
    env: { CI: "0" },
    cwd: () => "/workspace"
  });

  assert.equal(code, 0);
  assert.match(io.readOut(), /node: v22.0.0/);
  assert.match(io.readOut(), /platform: linux/);
  assert.match(io.readOut(), /ci: false/);
});

test("doctor command rejects unknown flags", () => {
  const io = createIo();
  const code = run(["doctor", "--bad-flag"], io);

  assert.equal(code, 1);
  assert.match(io.readErr(), /Unknown option/);
});

test("unknown command exits with error", () => {
  const io = createIo();
  const code = run(["unknown"], io);

  assert.equal(code, 1);
  assert.match(io.readErr(), /Unknown command:/);
  assert.match(io.readErr(), /Available commands:/);
});

test("help command alias exits successfully", () => {
  const io = createIo();
  const code = run(["help"], io);

  assert.equal(code, 0);
  assert.match(io.readOut(), /Commands:/);
});

test("invalid args input type is rejected", () => {
  const io = createIo();
  const code = run(/** @type {any} */ ("not-an-array"), io);

  assert.equal(code, 1);
  assert.match(io.readErr(), /Expected args to be an array/);
});
