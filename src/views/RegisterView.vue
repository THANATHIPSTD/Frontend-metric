<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import type { RegisterRequest } from '@/services/apiService'

const authStore = useAuthStore()

const formData = reactive<RegisterRequest>({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  image: [],
})
const imageUrl = ref('')
const error = ref<string | null>(null)

async function handleRegister() {
  error.value = null
  try {
    formData.image = imageUrl.value ? [imageUrl.value] : []

    await authStore.register(formData)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed.'
  }
}
</script>

<template>
  <div
    class="fixed inset-0 -z-10 bg-cover bg-center"
    style="
      background-image: url('https://xapqrepwfmjcrtcsmqzh.supabase.co/storage/v1/object/public/sadboy/3975808.jpg');
    "
  ></div>
  <div class="flex items-center justify-center min-h-screen py-20">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-md">
      <h1 class="text-2xl font-bold text-center">DEKTEADGAME</h1>

      <div class="flex border-b">
        <router-link to="/login" class="w-1/2 text-center py-2 text-gray-500 hover:text-black"
          >Log in</router-link
        >
        <span class="w-1/2 text-center py-2 border-b-2 border-black font-semibold">Register</span>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              v-model="formData.firstname"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              v-model="formData.lastname"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Email </label>
          <input
            type="email"
            v-model="formData.email"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            v-model="formData.password"
            required
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Profile Image URL (Optional)</label
          >
          <input
            type="text"
            v-model="imageUrl"
            placeholder="https://..."
            class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm"
          />
        </div>

        <div v-if="error" class="text-sm text-red-600 text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full px-4 py-3 font-medium text-white bg-black rounded-full hover:bg-gray-800"
        >
          Create Account
        </button>
      </form>
    </div>
  </div>
</template>
