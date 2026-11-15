# ShareMhob — M1 implemented components

This document describes the actual Vue implementation in `M1/frontend/src/`,
verified during the second M1 quality review. The original proposed component tree
is retained in [components-design-reference.md](components-design-reference.md).
Proposed names in that archive are not claims that those files exist.

**Roles:** `User.role` remains exactly `USER | ADMIN` in `types.ts`. Visitors are
anonymous, not a third account role. Registration creates `USER` accounts. The
`ADMIN` role remains part of M0; its dashboard, moderation, account management,
and server-enforced authorization are deferred. M1 uses memory-only mock accounts.

**Wireframes:** All five PNGs are in [wireframes/](wireframes/), or
`M1/docs/wireframes/` relative to the repository root.

## Application tree

```text
App.vue
├── AppNavbar.vue (once, shared by all routes)
├── RouterView
│   ├── HomeView.vue
│   │   ├── HeroSection.vue → RecipeSearch.vue
│   │   ├── CategoryFilter.vue
│   │   └── RecipeCard.vue[] → RatingStars.vue
│   ├── RecipeDetailView.vue
│   │   ├── RatingStars.vue
│   │   ├── inline image/header/ingredients/instructions
│   │   └── ReviewSection.vue
│   │       ├── inline review items → RatingStars.vue
│   │       └── ReviewForm.vue → RatingStars.vue
│   ├── AuthView.vue
│   │   ├── inline account mode buttons
│   │   └── AuthForm.vue (login or register)
│   ├── RecipeEditorView.vue
│   │   ├── RecipeImagePicker.vue
│   │   ├── RecipeBasicsForm.vue
│   │   ├── IngredientEditor.vue
│   │   ├── InstructionEditor.vue
│   │   └── inline form actions
│   ├── MyRecipesView.vue
│   │   ├── inline summary/status filter/pagination
│   │   ├── RecipeSearch.vue
│   │   ├── RecipeCard.vue[] (owner actions)
│   │   └── DeleteConfirmDialog.vue
│   └── NotFoundView.vue → EmptyState.vue
└── inline footer and prototype label
```

Views also render `LoadingState`, `EmptyState`, and `ErrorState` conditionally.
`AppIcon` is reused for decorative icons throughout the tree. All 18 component
files are listed below. Components are Vue `<script setup lang="ts">` SFCs.

## Shared components

| Component | Actual props (defaults) | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `AppIcon.vue` | `name: string`, `size?: number` (20) | None | Stateless; local icon-path dictionary |
| `AppNavbar.vue` | None | None | Reads user from `useAuthStore` and route from Vue Router; navigates before clearing the mock session, respecting cancelled editor navigation |
| `RecipeCard.vue` | `recipe: Recipe`, `showOwnerActions?: boolean` (false) | `delete(recipeId: string)` | Reads ratings/reviews from `useRecipeStore`; navigates directly with RouterLink for view/edit; parent handles delete intent |
| `RatingStars.vue` | `value: number`, `readOnly?: boolean` (true) | `change(value: number)` | Parent owns selected value; editable mode uses five radio inputs. Read-only glyphs round to the nearest whole star; numeric/accessible averages retain one decimal |
| `RecipeSearch.vue` | `modelValue: string`, `placeholder?: string` ("What would you like to cook?"), `label?: string` ("Search recipes") | `update:modelValue(value: string)`, `submit()` | Parent owns search text; native search form emits submit |
| `LoadingState.vue` | `message?: string` ("Gathering something delicious…") | None | Parent decides visibility; announces status |
| `EmptyState.vue` | `title?: string` ("No recipes here yet"), `detail?: string` ("Try another search or category.") | None | Parent decides visibility; default slot supplies links/buttons |
| `ErrorState.vue` | `message: string` | `retry()` | Parent/store owns error; parent handles retry |

`AppNavbar` does not receive `user`/`activeRoute` props or emit `logout`.
`RecipeCard` does not emit `open`, `edit`, or `save`; those were proposed interfaces.
`EmptyState` does not emit `retry`.

## Home / Explore — `/`, `/#recipes`

| Component | Actual props | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `HeroSection.vue` | `modelValue: string` | `update:modelValue(value: string)`, `search()` | Hero copy is fixed; forwards search input and submit intent to HomeView |
| `CategoryFilter.vue` | `categories: string[]`, `selectedCategory: string` | `select(category: string)` | Parent owns selected category; component adds the "All recipes" option |

`HomeView` receives no props and emits no custom events. It owns `search` and
`category`, computes the filtered recipes, and reads request state from
`useRecipeStore`. Route query `mock=error|empty` selects demonstrable request states.
The recipe grid is inline; no `RecipeGrid.vue` exists.

## Recipe Details — `/recipes/:id`

| Component | Actual props (defaults) | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `ReviewSection.vue` | `recipeId: string` | None | Reads user from auth store and reviews from recipe store; owns editing review, deletion target, pending/error/success state and form reset key; invokes store mutations |
| `ReviewForm.vue` | `submitting: boolean`, `initialRating?: number` (0), `initialComment?: string` (empty), `editing?: boolean` (false) | `submit({ rating: number, comment: string })`, `cancel()` | Owns draft rating/comment and validation error; initializes from editing props |

`RecipeDetailView` receives no props and emits no custom events. It reads `id` from
Vue Router, selects the recipe from `useRecipeStore`, and owns the checked ingredient
indexes. Header, single image, author, timing, ingredient list and cooking steps are
inline. There is no gallery, selected-image state, or active detail-tab state.
There are no `RecipeHeader`, `RecipeGallery`, `IngredientList`, `CookingSteps`, or
`ReviewCard` component files; the equivalent display content is in the view/section.

## Login / Register — `/auth`

| Component | Actual props | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `AuthForm.vue` | `mode: 'login' \| 'register'`, `pending: boolean`, `error: string` | `submit({ name: string, email: string, password: string })` | Owns name/email/password/confirmation fields, field errors and password visibility; confirmation stays local |

`AuthView` receives no props and emits no custom events. It derives the mode from
query `tab=register`, submits through `useAuthStore`, and handles a local `returnTo`
query after success. The account-mode buttons are inline. One `AuthForm` implements
both forms; there are no `AuthTabs`, `LoginForm`, or `RegisterForm` files.

## Create / Edit Recipe — `/recipes/new`, `/recipes/:id/edit`

`/recipes/create` is an alias of `/recipes/new`.

| Component | Actual props | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `RecipeImagePicker.vue` | `previewUrl: string` | `fileSelected(file: File)`, `clear()` | Parent owns accepted image/data URL; picker owns type/size error and native file input, reset after selection so the same file can be chosen again |
| `RecipeBasicsForm.vue` | `modelValue: RecipeDraft`, `errors: FormErrors` | `update:modelValue(draft: RecipeDraft)` | Parent owns the complete draft and errors; fields emit an updated draft |
| `IngredientEditor.vue` | `modelValue: Ingredient[]`, `error?: string` | `update:modelValue(ingredients: Ingredient[])` | Parent owns the array; add/update/remove each emit a new array |
| `InstructionEditor.vue` | `modelValue: string[]`, `error?: string` | `update:modelValue(instructions: string[])` | Parent owns steps; add/update/remove each emit a new array |

`RecipeEditorView` receives no props and emits no custom events. It reads optional
route `id`, owns draft/errors/attempted/submitting/readiness/ownership-denial state,
and invokes `useRecipeStore.save`. It owns FileReader/image decoding, pending image
state, and a request counter so stale selections cannot replace the latest choice.
It owns the original snapshot/dirty state and guards route leave/update.
The picker checks JPG/PNG/WebP and the 2 MB limit; the view decodes the file before
accepting a preview. Publish/Cancel actions are inline, not `FormActions.vue`.

## My Recipes — `/my-recipes`

| Component | Actual props | Actual emitted events | State ownership |
| --- | --- | --- | --- |
| `DeleteConfirmDialog.vue` | `open: boolean`, `recipeTitle: string`, `pending: boolean`, `error: string` | `confirm()`, `cancel()` | Parent owns target/pending/error; dialog owns DOM refs, modal visibility synchronization and initial safe focus |

`MyRecipesView` receives no props and emits no custom events. It reads the current
user and shared recipes, owns `search`, `status`, `page`, deletion target and action
status/error/success text. Summary counts and the grid are computed inline; Drafts
is zero because draft saving is deferred. Status select and pagination are inline.
There are no `RecipeSummary`, `StatusFilter`, or `MyRecipeGrid` component files.
`NotFoundView` has no props/emits/local state and provides a home link via EmptyState.

## Pinia, mock services and model ownership

| Owner | Actual state and actions |
| --- | --- |
| `useAuthStore` (`stores/auth.ts`) | `user: User \| null`, `pending`, `error`; `submit(mode, { name?, email, password })`, `logout()` |
| `useRecipeStore` (`stores/recipes.ts`) | `recipes`, `reviews`, `loading`, `loaded`, `error`; request sequence counter; `load(mode?)`, `recipeReviews(id)`, `rating(id)`, `save(draft, id?)`, `remove(id)`, `saveReview(recipeId, rating, comment, id?)`, `removeReview(id)` |
| `mockAuthService` | Promise-based login/register; clears mock session on logout |
| `mockRecipeService` | Promise-based list/save/remove and review save/remove; validates inputs and checks mock session/ownership |
| `mockDatabase` | In-memory recipes, reviews, account records, current session; 220 ms simulated request delay; seed reset on page refresh |
| Vue Router | Current route/params/query, login return navigation, protected-route guard |

`RecipeDraft`, `Recipe`, `Ingredient`, `Review`, `User`, `MockMode`, `FormErrors`,
categories and average calculation are defined in `types.ts`. Recipe status is
currently only `'published'`; no saved/draft record model is claimed.

## Deferred functionality and limits

Deferred: ADMIN dashboard/moderation/account management, secure backend login and
authorization, database persistence, favorites, social sharing, password recovery,
notifications, draft saving, and a multi-image gallery. Optional network-loaded
fonts have system fallbacks. The five core screens use browser-local mock data,
which resets on refresh. See [implementation scope](m1-implementation.md) and the
[second QA report](m1-qa-review.md) for verification and remaining limitations.
