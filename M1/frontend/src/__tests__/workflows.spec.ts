import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockAuthService } from '@/services/mockAuthService'
import { resetMockDatabase } from '@/services/mockDatabase'
import { mockRecipeService } from '@/services/mockRecipeService'
import { useRecipeStore } from '@/stores/recipes'
import { seedRecipes } from '@/data/recipes'
import { averageRating, type RecipeDraft } from '@/types'

beforeEach(() => {
  resetMockDatabase()
  setActivePinia(createPinia())
})
const login = () => mockAuthService.login('cook@sharemhob.test', 'Cook123!')
function draft(): RecipeDraft {
  return {
    title: 'Family curry',
    khmerTitle: '',
    description: 'A family recipe.',
    category: 'Main Dish',
    prepTime: 10,
    cookingTime: 20,
    servings: 2,
    imageUrl: '',
    ingredients: [{ name: 'Coconut milk', quantity: '200', unit: 'ml' }],
    instructions: ['Simmer until ready.'],
  }
}

describe('M1 account workflows', () => {
  it('rejects invalid credentials and logs the demo cook in', async () => {
    await expect(mockAuthService.login('cook@sharemhob.test', 'wrong')).rejects.toThrow(
      'do not match',
    )
    expect((await login()).name).toBe('Monika')
  })
  it('registers an account, rejects duplicates, and logs in again', async () => {
    const user = await mockAuthService.register('New Cook', 'NEW@example.test', 'Test123!')
    expect(user.email).toBe('new@example.test')
    await expect(
      mockAuthService.register('Another', 'new@example.test', 'Test123!'),
    ).rejects.toThrow('already uses')
    mockAuthService.logout()
    expect((await mockAuthService.login('new@example.test', 'Test123!')).id).toBe(user.id)
  })
})
describe('M1 recipe workflows', () => {
  it('allows anonymous browsing but requires sign-in for publishing', async () => {
    expect((await mockRecipeService.list()).recipes.length).toBe(6)
    await expect(mockRecipeService.save(draft())).rejects.toThrow('sign in')
  })
  it('publishes, edits, and deletes a recipe with related reviews', async () => {
    await login()
    const recipe = await mockRecipeService.save(draft())
    const updated = await mockRecipeService.save(
      { ...draft(), title: 'Updated family curry' },
      recipe.id,
    )
    expect(updated.id).toBe(recipe.id)
    expect(updated.title).toBe('Updated family curry')
    await mockRecipeService.saveReview(recipe.id, 5, 'Wonderful!')
    await mockRecipeService.remove(recipe.id)
    const result = await mockRecipeService.list()
    expect(result.recipes.some((item) => item.id === recipe.id)).toBe(false)
    expect(result.reviews.some((item) => item.recipeId === recipe.id)).toBe(false)
  })
  it('rejects edits and deletes of another cook’s recipe', async () => {
    await login()
    await expect(mockRecipeService.save(draft(), 'fish-amok')).rejects.toThrow('own recipes')
    await expect(mockRecipeService.remove('fish-amok')).rejects.toThrow('own recipes')
    expect(
      (await mockRecipeService.list()).recipes.find((item) => item.id === 'fish-amok')?.title,
    ).toBe('Fish Amok')
  })
  it('rejects incomplete recipes and invalid numbers without saving', async () => {
    await login()
    for (const invalid of [
      { ...draft(), title: ' ' },
      { ...draft(), ingredients: [] },
      { ...draft(), instructions: [''] },
      { ...draft(), servings: 0 },
      { ...draft(), cookingTime: NaN },
    ])
      await expect(mockRecipeService.save(invalid)).rejects.toThrow()
    expect((await mockRecipeService.list()).recipes.length).toBe(6)
  })
  it('handles loading errors, recovery, and empty states through the store', async () => {
    const store = useRecipeStore()
    const request = store.load('error')
    expect(store.loading).toBe(true)
    await request
    expect(store.loading).toBe(false)
    expect(store.error).toContain('could not load')
    await store.load()
    expect(store.error).toBe('')
    expect(store.recipes.length).toBe(6)
    await store.load('empty')
    expect(store.recipes).toEqual([])
  })
})
describe('M1 review workflows', () => {
  it('requires sign-in and rejects ratings outside the integer 1–5 range', async () => {
    await expect(mockRecipeService.saveReview('fish-amok', 5, 'Good')).rejects.toThrow('sign in')
    await login()
    for (const rating of [0, 6, 2.5, NaN])
      await expect(mockRecipeService.saveReview('fish-amok', rating, 'Good')).rejects.toThrow(
        '1 to 5',
      )
    await expect(mockRecipeService.saveReview('fish-amok', 5, ' ')).rejects.toThrow(
      'Write a few words',
    )
    await expect(mockRecipeService.saveReview('missing', 5, 'Good')).rejects.toThrow(
      'could not be found',
    )
  })
  it('updates the average when a review is added, edited, and removed', async () => {
    await login()
    const store = useRecipeStore()
    await store.load()
    expect(store.rating('fish-amok')).toBe(4.5)
    await store.saveReview('fish-amok', 3, 'My experience')
    expect(store.rating('fish-amok')).toBe(4)
    const review = store.reviews.find((item) => item.comment === 'My experience')!
    await store.saveReview('fish-amok', 5, 'Even better the second time', review.id)
    expect(store.rating('fish-amok')).toBeCloseTo(14 / 3)
    await store.removeReview(review.id)
    expect(store.rating('fish-amok')).toBe(4.5)
  })
  it('prevents modifying another user’s review', async () => {
    await login()
    await expect(
      mockRecipeService.saveReview('fish-amok', 1, 'Changed', 'review-1'),
    ).rejects.toThrow('own reviews')
    await expect(mockRecipeService.removeReview('review-1')).rejects.toThrow('own reviews')
  })
  it('does not leak changes into seed data and handles unrated recipes', async () => {
    await login()
    const original = seedRecipes.find((item) => item.id === 'bai-sach-chrouk')!.title
    await mockRecipeService.save(draft(), 'bai-sach-chrouk')
    expect(seedRecipes.find((item) => item.id === 'bai-sach-chrouk')!.title).toBe(original)
    expect(averageRating([])).toBe(0)
  })
})
