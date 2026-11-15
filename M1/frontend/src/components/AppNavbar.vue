<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppIcon from './AppIcon.vue'
const auth = useAuthStore()
const router = useRouter()
async function logout() {
  // The editor may cancel navigation to preserve an unsaved recipe.
  if (router.currentRoute.value.path !== '/' && (await router.push('/'))) return
  auth.logout()
}
</script>

<template>
  <header class="site-header">
    <div class="nav-inner">
      <RouterLink to="/" class="brand" aria-label="ShareMhob home"
        ><span class="brand-icon"><AppIcon name="chef" :size="29" /></span
        ><span
          >Share<span class="brand-accent">Mhob</span
          ><small>FROM OUR KITCHENS, WITH LOVE</small></span
        ></RouterLink
      >
      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/#recipes">Explore</RouterLink>
        <RouterLink to="/my-recipes" active-class="active">My Recipes</RouterLink>
      </nav>
      <div class="nav-account">
        <template v-if="auth.user"
          ><span class="nav-name">Hi, {{ auth.user.name }}</span
          ><button class="icon-button logout-button" aria-label="Log out" @click="logout">
            <AppIcon name="logout" /></button
          ><RouterLink to="/recipes/new" class="button small"
            ><AppIcon name="plus" :size="17" /><span>Share a recipe</span></RouterLink
          ></template
        >
        <template v-else
          ><RouterLink to="/auth" class="login-link">Log in</RouterLink
          ><RouterLink to="/auth?tab=register" class="button small"
            >Join the table <AppIcon name="arrow" :size="16" /></RouterLink
        ></template>
      </div>
    </div>
  </header>
</template>
