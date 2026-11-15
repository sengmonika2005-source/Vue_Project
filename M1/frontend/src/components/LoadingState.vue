<script setup lang="ts">
withDefaults(defineProps<{ message?: string }>(), { message: 'Gathering something delicious…' })
</script>
<template>
  <div class="state-box" role="status">
    <span class="spinner" />
    <h3>{{ message }}</h3>
    <p>A good recipe is worth a little wait.</p>
  </div>
</template>
