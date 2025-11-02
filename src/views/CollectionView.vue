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
  <div class="p-4 md:p-12 bg-white rounded-2xl shadow-lg my-12 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-16">COLLECTION</h1>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="p-6 bg-gray-100 rounded-lg space-y-4 animate-pulse">
        <div class="h-40 bg-gray-200 rounded-md"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="flex items-center space-x-3 mt-4">
          <div class="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1">
            <div class="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CollectionCard v-for="cat in categories" :key="cat.id" :category="cat" />
    </div>
  </div>
</template>
