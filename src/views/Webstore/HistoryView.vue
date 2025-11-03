<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService, { type UserOrder } from '@/services/apiService'

const orders = ref<UserOrder[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    orders.value = await apiService.fetchOrderHistory()
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to load order history'
  } finally {
    isLoading.value = false
  }
})

function calcPaypalFee(amount: number) {
  return amount * 0.07
}
function calcTotal(amount: number) {
  return amount + calcPaypalFee(amount)
}

function formatDateTime(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  }).format(new Date(dateStr))
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center">Order History</h1>

    <div v-if="isLoading" class="space-y-8">
      <div
        v-for="n in 2"
        :key="n"
        class="bg-white rounded-2xl shadow-md p-6 border border-zinc-100"
      >
        <div class="flex flex-col md:flex-row justify-between border-b border-zinc-200 pb-4 mb-4">
          <div class="space-y-2">
            <div class="h-6 w-48 rounded skeleton"></div>
            <div class="h-3 w-72 rounded skeleton"></div>
            <div class="h-3 w-60 rounded skeleton"></div>
          </div>
          <div class="mt-4 md:mt-0 space-y-2 w-48">
            <div class="h-3 rounded skeleton"></div>
            <div class="h-3 rounded skeleton"></div>
            <div class="h-3 rounded skeleton"></div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border-t border-b border-zinc-200">
            <thead class="bg-zinc-100">
              <tr>
                <th class="text-left p-3 font-medium">Description</th>
                <th class="text-center p-3 font-medium">Price</th>
                <th class="text-center p-3 font-medium">Platform</th>
                <th class="text-center p-3 font-medium">Quantity</th>
                <th class="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="i in 3" :key="i" class="border-t border-zinc-100">
                <td class="p-3">
                  <div class="h-4 w-48 rounded skeleton mb-2"></div>
                  <div class="h-3 w-64 rounded skeleton"></div>
                </td>
                <td class="text-center p-3">
                  <div class="h-4 w-16 mx-auto rounded skeleton"></div>
                </td>
                <td class="text-center p-3">
                  <div class="h-4 w-20 mx-auto rounded skeleton"></div>
                </td>
                <td class="text-center p-3">
                  <div class="h-4 w-10 mx-auto rounded skeleton"></div>
                </td>
                <td class="text-right p-3">
                  <div class="h-4 w-20 ml-auto rounded skeleton"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col md:flex-row justify-between items-end mt-6 border-t border-zinc-200 pt-4"
        >
          <div class="space-y-2">
            <div class="h-4 w-40 rounded skeleton"></div>
            <div class="h-4 w-44 rounded skeleton"></div>
          </div>
          <div class="mt-3 md:mt-0">
            <div class="h-6 w-36 rounded skeleton"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="errorMsg" class="text-center text-red-500 py-20">
      {{ errorMsg }}
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-20">
      <div class="text-zinc-400 mb-4">
        <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-zinc-700 mb-2">No Order History</h2>
      <p class="text-zinc-500 mb-6">You haven't placed any orders yet.</p>
      <router-link
        to="/"
        class="inline-block bg-zinc-800 text-white px-6 py-3 rounded-md hover:bg-zinc-700 transition"
      >
        Go to Homepage
      </router-link>
    </div>

    <div v-else>
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl shadow-md p-6 mb-10 border border-zinc-100"
      >
        <div class="flex flex-col md:flex-row justify-between border-b border-zinc-200 pb-4 mb-4">
          <div>
            <h2 class="font-semibold text-xl">DEKTEADGAME, Inc</h2>
            <p class="text-sm text-zinc-600">
              18/84 LookMoon Street, Chiangmai 50100<br />
              Phone: +66 903 7485 | Fax: (321) 451-7860
            </p>
          </div>
          <div class="text-right mt-4 md:mt-0">
            <p class="text-sm text-zinc-500">
              <strong>Date:</strong> {{ formatDateTime(order.orderDate) }}
            </p>
            <p class="text-sm text-zinc-500">
              <strong>Status: </strong>
              <span
                :class="
                  order.status === 'completed'
                    ? 'text-green-600 font-medium'
                    : 'text-yellow-600 font-medium'
                "
              >
                {{ order.status }}
              </span>
            </p>
            <p class="text-sm text-zinc-500 mt-1">
              <strong>Invoice #</strong>
              {{ order.id }}
            </p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm border-t border-b border-zinc-200">
            <thead class="bg-zinc-100 text-zinc-700">
              <tr>
                <th class="text-left p-3 font-medium">Description</th>
                <th class="text-center p-3 font-medium">Price</th>
                <th class="text-center p-3 font-medium">Platform</th>
                <th class="text-center p-3 font-medium">Quantity</th>
                <th class="text-right p-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, j) in order.items" :key="j" class="border-t border-zinc-100">
                <td class="p-3">
                  <span class="font-medium text-zinc-900">{{ item.game.title }}</span
                  ><br />
                  <span class="text-xs text-zinc-500">{{ item.game.description }}</span>
                </td>
                <td class="text-center p-3">฿{{ item.priceAtPurchase.toFixed(2) }}</td>
                <td class="text-center p-3">{{ item.platform }}</td>
                <td class="text-center p-3">{{ item.quantity }}</td>
                <td class="text-right p-3 font-medium">
                  ฿{{ (item.priceAtPurchase * item.quantity).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          class="flex flex-col md:flex-row justify-between items-end mt-6 border-t border-zinc-200 pt-4"
        >
          <div class="text-zinc-500 text-sm">
            Subtotal: ฿{{ order.totalAmount.toFixed(2) }}<br />
            Paypal Fee (7%): ฿{{ calcPaypalFee(order.totalAmount).toFixed(2) }}
          </div>
          <div class="mt-3 md:mt-0 text-right">
            <p class="text-lg font-semibold">
              TOTAL: ฿{{ calcTotal(order.totalAmount).toFixed(2) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  button {
    display: none;
  }
  .max-w-5xl {
    box-shadow: none !important;
  }
}

.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(244 244 245);
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
