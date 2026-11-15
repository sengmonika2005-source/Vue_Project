import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { mockAuthService } from '@/services/mockAuthService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const pending = ref(false)
  const error = ref('')
  async function submit(
    mode: 'login' | 'register',
    payload: { name?: string; email: string; password: string },
  ) {
    pending.value = true
    error.value = ''
    try {
      user.value =
        mode === 'login'
          ? await mockAuthService.login(payload.email, payload.password)
          : await mockAuthService.register(payload.name ?? '', payload.email, payload.password)
      return true
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'Could not sign in. Please try again.'
      return false
    } finally {
      pending.value = false
    }
  }
  function logout() {
    mockAuthService.logout()
    user.value = null
    error.value = ''
  }
  return { user, pending, error, submit, logout }
})
