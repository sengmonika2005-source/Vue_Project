# M1 verification

Validated locally on 15 November 2026.

## Automated checks

- Vitest: 14 passing tests across service/store workflows and form components.
- TypeScript: `vue-tsc --build` passes.
- Production bundle: Vite build passes.
- ESLint and Prettier checks pass.

## Browser verification

Headless Chromium was driven using the desktop runtime's bundled Playwright. It is
not an application dependency. Screenshots were inspected at 1440 px and 360 px.

Passed: public browsing, category/title filtering, unknown recipe/page handling,
mock error/retry and empty states, protected-route login return, owner-only recipe
listing, required fields, image preview, adding ingredient/step rows, publishing,
editing, deleting, review add/edit/delete, registration, and ownership denial.

The delete dialog initially focuses **Keep recipe**, and Escape cancels. No browser
application errors were reported. No horizontal overflow was found on the six
public route variants checked at 360 px, or the authenticated editor/owner list.

## Dependency audit

The production-only npm audit reports **zero vulnerabilities**. The full audit
reports **11 moderate development-dependency advisories** in the ESLint TypeScript
and Vue Test Utils dependency chains (glob/minimatch). A nonbreaking `npm audit fix`
did not resolve them. No forced dependency downgrade or breaking override was applied.
These remain a tooling maintenance item; they are not included in the production
bundle. Recheck upstream compatible updates before later milestones.

## Repository and preservation

The project has an independent repository with initial branch `frontend-setup`.
No commits, staging, remote configuration, or pushes were performed.

The initial SHA-256 comparison confirmed that the original M0 proposal, prepared
component document, and all five wireframe PNGs were unchanged during implementation.
The subsequent workspace reorganization moves documentation to `M1/docs/` and the
application to `M1/frontend/`; the component document's wireframe path is updated
accordingly. The proposal remains at [../../M0.pdf](../../M0.pdf), and the wireframe
images remain unchanged in [wireframes/](wireframes/). Deferred functionality is
recorded in [m1-implementation.md](m1-implementation.md) rather than claimed complete.

## Verification after workspace reorganization

Run from `M1/frontend/` on 15 November 2026:

| Check | Result |
| --- | --- |
| `npm test` | 14 tests passed across 2 files |
| `npm run type-check` | Passed |
| `npm run lint` | Passed |
| `npm run format:check` | Passed |
| `npm run build-only -- --emptyOutDir false` | Production build passed; existing output files retained |
| Development-server browser smoke check | HTTP 200; Home, Details, Login, My Recipes, and Editor work; no application errors |
| Mobile editor at 360 px | No horizontal overflow |

The complete move was verified against a pre-move SHA-256 inventory of 8,347 files.
All files matched immediately after relocation, and none were missing after checks.
Application source, tests, configuration, package manifests/lockfiles, installed
packages, wireframes, and the root proposal remain unchanged. Only documentation
path references and the root ignore rules were intentionally edited. Vite/Vitest
refreshed their generated cache metadata during verification.

Dependencies were moved in place; no install or dependency update was performed.
The Git root remains `Vue_Project/`, the branch remains `frontend-setup`, and no
nested repository, commit, staging, or push was created.

## Second quality review

The [second QA report](m1-qa-review.md) records the latest results: 18 passing Vitest
tests, all 11 browser check groups passing, layouts checked at 360/768/1440 px,
and passing TypeScript, ESLint, Prettier and production build. Four confirmed runtime
bugs were corrected and the [component documentation](components.md) was aligned
with the source; the proposed design was retained as a separate reference.
