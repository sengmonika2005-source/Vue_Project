<script setup lang="ts">
import AppIcon from './AppIcon.vue'
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div class="state-box" role="alert">
    <span class="state-icon"><AppIcon name="alert" :size="28" /></span>
    <h3>Something went wrong</h3>
    <p>{{ message }}</p>
    <button class="button secondary" @click="$emit('retry')">Try again</button>
  </div>
</template>
