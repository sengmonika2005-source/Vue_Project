<script setup lang="ts">
import { ref, watch } from 'vue'
import RatingStars from './RatingStars.vue'
import { validateReview } from '@/utils/validation'
const props = withDefaults(
  defineProps<{
    submitting: boolean
    initialRating?: number
    initialComment?: string
    editing?: boolean
  }>(),
  { initialRating: 0, initialComment: '', editing: false },
)
const emit = defineEmits<{ submit: [payload: { rating: number; comment: string }]; cancel: [] }>()
const rating = ref(props.initialRating)
const comment = ref(props.initialComment)
const error = ref('')
watch(
  () => [props.initialRating, props.initialComment],
  () => {
    rating.value = props.initialRating
    comment.value = props.initialComment
    error.value = ''
  },
)
function submit() {
  error.value = validateReview(rating.value, comment.value)
  if (!error.value) emit('submit', { rating: rating.value, comment: comment.value })
}
</script>
<template>
  <form class="review-form" novalidate @submit.prevent="submit">
    <h3>{{ editing ? 'Edit your review' : 'Cooked this? Tell us how it went.' }}</h3>
    <span class="field-label">Your rating</span
    ><RatingStars :value="rating" :read-only="false" @change="rating = $event" /><label
      for="review-comment"
      >Your experience</label
    ><textarea
      id="review-comment"
      v-model="comment"
      rows="3"
      maxlength="2000"
      placeholder="A family favorite? A little twist? We’d love to hear."
      :aria-invalid="!!error"
      :aria-describedby="error ? 'review-form-error' : undefined"
    />
    <p v-if="error" id="review-form-error" class="field-error" role="alert">{{ error }}</p>
    <div class="review-form-actions">
      <span>{{ comment.length }}/2000</span
      ><button
        v-if="editing"
        type="button"
        class="button secondary small"
        :disabled="submitting"
        @click="emit('cancel')"
      >
        Cancel</button
      ><button class="button small" type="submit" :disabled="submitting">
        {{ submitting ? 'Saving…' : editing ? 'Update review' : 'Post review' }}
      </button>
    </div>
  </form>
</template>
