<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '@/services/apiService'
import type { GameCard } from '@/services/apiService'
import FeaturedCarousel from '@/components/FeaturedCarousel.vue'
import NewReleasesRail from '@/components/NewReleasesRail.vue'

const loading = ref(true)
const featured = ref<GameCard[]>([])
const newReleases = ref<GameCard[]>([])
const errorMsg = ref<string | null>(null)

onMounted(async () => {
  try {
    const data = await apiService.fetchHomePageData()
    featured.value = data.featuredGames ?? []
    newReleases.value = data.newReleaseGames ?? []
  } catch (e: any) {
    errorMsg.value = e?.message || 'Failed to load homepage'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div v-if="loading" class="text-center py-12 text-zinc-500">Loading...</div>
    <div v-else-if="errorMsg" class="text-center py-12 text-red-500">{{ errorMsg }}</div>
    <div v-else class="space-y-8">
      <!-- Featured -->
      <FeaturedCarousel :games="featured.slice(0,5)" :intervalMs="4000" />

      <!-- New Releases -->
      <NewReleasesRail :games="newReleases" title="New Releases" />
    </div>
  </div>
</template>
