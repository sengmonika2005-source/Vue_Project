import type { User } from '@/types'
import { validEmail } from '@/utils/validation'
import { clone, database, wait } from './mockDatabase'

export const mockAuthService = {
  async login(email: string, password: string): Promise<User> {
    await wait()
    const account = database.accounts.find(
      (account) =>
        account.user.email === email.trim().toLowerCase() && account.password === password,
    )
    if (!account) throw new Error('That email and password do not match. Please try again.')
    database.session = clone(account.user)
    return clone(account.user)
  },
  async register(name: string, email: string, password: string): Promise<User> {
    await wait()
    email = email.trim().toLowerCase()
    if (!name.trim() || !validEmail(email) || password.length < 8)
      throw new Error('Enter a name, valid email, and password of at least 8 characters.')
    if (database.accounts.some((account) => account.user.email === email))
      throw new Error('An account already uses this email. Try signing in.')
    const user: User = { id: crypto.randomUUID(), name: name.trim(), email, role: 'USER' }
    database.accounts.push({ user, password })
    database.session = clone(user)
    return clone(user)
  },
  logout() {
    database.session = null
  },
}
