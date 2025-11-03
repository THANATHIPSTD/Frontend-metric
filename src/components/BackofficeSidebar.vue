<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div
    class="w-64 bg-zinc-100 text-black shadow-2xl min-h-screen p-4 flex flex-col space-y-2 sticky top-0"
  >
    <h2 class="text-xl font-bold mb-4 text-center">Admin Panel</h2>

    <RouterLink
      :to="{ name: 'backoffice-categories' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2"
        />
      </svg>
      Categories
    </RouterLink>

    <RouterLink
      :to="{ name: 'backoffice-products' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 8h14M5 12h14M5 16h14"
        />
      </svg>
      Products
    </RouterLink>

    <hr class="border-zinc-300 my-2" />

    <p class="text-xs text-zinc-500 uppercase font-semibold mt-4 px-3">Homepage</p>

    <RouterLink
      :to="{ name: 'backoffice-homepage' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      Highlight Games
    </RouterLink>

    <RouterLink
      :to="{ name: 'backoffice-newrelease' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      New Release
    </RouterLink>

    <hr class="border-zinc-300 my-2" />

    <p class="text-xs text-zinc-500 uppercase font-semibold mt-4 px-3">System</p>

    <RouterLink
      :to="{ name: 'backoffice-users' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-5v-2a3 3 0 00-5.356-1.857M12 18v-4.5m4.5-4.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z"
        />
      </svg>
      Manage Users
    </RouterLink>

    <RouterLink
      :to="{ name: 'backoffice-orders' }"
      class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
      active-class="bg-blue-600 hover:bg-blue-600 text-white"
    >
      <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      Order History
    </RouterLink>
  </div>
</template>
