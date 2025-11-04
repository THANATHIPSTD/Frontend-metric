import { ref } from 'vue'
import { defineStore } from 'pinia'
import backofficeApiService from '@/services/backofficeApiService'

export const useDashboardStore = defineStore('dashboard', () => {
  const totalGames = ref(0)
  const totalCategories = ref(0)
  const totalUsers = ref(0)
  const totalOrders = ref(0)
  const isLoading = ref(false)
  const hasLoaded = ref(false)

  async function fetchStats() {
    if (hasLoaded.value) return

    isLoading.value = true
    try {
      const [games, categories, users, orders] = await Promise.all([
        backofficeApiService.fetchAllGamesUnpaginated(),
        backofficeApiService.fetchAllCategories(),
        backofficeApiService.fetchAllUsers(),
        backofficeApiService.fetchAllOrdersForAdmin(),
      ])

      totalGames.value = games.length
      totalCategories.value = categories.length
      totalUsers.value = users.length
      totalOrders.value = orders.length
      hasLoaded.value = true
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    totalGames,
    totalCategories,
    totalUsers,
    totalOrders,
    isLoading,
    fetchStats,
  }
})
