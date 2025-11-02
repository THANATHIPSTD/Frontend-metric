<script lang="ts" setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const isLoggedIn = ref(false)
const username = ref('Admin')
const cartItemCount = ref(3)
</script>

<template>
  <nav class="bg-white shadow-md fixed top-0 left-0 w-full z-50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="shrink-0">
          <router-link to="/">
            <img class="h-8 w-auto" src="@/assets/logo.png" />
          </router-link>
        </div>

        <div class="hidden lg:flex lg:items-center lg:space-x-4">
          <router-link
            to="/"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >Home</router-link
          >
          <router-link
            to="/collection"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >Collection</router-link
          >
          <router-link
            to="/browse"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >Browse</router-link
          >
          <router-link
            v-if="isLoggedIn && username === 'Admin'"
            to="/backoffice"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Enter Backoffice
          </router-link>
        </div>

        <div class="hidden lg:flex lg:items-center lg:space-x-4">
          <router-link to="/cart" class="relative p-2 rounded-md text-gray-700 hover:bg-gray-100">
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
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 -mt-1 -mr-1 px-2 py-1 bg-red-600 text-white text-xs rounded-full"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <router-link
            v-if="!isLoggedIn"
            to="/login"
            class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-7 16a7 7 0 0114 0H3z" />
            </svg>
            <span>Login</span>
          </router-link>
          <div v-else class="px-3 py-2 rounded-md text-sm font-medium text-gray-700">
            Hi, {{ username }}
          </div>
        </div>

        <div class="lg:hidden">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              class="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div :class="isMenuOpen ? 'block' : 'hidden'" class="lg:hidden bg-white shadow-lg">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <router-link
          to="/"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >Home</router-link
        >
        <router-link
          to="/collection"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >Collection</router-link
        >
        <router-link
          to="/browse"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >Browse</router-link
        >
        <router-link
          v-if="isLoggedIn && username === 'Admin'"
          to="/backoffice"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
        >
          Enter Backoffice
        </router-link>
        <hr />
        <router-link
          to="/cart"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >Cart ({{ cartItemCount }})</router-link
        >
        <router-link
          v-if="!isLoggedIn"
          to="/login"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >Login</router-link
        >
        <div v-else class="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
          Hi, {{ username }}
        </div>
      </div>
    </div>
  </nav>
</template>
