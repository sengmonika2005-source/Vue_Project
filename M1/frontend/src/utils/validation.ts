import { categories, type FormErrors, type RecipeDraft } from '@/types'

export const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export function validateRecipe(draft: RecipeDraft): FormErrors {
  const errors: FormErrors = {}
  if (!draft.title.trim()) errors.title = 'Give your recipe a name.'
  if (!draft.description.trim()) errors.description = 'Tell us a little about this dish.'
  if (!categories.includes(draft.category)) errors.category = 'Choose a food category.'
  for (const field of ['prepTime', 'cookingTime', 'servings'] as const) {
    const value = draft[field]
    if (!Number.isInteger(value) || value < (field === 'servings' ? 1 : 0) || value > 10000) {
      errors[field] =
        field === 'servings'
          ? 'Enter a whole number from 1 to 10,000.'
          : 'Enter whole minutes from 0 to 10,000.'
    }
  }
  if (
    !draft.ingredients.length ||
    draft.ingredients.some((item) => !item.name.trim() || !item.quantity.trim())
  ) {
    errors.ingredients = 'Add at least one ingredient. Each ingredient needs a name and quantity.'
  }
  if (!draft.instructions.length || draft.instructions.some((step) => !step.trim())) {
    errors.instructions = 'Add at least one step and complete every instruction.'
  }
  return errors
}

export function validateReview(rating: number, comment: string): string {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return 'Choose a rating from 1 to 5 stars.'
  if (!comment.trim()) return 'Write a few words about your cooking experience.'
  if (comment.trim().length > 2000) return 'Keep your review within 2,000 characters.'
  return ''
}
