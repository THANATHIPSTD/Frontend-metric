<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService, { type UserOrder } from '@/services/apiService'

const orders = ref<UserOrder[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    orders.value = await apiService.fetchOrderHistory()
  } catch (err: any) {
    errorMsg.value = err?.message || 'Failed to load order history'
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
  // สตริงของคุณไม่มี timezone ("2025-11-03T16:10:15.614")
  // JS จะตีความเป็นเวลา "เครื่องผู้ใช้" อยู่แล้ว
  // ถ้าอยากล็อกให้เป็นเวลาประเทศไทย ให้ใส่ timeZone: 'Asia/Bangkok'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok', // ถ้าอยากใช้เวลาตามเครื่อง ให้ลบบรรทัดนี้ออก
  }).format(new Date(dateStr))
}

</script>

<template>
  <div class="max-w-5xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-8 text-center">Order History</h1>

    <!-- ⚡ Skeleton while loading -->
    <div v-if="isLoading" class="space-y-8">
      <div v-for="n in 2" :key="n" class="bg-white rounded-2xl shadow-md p-6 border border-zinc-100">
        <!-- header skeleton -->
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

        <!-- table skeleton -->
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
                <td class="text-center p-3"><div class="h-4 w-16 mx-auto rounded skeleton"></div></td>
                <td class="text-center p-3"><div class="h-4 w-20 mx-auto rounded skeleton"></div></td>
                <td class="text-center p-3"><div class="h-4 w-10 mx-auto rounded skeleton"></div></td>
                <td class="text-right p-3"><div class="h-4 w-20 ml-auto rounded skeleton"></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- totals skeleton -->
        <div class="flex flex-col md:flex-row justify-between items-end mt-6 border-t border-zinc-200 pt-4">
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

    <!-- ❗ error -->
    <div v-else-if="errorMsg" class="text-center text-red-500 py-20">
      {{ errorMsg }}
    </div>

    <!-- ✅ real content -->
    <div v-else>
      <div
        v-for="(order, idx) in orders"
        :key="order.id"
        class="bg-white rounded-2xl shadow-md p-6 mb-10 border border-zinc-100"
      >
        <!-- header -->
        <div class="flex flex-col md:flex-row justify-between border-b border-zinc-200 pb-4 mb-4">
          <div>
            <h2 class="font-semibold text-xl">DEKTEADGAME, Inc</h2>
            <p class="text-sm text-zinc-600">
              18/84 LookMoon Street, Chiangmai 50100<br />
              Phone: +66 903 7485 | Fax: (321) 451-7860
            </p>
          </div>
          <div class="text-right mt-4 md:mt-0">
            <p class="text-sm text-zinc-500"><strong>Date:</strong> {{ formatDateTime(order.orderDate) }}</p>
            <p class="text-sm text-zinc-500">
              <strong>Status:</strong>
              <span :class="order.status === 'completed' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'">
                {{ order.status }}
              </span>
            </p>
            <p class="text-sm text-zinc-500 mt-1">
              <strong>Invoice #</strong>
              {{ order.id }}
            </p>
          </div>
        </div>

        <!-- table -->
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
                  <span class="font-medium text-zinc-900">{{ item.game.title }}</span><br />
                  <span class="text-xs text-zinc-500">{{ item.game.description }}</span>
                </td>
                <td class="text-center p-3">฿{{ item.priceAtPurchase.toFixed(2) }}</td>
                <td class="text-center p-3">{{ item.platform }}</td>
                <td class="text-center p-3">{{ item.quantity }}</td>
                <td class="text-right p-3 font-medium">฿{{ (item.priceAtPurchase * item.quantity).toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- totals -->
        <div class="flex flex-col md:flex-row justify-between items-end mt-6 border-t border-zinc-200 pt-4">
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

        <!-- Print -->
        <div class="text-right mt-6">
          <button class="bg-zinc-800 text-white px-4 py-2 rounded-md text-sm hover:bg-zinc-700" @click="window.print()">
            🖨️ Print
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  button { display: none; }
  .max-w-5xl { box-shadow: none !important; }
}

/* shimmer */
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(244 244 245); /* zinc-100 */
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,.6) 50%,
    rgba(255,255,255,0) 100%
  );
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>
