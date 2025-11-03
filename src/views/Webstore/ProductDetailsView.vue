<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService, { type Game, type CartItemDTO, type Category } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const game = ref<Game | null>(null)
const categories = ref<Category[]>([])
const isLoading = ref(true)
const selectedPlatform = ref<string>('')

const isShaking = ref(false)
const adding = ref(false)
const showSuccess = ref(false)
const showError = ref<null | string>(null)

onMounted(async () => {
  const gameId = route.params.id as string
  try {
    game.value = await apiService.fetchGameById(gameId)
    if (game.value?.categoryIds?.length) {
      const allCategories = await apiService.fetchCategories()
      categories.value = allCategories.filter((cat) => game.value!.categoryIds.includes(cat.id))
    }
  } catch (error) {
    console.error('Failed to fetch game details:', error)
  } finally {
    isLoading.value = false
  }
})

const categoryNames = computed(() => categories.value.map((c) => c.name).join(', '))

function getEmbedUrl(url?: string) {
  if (!url) return ''
  try {
    if (url.includes('watch?v=')) return url.replace('watch?v=', 'embed/') + '?autoplay=1&mute=1'
    return url + (url.includes('?') ? '&' : '?') + 'autoplay=1&mute=1'
  } catch {
    return ''
  }
}

function setPlatform(platform: string) {
  selectedPlatform.value = platform
  isShaking.value = false
}

async function handleAddToCart() {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  if (!selectedPlatform.value) {
    isShaking.value = true
    setTimeout(() => (isShaking.value = false), 900)
    return
  }
  if (!game.value) return

  const itemData: CartItemDTO = {
    gameId: game.value.id,
    platform: selectedPlatform.value,
    quantity: 1,
  }

  adding.value = true
  showError.value = null
  try {
    await cartStore.addItem(itemData)

    showSuccess.value = true
    setTimeout(() => (showSuccess.value = false), 2500)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.response?.status === 401) {
      showError.value = 'Please login to continue.'
    } else if (err?.response?.data) {
      showError.value = String(err.response.data)
    } else {
      showError.value = err?.message || 'Failed to add to cart.'
    }
    setTimeout(() => (showError.value = null), 3000)
  } finally {
    adding.value = false
  }
}

const formatCurrency = (value: number) => `฿${value.toFixed(2)}`
</script>

<template>
  <div class="pt-1">
    <transition name="fade">
      <div
        v-if="showSuccess"
        class="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50"
        role="status"
        aria-live="polite"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span>Added to cart successfully!</span>
      </div>
    </transition>

    <transition name="fade">
      <div
        v-if="showError"
        class="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50"
        role="alert"
        aria-live="assertive"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z"
          />
        </svg>
        <span>{{ showError }}</span>
      </div>
    </transition>

    <div v-if="isLoading" class="container mx-auto my-12">
      <div class="rounded-4xl overflow-hidden shadow-2xl bg-zinc-900">
        <div class="h-[600px] md:h-[700px] bg-zinc-700 animate-pulse relative">
          <div class="absolute bottom-0 left-0 p-6 md:p-12 z-10 space-y-3">
            <div class="h-10 md:h-14 bg-zinc-600 rounded w-96 max-w-full animate-pulse"></div>
            <div
              class="h-6 bg-zinc-600 rounded w-[500px] max-w-full animate-pulse hidden md:block"
            ></div>
          </div>
        </div>

        <div class="p-6 md:p-12 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div class="xl:col-span-8 space-y-8">
            <div class="aspect-video rounded-lg bg-zinc-700 animate-pulse"></div>
            <div class="space-y-3">
              <div class="h-6 bg-zinc-700 rounded w-32 animate-pulse"></div>
              <div class="h-4 bg-zinc-700 rounded w-full animate-pulse"></div>
              <div class="h-4 bg-zinc-700 rounded w-5/6 animate-pulse"></div>
              <div class="h-4 bg-zinc-700 rounded w-4/6 animate-pulse"></div>
            </div>
          </div>
          <div class="xl:col-span-4">
            <div
              class="bg-zinc-800 p-6 rounded-2xl shadow-lg sticky top-24 mt-7 space-y-5 xl:max-w-[420px] xl:ml-auto"
            >
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 bg-zinc-700 rounded-lg animate-pulse shrink-0"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-5 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
                  <div class="h-4 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div class="h-8 bg-zinc-700 rounded w-32 animate-pulse"></div>
              <div class="space-y-2">
                <div class="h-4 bg-zinc-700 rounded w-32 animate-pulse"></div>
                <div class="grid grid-cols-2 gap-2">
                  <div class="h-10 bg-zinc-700 rounded-full animate-pulse"></div>
                  <div class="h-10 bg-zinc-700 rounded-full animate-pulse"></div>
                  <div class="h-10 bg-zinc-700 rounded-full animate-pulse"></div>
                  <div class="h-10 bg-zinc-700 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div class="h-12 bg-blue-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="game" class="container mx-auto my-12">
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
                (game.description || '').length > 100
                  ? (game.description || '').substring(0, 100) + '...'
                  : game.description || ''
              }}
            </p>
          </div>
        </div>

        <div class="p-6 md:p-12 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
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

          <div class="xl:col-span-4">
            <div
              class="bg-zinc-900/10 backdrop-blur-md p-6 rounded-2xl shadow-lg sticky top-24 mt-15 flex flex-col gap-5 xl:max-w-[420px] xl:ml-auto"
            >
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
                :disabled="adding"
                class="mt-auto w-full py-3 rounded-full text-white font-bold transition duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700"
              >
                <span v-if="adding" class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Adding...
                </span>
                <span v-else>{{
                  authStore.isLoggedIn ? 'Add to Cart' : 'Login to add to cart'
                }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

.shake {
  animation: shake 0.35s linear 0s 1;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
}
</style>
