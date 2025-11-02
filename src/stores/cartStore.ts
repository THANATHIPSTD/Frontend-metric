import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService, { type CartDTO, type CartItemDTO, type UserOrder } from '@/services/apiService'

export const useCartStore = defineStore('cart', () => {
  const router = useRouter()

  const cart = ref<CartDTO | null>(null)
  const latestOrder = ref<UserOrder | null>(null)
  const isCheckingOut = ref(false)

  const itemCount = computed(() => {
    if (!cart.value || !cart.value.items) {
      return 0
    }
    return cart.value.items.reduce((total, item) => total + (item.quantity || 1), 0)
  })

  const totalPrice = computed(() => {
    return cart.value?.totalPrice || 0
  })

  const totalPriceWithFee = computed(() => {
    if (!cart.value) return 0
    const fee = cart.value.totalPrice * 0.07
    return cart.value.totalPrice + fee
  })

  async function fetchCart() {
    try {
      const response = await apiService.getMyCart()
      cart.value = response
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      cart.value = null
    }
  }

  async function addItem(itemData: CartItemDTO) {
    try {
      const updatedCart = await apiService.addToCart(itemData)
      cart.value = updatedCart
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    }
  }

  async function removeItem(gameId: string, platform: string) {
    try {
      const updatedCart = await apiService.removeItem(gameId, platform)
      cart.value = updatedCart
    } catch (error) {
      console.error('Failed to remove item:', error)
    }
  }
  function clearCart() {
    cart.value = null
  }

  async function checkout() {
    if (isCheckingOut.value) return

    isCheckingOut.value = true
    try {
      const newOrder = await apiService.checkout()
      latestOrder.value = newOrder
      await fetchCart()

      router.push('/thankyou')
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      isCheckingOut.value = false
    }
  }

  return {
    cart,
    latestOrder,
    itemCount,
    totalPrice,
    totalPriceWithFee,
    fetchCart,
    addItem,
    removeItem,
    clearCart,
    checkout,
  }
})
