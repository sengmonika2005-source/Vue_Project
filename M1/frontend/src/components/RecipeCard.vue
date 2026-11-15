<script setup lang="ts">
import type { Recipe } from '@/types'
import { useRecipeStore } from '@/stores/recipes'
import AppIcon from './AppIcon.vue'
import RatingStars from './RatingStars.vue'
withDefaults(defineProps<{ recipe: Recipe; showOwnerActions?: boolean }>(), {
  showOwnerActions: false,
})
defineEmits<{ delete: [recipeId: string] }>()
const store = useRecipeStore()
</script>
<template>
  <article class="recipe-card">
    <RouterLink
      :to="`/recipes/${recipe.id}`"
      class="card-image-link"
      :aria-label="`View ${recipe.title}`"
      ><img
        class="card-image"
        :src="recipe.imageUrl"
        :alt="`Illustration of ${recipe.title}`"
        loading="lazy"
      /><span class="card-category">{{
        showOwnerActions ? 'Published' : recipe.category
      }}</span></RouterLink
    >
    <div class="card-body">
      <div class="card-rating">
        <RatingStars :value="store.rating(recipe.id)" /><span
          >{{ store.rating(recipe.id) ? store.rating(recipe.id).toFixed(1) : 'New' }}
          <span class="muted">({{ store.recipeReviews(recipe.id).length }})</span></span
        >
      </div>
      <h3>
        <RouterLink :to="`/recipes/${recipe.id}`">{{ recipe.title }}</RouterLink>
      </h3>
      <p class="khmer-title" lang="km">{{ recipe.khmerTitle }}</p>
      <p class="card-description">{{ recipe.description }}</p>
      <div class="card-meta">
        <span
          ><AppIcon name="clock" :size="15" />{{ recipe.prepTime + recipe.cookingTime }} min</span
        ><span>by {{ recipe.author }}</span>
      </div>
      <div v-if="showOwnerActions" class="owner-actions">
        <RouterLink :to="`/recipes/${recipe.id}`" class="button secondary small"
          ><AppIcon name="eye" :size="16" />View</RouterLink
        ><RouterLink :to="`/recipes/${recipe.id}/edit`" class="button secondary small"
          ><AppIcon name="edit" :size="16" />Edit</RouterLink
        ><button
          class="button danger-ghost small"
          :aria-label="`Delete ${recipe.title}`"
          @click="$emit('delete', recipe.id)"
        >
          <AppIcon name="trash" :size="16" />Delete
        </button>
      </div>
      <RouterLink v-else :to="`/recipes/${recipe.id}`" class="card-cta"
        >View recipe <AppIcon name="arrow" :size="17"
      /></RouterLink>
    </div>
  </article>
</template>
