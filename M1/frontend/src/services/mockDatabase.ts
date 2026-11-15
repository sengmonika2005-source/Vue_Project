import { demoUser, seedRecipes, seedReviews } from '@/data/recipes'
import type { Recipe, Review, User } from '@/types'

export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T
export const wait = () => new Promise((resolve) => setTimeout(resolve, 220))

// M1-only memory. Never use this credential handling as production authentication.
export const database: {
  recipes: Recipe[]
  reviews: Review[]
  accounts: { user: User; password: string }[]
  session: User | null
} = { recipes: [], reviews: [], accounts: [], session: null }

export function resetMockDatabase() {
  database.recipes = clone(seedRecipes)
  database.reviews = clone(seedReviews)
  database.accounts = [{ user: clone(demoUser), password: 'Cook123!' }]
  database.session = null
}

export function requireUser(): User {
  if (!database.session) throw new Error('Please sign in to continue.')
  return database.session
}

resetMockDatabase()
