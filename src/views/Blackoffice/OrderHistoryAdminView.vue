<script setup lang="ts">
import { ref, onMounted } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import type { UserOrder } from '@/services/apiService'

const orders = ref<UserOrder[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

async function fetchAllOrders() {
  isLoading.value = true
  errorMsg.value = null
  try {
    //
    orders.value = await backofficeApiService.fetchAllOrdersForAdmin()
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Failed to fetch order history.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAllOrders)

function formatCurrency(value: number) {
  if (!value) return '฿0.00'
  return `฿${value.toFixed(2)}`
}

function formatDateTime(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  }).format(new Date(dateStr))
}
</script>

<template>
  <div class="p-4 sm:p-8">
    <header class="flex justify-between items-center mb-6 border-b border-zinc-400 pb-4">
      <h2 class="text-2xl sm:text-3xl font-bold">Order History</h2>
    </header>

    <div v-if="isLoading" class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">Order ID</th>
            <th class="py-3 px-6 text-left">Customer</th>
            <th class="py-3 px-6 text-center">Date</th>
            <th class="py-3 px-6 text-center">Status</th>
            <th class="py-3 px-6 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="n in 8" :key="n" class="border-b border-zinc-200 animate-pulse">
            <td class="py-4 px-6"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </td>
            <td class="py-4 px-6 text-center">
              <div class="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            </td>
            <td class="py-4 px-6 text-center">
              <div class="h-6 w-20 rounded-full bg-gray-200 mx-auto"></div>
            </td>
            <td class="py-4 px-6 text-right">
              <div class="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-else-if="errorMsg"
      class="text-center py-10 text-red-600 border border-red-300 bg-red-50 rounded-lg p-4"
    >
      <p class="font-semibold">Error:</p>
      <p>{{ errorMsg }}</p>
      <button @click="fetchAllOrders" class="mt-4 text-blue-600 hover:underline">
        Retry Loading
      </button>
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-20 text-gray-500">
      <h3 class="font-semibold text-xl">No Orders Found</h3>
      <p>There are no completed orders in the system yet.</p>
    </div>

    <div v-else class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">Order ID</th>
            <th class="py-3 px-6 text-left">Customer</th>
            <th class="py-3 px-6 text-center">Date</th>
            <th class="py-3 px-6 text-center">Status</th>
            <th class="py-3 px-6 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-zinc-200 hover:bg-gray-50"
          >
            <td class="py-4 px-6 text-xs text-gray-500">
              #{{ order.id.slice(-10).toUpperCase() }}
            </td>

            <td class="py-4 px-6 font-medium text-gray-900">
              <div class="flex items-center gap-3">
                <img
                  :src="order.user.profileImage"
                  alt=""
                  class="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div class="truncate">
                  <div class="font-semibold truncate">
                    {{ order.user.firstname }} {{ order.user.lastname }}
                  </div>
                  <div class="text-xs text-gray-500 truncate">{{ order.user.email }}</div>
                </div>
              </div>
            </td>

            <td class="py-4 px-6 text-center text-sm text-gray-600">
              {{ formatDateTime(order.orderDate) }}
            </td>

            <td class="py-4 px-6 text-center">
              <span
                v-if="order.status === 'completed'"
                class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
              >
                Completed
              </span>
              <span
                v-else
                class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800"
              >
                {{ order.status }}
              </span>
            </td>

            <td class="py-4 px-6 text-right font-semibold">
              {{ formatCurrency(order.totalAmount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
