<script setup lang="ts">
withDefaults(defineProps<{ value: number; readOnly?: boolean }>(), { readOnly: true })
defineEmits<{ change: [value: number] }>()
</script>

<template>
  <span
    v-if="readOnly"
    class="rating-stars"
    role="img"
    :aria-label="`${value.toFixed(1)} out of 5 stars`"
    ><span v-for="star in 5" :key="star" :class="{ filled: star <= Math.round(value) }"
      >★</span
    ></span
  >
  <fieldset v-else class="star-picker">
    <legend class="sr-only">Your rating</legend>
    <label v-for="star in 5" :key="star" :class="{ filled: star <= value }"
      ><input
        type="radio"
        name="review-rating"
        :value="star"
        :checked="value === star"
        :aria-label="`${star} ${star === 1 ? 'star' : 'stars'}`"
        @change="$emit('change', star)"
      /><span aria-hidden="true">★</span></label
    >
  </fieldset>
</template>
