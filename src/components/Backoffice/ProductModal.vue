<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import { type Game, type Category } from '@/services/apiService'
import { type GamePayload } from '@/services/backofficeApiService'

const props = defineProps<{
  mode: 'add' | 'edit'
  gameToEdit: Game | null
  allCategories: Category[]
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const formData = reactive<GamePayload>({
  title: '',
  price: 0,
  promotionPrice: null,
  description: '',
  mainImageUrl: '',
  icongameUrl: '',
  trailerUrl: '',
  categoryIds: [],
})

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      errorMessage.value = null
      if (props.mode === 'edit' && props.gameToEdit) {
        formData.title = props.gameToEdit.title
        formData.price = props.gameToEdit.price
        formData.promotionPrice = props.gameToEdit.promotionPrice || null
        formData.description = props.gameToEdit.description || ''
        formData.mainImageUrl = props.gameToEdit.mainImageUrl || ''
        formData.icongameUrl = props.gameToEdit.icongameUrl || ''
        formData.trailerUrl = props.gameToEdit.trailerUrl || ''
        formData.categoryIds = props.gameToEdit.categoryIds || []
      } else {
        formData.title = ''
        formData.price = 0
        formData.promotionPrice = null
        formData.description = ''
        formData.mainImageUrl = ''
        formData.icongameUrl = ''
        formData.trailerUrl = ''
        formData.categoryIds = []
      }
    }
  },
)

async function handleSubmit() {
  if (!formData.title || !formData.price) {
    errorMessage.value = 'Product Name and Price are required.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    if (props.mode === 'add') {
      await backofficeApiService.createGame(formData)
    } else if (props.mode === 'edit' && props.gameToEdit) {
      await backofficeApiService.updateGame(props.gameToEdit.id, formData)
    }

    emit('success')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    errorMessage.value = err.response?.data?.message || 'Submission failed.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-8 sm:p-0"
        @click.self="emit('close')"
      >
        <div
          class="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          @keydown.escape="emit('close')"
        >
          <header
            class="flex justify-between items-center border-b border-zinc-300 p-5 sticky top-0 bg-white z-10"
          >
            <h3 class="text-xl font-bold">
              {{ mode === 'add' ? 'Add New Product' : `Edit Product: ${gameToEdit?.title}` }}
            </h3>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-800">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          <form @submit.prevent="handleSubmit" class="p-5 space-y-6">
            <div
              v-if="errorMessage"
              class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              {{ errorMessage }}
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="font-semibold text-lg border-b border-zinc-300 pb-2">
                  Basic Information
                </h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    v-model="formData.title"
                    required
                    :disabled="isSubmitting"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Normal Price *</label
                    >
                    <input
                      type="number"
                      step="0.01"
                      v-model.number="formData.price"
                      required
                      min="0"
                      :disabled="isSubmitting"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Promotion Price</label
                    >
                    <input
                      type="number"
                      step="0.01"
                      v-model.number="formData.promotionPrice"
                      min="0"
                      :disabled="isSubmitting"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="4"
                    :disabled="isSubmitting"
                    class="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                  ></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="font-semibold text-lg border-b border-zinc-300 pb-2">
                  Media & Categorization
                </h4>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
                  <input
                    type="url"
                    v-model="formData.mainImageUrl"
                    :disabled="isSubmitting"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                    placeholder="Game key visual"
                  />
                  <img
                    v-if="formData.mainImageUrl"
                    :src="formData.mainImageUrl"
                    alt="Main Image Preview"
                    class="mt-2 w-auto h-35 object-cover rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Icon Image URL</label>
                  <input
                    type="url"
                    v-model="formData.icongameUrl"
                    :disabled="isSubmitting"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                    placeholder="Game icon"
                  />
                  <img
                    v-if="formData.icongameUrl"
                    :src="formData.icongameUrl"
                    alt="Icon Preview"
                    class="mt-2 w-16 h-16 object-cover rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1"
                    >Trailer URL (YouTube)</label
                  >
                  <input
                    type="url"
                    v-model="formData.trailerUrl"
                    :disabled="isSubmitting"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-zinc-900 focus:border-zinc-900"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="cat in allCategories"
                      :key="cat.id"
                      type="button"
                      @click="
                        formData.categoryIds.includes(cat.id)
                          ? (formData.categoryIds = formData.categoryIds.filter(
                              (id) => id !== cat.id,
                            ))
                          : formData.categoryIds.push(cat.id)
                      "
                      :disabled="isSubmitting"
                      :class="[
                        'px-4 py-2 text-sm font-medium rounded-full border transition-colors',
                        formData.categoryIds.includes(cat.id)
                          ? 'bg-zinc-900 text-white border-zinc-900'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      ]"
                    >
                      {{ cat.name }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <footer class="flex justify-end space-x-3 pt-3 border-t border-zinc-300">
              <button
                type="button"
                @click="emit('close')"
                :disabled="isSubmitting"
                class="px-4 py-2 text-sm font-medium border border-gray-300 rounded-full hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="isSubmitting"
                class="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-full hover:bg-zinc-800 disabled:bg-zinc-500"
              >
                {{
                  isSubmitting ? 'Saving...' : mode === 'add' ? 'Save New Product' : 'Save Changes'
                }}
              </button>
            </footer>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
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
