export interface User {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
}

export interface Ingredient {
  name: string
  quantity: string
  unit: string
}

export interface RecipeDraft {
  title: string
  khmerTitle: string
  description: string
  category: string
  prepTime: number
  cookingTime: number
  servings: number
  imageUrl: string
  ingredients: Ingredient[]
  instructions: string[]
}

export interface Recipe extends RecipeDraft {
  id: string
  userId: string
  author: string
  createdAt: string
  status: 'published'
}

export interface Review {
  id: string
  recipeId: string
  userId: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export type MockMode = 'normal' | 'empty' | 'error'
export type FormErrors = Record<string, string>

export const categories = ['Main Dish', 'Soup', 'Noodle', 'Dessert', 'Snack']

export function averageRating(reviews: Review[]): number {
  return reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0
}
