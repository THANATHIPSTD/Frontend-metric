<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const authStore = useAuthStore()
const cartStore = useCartStore()

const isMenuOpen = ref(false)
const isProfileOpen = ref(false)

function handleLogout() {
  authStore.logout()
  isProfileOpen.value = false
  isMenuOpen.value = false
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

          <RouterLink v-if="authStore.isAdmin" to="/blackoffice" class="px-3 py-2 ...">
            <RouterLink v-if="authStore.isAdmin" to="/blackoffice" class="px-3 py-2 ...">
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
          <RouterLink
            v-if="cartStore.itemCount > 0"
            to="/cart"
            class="relative p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-basket"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5"
              />
            </svg>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>
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
                  class="w-10 h-10 rounded-full mr-5 object-cover"
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
          <button
            @click="toggleMenu"
            class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                v-if="!isMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div :class="isMenuOpen ? 'block' : 'hidden'" class="lg:hidden bg-white border-t shadow-lg">
      <div class="px-4 pt-4 pb-6 space-y-2">
        <RouterLink
          @click="closeMenus"
          to="/"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11v-5m0 0V9m9 11v-5m0 0V9"
            />
          </svg>
          <span class="font-medium">Home</span>
        </RouterLink>

        <RouterLink
          @click="closeMenus"
          to="/collection"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 017 12V7a4 4 0 014-4z"
            />
          </svg>
          <span class="font-medium">Collection</span>
        </RouterLink>

        <RouterLink
          @click="closeMenus"
          to="/browse"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span class="font-medium">Browse</span>
        </RouterLink>

        <RouterLink
          v-if="authStore.isAdmin"
          @click="closeMenus"
          to="/backoffice"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v16.5A2.25 2.25 0 003.75 22.5h16.5a2.25 2.25 0 002.25-2.25V13.5m-20.25-9h6m-6 4.5h6M10.5 1.5l6 6m6-6v6"
            />
          </svg>
          <span class="font-medium">Backoffice</span>
        </RouterLink>

        <div class="my-3 border-t"></div>

        <RouterLink
          @click="closeMenus"
          to="/cart"
          class="flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
              <path
                d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9zM1 7v1h14V7zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10m2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5"
              />
            </svg>
            <span class="font-medium">Cart</span>
          </div>
          <span
            v-if="cartStore.itemCount > 0"
            class="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-full"
          >
            {{ cartStore.itemCount }}
          </span>
        </RouterLink>

        <div class="my-3 border-t"></div>

        <template v-if="!authStore.isLoggedIn">
          <RouterLink
            @click="closeMenus"
            to="/login"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-white bg-gray-800 hover:bg-gray-900 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            <span class="font-medium">Login</span>
          </RouterLink>
        </template>

        <template v-else>
          <div class="px-4 py-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
              <img
                v-if="authStore.user?.profileImage"
                :src="authStore.user.profileImage"
                class="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
              />
              <div class="flex-1">
                <p class="text-sm text-gray-500">Logged in as</p>
                <p class="font-semibold text-gray-900">{{ authStore.user?.firstname }}</p>
              </div>
            </div>

            <div class="space-y-1">
              <RouterLink
                @click="closeMenus"
                to="/profile"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span class="font-medium">Profile</span>
              </RouterLink>

              <RouterLink
                @click="closeMenus"
                to="/history"
                class="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="font-medium">History/Receipt</span>
              </RouterLink>

              <button
                @click="handleLogout"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span class="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>
