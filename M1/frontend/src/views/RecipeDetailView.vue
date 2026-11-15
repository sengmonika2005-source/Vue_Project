<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRecipeStore } from '@/stores/recipes'
import { useAuthStore } from '@/stores/auth'
import AppIcon from '@/components/AppIcon.vue'
import RatingStars from '@/components/RatingStars.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import ReviewSection from '@/components/ReviewSection.vue'
const store = useRecipeStore()
const auth = useAuthStore()
const route = useRoute()
const recipe = computed(() => store.recipes.find((recipe) => recipe.id === route.params.id))
const checked = ref<number[]>([])
watch(
  () => route.params.id,
  () => {
    checked.value = []
    store.load()
  },
  { immediate: true },
)
</script>
<template>
  <main class="page detail-page">
    <RouterLink to="/#recipes" class="back-link"
      ><AppIcon name="back" :size="18" />Back to recipes</RouterLink
    ><LoadingState v-if="store.loading && !store.loaded" /><ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="store.load()"
    /><EmptyState
      v-else-if="!recipe"
      title="This recipe isn’t on the menu"
      detail="It may have been removed. Let’s find something else to cook."
      ><RouterLink to="/" class="button">Explore recipes</RouterLink></EmptyState
    ><template v-else
      ><section class="recipe-intro">
        <div class="detail-image">
          <img :src="recipe.imageUrl" :alt="`Illustration of ${recipe.title}`" /><span
            class="image-caption"
            >A LITTLE TASTE OF CAMBODIA</span
          >
        </div>
        <div class="detail-heading">
          <span class="eyebrow">{{ recipe.category }} <span class="tiny-dot" /> KHMER KITCHEN</span>
          <h1>{{ recipe.title }}</h1>
          <p class="detail-khmer" lang="km">{{ recipe.khmerTitle }}</p>
          <p class="detail-description">{{ recipe.description }}</p>
          <div class="detail-rating">
            <RatingStars :value="store.rating(recipe.id)" /><strong>{{
              store.rating(recipe.id) ? store.rating(recipe.id).toFixed(1) : 'No ratings yet'
            }}</strong
            ><a href="#review-editor">{{ store.recipeReviews(recipe.id).length }} reviews</a>
          </div>
          <div class="author-line">
            <span class="avatar">{{ recipe.author.charAt(0) }}</span>
            <div>
              From <strong>{{ recipe.author }}’s</strong> kitchen<small
                >Shared
                {{
                  new Date(recipe.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }}</small
              >
            </div>
            <RouterLink
              v-if="auth.user?.id === recipe.userId"
              :to="`/recipes/${recipe.id}/edit`"
              class="button secondary small"
              ><AppIcon name="edit" :size="16" />Edit recipe</RouterLink
            >
          </div>
          <div class="recipe-facts">
            <div>
              <AppIcon name="clock" /><span
                >PREP TIME<strong>{{ recipe.prepTime }} min</strong></span
              >
            </div>
            <div>
              <AppIcon name="bowl" /><span
                >COOK TIME<strong>{{ recipe.cookingTime }} min</strong></span
              >
            </div>
            <div>
              <AppIcon name="users" /><span
                >SERVINGS<strong>{{ recipe.servings }} people</strong></span
              >
            </div>
          </div>
        </div>
      </section>
      <section class="cooking-layout">
        <div class="panel ingredients-panel">
          <div class="panel-heading">
            <AppIcon name="leaf" :size="24" />
            <h2>Ingredients</h2>
          </div>
          <p class="muted">A little preparation goes a long way.</p>
          <ul class="ingredient-list">
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              <label :class="{ checked: checked.includes(index) }"
                ><input v-model="checked" type="checkbox" :value="index" /><span
                  >{{ ingredient.name
                  }}<small>{{ ingredient.quantity }} {{ ingredient.unit }}</small></span
                ></label
              >
            </li>
          </ul>
          <div class="ingredients-note">
            <AppIcon name="check" :size="17" />{{ checked.length }} of
            {{ recipe.ingredients.length }} ingredients ready
          </div>
        </div>
        <div class="panel instructions-panel">
          <div class="panel-heading">
            <AppIcon name="chef" :size="24" />
            <h2>Let’s get cooking</h2>
          </div>
          <p class="muted">Take your time. Enjoy the process.</p>
          <ol class="instruction-list">
            <li v-for="(step, index) in recipe.instructions" :key="index">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <p>{{ step }}</p>
            </li>
          </ol>
          <p class="cooking-signoff">Made with care. Best enjoyed together.</p>
        </div>
      </section>
      <ReviewSection :key="recipe.id" :recipe-id="recipe.id"
    /></template>
  </main>
</template>
