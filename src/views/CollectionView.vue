<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService, { type Category } from '@/services/apiService'

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
    <h1 class="text-3xl font-bold text-center mb-16">COLLECTION</h1>

    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="n in 6"
        :key="n"
        class="rounded-2xl aspect-4/3 bg-gray-100 overflow-hidden shadow-inner animate-pulse flex items-center justify-center"
      >
        <div class="w-3/4 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="cat in categories"
        :key="cat.id"
        :to="`/browse/category/${cat.id}`"
        class="relative aspect-4/3 rounded-2xl bg-cover bg-center flex justify-center items-center text-white shadow-lg transition-all duration-300 brightness-90 hover:scale-105 hover:shadow-2xl hover:brightness-100 group"
        :style="{ backgroundImage: `url(${cat.categoryImage})` }"
      >
        <h2 class="text-4xl font-bold z-10 transition-all group-hover:bg-black/50 p-2 rounded-lg">
          {{ cat.name }}
        </h2>
      </router-link>
    </div>
  </div>
</template>
