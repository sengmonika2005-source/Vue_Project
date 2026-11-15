<script setup lang="ts">
import AppIcon from './AppIcon.vue'
defineProps<{ categories: string[]; selectedCategory: string }>()
defineEmits<{ select: [category: string] }>()
const icons: Record<string, string> = {
  'All recipes': 'book',
  'Main Dish': 'bowl',
  Soup: 'bowl',
  Noodle: 'chef',
  Dessert: 'leaf',
  Snack: 'leaf',
}
</script>
<template>
  <div class="category-filter" aria-label="Food categories">
    <button
      v-for="category in ['All recipes', ...categories]"
      :key="category"
      :class="{ selected: selectedCategory === category }"
      :aria-pressed="selectedCategory === category"
      @click="$emit('select', category)"
    >
      <AppIcon :name="icons[category] || 'bowl'" :size="19" />{{ category }}
    </button>
  </div>
</template>
