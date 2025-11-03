<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import { type Game } from '@/services/apiService'

type GameWithPosition = Game & { homepagePosition?: number | null }

const allGames = ref<GameWithPosition[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)
const submitting = ref(false)
const searchAvailable = ref('')
const originalSelectedIds = ref<Set<string>>(new Set())

const selectedGames = computed(() => {
  return allGames.value
    .filter((g) => g.homepagePosition !== null && g.homepagePosition !== undefined)
    .sort((a, b) => (a.homepagePosition || 0) - (b.homepagePosition || 0))
})

const availableGames = computed(() => {
  return allGames.value
    .filter((g) => g.homepagePosition === null || g.homepagePosition === undefined)
    .filter((g) => g.title.toLowerCase().includes(searchAvailable.value.toLowerCase()))
    .sort((a, b) => a.title.localeCompare(b.title))
})

function reindexSelectedGames() {
  selectedGames.value.forEach((g, index) => {
    g.homepagePosition = index + 1
  })
  allGames.value = [...allGames.value]
}

async function fetchGames() {
  isLoading.value = true
  errorMsg.value = null
  try {
    const all = await backofficeApiService.fetchAllGamesUnpaginated()
    const featured = await backofficeApiService.fetchFeaturedGamesForManagement()
    const featuredMap = new Map(featured.map((g, index: number) => [g.id, index + 1]))

    const mergedGames: GameWithPosition[] = all.map((game) => {
      const position = featuredMap.get(game.id)
      return {
        ...game,
        homepagePosition: position !== undefined ? position : null,
      } as GameWithPosition
    })

    allGames.value = mergedGames
    originalSelectedIds.value = new Set(
      mergedGames
        .filter((g) => g.homepagePosition !== null && g.homepagePosition !== undefined)
        .map((g) => g.id),
    )
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to fetch game list.'
  } finally {
    isLoading.value = false
  }
}

function move(game: GameWithPosition, direction: 'up' | 'down') {
  const list = selectedGames.value
  const index = list.findIndex((g) => g.id === game.id)
  if (index === -1) return

  const targetIndex = index + (direction === 'up' ? -1 : 1)
  if (targetIndex < 0 || targetIndex >= list.length) return

  const targetGame = list[targetIndex]!
  const tempPos = game.homepagePosition!
  game.homepagePosition = targetGame.homepagePosition!
  targetGame.homepagePosition = tempPos

  reindexSelectedGames()
}

function handleAdd(game: GameWithPosition) {
  if (selectedGames.value.length >= 5) {
    alert('Maximum 5 Highlight Games already selected.')
    return
  }

  const nextPosition =
    (selectedGames.value[selectedGames.value.length - 1]?.homepagePosition || 0) + 1
  game.homepagePosition = nextPosition
  reindexSelectedGames()
}

function handleRemove(game: GameWithPosition) {
  game.homepagePosition = null
  nextTick(() => {
    reindexSelectedGames()
  })
}

async function handleSave() {
  submitting.value = true
  errorMsg.value = null

  if (selectedGames.value.length > 5) {
    alert('Error: Cannot save. You have selected more than 5 Highlight Games.')
    submitting.value = false
    return
  }

  try {
    const previousSelectedIds = originalSelectedIds.value
    const currentSelectedIds = selectedGames.value.map((g) => g.id)
    const idsToRemove = [...previousSelectedIds].filter((id) => !currentSelectedIds.includes(id))

    const promises: Promise<void>[] = []

    idsToRemove.forEach((id) => {
      promises.push(backofficeApiService.setGamePosition(id, 'feature', null))
    })

    selectedGames.value.forEach((game, index) => {
      promises.push(backofficeApiService.setGamePosition(game.id, 'feature', index + 1))
    })

    await Promise.all(promises)
    alert('Highlight Games order saved successfully!')
    await fetchGames()
  } catch (err: unknown) {
    errorMsg.value = err instanceof Error ? err.message : 'Failed to save Highlight Games order.'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchGames)
</script>

<template>
  <div class="p-4 sm:p-8">
    <header
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-zinc-300 pb-4 gap-3"
    >
      <h2 class="text-2xl sm:text-3xl font-bold">Homepage Management (Highlight Games)</h2>
      <button
        @click="handleSave"
        :disabled="submitting || selectedGames.length > 5"
        class="w-full sm:w-auto bg-zinc-900 text-white px-4 py-2 rounded-full font-medium hover:bg-white hover:text-zinc-900 transition disabled:bg-gray-400 disabled:text-zinc-700"
      >
        <span v-if="submitting">Saving...</span>
        <span v-else-if="selectedGames.length > 5" class="text-red-300"
          >Max 5 Games Selected ({{ selectedGames.length }})</span
        >
        <span v-else>Save Highlight Games Order</span>
      </button>
    </header>

    <div
      v-if="errorMsg"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
    >
      {{ errorMsg }}
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-4">
        <h3 class="text-xl font-semibold border-zinc-300 pb-2">
          Available Games ({{ availableGames.length }})
        </h3>

        <input
          type="text"
          v-model="searchAvailable"
          placeholder="Filter by game title..."
          class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />

        <div v-if="isLoading" class="space-y-3">
          <div
            v-for="i in 10"
            :key="i"
            class="flex items-center gap-3 p-3 border-b border-zinc-200 animate-pulse"
          >
            <div class="w-10 h-10 bg-gray-200 rounded-md shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-16 h-8 bg-gray-200 rounded-full shrink-0"></div>
          </div>
        </div>

        <div
          v-else
          class="max-h-[70vh] overflow-y-auto border border-zinc-300 rounded-lg shadow-inner"
        >
          <ul v-if="availableGames.length > 0">
            <li
              v-for="game in availableGames"
              :key="game.id"
              class="flex justify-between items-center p-3 border-b border-zinc-200 hover:bg-gray-50"
            >
              <div class="flex items-center gap-3 truncate">
                <img
                  :src="game.icongameUrl || '/placeholder/icon.jpg'"
                  class="w-10 h-10 object-cover rounded-md shrink-0"
                />
                <span class="font-medium truncate">{{ game.title }}</span>
              </div>
              <button
                @click="handleAdd(game)"
                :disabled="selectedGames.length >= 5"
                class="bg-zinc-900 text-white px-3 py-1 rounded-full text-sm hover:bg-zinc-700 disabled:bg-gray-200 shrink-0"
              >
                ADD
              </button>
            </li>
          </ul>
          <div v-else class="text-center p-6 text-zinc-500">
            No available games match your filter.
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-xl font-semibold border-zinc-300 pb-2">
          Selected Highlight Games
          <span :class="selectedGames.length > 5 ? 'text-red-500' : 'text-zinc-900'">
            ({{ selectedGames.length }} / 5)</span
          >
        </h3>

        <div class="max-h-[70vh] overflow-y-auto border border-zinc-300 rounded-lg shadow-inner">
          <ul v-if="selectedGames.length > 0" class="divide-y divide-zinc-200">
            <li
              v-for="(game, index) in selectedGames"
              :key="game.id"
              class="flex justify-between items-center p-3 bg-white"
              :class="{ 'bg-red-50 border-l-4 border-red-500': index >= 5 }"
            >
              <div class="flex items-center gap-3">
                <span class="font-bold text-lg w-6 text-center shrink-0">{{ index + 1 }}.</span>
                <img
                  :src="game.icongameUrl || '/placeholder/icon.jpg'"
                  class="w-10 h-10 object-cover rounded-md shrink-0"
                />
                <span class="font-medium truncate">{{ game.title }}</span>
              </div>

              <div class="flex items-center space-x-2 shrink-0">
                <button
                  @click="move(game, 'up')"
                  :disabled="index === 0"
                  class="p-1 rounded-full text-zinc-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="move(game, 'down')"
                  :disabled="index === selectedGames.length - 1"
                  class="p-1 rounded-full text-zinc-600 hover:bg-gray-100 disabled:opacity-30"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>
                <button
                  @click="handleRemove(game)"
                  class="p-1 rounded-full text-red-600 hover:bg-red-100"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </li>
          </ul>
          <div v-else class="text-center p-6 text-zinc-500">
            <div v-if="isLoading" class="space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-2 p-3 animate-pulse">
                <div class="w-6 h-6 bg-gray-200 rounded"></div>
                <div class="w-10 h-10 bg-gray-200 rounded-md"></div>
                <div class="flex-1 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div v-else class="text-center p-6 text-zinc-500">
              No games selected. Add up to 5 games from the list on the left.
            </div>
          </div>
        </div>
        <p v-if="selectedGames.length > 5" class="text-sm text-red-500 font-medium mt-2">
          ⚠️ Too many games selected. Only the first 5 games will be displayed on the homepage.
        </p>
      </div>
    </div>
  </div>
</template>
