# toolbox-starter-node-cli

[![CI](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/ci.yml)
[![Dependency Review](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/dependency-review.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/dependency-review.yml)
[![Release](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/release.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/release.yml)
[![Publish](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/publish.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/publish.yml)
[![License](https://img.shields.io/github/license/PetriLahdelma/toolbox-starter-node-cli)](./LICENSE)

Production-ready Node CLI starter scaffolded by [`dev-toolbox`](https://github.com/PetriLahdelma/dev-toolbox).

## Why this starter

- Deterministic command runner design via exported `run(args, io, runtime)`.
- Practical command patterns (`help`, `greet`, `doctor`) with option handling.
- Test + coverage + build + pack validation wired into CI.
- Release hygiene with semantic PR titles + Release Please.
- Governance and security baseline already present.

## Quickstart

```bash
npm install
npm run lint
npm run typecheck
npm test
npm run build
```

## Usage

```bash
# Help and version
node dist/index.js --help
node dist/index.js --version

# Command usage
node dist/index.js greet Petra
node dist/index.js greet Petra --upper
node dist/index.js doctor
node dist/index.js doctor --json
```

## Scripts

- `npm run dev` - run CLI help from source.
- `npm run lint` - syntax checks for source + tests.
- `npm run typecheck` - TypeScript check for JS (`checkJs`).
- `npm test` - Node test runner.
- `npm run test:coverage` - coverage report with `c8`.
- `npm run build` - clean + build `dist/index.js`.
- `npm run pack:check` - validate publish tarball with `npm pack --dry-run`.

## CI quality gates

CI runs on Node 20 and 22 and enforces:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run pack:check`

Coverage is executed on Node 20.

## Extending commands

See [`docs/EXTENDING.md`](./docs/EXTENDING.md) for command architecture and implementation guidance.

## Release flow

1. Merge semantic PRs (`feat:`, `fix:`, `docs:`, etc.).
2. Release Please opens or updates the release PR.
3. Merge the release PR to cut tag + GitHub Release.
4. GitHub release triggers trusted npm publish with provenance.

## Publishing setup

See [`docs/PUBLISHING.md`](./docs/PUBLISHING.md) for npm trusted publisher setup.

## License

MIT.
