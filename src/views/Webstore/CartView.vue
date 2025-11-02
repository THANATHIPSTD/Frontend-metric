<script setup lang="ts">
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

const formatCurrency = (value: number) => {
  if (!value) return '฿0.00'
  return `฿${value.toFixed(2)}`
}
</script>

<template>
  <div class>
    <div class="container mx-auto py-12 px-4">
      <div class="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Shopping Cart</h1>

        <div v-if="cartStore.itemCount === 0" class="empty-cart text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="#0072ce"
            class="bi bi-cart-x mx-auto"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793 7.354 5.646z"
            />
            <path
              d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
            />
          </svg>
          <h3 class="text-2xl font-semibold mt-4 mb-2">Your Cart Feels Lonely</h3>
          <p class="text-gray-500 mb-6">Discover amazing games waiting for you!</p>
          <router-link
            to="/browse"
            class="px-6 py-3 bg-black text-white rounded-full font-semibold"
          >
            Browse Games
          </router-link>
        </div>

        <div v-else-if="cartStore.cart">
          <div class="space-y-4">
            <div
              v-for="item in cartStore.cart.items"
              :key="`${item.gameId}-${item.platform}`"
              class="flex items-center gap-4 p-4 border rounded-2xl"
            >
              <img
                :src="item.icongameUrl"
                :alt="item.title"
                class="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
              />

              <div class="grow">
                <h2 class="font-semibold">{{ item.title }}</h2>
                <p class="text-sm text-gray-500">{{ item.platform }} (x{{ item.quantity }})</p>
                <!-- Price Logic -->
                <div class="text-sm">
                  <span v-if="item.promotionPrice" class="text-green-500 font-bold">{{
                    formatCurrency(item.promotionPrice)
                  }}</span>
                  <span v-else class="font-bold">{{ formatCurrency(item.price) }}</span>
                  <span v-if="item.promotionPrice" class="text-gray-400 line-through ml-2">{{
                    formatCurrency(item.price)
                  }}</span>
                </div>
              </div>

              <!-- ปุ่มลบ -->
              <button
                @click="cartStore.removeItem(item.gameId, item.platform)"
                class="p-2 text-red-500 hover:bg-red-100 rounded-full"
                aria-label="Remove item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  fill="currentColor"
                  class="bi bi-trash3-fill"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="cartpage-summary bg-gray-50 rounded-lg p-6 mt-8">
            <h3 class="text-xl font-semibold mb-4">Estimated Total</h3>

            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ formatCurrency(cartStore.totalPrice) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">PayPal Fee (7%):</span>
                <span class="font-medium">{{ formatCurrency(cartStore.totalPrice * 0.07) }}</span>
              </div>
              <hr class="my-2" />
              <div class="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{{ formatCurrency(cartStore.totalPriceWithFee) }}</span>
              </div>
            </div>

            <div class="mt-6 flex flex-col md:flex-row gap-2">
              <button
                @click="router.push('/browse')"
                class="w-full px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-100 text-center"
              >
                Continue Shopping
              </button>
              <button
                @click="cartStore.checkout()"
                class="w-full px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
