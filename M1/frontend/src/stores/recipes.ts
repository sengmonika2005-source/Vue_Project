import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MockMode, Recipe, RecipeDraft, Review } from '@/types'
import { averageRating } from '@/types'
import { mockRecipeService } from '@/services/mockRecipeService'

export const useRecipeStore = defineStore('recipes', () => {
  const recipes = ref<Recipe[]>([])
  const reviews = ref<Review[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const error = ref('')
  let request = 0
  async function load(mode: MockMode = 'normal') {
    const current = ++request
    loading.value = true
    error.value = ''
    try {
      const data = await mockRecipeService.list(mode)
      if (current === request) {
        recipes.value = data.recipes
        reviews.value = data.reviews
        loaded.value = true
      }
    } catch (cause) {
      if (current === request)
        error.value = cause instanceof Error ? cause.message : 'Could not load recipes.'
    } finally {
      if (current === request) loading.value = false
    }
  }
  const recipeReviews = (id: string) => reviews.value.filter((review) => review.recipeId === id)
  const rating = (id: string) => averageRating(recipeReviews(id))
  async function save(draft: RecipeDraft, id?: string) {
    const recipe = await mockRecipeService.save(draft, id)
    await load()
    return recipe
  }
  async function remove(id: string) {
    await mockRecipeService.remove(id)
    await load()
  }
  async function saveReview(recipeId: string, value: number, comment: string, id?: string) {
    await mockRecipeService.saveReview(recipeId, value, comment, id)
    await load()
  }
  async function removeReview(id: string) {
    await mockRecipeService.removeReview(id)
    await load()
  }
  return {
    recipes,
    reviews,
    loading,
    loaded,
    error,
    load,
    recipeReviews,
    rating,
    save,
    remove,
    saveReview,
    removeReview,
  }
})
