<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthForm from '@/components/AuthForm.vue'
import AppIcon from '@/components/AppIcon.vue'
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const mode = computed(() => (route.query.tab === 'register' ? 'register' : 'login'))
watch(mode, () => {
  auth.error = ''
})
function changeTab(tab: 'login' | 'register') {
  router.replace({ query: { ...route.query, tab } })
}
async function submit(payload: { name: string; email: string; password: string }) {
  if (await auth.submit(mode.value, payload)) {
    const returnTo = typeof route.query.returnTo === 'string' ? route.query.returnTo : '/my-recipes'
    await router.push(
      returnTo.startsWith('/') &&
        !returnTo.startsWith('//') &&
        !returnTo.includes('\\') &&
        !returnTo.startsWith('/auth')
        ? returnTo
        : '/my-recipes',
    )
  }
}
</script>
<template>
  <main class="page auth-page">
    <section class="auth-story">
      <span class="eyebrow">FOOD TASTES BETTER TOGETHER</span>
      <h1>Good recipes.<br />Great company.<br /><em>A little taste of home.</em></h1>
      <p>From family kitchens to new traditions.<br />Come share something delicious.</p>
      <div class="auth-illustration">
        <img
          src="/images/green-noodles.svg"
          alt="Illustration of fresh Khmer noodles and herbs"
        /><span class="auth-art-note">Made to be shared.</span>
      </div>
      <div class="story-caption">
        <AppIcon name="leaf" />Rooted in Khmer culture. Open to everyone.
      </div>
    </section>
    <section class="auth-panel">
      <template v-if="auth.user"
        ><div class="state-box">
          <h2>You’re already at the table.</h2>
          <p>Signed in as {{ auth.user.name }}.</p>
          <RouterLink to="/my-recipes" class="button">Go to my recipes</RouterLink>
        </div></template
      ><template v-else
        ><div class="auth-tabs" role="group" aria-label="Account access">
          <button
            :class="{ selected: mode === 'login' }"
            :aria-pressed="mode === 'login'"
            :disabled="auth.pending"
            @click="changeTab('login')"
          >
            Log in</button
          ><button
            :class="{ selected: mode === 'register' }"
            :aria-pressed="mode === 'register'"
            :disabled="auth.pending"
            @click="changeTab('register')"
          >
            Create account
          </button>
        </div>
        <AuthForm
          :key="mode"
          :mode="mode"
          :pending="auth.pending"
          :error="auth.error"
          @submit="submit"
      /></template>
    </section>
  </main>
</template>
