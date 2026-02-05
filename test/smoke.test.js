import test from "node:test";
import assert from "node:assert/strict";

import { run } from "../src/index.js";

function createIo() {
  const out = [];
  const err = [];
  return {
    stdout: { write: (msg) => out.push(msg) },
    stderr: { write: (msg) => err.push(msg) },
    readOut: () => out.join(""),
    readErr: () => err.join("")
  };
}

test("help output returns success", () => {
  const io = createIo();
  const code = run(["--help"], io);
  assert.equal(code, 0);
  assert.match(io.readOut(), /Usage:/);
});

test("version output returns success", () => {
  const io = createIo();
  const code = run(["--version"], io);
  assert.equal(code, 0);
  assert.match(io.readOut(), /v0\.1\.0/);
});

test("greet command prints greeting", () => {
  const io = createIo();
  const code = run(["greet", "Petri"], io);
  assert.equal(code, 0);
  assert.match(io.readOut(), /Hello, Petri\./);
});

test("unknown command exits with error", () => {
  const io = createIo();
  const code = run(["unknown"], io);
  assert.equal(code, 1);
  assert.match(io.readErr(), /Unknown command:/);
});
