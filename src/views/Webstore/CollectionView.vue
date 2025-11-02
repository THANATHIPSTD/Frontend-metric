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
  <div class="p-4 md:p-12 bg-white rounded-3xl shadow-md my-12 max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-center mb-16">COLLECTION</h1>

    <div v-if="isLoading" class="flex flex-wrap justify-center gap-6">
      <div v-for="n in 5" :key="n" class="w-full sm:w-72 md:w-90">
        <div
          class="relative block aspect-4/3 rounded-2xl overflow-hidden shadow-lg animate-pulse bg-gray-100"
        >
          <div class="absolute inset-0 bg-gray-200"></div>

          <div></div>

          <div class="absolute bottom-0 left-0 p-4 md:p-6">
            <div class="h-8 md:h-10 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-center gap-6 mb-10">
      <div v-for="cat in categories" :key="cat.id" class="w-full sm:w-72 md:w-90">
        <CollectionCard :category="cat" />
      </div>
    </div>
  </div>
</template>
