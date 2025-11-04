<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import { type Category } from '@/services/apiService'
import { type CategoryPayload } from '@/services/backofficeApiService'

const props = defineProps<{
  mode: 'add' | 'edit'
  categoryToEdit: Category | null
  isOpen: boolean
}>()

const emit = defineEmits(['close', 'success'])

const isSubmitting = ref(false)
const errorMessage = ref<string | null>(null)

const formData = reactive<CategoryPayload>({
  name: '',
  categoryImage: '',
})

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      errorMessage.value = null
      if (props.mode === 'edit' && props.categoryToEdit) {
        formData.name = props.categoryToEdit.name
        formData.categoryImage = props.categoryToEdit.categoryImage || ''
      } else {
        formData.name = ''
        formData.categoryImage = ''
      }
    }
  },
)

async function handleSubmit() {
  if (!formData.name) {
    errorMessage.value = 'Category Name is required.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = null

  try {
    if (props.mode === 'add') {
      await backofficeApiService.createCategory(formData)
    } else if (props.mode === 'edit' && props.categoryToEdit) {
      await backofficeApiService.updateCategory(props.categoryToEdit.id, formData)
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
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        @click.self="emit('close')"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg"
          @keydown.escape="emit('close')"
        >
          <header class="flex justify-between items-center border-b border-zinc-300 pb-3 mb-4">
            <h3 class="text-xl font-bold">
              {{ mode === 'add' ? 'Add New Category' : `Edit Category: ${categoryToEdit?.name}` }}
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

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div
              v-if="errorMessage"
              class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            >
              {{ errorMessage }}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                v-model="formData.name"
                required
                :disabled="isSubmitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category Image URL</label>
              <input
                type="url"
                v-model="formData.categoryImage"
                :disabled="isSubmitting"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
              <img
                v-if="formData.categoryImage"
                :src="formData.categoryImage"
                alt="Preview"
                class="mt-2 w-20 h-16 object-cover rounded-md shadow-sm"
              />
            </div>

            <footer class="flex justify-end space-x-3 pt-3">
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
                class="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-zinc-700 disabled:bg-zinc-400"
              >
                {{ isSubmitting ? 'Saving...' : mode === 'add' ? 'Save New' : 'Save Changes' }}
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
