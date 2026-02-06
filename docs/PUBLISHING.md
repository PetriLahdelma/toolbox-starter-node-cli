# Publishing to npm (Trusted Publishing)

This repo publishes via GitHub Actions OIDC trusted publishing with provenance.

## One-time setup in npm

1. Create the package in npm (or reserve the name).
2. In npm package settings, add a **Trusted Publisher**:
   - Provider: GitHub Actions
   - Repository: `PetriLahdelma/toolbox-starter-node-cli`
   - Workflow file: `.github/workflows/publish.yml`
   - Environment: not required (unless you want manual gates)
3. Ensure package visibility and access settings match your intent.

## How publishing is triggered

- Automatically on GitHub Release publish events.
- Manually via Actions `workflow_dispatch`.

## What the workflow enforces

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run pack:check`
- `npm publish --provenance --access public`

## Notes

- No long-lived npm token is required for trusted publishing.
- `id-token: write` permission is required in the workflow.
