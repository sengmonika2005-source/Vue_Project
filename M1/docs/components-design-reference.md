# ShareMhob - M1 Component Trees

**Project:** ShareMhob — Khmer recipe sharing and reviews
**Frontend:** Vue 3, TypeScript, Vue Router, Pinia
**Scope:** Five principal screens. These are **proposed** frontend components and mock state for M1; they do not represent an implemented backend.
**Account roles:** `USER` (Cook), `ADMIN`; anonymous visitors may browse publicly.

## Shared components

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `AppNavbar.vue` | `user`, `activeRoute` | `logout` | `useAuthStore` owns session and role; Vue Router owns route |
| `RecipeCard.vue` | `recipe`, `showOwnerActions=false` | `open(recipeId)`, `save(recipeId)`, `edit(recipeId)`, `delete(recipeId)` | Parent view handles emitted intent; `useRecipeStore` owns recipe data |
| `RatingStars.vue` | `value`, `readOnly=true` | `change(value)` when editable | Parent owns selected rating; recipe data/store owns aggregate rating |
| `LoadingState.vue` | `message` | None | Parent decides when to show |
| `EmptyState.vue` | `title`, `detail` | `retry` | Parent owns loading/empty conditions |
| `ErrorState.vue` | `message` | `retry` | Parent/store owns error |

## 1. Home / Explore — `/`

```text
HomeView.vue
├── AppNavbar.vue
├── HeroSection.vue
│   └── RecipeSearch.vue
├── CategoryFilter.vue
└── RecipeGrid.vue
    ├── RecipeCard.vue (repeated)
    │   └── RatingStars.vue
    ├── LoadingState.vue
    ├── EmptyState.vue
    └── ErrorState.vue
```

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `HomeView.vue` | None | None | Owns search term and selected category; reads recipes/loading/error from `useRecipeStore` |
| `HeroSection.vue` | `title`, `tagline` | None | Stateless; display only |
| `RecipeSearch.vue` | `modelValue` | `update:modelValue`, `submit` | `HomeView` owns search term |
| `CategoryFilter.vue` | `categories`, `selectedCategory` | `select(category)` | `HomeView` owns active filter |
| `RecipeGrid.vue` | `recipes`, `loading`, `error` | `open(recipeId)`, `retry` | `useRecipeStore` owns list and request states |
| `RecipeCard.vue` | `recipe` | `open(recipeId)`, `save(recipeId)` | Parent forwards action; shared store owns recipe data |

## 2. Recipe Details — `/recipes/:id`

```text
RecipeDetailView.vue
├── AppNavbar.vue
├── RecipeHeader.vue
│   ├── RecipeGallery.vue
│   └── RatingStars.vue
├── IngredientList.vue
├── CookingSteps.vue
└── ReviewSection.vue
    ├── ReviewCard.vue (repeated)
    ├── RatingStars.vue
    └── ReviewForm.vue
```

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `RecipeDetailView.vue` | Route param `id` (from Vue Router) | None | Reads selected recipe/reviews/loading/error from `useRecipeStore`; owns active detail tab |
| `RecipeHeader.vue` | `recipe`, `isSaved` | `save`, `share` | `useRecipeStore` (or future favorites state) owns saved status |
| `RecipeGallery.vue` | `images` | `selectImage(index)` | Gallery owns active image index |
| `IngredientList.vue` | `ingredients` | None | Display-only |
| `CookingSteps.vue` | `instructions` | None | Display-only |
| `ReviewSection.vue` | `reviews`, `canReview` | `submitReview(payload)` | `RecipeDetailView` coordinates submission; store owns reviews |
| `ReviewCard.vue` | `review` | None | Display-only |
| `ReviewForm.vue` | `submitting` | `submit({rating,comment})` | Owns draft rating/comment and validation errors |

## 3. Login / Register — `/auth`

```text
AuthView.vue
├── AppNavbar.vue
├── AuthTabs.vue
├── LoginForm.vue
└── RegisterForm.vue
```

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `AuthView.vue` | Optional query `returnTo` | None | Owns active tab (login or register), routes after mock login |
| `AuthTabs.vue` | `activeTab` | `change(tab)` | `AuthView` owns active tab |
| `LoginForm.vue` | `pending`, `error` | `submit({email,password})` | Form owns input values and field errors; `useAuthStore` owns session |
| `RegisterForm.vue` | `pending`, `error` | `submit({name,email,password})` | Form owns input values and validation; `useAuthStore` owns session |

**M1 only:** Use mock account state. Password validation in the browser is UX feedback, not real authentication or authorization.

## 4. Create / Edit Recipe — `/recipes/new`, `/recipes/:id/edit`

```text
RecipeEditorView.vue
├── AppNavbar.vue
├── RecipeImagePicker.vue
├── RecipeBasicsForm.vue
├── IngredientEditor.vue
├── InstructionEditor.vue
└── FormActions.vue
```

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `RecipeEditorView.vue` | Optional route param `id` | None | Owns editable recipe draft, validation errors and submit status; invokes `useRecipeStore` mock create/update |
| `RecipeImagePicker.vue` | `previewUrl` | `fileSelected(file)` | Parent owns selected image/preview URL |
| `RecipeBasicsForm.vue` | `modelValue`, `errors` | `update:modelValue` | Parent owns title, description, category, times and servings |
| `IngredientEditor.vue` | `ingredients` | `add`, `update(index,item)`, `remove(index)` | Parent owns ingredient array |
| `InstructionEditor.vue` | `instructions` | `add`, `update(index,text)`, `remove(index)` | Parent owns instruction steps |
| `FormActions.vue` | `submitting`, `canSave` | `cancel`, `saveDraft`, `publish` | Parent decides what to do; store persists mock recipe data |

## 5. My Recipes — `/my-recipes`

```text
MyRecipesView.vue
├── AppNavbar.vue
├── RecipeSummary.vue
├── RecipeSearch.vue
├── StatusFilter.vue
├── MyRecipeGrid.vue
│   └── RecipeCard.vue (repeated, owner actions)
└── DeleteConfirmDialog.vue
```

| Component | Props | Emitted events | State owner |
|---|---|---|---|
| `MyRecipesView.vue` | None | None | Owns search text, status filter and recipe pending deletion; queries `useRecipeStore` for signed-in user's mock recipes |
| `RecipeSummary.vue` | `total`, `published`, `drafts` | None | Counts computed by parent/store |
| `RecipeSearch.vue` | `modelValue` | `update:modelValue` | `MyRecipesView` owns search |
| `StatusFilter.vue` | `status` | `change(status)` | `MyRecipesView` owns status filter |
| `MyRecipeGrid.vue` | `recipes` | `view`, `edit`, `delete` | Store owns recipes; parent handles actions |
| `DeleteConfirmDialog.vue` | `open`, `recipeTitle` | `confirm`, `cancel` | `MyRecipesView` owns selected deletion target and dialog visibility |

## Notes for implementation

- In M1, the mock service can be `src/services/mockRecipeService.ts`, returning promises to demonstrate loading, error and empty states.
- `useRecipeStore` owns recipes and reviews shared across views; `useAuthStore` owns mock user/session information.
- Actual server-side login, ownership validation and `USER`/`ADMIN` authorization must be implemented during backend integration, not represented as secure in the M1 mock.
- The five wireframes are stored in [wireframes/](wireframes/) (`M1/docs/wireframes/` from the repository root). The Admin Dashboard remains in the project proposal and can be prototyped later.
