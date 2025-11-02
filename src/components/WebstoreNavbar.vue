<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
// 1. 🔽 Import Store 🔽
import { useAuthStore } from '@/stores/authStore'

// 2. 🔽 ใช้งาน Store 🔽
const authStore = useAuthStore()

const isMenuOpen = ref(false)
const isProfileOpen = ref(false) // ◀️ 3. State สำหรับปุ่ม Profile

function handleLogout() {
  authStore.logout()
  isProfileOpen.value = false // ปิด Popover
  isMenuOpen.value = false // ปิดเมนู Mobile
}

function closeMenus() {
  isMenuOpen.value = false
  isProfileOpen.value = false
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  isProfileOpen.value = false
}
</script>

<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="shrink-0">
          <RouterLink to="/" @click="closeMenus">
            <img class="h-8 w-auto" src="@/assets/logo.png" alt="DEKTEADGAME Logo" />
          </RouterLink>
        </div>

        <div class="hidden lg:flex lg:items-center lg:space-x-4">
          <RouterLink
            to="/"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m9 11v-5m0 0V9"
              />
            </svg>
            Home
          </RouterLink>
          <RouterLink
            to="/collection"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 017 12V7a4 4 0 014-4z"
              />
            </svg>
            Collection
          </RouterLink>
          <RouterLink
            to="/browse"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Browse
          </RouterLink>

          <RouterLink v-if="authStore.isAdmin" to="/backoffice" class="px-3 py-2 ...">
            <RouterLink v-if="authStore.isAdmin" to="/backoffice" class="px-3 py-2 ...">
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v16.5A2.25 2.25 0 003.75 22.5h16.5a2.25 2.25 0 002.25-2.25V13.5m-20.25-9h6m-6 4.5h6M10.5 1.5l6 6m6-6v6"
                  />
                </svg>
                Backoffice
              </span>
            </RouterLink>
          </RouterLink>
        </div>

        <div class="hidden lg:flex lg:items-center lg:space-x-4">
          <RouterLink to="/cart" class="relative p-2 ..."> </RouterLink>

          <template v-if="!authStore.isLoggedIn">
            <RouterLink
              to="/login"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </RouterLink>
          </template>

          <template v-else>
            <div class="relative">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <img
                  v-if="authStore.user?.profileImage"
                  :src="authStore.user.profileImage"
                  class="w-6 h-6 rounded-full mr-2 object-cover"
                />
                Hi, {{ authStore.user?.firstname }}
              </button>

              <div
                v-if="isProfileOpen"
                @click="isProfileOpen = false"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border"
              >
                <RouterLink
                  to="/profile"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </RouterLink>
                <RouterLink
                  to="/history"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  History/Receipt
                </RouterLink>
                <hr class="my-1" />
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <svg
                    class="w-4 h-4 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </template>
        </div>

        <div class="lg:hidden">
          <button @click="toggleMenu" class="p-2 ..."></button>
        </div>
      </div>
    </div>

    <div :class="isMenuOpen ? 'block' : 'hidden'" class="lg:hidden bg-white shadow-lg">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <RouterLink @click="closeMenus" to="/" class="block ...">Home</RouterLink>
        <RouterLink @click="closeMenus" to="/collection" class="block ...">Collection</RouterLink>
        <RouterLink @click="closeMenus" to="/browse" class="block ...">Browse</RouterLink>
        <RouterLink @click="closeMenus" v-if="authStore.isAdmin" to="/backoffice" class="block ...">
          Enter Backoffice
        </RouterLink>
        <hr />
        <RouterLink @click="closeMenus" to="/cart" class="block ...">Cart</RouterLink>

        <template v-if="!authStore.isLoggedIn">
          <RouterLink @click="closeMenus" to="/login" class="block ...">Login</RouterLink>
        </template>
        <template v-else>
          <RouterLink @click="closeMenus" to="/profile" class="block ...">
            Profile ({{ authStore.user?.firstname }})
          </RouterLink>
          <button @click="handleLogout" class="w-full text-left block px-3 py-2 ... text-red-600">
            Logout
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>
