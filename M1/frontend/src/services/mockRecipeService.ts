import type { MockMode, Recipe, RecipeDraft, Review } from '@/types'
import { validateRecipe, validateReview } from '@/utils/validation'
import { clone, database, requireUser, wait } from './mockDatabase'

function ownedRecipe(id: string): Recipe {
  const user = requireUser()
  const recipe = database.recipes.find((item) => item.id === id)
  if (!recipe) throw new Error('This recipe could not be found.')
  if (recipe.userId !== user.id) throw new Error('You can only change your own recipes.')
  return recipe
}

export const mockRecipeService = {
  async list(mode: MockMode = 'normal'): Promise<{ recipes: Recipe[]; reviews: Review[] }> {
    await wait()
    if (mode === 'error') throw new Error('We could not load the recipes. Please try again.')
    return mode === 'empty'
      ? { recipes: [], reviews: [] }
      : clone({ recipes: database.recipes, reviews: database.reviews })
  },
  async save(draft: RecipeDraft, id?: string): Promise<Recipe> {
    await wait()
    const user = requireUser()
    const errors = validateRecipe(draft)
    if (Object.keys(errors).length) throw new Error(Object.values(errors)[0])
    const existing = id ? ownedRecipe(id) : undefined
    const recipe: Recipe = {
      ...clone(draft),
      title: draft.title.trim(),
      description: draft.description.trim(),
      id: existing?.id ?? crypto.randomUUID(),
      userId: user.id,
      author: user.name,
      status: 'published',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      imageUrl: draft.imageUrl || '/images/amok.svg',
    }
    if (existing) database.recipes.splice(database.recipes.indexOf(existing), 1, recipe)
    else database.recipes.unshift(recipe)
    return clone(recipe)
  },
  async remove(id: string) {
    await wait()
    const recipe = ownedRecipe(id)
    database.recipes.splice(database.recipes.indexOf(recipe), 1)
    database.reviews = database.reviews.filter((review) => review.recipeId !== id)
  },
  async saveReview(
    recipeId: string,
    rating: number,
    comment: string,
    id?: string,
  ): Promise<Review> {
    await wait()
    const user = requireUser()
    if (!database.recipes.some((recipe) => recipe.id === recipeId))
      throw new Error('This recipe could not be found.')
    const error = validateReview(rating, comment)
    if (error) throw new Error(error)
    const existing = id
      ? database.reviews.find((review) => review.id === id && review.recipeId === recipeId)
      : undefined
    if (id && !existing) throw new Error('This review could not be found.')
    if (existing && existing.userId !== user.id)
      throw new Error('You can only change your own reviews.')
    const review: Review = {
      id: existing?.id ?? crypto.randomUUID(),
      recipeId,
      userId: user.id,
      author: user.name,
      rating,
      comment: comment.trim(),
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    }
    if (existing) database.reviews.splice(database.reviews.indexOf(existing), 1, review)
    else database.reviews.unshift(review)
    return clone(review)
  },
  async removeReview(id: string) {
    await wait()
    const user = requireUser()
    const review = database.reviews.find((review) => review.id === id)
    if (!review) throw new Error('This review could not be found.')
    if (review.userId !== user.id) throw new Error('You can only change your own reviews.')
    database.reviews.splice(database.reviews.indexOf(review), 1)
  },
}
