<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/services/apiService'

const props = defineProps<{ category: Category }>()

const cover = computed(() => props.category.categoryImage || '/placeholder/collection-cover.jpg')
const title = computed(() => props.category.name || 'Untitled Collection')
/* eslint-disable */
const subtitle = computed(() =>
  (props.category as any)?.gameCount
    ? `${(props.category as any).gameCount} titles`
    : ((props.category as any)?.description || '').slice(0, 80),
)
</script>

<template>
  <router-link
    :to="`/browse/category/${category.id}`"
    class="group block rounded-3xl bg-white border border-neutral-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-emerald-100"
  >
    <div class="relative">
      <img
        :src="cover"
        :alt="title"
        class="w-full aspect-video object-cover"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
    </div>

    <div class="p-6 md:p-7">
      <div class="flex items-start justify-between gap-4">
        <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 leading-tight">
          {{ title }}
        </h2>
        <div
          class="shrink-0 rounded-full border border-neutral-200 p-2 text-neutral-500 transition group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      <p v-if="subtitle" class="mt-3 text-neutral-500">
        {{ subtitle }}
      </p>

      <div class="mt-5 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
        <span
          v-if="(category as any)?.tag"
          class="inline-flex items-center px-3 py-1 rounded-full border border-neutral-200"
        >
          {{ (category as any).tag }}
        </span>
        <span
          v-if="(category as any)?.updatedAt"
          class="inline-flex items-center px-3 py-1 rounded-full border border-neutral-200"
        >
          Updated: {{ (category as any).updatedAt }}
        </span>
      </div>
    </div>
  </router-link>
</template>
