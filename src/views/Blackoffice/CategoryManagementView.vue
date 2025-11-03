<script setup lang="ts">
import { ref, onMounted } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import CategoryModal from '@/components/Backoffice/CategoryModal.vue'
import { type Category } from '@/services/apiService'

const categories = ref<Category[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

const isModalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const categoryToEdit = ref<Category | null>(null)

async function fetchCategories() {
  isLoading.value = true
  errorMsg.value = null
  try {
    categories.value = await backofficeApiService.fetchAllCategories()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    errorMsg.value = err.message || 'Failed to fetch categories.'
  } finally {
    isLoading.value = false
  }
}

function handleAdd() {
  modalMode.value = 'add'
  categoryToEdit.value = null
  isModalOpen.value = true
}

function handleEdit(category: Category) {
  modalMode.value = 'edit'
  categoryToEdit.value = category
  isModalOpen.value = true
}

function handleSuccess() {
  isModalOpen.value = false
  fetchCategories()
}

async function handleDelete(id: string, name: string) {
  if (!confirm(`Are you sure you want to delete the category: ${name}?`)) {
    return
  }
  try {
    await backofficeApiService.deleteCategory(id)
    categories.value = categories.value.filter((c) => c.id !== id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    alert(`Error deleting category: ${err.response?.data?.message || 'Unknown error'}`)
  }
}

onMounted(fetchCategories)
</script>
<template>
  <div class="p-4 sm:p-8">
    <header
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-zinc-400 pb-4 gap-3"
    >
      <h2 class="text-2xl sm:text-3xl font-bold">Category Management</h2>
      <button
        @click="handleAdd"
        class="w-full sm:w-auto bg-zinc-900 text-white px-4 py-2 rounded-full font-medium hover:bg-white hover:text-zinc-900 transition"
      >
        + Add New Category
      </button>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <div class="animate-pulse">
        <div class="hidden sm:block overflow-x-auto shadow-md rounded-lg">
          <table class="min-w-full bg-white">
            <thead class="bg-zinc-900 text-white text-sm">
              <tr>
                <th class="py-3 px-6 text-left">Name</th>
                <th class="py-3 px-6 text-center">Image</th>
                <th class="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-zinc-200">
                <td class="py-4 px-6"><div class="bg-gray-200 h-6 rounded w-3/4"></div></td>
                <td class="py-4 px-6 text-center">
                  <div class="bg-gray-200 h-12 w-16 rounded-md mx-auto"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="bg-gray-200 h-6 rounded w-24 ml-auto"></div>
                </td>
              </tr>
              <tr class="border-b border-zinc-200">
                <td class="py-4 px-6"><div class="bg-gray-200 h-6 rounded w-3/4"></div></td>
                <td class="py-4 px-6 text-center">
                  <div class="bg-gray-200 h-12 w-16 rounded-md mx-auto"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="bg-gray-200 h-6 rounded w-24 ml-auto"></div>
                </td>
              </tr>
              <tr class="border-b border-zinc-200">
                <td class="py-4 px-6"><div class="bg-gray-200 h-6 rounded w-3/4"></div></td>
                <td class="py-4 px-6 text-center">
                  <div class="bg-gray-200 h-12 w-16 rounded-md mx-auto"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="bg-gray-200 h-6 rounded w-24 ml-auto"></div>
                </td>
              </tr>
              <tr class="border-b border-zinc-200">
                <td class="py-4 px-6"><div class="bg-gray-200 h-6 rounded w-3/4"></div></td>
                <td class="py-4 px-6 text-center">
                  <div class="bg-gray-200 h-12 w-16 rounded-md mx-auto"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="bg-gray-200 h-6 rounded w-24 ml-auto"></div>
                </td>
              </tr>
              <tr class="border-b border-zinc-200">
                <td class="py-4 px-6"><div class="bg-gray-200 h-6 rounded w-3/4"></div></td>
                <td class="py-4 px-6 text-center">
                  <div class="bg-gray-200 h-12 w-16 rounded-md mx-auto"></div>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="bg-gray-200 h-6 rounded w-24 ml-auto"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="block sm:hidden space-y-4">
          <div class="bg-white rounded-lg shadow-md p-4">
            <div class="flex items-start gap-4">
              <div class="bg-gray-200 h-16 w-20 rounded-md"></div>
              <div class="flex-1 space-y-2">
                <div class="bg-gray-200 h-6 rounded w-3/4"></div>
                <div class="flex gap-2">
                  <div class="bg-gray-200 h-10 rounded flex-1"></div>
                  <div class="bg-gray-200 h-10 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-md p-4">
            <div class="flex items-start gap-4">
              <div class="bg-gray-200 h-16 w-20 rounded-md"></div>
              <div class="flex-1 space-y-2">
                <div class="bg-gray-200 h-6 rounded w-3/4"></div>
                <div class="flex gap-2">
                  <div class="bg-gray-200 h-10 rounded flex-1"></div>
                  <div class="bg-gray-200 h-10 rounded flex-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="errorMsg"
      class="text-center py-10 text-red-600 border border-red-300 bg-red-50 rounded-lg p-4"
    >
      <p class="font-semibold">Error:</p>
      <p class="wrap-break-word">{{ errorMsg }}</p>
      <button @click="fetchCategories" class="mt-4 text-blue-600 hover:underline">
        Retry Loading
      </button>
    </div>

    <div v-else-if="categories.length === 0" class="text-center py-10 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zM12 18v-6m-3 3h6"
        ></path>
      </svg>
      <h3 class="font-semibold text-xl">No Categories Found</h3>
      <p>Start by adding a new game category.</p>
    </div>

    <div v-else class="block sm:hidden space-y-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition"
      >
        <div class="flex items-start gap-4">
          <img
            :src="category.categoryImage || '/placeholder/default.jpg'"
            :alt="category.name"
            class="w-20 h-16 object-cover rounded-md shrink-0"
            loading="lazy"
          />
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-gray-900 text-lg truncate">{{ category.name }}</h3>
            <div class="flex flex-wrap gap-2 mt-3">
              <button
                @click="handleEdit(category)"
                class="flex-1 min-w-[100px] text-black hover:bg-blue-50 border border-black font-medium py-2 px-3 rounded-lg inline-flex items-center justify-center gap-1"
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
                @click="handleDelete(category.id, category.name)"
                class="flex-1 min-w-[100px] text-red-600 hover:bg-red-50 border border-red-600 font-medium py-2 px-3 rounded-lg inline-flex items-center justify-center gap-1"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden sm:block overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead v-if="!isLoading" class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">Name</th>
            <th class="py-3 px-6 text-center">Image</th>
            <th class="py-3 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categories"
            :key="category.id"
            class="border-b border-zinc-200 hover:bg-gray-50"
          >
            <td class="py-4 px-6 font-medium text-gray-900">
              {{ category.name }}
            </td>
            <td class="py-4 px-6 text-center">
              <img
                :src="category.categoryImage || '/placeholder/default.jpg'"
                :alt="category.name"
                class="w-16 h-12 object-cover rounded-md mx-auto"
                loading="lazy"
              />
            </td>
            <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
              <button
                @click="handleEdit(category)"
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
                @click="handleDelete(category.id, category.name)"
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
  </div>

  <CategoryModal
    :is-open="isModalOpen"
    :mode="modalMode"
    :category-to-edit="categoryToEdit"
    @close="isModalOpen = false"
    @success="handleSuccess"
  />
</template>
