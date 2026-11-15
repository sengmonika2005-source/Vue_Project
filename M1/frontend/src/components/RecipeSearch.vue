<script setup lang="ts">
import AppIcon from './AppIcon.vue'
withDefaults(defineProps<{ modelValue: string; placeholder?: string; label?: string }>(), {
  placeholder: 'What would you like to cook?',
  label: 'Search recipes',
})
defineEmits<{ 'update:modelValue': [value: string]; submit: [] }>()
</script>
<template>
  <form role="search" class="recipe-search" @submit.prevent="$emit('submit')">
    <AppIcon name="search" /><input
      type="search"
      :aria-label="label"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    /><button class="button small" type="submit">Search</button>
  </form>
</template>
