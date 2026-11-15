import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import RecipeEditorView from '@/views/RecipeEditorView.vue'
import RecipeImagePicker from '@/components/RecipeImagePicker.vue'
import { useAuthStore } from '@/stores/auth'
import { resetMockDatabase, requireUser } from '@/services/mockDatabase'

const wrappers: VueWrapper[] = []
beforeEach(() => {
  resetMockDatabase()
})
afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers.length = 0
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function openEditor() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const auth = useAuthStore()
  await auth.submit('login', { email: 'cook@sharemhob.test', password: 'Cook123!' })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<h1>Home</h1>' } },
      { path: '/recipes/new', component: RecipeEditorView },
      { path: '/my-recipes', component: { template: '<h1>My recipes</h1>' } },
      { path: '/auth', component: { template: '<h1>Log in</h1>' } },
    ],
  })
  await router.push('/recipes/new')
  const shell = defineComponent({
    components: { AppNavbar, RouterView },
    template: '<AppNavbar /><RouterView />',
  })
  const wrapper = mount(shell, { global: { plugins: [pinia, router] } })
  wrappers.push(wrapper)
  await flushPromises()
  return { wrapper, router, auth }
}

describe('second QA regression checks', () => {
  it('keeps the mock session and draft when leaving for logout is cancelled', async () => {
    const { wrapper, router, auth } = await openEditor()
    await wrapper.get('#recipe-title').setValue('Unsaved family recipe')
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    await wrapper.get('[aria-label="Log out"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/recipes/new')
    expect(auth.user?.id).toBe('cook-monika')
    expect(requireUser().id).toBe('cook-monika')
    expect((wrapper.get('#recipe-title').element as HTMLInputElement).value).toBe(
      'Unsaved family recipe',
    )
  })
  it('logs out after confirmed navigation, including when already on Home', async () => {
    const { wrapper, router, auth } = await openEditor()
    await wrapper.get('#recipe-title').setValue('Unsaved family recipe')
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    await wrapper.get('[aria-label="Log out"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/')
    expect(auth.user).toBeNull()
    expect(() => requireUser()).toThrow('sign in')
    await auth.submit('login', { email: 'cook@sharemhob.test', password: 'Cook123!' })
    await flushPromises()
    await wrapper.get('[aria-label="Log out"]').trigger('click')
    await flushPromises()
    expect(auth.user).toBeNull()
  })
  it('rejects undecodable images and leaves publishing available', async () => {
    vi.stubGlobal(
      'Image',
      class {
        src = ''
        decode() {
          return Promise.reject(new Error('Invalid image'))
        }
      },
    )
    const { wrapper } = await openEditor()
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      configurable: true,
      value: [new File(['not an image'], 'broken.png', { type: 'image/png' })],
    })
    await input.trigger('change')
    await vi.waitFor(() =>
      expect(wrapper.text()).toContain('Could not read this image. Please choose another.'),
    )
    expect(wrapper.find('img[alt="Selected recipe image preview"]').exists()).toBe(false)
    expect(wrapper.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })
  it('clears the file input so the same image can be selected again', async () => {
    const wrapper = mount(RecipeImagePicker, { props: { previewUrl: '' } })
    wrappers.push(wrapper)
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', {
      value: [new File(['image'], 'dish.png', { type: 'image/png' })],
    })
    Object.defineProperty(input.element, 'value', {
      writable: true,
      value: 'C:\\fakepath\\dish.png',
    })
    await input.trigger('change')
    expect(wrapper.emitted('fileSelected')).toHaveLength(1)
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
