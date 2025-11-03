<script setup lang="ts">
/* eslint-disable */
import { ref, onMounted, watch, computed } from 'vue'
import { debounce } from 'lodash-es'
import backofficeApiService from '@/services/backofficeApiService'
import { type Game, type Category } from '@/services/apiService'
import ProductModal from '@/components/Backoffice/ProductModal.vue'

const games = ref<Game[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(true)
const isLoadingCategories = ref(true)
const errorMsg = ref<string | null>(null)

const itemsPerPage = ref(16)
const totalGames = ref(0)
const currentPage = ref(1)
const searchTitle = ref('')

const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const gameToEdit = ref<Game | null>(null)

const totalPages = computed(() => {
  return Math.ceil(totalGames.value / itemsPerPage.value)
})

async function fetchCategories() {
  isLoadingCategories.value = true
  try {
    categories.value = await backofficeApiService.fetchAllCategories()
  } catch (err: any) {
    console.error('Failed to fetch categories:', err)
    errorMsg.value = err.message || 'Failed to fetch categories list.'
  } finally {
    isLoadingCategories.value = false
  }
}

async function fetchProducts() {
  isLoading.value = true
  try {
    const response = await backofficeApiService.fetchAdminGames(
      currentPage.value,
      itemsPerPage.value,
      searchTitle.value,
    )

    games.value = response.data
    totalGames.value = response.total
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to fetch products.'
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
    fetchProducts()
  }
}, 500)

watch(currentPage, (newPage, oldPage) => {
  if (newPage !== oldPage) fetchProducts()
})

watch(searchTitle, debouncedFetchData)

async function handleDelete(id: string, title: string) {
  if (!confirm(`Are you sure you want to delete the product: ${title}?`)) {
    return
  }
  try {
    await backofficeApiService.deleteGame(id)
    fetchProducts()
  } catch (err: any) {
    alert(`Error deleting product: ${err.response?.data?.message || 'Unknown error'}`)
  }
}

function handleAdd() {
  modalMode.value = 'add'
  gameToEdit.value = null
  isModalOpen.value = true
}

function handleEdit(game: Game) {
  modalMode.value = 'edit'
  gameToEdit.value = game
  isModalOpen.value = true
}

function handleSuccess() {
  isModalOpen.value = false
  fetchProducts()
}

function formatCurrency(value: number) {
  return `฿${value.toFixed(2)}`
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>

<template>
  <div class="p-4 sm:p-8">
    <header
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-zinc-400 pb-4 gap-3"
    >
      <h2 class="text-2xl sm:text-3xl font-bold">Product Management</h2>
      <button
        @click="handleAdd"
        :disabled="isLoadingCategories"
        class="w-full sm:w-auto bg-zinc-900 text-white px-4 py-2 rounded-full font-medium hover:bg-white hover:text-zinc-900 transition disabled:bg-gray-400"
      >
        <span v-if="isLoadingCategories">Loading Categories...</span>
        <span v-else>+ Add New Product</span>
      </button>
    </header>

    <div class="mb-6">
      <input
        type="text"
        v-model="searchTitle"
        placeholder="Search product by title..."
        class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900"
      />
    </div>

    <div v-if="!isLoading && games.length > 0" class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">Icon</th>
            <th class="py-3 px-6 text-left">Title</th>
            <th class="py-3 px-6 text-center">Price</th>
            <th class="py-3 px-6 text-center hidden lg:table-cell">Promotion Price</th>
            <th class="py-3 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="game in games"
            :key="game.id"
            class="border-b border-zinc-200 hover:bg-gray-50"
          >
            <td class="py-4 px-6">
              <img
                :src="game.icongameUrl || '/placeholder/icon.jpg'"
                :alt="game.title"
                class="w-10 h-10 object-cover rounded-md"
                loading="lazy"
              />
            </td>
            <td class="py-4 px-6 font-medium text-gray-900 truncate max-w-xs">
              {{ game.title }}
            </td>
            <td class="py-4 px-6 text-center text-zinc-700">
              {{ formatCurrency(game.price) }}
            </td>
            <td class="py-4 px-6 text-center hidden lg:table-cell">
              <span v-if="game.promotionPrice">
                {{ formatCurrency(game.promotionPrice) }}
              </span>
              <span v-else>-</span>
            </td>
            <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
              <button
                @click="handleEdit(game)"
                class="bg-black hover:bg-zinc-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                @click="handleDelete(game.id, game.title)"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!isLoading && totalPages > 1" class="flex items-center justify-center gap-2 mt-12">
      <button
        class="px-3 py-1 rounded-md border"
        :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
        :disabled="currentPage === 1"
        s
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

    <div v-else-if="isLoading" class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">Icon</th>
            <th class="py-3 px-6 text-left">Title</th>
            <th class="py-3 px-6 text-center">Price</th>
            <th class="py-3 px-6 text-center hidden lg:table-cell">Promotion Price</th>
            <th class="py-3 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 16" :key="n" class="border-b border-zinc-200 animate-pulse">
            <td class="py-4 px-6">
              <div class="w-10 h-10 bg-gray-300 rounded-md"></div>
            </td>
            <td class="py-4 px-6">
              <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            </td>
            <td class="py-4 px-6 text-center">
              <div class="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </td>
            <td class="py-4 px-6 text-center hidden lg:table-cell">
              <div class="h-4 bg-gray-300 rounded w-16 mx-auto"></div>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="flex justify-end gap-2">
                <div class="h-9 w-20 bg-gray-300 rounded-lg"></div>
                <div class="h-9 w-24 bg-gray-300 rounded-lg"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="errorMsg" class="text-center py-8">
      <p class="text-red-600">{{ errorMsg }}</p>
    </div>
  </div>

  <ProductModal
    :is-open="isModalOpen"
    :mode="modalMode"
    :game-to-edit="gameToEdit"
    :all-categories="categories"
    @close="isModalOpen = false"
    @success="handleSuccess"
  />
</template>
