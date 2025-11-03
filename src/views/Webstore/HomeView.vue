<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '@/services/apiService'
import type { GameCard } from '@/services/apiService'
import FeaturedCarousel from '@/components/FeaturedCarousel.vue'
import NewReleasesRail from '@/components/NewReleasesRails.vue'

const loading = ref(true)
const featured = ref<GameCard[]>([])
const newReleases = ref<GameCard[]>([])
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await apiService.fetchHomePageData()
    featured.value = data.featuredGames ?? []
    newReleases.value = data.newReleaseGames ?? []
    /* eslint-disable */
  } catch (e: any) {
    /* eslint-enable */
    errorMsg.value = e?.message || 'Failed to load homepage'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-13">
    <div class="bg-white shadow-md p-15 rounded-4xl">
      <div v-if="loading" class="space-y-8">
        <div class="animate-pulse">
          <div class="bg-gray-300 rounded-lg h-130 w-full"></div>
        </div>
        <div class="animate-pulse space-y-4">
          <div class="bg-gray-300 rounded h-8 w-48"></div>
          <div class="flex gap-4">
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
            <div class="bg-gray-300 rounded-lg h-55 w-64"></div>
          </div>
        </div>
      </div>

      <div v-else-if="errorMsg" class="text-center py-12 text-red-500">{{ errorMsg }}</div>
      <div v-else class="space-y-8">
        <FeaturedCarousel :games="featured.slice(0, 5)" :intervalMs="4000" />
        <NewReleasesRail :games="newReleases" title="New Releases" />
      </div>
    </div>
  </div>
</template>
