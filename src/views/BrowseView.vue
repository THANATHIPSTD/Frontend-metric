<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { debounce } from 'lodash-es'
import apiService, { type Game, type Category } from '@/services/apiService'
import GameCard from '@/components/GameCard.vue'

const route = useRoute()

const games = ref<Game[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(true)

const itemsPerPage = ref(16)
const totalGames = ref(0)
const currentPage = ref(1)

const searchTitle = ref('')
const priceFilter = ref('')

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
      searchTitle.value,
      priceFilter.value,
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

const debouncedFetchData = debounce(() => {
  if (currentPage.value !== 1) {
    currentPage.value = 1
  } else {
    fetchData()
  }
}, 500)

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) fetchData()
})

watch(categoryId, () => {
  debouncedFetchData()
})

watch(searchTitle, debouncedFetchData)
watch(priceFilter, debouncedFetchData)

onMounted(fetchData)
</script>

<template>
  <div class="max-w-7xl mx-auto p-4 md:p-8 my-12 bg-white rounded-2xl shadow-lg">
    <h1 v-if="!isLoading" class="text-3xl font-bold mb-6">{{ pageTitle }}</h1>
    <div v-else class="mb-6 h-8 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>

    <div class="flex space-x-2 overflow-x-auto pb-4 mb-6">
      <router-link
        to="/browse"
        class="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
        :class="!categoryId ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
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
    </div>

    <div class="search-filter-container mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <input
        type="text"
        v-model="searchTitle"
        placeholder="Search for games..."
        class="md:col-span-2 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        v-model="priceFilter"
        class="px-4 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Prices</option>
        <option value="under-500">Under ฿500</option>
        <option value="500-1000">฿500 - ฿1000</option>
        <option value="1000-2000">฿1000 - ฿2000</option>
        <option value="over-2000">Over ฿2000</option>
      </select>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      <div v-for="n in itemsPerPage" :key="n" class="space-y-3">
        <div class="w-full h-70 bg-gray-200 rounded-2xl animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>

    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      <GameCard v-for="game in games" :key="game.id" :game="game" />
    </div>

    <div v-if="!isLoading && games.length === 0" class="text-center p-12 text-gray-500">
      No games found.
    </div>

    <div class="flex items-center justify-center gap-2 mt-12" v-if="!isLoading && totalPages > 1">
      <button
        class="px-3 py-1 rounded-md border"
        :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Prev
      </button>

      <button
        v-for="p in totalPages"
        :key="p"
        class="px-3 py-1 rounded-md border"
        :class="
          p === currentPage ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        "
        @click="goToPage(p)"
      >
        {{ p }}
      </button>

      <button
        class="px-3 py-1 rounded-md border"
        :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>
