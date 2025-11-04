<script setup lang="ts">
import { onMounted } from 'vue'
import BackofficeSidebar from '@/components/Backoffice/BackofficeSidebar.vue'
import { useDashboardStore } from '@/stores/dashboardStore'

const dashboardStore = useDashboardStore()

onMounted(() => {
  dashboardStore.fetchStats()
})
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">
    <BackofficeSidebar />

    <main class="flex-1 p-10">
      <div class="bg-zinc-100 rounded-4xl shadow-xl min-h-[calc(100vh-64px)] p-6">
        <div class="mb-6">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p class="text-gray-600">Welcome to the backoffice administration panel</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-gray-500 text-sm font-medium mb-2">Total Games</h3>
            <div
              v-if="dashboardStore.isLoading"
              class="h-9 w-20 bg-gray-200 rounded animate-pulse"
            ></div>
            <p v-else class="text-3xl font-bold text-gray-800">
              {{ dashboardStore.totalGames.toLocaleString() }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-gray-500 text-sm font-medium mb-2">Total Categories</h3>
            <div
              v-if="dashboardStore.isLoading"
              class="h-9 w-20 bg-gray-200 rounded animate-pulse"
            ></div>
            <p v-else class="text-3xl font-bold text-gray-800">
              {{ dashboardStore.totalCategories.toLocaleString() }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-gray-500 text-sm font-medium mb-2">Total Users</h3>
            <div
              v-if="dashboardStore.isLoading"
              class="h-9 w-20 bg-gray-200 rounded animate-pulse"
            ></div>
            <p v-else class="text-3xl font-bold text-gray-800">
              {{ dashboardStore.totalUsers.toLocaleString() }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow">
            <h3 class="text-gray-500 text-sm font-medium mb-2">Successful Orders</h3>
            <div
              v-if="dashboardStore.isLoading"
              class="h-9 w-20 bg-gray-200 rounded animate-pulse"
            ></div>
            <p v-else class="text-3xl font-bold text-gray-800">
              {{ dashboardStore.totalOrders.toLocaleString() }}
            </p>
          </div>
        </div>

        <RouterView />
      </div>
    </main>
  </div>
</template>
