<script setup lang="ts">
import type { Category } from '@/services/apiService'

defineProps<{
  category: Category
}>()
</script>

<template>
  <router-link
    :to="`/browse/category/${category.id}`"
    class="relative block aspect-4/3 rounded-2xl overflow-hidden shadow-lg group transition-all duration-300"
  >
    <img
      :src="category.categoryImage"
      :alt="category.name"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
    />

    <div
      class="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"
      aria-hidden="true"
    ></div>

    <div class="absolute bottom-0 left-0 p-4 md:p-6">
      <h2
        class="text-3xl font-bold text-white shadow-2xl transition-transform duration-300 ease-in-out group-hover:-translate-y-1"
      >
        {{ category.name }}
      </h2>
    </div>
  </router-link>
</template>
