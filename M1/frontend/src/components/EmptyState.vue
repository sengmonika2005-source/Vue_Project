<script setup lang="ts">
import AppIcon from './AppIcon.vue'
withDefaults(defineProps<{ title?: string; detail?: string }>(), {
  title: 'No recipes here yet',
  detail: 'Try another search or category.',
})
</script>
<template>
  <div class="state-box">
    <span class="state-icon"><AppIcon name="bowl" :size="32" /></span>
    <h3>{{ title }}</h3>
    <p>{{ detail }}</p>
    <slot />
  </div>
</template>
