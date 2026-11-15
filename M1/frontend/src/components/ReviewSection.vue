<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Review } from '@/types'
import { averageRating } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useRecipeStore } from '@/stores/recipes'
import RatingStars from './RatingStars.vue'
import ReviewForm from './ReviewForm.vue'
import AppIcon from './AppIcon.vue'
const props = defineProps<{ recipeId: string }>()
const auth = useAuthStore()
const store = useRecipeStore()
const reviews = computed(() => store.recipeReviews(props.recipeId))
const editing = ref<Review | null>(null)
const deleting = ref('')
const pending = ref(false)
const error = ref('')
const message = ref('')
const formKey = ref(0)
async function save(payload: { rating: number; comment: string }) {
  pending.value = true
  error.value = ''
  message.value = ''
  try {
    await store.saveReview(props.recipeId, payload.rating, payload.comment, editing.value?.id)
    message.value = editing.value
      ? 'Your review has been updated.'
      : 'Thank you for sharing your experience!'
    editing.value = null
    formKey.value++
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not save your review.'
  } finally {
    pending.value = false
  }
}
async function remove() {
  pending.value = true
  error.value = ''
  message.value = ''
  try {
    await store.removeReview(deleting.value)
    deleting.value = ''
    message.value = 'Your review has been removed.'
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Could not remove your review.'
  } finally {
    pending.value = false
  }
}
function edit(review: Review) {
  editing.value = review
  deleting.value = ''
  document.getElementById('review-editor')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
function requestDelete(id: string) {
  deleting.value = id
  editing.value = null
}
</script>
<template>
  <section class="panel reviews-panel">
    <div class="section-heading compact">
      <div>
        <span class="eyebrow">AROUND THE TABLE</span>
        <h2>
          Community reviews <span class="count-badge">{{ reviews.length }}</span>
        </h2>
      </div>
      <div v-if="reviews.length" class="review-average">
        <strong>{{ averageRating(reviews).toFixed(1) }}</strong
        ><RatingStars :value="averageRating(reviews)" />
      </div>
    </div>
    <p v-if="!reviews.length" class="muted">
      Be the first to share your experience with this recipe.
    </p>
    <article v-for="review in reviews" :key="review.id" class="review-item">
      <span class="avatar">{{ review.author.charAt(0) }}</span>
      <div class="review-body">
        <div class="review-byline">
          <strong>{{ review.author }}</strong
          ><time :datetime="review.createdAt">{{
            new Date(review.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          }}</time>
        </div>
        <RatingStars :value="review.rating" />
        <p>{{ review.comment }}</p>
        <div v-if="auth.user?.id === review.userId" class="review-actions">
          <button class="text-button" :disabled="pending" @click="edit(review)">
            <AppIcon name="edit" :size="14" />Edit</button
          ><button
            class="text-button danger-text"
            :disabled="pending"
            @click="requestDelete(review.id)"
          >
            <AppIcon name="trash" :size="14" />Delete
          </button>
        </div>
        <div
          v-if="deleting === review.id"
          class="inline-confirm"
          role="group"
          aria-label="Confirm review deletion"
        >
          <span>Remove your review?</span
          ><button class="text-button" :disabled="pending" @click="deleting = ''">Keep it</button
          ><button class="text-button danger-text" :disabled="pending" @click="remove">
            {{ pending ? 'Removing…' : 'Yes, remove' }}
          </button>
        </div>
      </div>
    </article>
    <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    <p v-if="message" class="success-message" role="status">{{ message }}</p>
    <div id="review-editor">
      <ReviewForm
        v-if="auth.user"
        :key="formKey"
        :submitting="pending"
        :editing="!!editing"
        :initial-rating="editing?.rating ?? 0"
        :initial-comment="editing?.comment ?? ''"
        @submit="save"
        @cancel="editing = null"
      />
      <div v-else class="review-signin">
        <AppIcon name="chef" :size="26" />
        <div>
          <h3>A good meal starts a conversation.</h3>
          <p>Log in to rate this recipe and leave a review.</p>
        </div>
        <RouterLink
          :to="{ path: '/auth', query: { returnTo: `/recipes/${recipeId}` } }"
          class="button secondary small"
          >Join the conversation</RouterLink
        >
      </div>
    </div>
  </section>
</template>
