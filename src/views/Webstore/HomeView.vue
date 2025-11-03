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
    <div class="space-y-8">
      <FeaturedCarousel :games="featured.slice(0,5)" :loading="loading" :intervalMs="4000" />
      <NewReleasesRail :games="newReleases" :loading="loading" title="New Releases" />
    </div>
  </div>
</template>
