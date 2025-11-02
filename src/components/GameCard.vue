<script setup lang="ts">
import type { Game } from '@/services/apiService'

defineProps<{
  game: Game
}>()

const formatCurrency = (value: number) => {
  if (!value) return '฿0.00'
  return `฿${value.toFixed(2)}`
}
</script>

<template>
  <router-link :to="`/product/${game.id}`" class="block group">
    <div class="aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-100">
      <img
        :src="game.icongameUrl"
        :alt="game.title"
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>

    <h3 class="mt-2 font-semibold text-gray-900 truncate">{{ game.title }}</h3>

    <div class="text-sm font-bold">
      <div v-if="game.promotionPrice && game.promotionPrice < game.price">
        <span class="text-gray-400 line-through mr-2">{{ formatCurrency(game.price) }}</span>
        <span class="text-red-500">{{ formatCurrency(game.promotionPrice) }}</span>
      </div>
      <div v-else class="text-gray-800">
        {{ formatCurrency(game.price) }}
      </div>
    </div>
  </router-link>
</template>
