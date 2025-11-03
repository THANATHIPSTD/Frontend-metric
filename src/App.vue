<script setup lang="ts">
import { RouterView } from 'vue-router'
import WebstoreNavbar from '@/components/WebstoreNavbar.vue'
import WebstoreFooter from '@/components/WebstoreFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <WebstoreNavbar />

    <main class="pt-16 grow">
      <RouterView />
    </main>

    <WebstoreFooter class="mt-auto" />
  </div>
</template>
