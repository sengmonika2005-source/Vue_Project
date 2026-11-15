<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppIcon from '@/components/AppIcon.vue'
</script>
<template>
  <a class="skip-link" href="#main-content">Skip to content</a><AppNavbar />
  <div id="main-content" tabindex="-1"><RouterView /></div>
  <footer class="site-footer">
    <div>
      <RouterLink to="/" class="footer-brand"
        ><AppIcon name="chef" :size="23" />ShareMhob</RouterLink
      >
      <p>Khmer food. Shared stories. A place at the table.</p>
    </div>
    <span
      >Made with love for Khmer cooking.<small
        >ShareMhob · University frontend prototype</small
      ></span
    >
  </footer>
  <div class="prototype-label">M1 PROTOTYPE <span>·</span> Mock data resets on refresh</div>
</template>
