<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import WebstoreNavbar from '@/components/WebstoreNavbar.vue'
import WebstoreFooter from '@/components/WebstoreFooter.vue'

const route = useRoute()

const bgClass = computed(() => {
  const name = String(route.name ?? '').toLowerCase()
  const map: Record<string, string> = {
    home: 'from-sky-50 via-white to-indigo-50',
    collection: 'from-indigo-50 via-white to-violet-50',
    browse: 'from-emerald-50 via-white to-teal-50',
    'browse-category': 'from-emerald-50 via-white to-teal-50',
    'product-detail': 'from-slate-50 via-white to-slate-100',
    cart: 'from-amber-50 via-white to-yellow-50',
    thankyou: 'from-emerald-50 via-white to-green-50',
    profile: 'from-pink-100 via-white to-fuchsia-100',
    history: 'from-gray-100 via-white to-slate-200',
    'backoffice-layout': 'from-zinc-50 via-white to-zinc-100',
    'blackoffice-layout': 'from-zinc-50 via-white to-zinc-100',
  }
  return `bg-gradient-to-br ${map[name] ?? 'from-slate-50 via-white to-slate-100'}`
})
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors duration-500" :class="bgClass">
    <WebstoreNavbar />
    <main class="pt-16 grow">
      <Transition name="fade" mode="out-in">
        <RouterView :key="$route.fullPath" />
      </Transition>
    </main>
    <WebstoreFooter class="mt-auto" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
