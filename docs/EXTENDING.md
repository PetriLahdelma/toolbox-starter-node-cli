# Extending This CLI

This starter intentionally keeps one explicit entrypoint (`src/index.js`) and uses an exported `run(args, io, runtime)` function so behavior stays testable.

## Command contract

Each command should:

1. Accept `string[]` command arguments only.
2. Validate flags and return exit code `1` on invalid usage.
3. Write user-facing output via provided `io` (`stdout` / `stderr`) instead of `console.log`.
4. Return numeric exit codes (`0` success, non-zero failure).

## Suggested pattern

- Add command help text near existing `helpText` helpers.
- Implement `run<CommandName>(args, io, runtime?)`.
- Route command in `run(args, io, runtime)`.
- Add tests in `test/smoke.test.js` for success and failure paths.

## Quality checklist for new commands

- [ ] Command appears in global help output.
- [ ] `--help` path exists and returns `0`.
- [ ] Invalid flags are rejected with actionable error output.
- [ ] Tests cover happy path and failure path.
- [ ] `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
