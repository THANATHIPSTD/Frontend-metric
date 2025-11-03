<script setup lang="ts">
import BackofficeSidebar from '@/components/Backoffice/BackofficeSidebar.vue'
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <BackofficeSidebar />

    <main class="flex-1 p-10">
      <div class="bg-zinc-100 rounded-3xl shadow-xl min-h-[calc(100vh-64px)]">
        <RouterView />
      </div>
    </main>
  </div>
</template>
