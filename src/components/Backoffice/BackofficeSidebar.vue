<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, watch } from 'vue'

const isOpen = ref(false)

watch(isOpen, (v) => {
  document.documentElement.classList.toggle('overflow-hidden', v)
})
</script>

<template>
  <div class="shadow-lg">
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="md:hidden fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+16px)] z-50 h-12 w-12 rounded-full bg-black text-white shadow-lg grid place-items-center"
      aria-label="Open menu"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="md:hidden fixed inset-0 bg-black/70 z-40"
      @click="isOpen = false"
    ></div>

    <aside
      :class="[
        'bg-zinc-100 text-black shadow-2xl p-4 flex flex-col space-y-2',
        'fixed top-0 left-0 z-50 w-72 h-screen overflow-y-auto',
        'transform transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:static md:w-64 md:h-auto md:translate-x-0 md:top-0 md:shadow-none md:bg-zinc-100',
      ]"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-between mb-3 md:hidden">
        <h2 class="text-lg font-semibold">Admin Panel</h2>
        <button
          class="h-10 w-10 rounded-full bg-black text-white grid place-items-center shadow"
          @click="isOpen = false"
          aria-label="Close menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <h2 class="hidden md:block text-xl font-bold mb-4 text-center">Admin Panel</h2>

      <RouterLink
        :to="{ name: 'backoffice-categories' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2"
          />
        </svg>
        <span class="truncate">Categories</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'backoffice-products' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 8h14M5 12h14M5 16h14"
          />
        </svg>
        <span class="truncate">Products</span>
      </RouterLink>

      <hr class="border-zinc-300 my-2" />
      <p class="text-xs text-zinc-500 uppercase font-semibold mt-2 px-3">Homepage</p>

      <RouterLink
        :to="{ name: 'backoffice-homepage' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span class="truncate">Highlight Games</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'backoffice-newrelease' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="truncate">New Release</span>
      </RouterLink>

      <hr class="border-zinc-300 my-2" />
      <p class="text-xs text-zinc-500 uppercase font-semibold mt-2 px-3">System</p>

      <RouterLink
        :to="{ name: 'backoffice-users' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20h-5v-2a3 3 0 00-5.356-1.857M12 18v-4.5m4.5-4.5a4.5 4.5 0 10-9 0 4.5 4.5 0 009 0z"
          />
        </svg>
        <span class="truncate">Manage Users</span>
      </RouterLink>

      <RouterLink
        :to="{ name: 'backoffice-orders' }"
        class="flex items-center p-3 rounded-lg hover:bg-zinc-200 transition"
        active-class="bg-zinc-900 hover:bg-zinc-800 text-white"
        @click="isOpen = false"
      >
        <svg class="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <span class="truncate">Orders</span>
      </RouterLink>
    </aside>
  </div>
</template>
