# ShareMhob M1 implementation

## Scope

The frontend lives in `M1/frontend/` and this documentation in `M1/docs/`, relative
to the repository root. See the [root README](../../README.md), the original
[M0 proposal](../../M0.pdf), [component design](components.md), and [wireframes](wireframes/).
Frontend source paths refer to `M1/frontend/src/`. Run npm commands in `M1/frontend/`.

Frontend prototype of the five supplied wireframes. The original M0 proposal,
wireframes, and [proposed component design](components-design-reference.md) are
preserved. [components.md](components.md) documents the actual implementation.
Backend, database, secure
authentication/authorization, and concurrent-request performance requirements belong
to later integration work and are not claimed as completed.

Implemented: public browsing, details, mock registration/login/logout, owner recipe
creation/editing/deletion, integer 1–5 ratings, written reviews, own-review edit/delete,
computed averages, form validation, loading/error/empty states, and responsive layouts
down to 360 px. Title/Khmer-name search and My Recipes pagination are M0 stretch features.

## Routes and wireframes

| Wireframe | Route | Implementation |
| --- | --- | --- |
| 01 Home / Explore | `/`, `/#recipes` | Hero, search, categories, recipe grid |
| 02 Recipe Details | `/recipes/:id` | Image, author, ratings, timing, ingredients, steps, reviews |
| 03 Login / Register | `/auth`, `/auth?tab=register` | Account mode buttons and validated forms |
| 04 Create / Edit | `/recipes/new`, `/recipes/:id/edit` | Image preview, basics, ingredients, steps, publish/update |
| 05 My Recipes | `/my-recipes` | Owner list, counts, search, status filter, edit/delete, pagination |

`/recipes/create` aliases `/recipes/new` to reconcile the references. Unknown URLs
and recipe IDs have not-found states. Protected routes return to their intended
page after mock login. Categories match the editor: Main Dish, Soup, Noodle, Dessert,
and Snack; the Home wireframe's dish names are represented as recipe cards.

## Component mapping

The archived proposed component document remains the design reference; the current
component document lists the implemented props, events, and state owners. Shared components:
AppNavbar, AppIcon, RecipeCard, RatingStars, RecipeSearch, CategoryFilter, HeroSection,
LoadingState, EmptyState, and ErrorState.

Proposed display-only wrappers are consolidated: grids live in Home/My Recipes;
the recipe header, image, ingredients, and instructions live in RecipeDetailView.
AuthForm handles login/register; ReviewSection and ReviewForm handle reviews;
RecipeBasicsForm, RecipeImagePicker, IngredientEditor, and InstructionEditor support
the editor. DeleteConfirmDialog uses a native modal with keyboard focus containment
and initial focus on the safe action.

Pinia auth owns the mock user/request state; Pinia recipes owns shared lists and
loading/error state. Forms own drafts and errors. The promise-based mock services
use an in-memory database and check the mock session and ownership. These checks
demonstrate behavior and are not secure server authorization. Accounts and passwords
are memory-only demo data; use made-up credentials.

## Deferred and visual differences

- Admin Dashboard, moderation, and account management (FR-09/10): deferred as stated
  in the prepared component document. They remain in M0's overall scope.
- Favorites, social sharing, password recovery, notifications, and saving drafts:
  deferred. The draft count is zero and its filter has an empty state. Nonfunctional
  save/share/recovery/notification buttons are omitted.
- Own-review edit/delete controls cover FR-08 within Recipe Details.
- Confirm-password validation follows the registration wireframe.
- Browser chrome and annotation callouts are reference-only.
- Six local SVG food illustrations are included. Selected JPG/PNG/WebP files up to
  2 MB stay in browser memory; nothing is uploaded to a server.
- Warm cream/green/terracotta styling follows the content hierarchy. Optional Google
  Fonts have system-font fallbacks.
- No AI recommendations, payments, delivery, nutrition analysis, or real-time chat.

## Demonstrating states

- `/?mock=error`: failed request; **Try again** reloads normal data.
- `/?mock=empty`: empty collection; navigate home normally to restore the list.
- Loading is visible during the simulated 220 ms service delay.
- An unmatched title or the Snack category shows a filtered empty state.
- `/recipes/unknown`: unavailable recipe.
- Sign in as the demo cook and open `/recipes/fish-amok/edit`: ownership denial.

## Acceptance checklist

1. Browse anonymously, open details, check ingredient boxes, and inspect steps/reviews.
2. Try invalid account fields/mismatched passwords; sign in with the demo account
   (`cook@sharemhob.test` / `Cook123!`) and verify return navigation.
3. Publish a recipe with several ingredients/steps. Verify public list, details,
   and My Recipes counts. Edit it and check values across pages.
4. Cancel deletion, then confirm deletion; verify the recipe and its reviews disappear.
   Another cook's content cannot be changed.
5. Add, edit, and remove a review; verify the average changes and other authors'
   edit/delete controls are absent.
6. Check loading, error/retry, empty, and unknown recipe states.
7. Repeat at 360 px. Verify no page overflow, keyboard focus, field labels, and
   keyboard containment in the delete dialog.
8. Refresh to restore seed data and clear mock accounts/session.

Vitest covers account flows, CRUD/ownership, rating integrity, cascade review deletion,
averages, request-state recovery, form validation/events, cancelled logout, image
decoding, and reselecting an image. See [the second QA report](m1-qa-review.md).
