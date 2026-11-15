<script setup lang="ts">
import RecipeSearch from './RecipeSearch.vue'
import AppIcon from './AppIcon.vue'
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string]; search: [] }>()
</script>
<template>
  <section class="hero">
    <div class="hero-content">
      <span class="eyebrow"><span class="tiny-line" />A LITTLE CAMBODIA IN EVERY BITE</span>
      <h1>Discover Khmer<br />flavors. <em>Share yours.</em></h1>
      <p>
        Recipes passed down. Memories made around the table.<br class="desktop-break" />
        Find, cook, and share the food that brings us home.
      </p>
      <RecipeSearch
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        @submit="$emit('search')"
      />
      <div class="hero-note">
        <AppIcon name="leaf" :size="17" /><span>Made with tradition. Shared with love.</span>
      </div>
    </div>
    <div class="hero-art">
      <div class="hero-circle" />
      <img
        src="/images/amok.svg"
        alt="An illustrated bowl of Khmer fish amok with coconut and herbs"
      /><span class="floating-note note-top">A taste of home <span>អាម៉ុកត្រី</span></span
      ><span class="floating-note note-bottom"
        ><span class="note-icon"><AppIcon name="chef" :size="23" /></span
        ><span>From our kitchens<br /><strong>to your table.</strong></span></span
      >
    </div>
  </section>
</template>
