# Contributing

## Standards

1. Keep changes focused and reviewable.
2. Prefer small, composable commits.
3. Preserve or improve test coverage.
4. Update docs for user-facing behavior changes.

## Local validation

Run the same checks CI enforces before opening a PR:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run pack:check
```

## Pull request expectations

- Use semantic titles (`feat:`, `fix:`, `docs:`, etc.).
- Describe behavior changes and migration implications.
- Add tests for bug fixes and new commands.
