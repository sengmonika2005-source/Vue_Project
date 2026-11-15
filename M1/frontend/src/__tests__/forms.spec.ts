import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthForm from '@/components/AuthForm.vue'
import ReviewForm from '@/components/ReviewForm.vue'
import IngredientEditor from '@/components/IngredientEditor.vue'

describe('form behavior', () => {
  it('shows registration errors and rejects mismatched passwords', async () => {
    const wrapper = mount(AuthForm, { props: { mode: 'register', pending: false, error: '' } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Please enter your name')
    expect(wrapper.text()).toContain('valid email')
    expect(wrapper.emitted('submit')).toBeUndefined()
    await wrapper.get('#account-name').setValue('New Cook')
    await wrapper.get('#account-email').setValue('new@example.test')
    await wrapper.get('#account-password').setValue('Password123!')
    await wrapper.get('#account-confirm').setValue('Different123!')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('passwords do not match')
    await wrapper.get('#account-confirm').setValue('Password123!')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')?.length).toBe(1)
  })
  it('requires a rating and comment, then emits a valid review', async () => {
    const wrapper = mount(ReviewForm, { props: { submitting: false } })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.text()).toContain('Choose a rating')
    await wrapper.get('input[value="5"]').setValue(true)
    await wrapper.get('textarea').setValue('Made this for my family.')
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]).toEqual([
      { rating: 5, comment: 'Made this for my family.' },
    ])
  })
  it('adds an ingredient without mutating the parent array', async () => {
    const ingredients = [{ name: 'Rice', quantity: '1', unit: 'cup' }]
    const wrapper = mount(IngredientEditor, { props: { modelValue: ingredients } })
    await wrapper.get('.add-row').trigger('click')
    expect(ingredients).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toHaveLength(2)
  })
})
