<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const username = ref('admin')
const password = ref('admin')
const error = ref<string | null>(null)

async function handleLogin() {
  error.value = null
  try {
    await authStore.login(username.value, password.value)
  } catch {
    error.value = 'Invalid username or password.'
  }
}
</script>
<template>
  <div
    class="flex items-center justify-center min-h-screen bg-cover bg-center"
    style="
      background-image: url('https://xapqrepwfmjcrtcsmqzh.supabase.co/storage/v1/object/public/sadboy/3975808.jpg');
    "
  >
    <div class="w-full lg:w-1/2 flex items-center justify-center py-15 px-4">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-md">
        <h1 class="text-2xl font-bold text-center">DEKTEADGAME</h1>

        <div class="flex border-b">
          <span class="w-1/2 text-center py-2 border-b-2 border-black font-semibold">Log in</span>
          <router-link to="/register" class="w-1/2 text-center py-2 text-gray-500 hover:text-black"
            >Register</router-link
          >
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              v-model="username"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              v-model="password"
              required
              class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div v-if="error" class="text-sm text-red-600 text-center">
            {{ error }}
          </div>

          <button
            type="submit"
            class="w-full px-4 py-3 font-medium text-white bg-black rounded-full hover:bg-gray-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
