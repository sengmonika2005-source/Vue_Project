<script setup lang="ts">
import EmptyState from '@/components/EmptyState.vue'
</script>
<template>
  <main class="page">
    <EmptyState
      title="This page isn’t on the menu"
      detail="The link may have changed. There are plenty of good recipes back home."
      ><RouterLink to="/" class="button">Explore recipes</RouterLink></EmptyState
    >
  </main>
</template>
