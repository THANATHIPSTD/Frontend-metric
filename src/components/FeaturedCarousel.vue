<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

type GameCard = {
  id: string
  title: string
  mainImageUrl: string
  iconGameUrl: string
  price: number
  promotionPrice?: number | null
}

const props = defineProps<{
  games: GameCard[]
  intervalMs?: number       // default 4000ms
  loading?: boolean         // <<— NEW: แสดง skeleton ขณะโหลด
}>()

const router = useRouter()

// จำกัดไว้ 5 เกมเสมอ
const limitedGames = computed(() => (props.games ?? []).slice(0, 5))

const activeIndex = ref(0)
const hoveringMain = ref(false)
let timer: number | null = null

const hasGames = computed(() => limitedGames.value.length > 0)
const activeGame = computed(() => limitedGames.value[activeIndex.value])

function goTo(i: number) {
  const max = limitedGames.value.length
  if (!max) return
  activeIndex.value = ((i % max) + max) % max
}
function next() { goTo(activeIndex.value + 1) }
function toProduct(id: string) { router.push(`/product/${id}`) }

function start() {
  stop()
  const ms = props.intervalMs ?? 4000
  if (limitedGames.value.length > 1) {
    timer = window.setInterval(() => {
      if (!hoveringMain.value) next()
    }, ms)
  }
}
function stop() { if (timer) { clearInterval(timer); timer = null } }

watch(() => limitedGames.value.length, () => { activeIndex.value = 0; start() })
onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
    <!-- Left: Big Carousel OR Skeleton -->
    <div
      class="md:col-span-3 relative rounded-2xl overflow-hidden bg-zinc-100 shadow-lg"
      @mouseenter="hoveringMain = true"
      @mouseleave="hoveringMain = false"
    >
      <!-- Skeleton (left) -->
      <div v-if="loading" class="h-[54vw] max-h-[520px] skeleton"></div>

      <!-- Real content (left) -->
      <div v-else>
        <div v-if="hasGames" class="relative">
          <transition name="fade-slide" mode="out-in">
            <div :key="activeGame?.id" class="relative">
              <img
                :src="activeGame!.mainImageUrl"
                :alt="activeGame!.title"
                class="w-full h-[54vw] max-h-[520px] object-cover cursor-pointer"
                @click="toProduct(activeGame!.id)"
              />

              <!-- gradient + title + price + button -->
              <div
                class="absolute inset-x-0 bottom-0 p-4 md:p-6
                       bg-gradient-to-t from-black/75 via-black/35 to-transparent"
              >
                <div class="flex flex-col gap-2 md:gap-3">
                  <h3 class="text-white text-2xl md:text-3xl font-semibold drop-shadow">
                    {{ activeGame!.title }}
                  </h3>

                  <div class="text-white">
                    <template v-if="activeGame!.promotionPrice">
                      <div class="opacity-80 line-through text-sm md:text-base">
                        ฿{{ activeGame!.price }}
                      </div>
                      <div class="text-2xl md:text-3xl font-bold">
                        ฿{{ activeGame!.promotionPrice }}
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-2xl md:text-3xl font-bold">
                        ฿{{ activeGame!.price }}
                      </div>
                    </template>
                  </div>

                  <div>
                    <button
                      class="inline-flex items-center rounded-full bg-white/95 text-black
                             px-4 py-2 text-sm md:text-base font-medium hover:bg-white
                             shadow-sm"
                      @click.stop="toProduct(activeGame!.id)"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- bottom dots -->
          <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
            <button
              v-for="(g, idx) in limitedGames"
              :key="g.id"
              class="w-2.5 h-2.5 rounded-full border"
              :class="idx === activeIndex ? 'bg-white border-white' : 'bg-white/60 border-white/80 hover:bg-white/90'"
              @click="goTo(idx)"
              aria-label="slide-dot"
            />
          </div>
        </div>

        <div v-else class="h-[54vw] max-h-[520px] grid place-items-center text-zinc-500">
          No featured games
        </div>
      </div>
    </div>

    <!-- RIGHT: Glass stack OR Skeleton -->
    <div class="md:col-span-1">
      <!-- Skeleton (right) -->
      <div v-if="loading" class="hidden md:grid grid-rows-5 gap-3 h-[54vw] max-h-[520px]">
        <div v-for="n in 5" :key="n"
             class="relative w-full overflow-hidden rounded-xl p-3 flex items-center gap-3
                    bg-white/40 backdrop-blur-md border border-white/30">
          <div class="w-11 h-11 rounded-lg skeleton"></div>
          <div class="h-4 w-3/4 rounded skeleton"></div>
        </div>
      </div>

      <!-- Real content (right) -->
      <div v-else>
        <div v-if="limitedGames.length" class="hidden md:grid grid-rows-5 gap-3 h-[54vw] max-h-[520px]">
          <button
            v-for="(g, idx) in limitedGames"
            :key="g.id"
            class="group relative w-full overflow-hidden rounded-xl p-3 flex items-center gap-3
                   bg-white/40 backdrop-blur-md border
                   transition-all duration-200"
            :class="idx === activeIndex
              ? 'border-white/60 shadow-[0_8px_24px_rgba(0,0,0,.12)]'
              : 'border-white/20 hover:border-white/40 hover:shadow-[0_6px_18px_rgba(0,0,0,.08)]'"
            @click="goTo(idx)"
          >
            <!-- accent bar -->
            <span
              class="absolute left-0 top-0 h-full w-1 transition-all"
              :class="idx === activeIndex ? 'bg-gradient-to-b from-cyan-400 to-blue-500' : 'bg-transparent group-hover:bg-white/50'"
            />
            <img :src="g.iconGameUrl" :alt="g.title" class="w-11 h-11 rounded-lg object-cover ring-1 ring-white/20" />
            <span class="text-sm font-medium truncate">{{ g.title }}</span>
          </button>
        </div>

        <div v-else class="text-zinc-500">No featured games found.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* slide + fade */
.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.6s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateX(40px); }
.fade-slide-leave-to   { opacity: 0; transform: translateX(-40px); }

/* Shimmer skeleton */
.skeleton {
  position: relative;
  overflow: hidden;
  background-color: rgb(244 244 245); /* zinc-100 */
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
