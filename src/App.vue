<script setup lang="ts">
import { RouterView } from 'vue-router'
import WebstoreNavbar from '@/components/WebstoreNavbar.vue'
import WebstoreFooter from '@/components/WebstoreFooter.vue'
</script>

<template>
  <WebstoreNavbar />

  <main class="pt-16">
    <RouterView />
  </main>

  <WebstoreFooter />
</template>
