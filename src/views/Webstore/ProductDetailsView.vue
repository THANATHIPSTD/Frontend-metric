<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService, { type Game, type CartItemDTO, type Category } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

// --- Setup ---
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const game = ref<Game | null>(null)
const categories = ref<Category[]>([])
const isLoading = ref(true)
const selectedPlatform = ref<string>('')
const isShaking = ref(false)

onMounted(async () => {
  const gameId = route.params.id as string
  try {
    game.value = await apiService.fetchGameById(gameId)

    if (game.value?.categoryIds) {
      const allCategories = await apiService.fetchCategories()
      categories.value = allCategories.filter((cat) => game.value?.categoryIds.includes(cat.id))
    }
  } catch (error) {
    console.error('Failed to fetch game details:', error)
  } finally {
    isLoading.value = false
  }
})

const categoryNames = computed(() => {
  return categories.value.map((cat) => cat.name).join(', ')
})

function getEmbedUrl(url: string | undefined) {
  if (!url) return ''
  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'
  }
  return url + '?autoplay=1&mute=1'
}

function setPlatform(platform: string) {
  selectedPlatform.value = platform
  isShaking.value = false
}

function handleAddToCart() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (!selectedPlatform.value) {
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 1000)
    return
  }
  if (game.value) {
    const itemData: CartItemDTO = {
      gameId: game.value.id,
      platform: selectedPlatform.value,
      quantity: 1,
    }
    cartStore.addItem(itemData)
  }
}

const formatCurrency = (value: number) => `฿${value.toFixed(2)}`
</script>
<template>
  <div class="pt-1">
    <!-- Loading -->
    <div v-if="isLoading" class="container mx-auto my-12 max-w-7xl p-4">
      <div class="rounded-2xl overflow-hidden shadow-2xl bg-zinc-900">
        <div class="h-96 w-full bg-zinc-700 animate-pulse"></div>
        <div class="p-6 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="aspect-video w-full bg-zinc-700 rounded-lg animate-pulse"></div>
            <div class="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
            <div class="h-4 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
          </div>
          <div class="lg:col-span-1 space-y-4">
            <div class="h-24 w-full bg-zinc-800 rounded-lg animate-pulse"></div>
            <div class="h-10 w-full bg-zinc-800 rounded-full animate-pulse"></div>
            <div class="h-16 w-full bg-zinc-800 rounded-lg animate-pulse"></div>
            <div class="h-12 w-full bg-blue-800 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="game" class="container mx-auto my-12 max-w-7xl">
      <div class="rounded-4xl overflow-hidden shadow-2xl bg-zinc-900">
        <div
          class="h-[600px] md:h-[700px] bg-cover bg-center relative"
          :style="{ backgroundImage: `url(${game.mainImageUrl})` }"
        >
          <div class="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-zinc-900/10"></div>
          <div class="absolute bottom-0 left-0 p-6 md:p-12 z-10">
            <h1 class="text-3xl md:text-5xl font-bold text-white shadow-lg">{{ game.title }}</h1>
            <p class="text-lg text-gray-200 max-w-2xl mt-2 hidden md:block">
              {{
                game.description.length > 100
                  ? game.description.substring(0, 100) + '...'
                  : game.description
              }}
            </p>
          </div>
        </div>

        <!-- Main grid -->
        <div class="p-6 md:p-12 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <!-- Left -->
          <div class="xl:col-span-8 space-y-8">
            <div v-if="game.trailerUrl" class="aspect-video rounded-lg overflow-hidden shadow-lg">
              <iframe
                class="w-full h-full"
                :src="getEmbedUrl(game.trailerUrl)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <section class="text-gray-300">
              <h3 class="font-semibold text-white text-xl mb-3">Description</h3>
              <p class="leading-relaxed">{{ game.description }}</p>
            </section>
          </div>

          <!-- Right: buy card -->
          <div class="xl:col-span-4">
            <div
              class="bg-zinc-900/10 backdrop-blur-md p-6 rounded-2xl shadow-lg sticky top-24 mt-7 flex flex-col gap-5 xl:max-w-[420px] xl:ml-auto"
            >
              <!-- Icon + Title -->
              <div class="flex items-center gap-4">
                <img
                  :src="game.icongameUrl"
                  alt="icon"
                  class="w-16 h-16 rounded-lg object-cover shrink-0 border border-gray-700"
                />
                <div>
                  <h2 class="text-xl font-semibold text-white">{{ game.title }}</h2>
                  <p class="text-sm text-gray-400">{{ categoryNames || 'N/A' }}</p>
                </div>
              </div>

              <!-- Price -->
              <div>
                <div
                  v-if="game.promotionPrice && game.promotionPrice > 0"
                  class="flex items-baseline gap-2"
                >
                  <span class="text-lg text-gray-400 line-through">{{
                    formatCurrency(game.price)
                  }}</span>
                  <span class="text-2xl font-bold text-green-400">{{
                    formatCurrency(game.promotionPrice)
                  }}</span>
                </div>
                <div v-else>
                  <span class="text-2xl font-bold text-white">{{
                    formatCurrency(game.price)
                  }}</span>
                </div>
              </div>

              <!-- Platform -->
              <div>
                <h6 class="text-sm font-medium text-gray-300 mb-2">Select Platform:</h6>
                <div class="grid grid-cols-2 gap-2" :class="{ shake: isShaking }">
                  <button
                    @click="setPlatform('PC')"
                    :class="
                      selectedPlatform === 'PC'
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:bg-gray-700'
                    "
                    class="px-4 py-2 text-sm rounded-full border text-white transition"
                  >
                    PC
                  </button>
                  <button
                    @click="setPlatform('PS5')"
                    :class="
                      selectedPlatform === 'PS5'
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:bg-gray-700'
                    "
                    class="px-4 py-2 text-sm rounded-full border text-white transition"
                  >
                    PS5
                  </button>
                  <button
                    @click="setPlatform('Xbox')"
                    :class="
                      selectedPlatform === 'Xbox'
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:bg-gray-700'
                    "
                    class="px-4 py-2 text-sm rounded-full border text-white transition"
                  >
                    Xbox
                  </button>
                  <button
                    @click="setPlatform('PS4')"
                    :class="
                      selectedPlatform === 'PS4'
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-600 hover:bg-gray-700'
                    "
                    class="px-4 py-2 text-sm rounded-full border text-white transition"
                  >
                    PS4
                  </button>
                </div>
                <p v-if="isShaking" class="text-red-400 text-xs mt-2">Please select a platform.</p>
              </div>

              <button
                @click="handleAddToCart"
                class="mt-auto w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-300 transform hover:scale-105 active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 404 -->
    <div v-else class="text-center py-32">
      <h1 class="text-4xl font-bold">404 - Game Not Found</h1>
      <p class="text-gray-600 mt-4">Sorry, we couldn't find the game you were looking for.</p>
      <router-link
        to="/browse"
        class="mt-6 inline-block px-6 py-3 bg-black text-white rounded-full"
      >
        Back to Browse
      </router-link>
    </div>
  </div>
</template>
