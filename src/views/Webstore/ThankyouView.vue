<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { onMounted, nextTick } from 'vue'
// @ts-expect-error canvas-confetti does not have TypeScript type definitions
import confetti from 'canvas-confetti'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const formatCurrency = (value: number) => {
  if (!value) return '฿0.00'
  return `฿${value.toFixed(2)}`
}

function fireRibbons() {
  const shoot = (originX: number, angle: number, scalar = 1) => {
    confetti({
      particleCount: 60,
      spread: 55,
      startVelocity: 55,
      angle,
      origin: { x: originX, y: 0.2 },
      gravity: 0.9,
      drift: originX < 0.5 ? 1 : -1,
      ticks: 200,
      scalar,
    })
  }

  confetti({
    particleCount: 120,
    spread: 70,
    startVelocity: 45,
    origin: { y: 0.4 },
    gravity: 1.1,
    ticks: 220,
    scalar: 1.1,
  })

  setTimeout(() => shoot(0.1, 60, 1.2), 80)
  setTimeout(() => shoot(0.9, 120, 1.2), 120)
  setTimeout(() => shoot(0.2, 55, 1.0), 180)
  setTimeout(() => shoot(0.8, 125, 1.0), 220)
}

function onCelebrateClick() {
  fireRibbons()
}

onMounted(async () => {
  if (!cartStore.latestOrder) {
    router.push('/history')
    return
  }
  await nextTick()
  fireRibbons()
})
</script>

<template>
  <div>
    <div class="bg-gray-100 flex items-center justify-center">
      <div
        v-if="cartStore.latestOrder && authStore.user"
        class="confirmation-card bg-white p-8 md:p-16 rounded-4xl shadow-xl max-w-2xl mt-15 mb-20 w-full text-center relative overflow-hidden"
      >
        <div
          class="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6"
        >
          <svg
            class="w-16 h-16 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>

        <h1 class="text-3xl font-bold mb-3">Payment Successful!</h1>

        <div class="text-gray-600 mb-8">
          Order Number: #GS{{ cartStore.latestOrder.id.slice(-6).toUpperCase() }}<br />
          A confirmation email has been sent to:<br />
          <strong class="text-gray-900">{{ authStore.user.email }}</strong>
        </div>

        <div class="bg-gray-50 p-6 rounded-lg text-left mb-8">
          <h3 class="font-semibold mb-3">Order Summary</h3>
          <div
            v-for="item in cartStore.latestOrder.items"
            :key="item.game.id"
            class="flex justify-between items-center text-sm mb-2"
          >
            <span class="text-gray-700">{{ item.title }} (x{{ item.quantity }})</span>
            <span class="font-medium">{{
              formatCurrency(item.priceAtPurchase * item.quantity)
            }}</span>
          </div>
          <hr class="my-3" />
          <div class="flex justify-between font-bold text-lg">
            <span>Total Paid:</span>
            <span>{{ formatCurrency(cartStore.latestOrder.totalAmount) }}</span>
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-3">
          <router-link
            to="/browse"
            @click="onCelebrateClick"
            class="w-full px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
          >
            Continue Shopping
          </router-link>
          <router-link
            to="/history"
            @click="onCelebrateClick"
            class="w-full px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-100"
          >
            View Order History
          </router-link>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        <p>Loading or no order data found. Redirecting...</p>
      </div>
    </div>
  </div>
</template>
