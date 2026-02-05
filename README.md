# toolbox-starter-node-cli

[![CI](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/ci.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/ci.yml)
[![Release](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/release.yml/badge.svg)](https://github.com/PetriLahdelma/toolbox-starter-node-cli/actions/workflows/release.yml)
[![License](https://img.shields.io/github/license/PetriLahdelma/toolbox-starter-node-cli)](./LICENSE)

Production-ready Node CLI starter scaffolded by `dev-toolbox`.

## Features

- ESM-based CLI entrypoint with structured command routing
- Built-in `--help` and `--version`
- Testable `run(args, io)` function for deterministic tests
- CI-ready scripts (`lint`, `typecheck`, `test`, `build`)
- Release-please + maintainer baseline wired out of the box

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
# Show help
node dist/index.js --help

# Show version
node dist/index.js --version

# Greet command
node dist/index.js greet Petra

# Lightweight runtime diagnostics
node dist/index.js doctor
```

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run clean`

## Publish checklist

1. Update package metadata in `package.json`.
2. Ensure `npm test` and CI pass.
3. Merge semantic PRs (`feat:`, `fix:`, etc.).
4. Let release-please open and cut release PRs automatically.

## License

MIT.
