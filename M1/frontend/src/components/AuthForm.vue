<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { validEmail } from '@/utils/validation'
import type { FormErrors } from '@/types'
import AppIcon from './AppIcon.vue'
const props = defineProps<{ mode: 'login' | 'register'; pending: boolean; error: string }>()
const emit = defineEmits<{ submit: [payload: { name: string; email: string; password: string }] }>()
const fields = reactive({ name: '', email: '', password: '', confirm: '' })
const errors = ref<FormErrors>({})
const visible = ref(false)
const isRegister = computed(() => props.mode === 'register')
function submit() {
  const next: FormErrors = {}
  if (isRegister.value && !fields.name.trim()) next.name = 'Please enter your name.'
  if (!validEmail(fields.email)) next.email = 'Please enter a valid email address.'
  if (isRegister.value ? fields.password.length < 8 : !fields.password)
    next.password = isRegister.value ? 'Use at least 8 characters.' : 'Please enter your password.'
  if (isRegister.value && fields.confirm !== fields.password)
    next.confirm = 'Your passwords do not match.'
  errors.value = next
  if (!Object.keys(next).length)
    emit('submit', {
      name: fields.name.trim(),
      email: fields.email.trim(),
      password: fields.password,
    })
}
function useDemo() {
  fields.email = 'cook@sharemhob.test'
  fields.password = 'Cook123!'
  errors.value = {}
}
</script>
<template>
  <form class="auth-form" novalidate @submit.prevent="submit">
    <h2>{{ isRegister ? 'There’s a seat for you.' : 'Welcome back.' }}</h2>
    <p>
      {{
        isRegister
          ? 'Join a community that cooks from the heart.'
          : 'Your next favorite recipe is waiting.'
      }}
    </p>
    <div v-if="isRegister" class="field">
      <label for="account-name">Full name</label>
      <div class="input-icon">
        <AppIcon name="person" /><input
          id="account-name"
          v-model="fields.name"
          autocomplete="name"
          :aria-invalid="!!errors.name"
          :aria-describedby="errors.name ? 'name-error' : undefined"
          placeholder="Your name"
        />
      </div>
      <span v-if="errors.name" id="name-error" class="field-error">{{ errors.name }}</span>
    </div>
    <div class="field">
      <label for="account-email">Email address</label>
      <div class="input-icon">
        <AppIcon name="mail" /><input
          id="account-email"
          v-model="fields.email"
          type="email"
          autocomplete="email"
          :aria-invalid="!!errors.email"
          :aria-describedby="errors.email ? 'email-error' : undefined"
          placeholder="you@example.com"
        />
      </div>
      <span v-if="errors.email" id="email-error" class="field-error">{{ errors.email }}</span>
    </div>
    <div class="field">
      <label for="account-password">Password</label>
      <div class="input-icon">
        <AppIcon name="lock" /><input
          id="account-password"
          v-model="fields.password"
          :type="visible ? 'text' : 'password'"
          :autocomplete="isRegister ? 'new-password' : 'current-password'"
          :aria-invalid="!!errors.password"
          :aria-describedby="errors.password ? 'password-error' : undefined"
          placeholder="Enter your password"
        /><button
          type="button"
          class="icon-button"
          :aria-label="visible ? 'Hide password' : 'Show password'"
          :aria-pressed="visible"
          @click="visible = !visible"
        >
          <AppIcon name="eye" :size="18" />
        </button>
      </div>
      <span v-if="errors.password" id="password-error" class="field-error">{{
        errors.password
      }}</span>
    </div>
    <div v-if="isRegister" class="field">
      <label for="account-confirm">Confirm password</label
      ><input
        id="account-confirm"
        v-model="fields.confirm"
        :type="visible ? 'text' : 'password'"
        autocomplete="new-password"
        :aria-invalid="!!errors.confirm"
        :aria-describedby="errors.confirm ? 'confirm-error' : undefined"
        placeholder="One more time"
      /><span v-if="errors.confirm" id="confirm-error" class="field-error">{{
        errors.confirm
      }}</span>
    </div>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <button class="button full" :disabled="pending" type="submit">
      {{ pending ? 'Please wait…' : isRegister ? 'Create account' : 'Log in'
      }}<AppIcon v-if="!pending" name="arrow" :size="18" />
    </button>
    <div v-if="!isRegister" class="demo-account">
      <span>Just looking around?</span
      ><button type="button" class="text-button" @click="useDemo">Fill demo account</button
      ><small>cook@sharemhob.test · Cook123!</small>
    </div>
    <p class="auth-fineprint">This is a practice kitchen. Use a made-up email and password.</p>
  </form>
</template>
