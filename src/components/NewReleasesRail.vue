<script setup lang="ts">
import type { GameCard } from '@/services/apiService' // หรือ type ที่คุณใช้จริง

const props = defineProps<{
  games: GameCard[]
  title?: string
  loading?: boolean
}>()

function toBaht(n?: number | null) {
  return typeof n === 'number' ? `฿${n}` : ''
}
</script>

<template>
  <section class="mt-10">
    <h2 class="text-xl md:text-2xl font-semibold mb-3">
      {{ title || 'Games for you' }}
    </h2>

    <!-- Skeleton rail -->
    <div v-if="loading" class="flex gap-4 overflow-x-hidden pb-2">
      <div v-for="n in 8" :key="n" class="min-w-[180px] w-[180px] rounded-2xl border border-zinc-200 bg-white">
        <div class="w-full h-28 rounded-t-2xl skeleton"></div>
        <div class="p-3">
          <div class="h-4 w-3/4 rounded skeleton mb-2"></div>
          <div class="h-4 w-1/2 rounded skeleton"></div>
        </div>
      </div>
    </div>

    <!-- Real list -->
    <div v-else class="flex gap-4 overflow-x-auto pb-2">
      <div
        v-for="g in games"
        :key="g.id"
        class="min-w-[180px] w-[180px] rounded-2xl border border-zinc-200 hover:border-zinc-400 transition bg-white"
      >
        <img :src="g.iconGameUrl" :alt="g.title" class="w-full h-28 object-cover rounded-t-2xl" />
        <div class="p-3">
          <h6 class="font-medium truncate" :title="g.title">{{ g.title }}</h6>
          <div class="mt-1">
            <template v-if="g.promotionPrice">
              <div class="text-xs line-through opacity-70">{{ toBaht(g.price) }}</div>
              <div class="text-lg font-bold">{{ toBaht(g.promotionPrice) }}</div>
            </template>
            <template v-else>
              <div class="text-lg font-bold">{{ toBaht(g.price) }}</div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* shimmer เหมือนใน FeaturedCarousel */
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(244 244 245);
}
.skeleton::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,.6) 50%,
    rgba(255,255,255,0) 100%
  );
  animation: shimmer 1.2s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>
