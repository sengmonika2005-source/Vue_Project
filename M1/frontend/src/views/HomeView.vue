<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categories, type MockMode } from '@/types'
import { useRecipeStore } from '@/stores/recipes'
import HeroSection from '@/components/HeroSection.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import RecipeCard from '@/components/RecipeCard.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
const store = useRecipeStore()
const route = useRoute()
const search = ref('')
const category = ref('All recipes')
const filtered = computed(() =>
  store.recipes.filter(
    (recipe) =>
      (category.value === 'All recipes' || recipe.category === category.value) &&
      `${recipe.title} ${recipe.khmerTitle}`
        .toLowerCase()
        .includes(search.value.toLowerCase().trim()),
  ),
)
watch(
  () => route.query.mock,
  (value) => {
    const mode: MockMode = value === 'empty' || value === 'error' ? value : 'normal'
    store.load(mode)
  },
  { immediate: true },
)
function scrollToRecipes() {
  document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' })
}
function clearFilters() {
  search.value = ''
  category.value = 'All recipes'
}
</script>
<template>
  <main class="page home-page">
    <HeroSection v-model="search" @search="scrollToRecipes" />
    <section class="recipe-section" id="recipes">
      <div class="section-heading">
        <div>
          <span class="eyebrow">FIND YOUR NEXT FAVORITE</span>
          <h2>A recipe for every craving</h2>
        </div>
        <p>Good food. Beautiful stories. Khmer roots.</p>
      </div>
      <CategoryFilter
        :categories="categories"
        :selected-category="category"
        @select="category = $event"
      />
      <div class="results-heading">
        <h3>
          {{ category === 'All recipes' ? 'From the community kitchen' : category + ' recipes' }}
        </h3>
        <span>{{ filtered.length }} {{ filtered.length === 1 ? 'recipe' : 'recipes' }}</span>
      </div>
      <LoadingState v-if="store.loading" /><ErrorState
        v-else-if="store.error"
        :message="store.error"
        @retry="store.load()"
      /><EmptyState v-else-if="!filtered.length"
        ><button class="text-button" @click="clearFilters">Clear filters</button></EmptyState
      >
      <div v-else class="recipe-grid">
        <RecipeCard v-for="recipe in filtered" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>
    <section class="community-banner">
      <span class="community-icon">ម្</span>
      <div>
        <span class="eyebrow">EVERY RECIPE HAS A STORY</span>
        <h2>What’s cooking in your kitchen?</h2>
        <p>Your family favorite could become someone else’s new tradition.</p>
      </div>
      <RouterLink to="/recipes/new" class="button"
        >Share your recipe <span aria-hidden="true">↗</span></RouterLink
      >
    </section>
  </main>
</template>
