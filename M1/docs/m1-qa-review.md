# ShareMhob M1 — Second quality assurance review

Reviewed on 15 November 2026. Scope: verify existing M1 functionality, correct
confirmed bugs, and align component documentation. No new features, redesign,
backend work, dependency changes, commits, or pushes were included.

## Final outcome

**Passed after fixes:** 11 browser check groups; 18 Vitest tests across 3 files;
TypeScript; ESLint; Prettier; and production build. No unresolved failures remain
in the checks performed. Deferred functionality below is not claimed as tested or
implemented.

Browser checks used headless Chromium through the desktop runtime's bundled
Playwright, without adding an application dependency. Layout checks cover desktop
1440 px, tablet 768 px, and mobile 360 px. Seven variants at each width (Home,
Details, Login, Register, My Recipes, Create, and Edit) produced 21 screenshots.
The structured browser outcomes are in [qa-browser-results.json](qa-browser-results.json).

## Passed checks

| Area | Checks performed | Final result |
| --- | --- | --- |
| Homepage | Case-insensitive/trimmed title search, Khmer-name search, category selection, combined search/category filtering, clearing filters, empty matches, search submit and recipe navigation | Passed |
| Recipe details | All 8 Fish Amok ingredients and quantities, 5 instructions, ingredient checklist, numeric and accessible rating, anonymous review login return | Passed |
| Reviews | Missing rating/comment rejected; 5-star submission; review edit/delete/cancel; average changes from 4.5 to 4.7, then 4.0, then 4.5; another author's edit controls absent | Passed |
| Authentication | Missing name/email/password, invalid email, short registration password, confirmation mismatch, invalid credentials, password visibility, registration, login to the created account, logout, protected-route redirect | Passed |
| Logout regression | Cancelling the editor's unsaved-change confirmation retains the session and draft; accepting logs out and returns home; logout while already home works | Passed |
| Recipe management | Required fields, invalid servings, multiple ingredient and instruction rows, publishing, saved details, editing, owner list updates | Passed |
| Delete confirmation | Safe initial focus on Keep recipe, cancel button, Escape cancellation, confirmed removal; related-review deletion and ownership rejection covered by service tests | Passed |
| Images | Non-image type and files over 2 MB rejected, valid PNG decoded and previewed, remove/reselect supported, corrupt PNG rejected without leaving Publish disabled | Passed |
| Request states | Loading during retry, failed request and recovery, empty collection, filtered empty results, unknown recipe and unknown page | Passed |
| Responsive layout | All screen variants at 360/768/1440 px, plus long unbroken valid recipe text at 360/768 px; no horizontal page overflow | Passed |
| Browser diagnostics | Application exceptions, console errors, and console warnings recorded throughout the final run | None recorded |
| Project structure | Repository root Vue_Project, branch frontend-setup, five wireframe PNGs in M1/docs/wireframes | Confirmed |

## Initial failures and fixes

The initial browser run passed 8 of 11 groups and failed the cancelled-logout,
corrupt-image, and long-text groups. Targeted regression tests additionally
reproduced the image-reselection defect. The following issues were fixed:

| Issue | Evidence before fix | Fix | Verification |
| --- | --- | --- | --- |
| Cancelled logout cleared the mock session | Dirty editor remained at `/recipes/new` after dismissal, but its Log out control disappeared and the session was null | AppNavbar waits for successful navigation before clearing the session; handles already being home | Browser scenario and router-integrated Vitest regression |
| Corrupt uploads became broken previews | A text buffer named `broken.png` with MIME `image/png` produced a preview with natural width 0 and no error | Decode the image before assigning its data URL; report decode failure and clear pending state | Real browser corrupt-file check and mocked-decoder regression |
| Same image could not be chosen again after removal | The native file input retained its previous filename, so choosing that file again would not trigger change | Clear the native input after emitting the selected File | Input-reset regression; real browser remove/reselect flow |
| Unbroken user content overflowed the page | A valid 120-character title and long recipe content produced 3,639 px of document width at a 360 px viewport | Add `overflow-wrap: anywhere` to `.page`; normal typography, palette and layout rules stay intact | Browser checks at 360 and 768 px |
| Component documentation described proposed APIs as the design reference | Referenced absent wrappers, incorrect Navbar/Card/ReviewSection props and emits, wrong array editor events, and missing dialog pending/error props | Update components.md to the actual 18 component files, view structure, props, events, and ownership; preserve the original as components-design-reference.md | Source-by-source review and component inventory check |

No application colors, fonts, illustration assets, page hierarchy, or navigation
features were redesigned. The only CSS change is long-text wrapping. Screenshots
were compared before/after and inspected for identity/layout consistency.

## Commands and results

Run from `M1/frontend/` using the existing installed dependencies:

| Command | Result |
| --- | --- |
| `npm test` | 18 passed, 0 failed, across 3 test files |
| `npm run type-check` | Passed |
| `npm run lint` | Passed |
| `npm run format:check` | Passed |
| `npm run build-only -- --emptyOutDir false` | Production build passed; prior output retained |

The four new regression tests cover cancelled logout, confirmed/homepage logout,
image decoding failure, and selecting the same image again. Existing tests continue
to cover core CRUD, mock account workflows, ownership, review integrity and averages,
request-state recovery, and form events.

## Requirements and remaining limitations

- M0's roles remain `USER` and `ADMIN` in `types.ts`; visitors remain anonymous.
  Registration creates USER accounts. The M0 PDF is unchanged. ADMIN interfaces,
  moderation, account management, and server role enforcement remain deferred;
  there is no working ADMIN account/demo or dashboard in M1.
- Mock records, accounts, and sessions live in memory and reset on refresh.
  Authentication and ownership checks demonstrate UI behavior and are not secure
  server authorization. There is no backend, persistent database, or server upload.
- Draft saving, favorites, social sharing, password recovery, notifications, and
  multi-image galleries are deferred. Draft count remains zero. These are scope
  limitations, not unresolved failures in the approved core prototype.
- Read-only star glyphs round to a whole star; numeric and accessible average labels
  show one decimal. Review input accepts integer ratings from 1 to 5.
- Optional Google Fonts require a connection and have system fallbacks. Network
  outages, additional browser engines/devices, real API behavior, and M0's concurrent
  server performance target were not certified by this Chromium review.
- Existing development-tool dependency advisories remain documented in
  [m1-verification.md](m1-verification.md). Dependencies were neither reinstalled nor
  upgraded as part of this review.

The five original wireframes remain in [wireframes/](wireframes/). Current component
contracts are in [components.md](components.md); the original proposed design is
preserved in [components-design-reference.md](components-design-reference.md).
No commit, staging, or push was performed.
