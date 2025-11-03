<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService, { type Category } from '@/services/apiService'
import CollectionCard from '@/components/CollectionCard.vue'

const categories = ref<Category[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    categories.value = await apiService.fetchCategories()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-50">
    <section class="max-w-7xl mx-auto px-4 md:px-8 py-14">
      <header class="mb-10 text-center">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900">
          Collections
        </h1>
      </header>

      <!-- Loading skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="n in 6"
          :key="n"
          class="rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden"
        >
          <div class="aspect-video w-full bg-neutral-100 animate-pulse"></div>
          <div class="p-6">
            <div class="h-7 w-2/3 bg-neutral-200 rounded animate-pulse"></div>
            <div class="mt-3 h-4 w-1/2 bg-neutral-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <CollectionCard v-for="cat in categories" :key="cat.id" :category="cat" />
      </div>
    </section>
  </div>
</template>
