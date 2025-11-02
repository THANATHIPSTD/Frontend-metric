<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import apiService, { type Game, type Category } from '@/services/apiService'
import GameCard from '@/components/GameCard.vue'

const route = useRoute()

const games = ref<Game[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(true)

const itemsPerPage = ref(16)
const totalGames = ref(0)
const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(totalGames.value / itemsPerPage.value)
})

const categoryId = computed(() => {
  return route.params.id as string | undefined
})

const pageTitle = computed(() => {
  if (!categoryId.value) return 'ALL GAMES'
  const cat = categories.value.find((c) => c.id === categoryId.value)
  return cat ? cat.name.toUpperCase() : '...'
})

async function fetchData() {
  isLoading.value = true
  try {
    if (categories.value.length === 0) {
      apiService.fetchCategories().then((data) => (categories.value = data))
    }

    const response = await apiService.fetchGames(
      currentPage.value,
      itemsPerPage.value,
      categoryId.value,
    )

    games.value = response.data
    totalGames.value = response.total
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    isLoading.value = false
  }
}

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  currentPage.value = page
}

watch(currentPage, fetchData)

watch(categoryId, () => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    fetchData()
  }
})

onMounted(fetchData)
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 my-12 bg-white rounded-2xl shadow-lg">
    <h1 v-if="!isLoading" class="text-3xl font-bold mb-6">{{ pageTitle }}</h1>
    <div v-else class="mb-6 h-8 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>

    <div class="flex space-x-2 overflow-x-auto pb-4 mb-6">
      <div v-if="isLoading" class="flex space-x-2">
        <div class="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div class="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div class="w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>

      <template v-else>
        <router-link
          to="/browse"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
          :class="
            !categoryId ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          "
        >
          ALL
        </router-link>
        <router-link
          v-for="cat in categories"
          :key="cat.id"
          :to="`/browse/category/${cat.id}`"
          class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
          :class="
            cat.id === categoryId
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          "
        >
          {{ cat.name }}
        </router-link>
      </template>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      <div v-for="n in 16" :key="n" class="space-y-4" aria-hidden="true">
        <div class="w-full aspect-square bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </div>

    <div v-if="!isLoading && games.length === 0" class="text-center p-12 text-gray-500">
      No games found in this category.
    </div>

    <div class="flex items-center justify-center gap-2 mt-12" v-if="!isLoading && totalPages > 1">
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="page-btn px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50"
      >
        ❮
      </button>

      <div class="page-numbers flex gap-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          class="page-btn-number px-4 py-2 rounded-md"
          :class="
            page === currentPage ? 'active bg-black text-white' : 'bg-white text-gray-700 border'
          "
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="page-btn px-3 py-2 bg-gray-100 rounded-md disabled:opacity-50"
      >
        ❯
      </button>
    </div>
  </div>
</template>
