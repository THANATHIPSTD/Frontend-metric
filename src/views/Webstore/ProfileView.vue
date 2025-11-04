<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import apiService, { type UserReporter } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

const user = ref<UserReporter | null>(null)
const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const newImageUrl = ref('')
const newPassword = ref('')
const errorMsg = ref<string | null>(null)

const todayStr = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

onMounted(async () => {
  try {
    const res = await apiService.getCurrentUser()
    user.value = res
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to load user profile.'
  } finally {
    isLoading.value = false
  }
})

function enableEdit() {
  isEditing.value = true
  newImageUrl.value = user.value?.profileImage || ''
}

function cancelEdit() {
  isEditing.value = false
  newImageUrl.value = user.value?.profileImage || ''
  newPassword.value = ''
}

async function saveProfile() {
  if (!user.value) return
  isSaving.value = true
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      email: user.value.email,
      profileImage: newImageUrl.value || user.value.profileImage,
    }
    if (newPassword.value?.trim()) payload.newPassword = newPassword.value

    const updatedUser = await apiService.updateMyProfile(payload)

    user.value = updatedUser

    authStore.setUser(updatedUser)

    isEditing.value = false
    newPassword.value = ''
  } catch (e) {
    console.error(e)
    alert('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header gradient -->
      <div class="rounded-2xl bg-linear-to-r from-zinc-800 via-zinc-700 to-zinc-900 p-px shadow-lg">
        <div class="rounded-2xl bg-white/80 dark:bg-zinc-900/70 backdrop-blur">
          <div class="flex items-center gap-3 px-6 py-5">
            <div
              class="h-10 w-10 rounded-xl bg-white/70 text-white dark:bg-white/10 flex items-center justify-center shadow"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 opacity-80"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zM12 14.4c-3.6 0-10.8 1.8-10.8 5.4v1.8h21.6v-1.8c0-3.6-7.2-5.4-10.8-5.4z"
                />
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                {{ user ? `Welcome, ${user.firstname} ${user.lastname}` : 'Profile' }}
              </h2>
              <p class="text-sm text-zinc-500">{{ todayStr }}</p>
            </div>
            <div class="hidden sm:flex items-center gap-2">
              <span
                class="rounded-full px-3 py-1 text-xs font-medium bg-zinc-100 text-zinc-600 border border-zinc-200"
                v-if="user"
                >{{ user.username }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="mt-6">
        <!-- Loading skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-1 rounded-2xl bg-white shadow p-6 animate-pulse">
            <div class="w-28 h-28 rounded-full bg-zinc-200 mb-4"></div>
            <div class="h-4 bg-zinc-200 rounded w-2/3 mb-2"></div>
            <div class="h-3 bg-zinc-200 rounded w-1/2"></div>
          </div>
          <div class="lg:col-span-2 rounded-2xl bg-white shadow p-6 animate-pulse">
            <div class="h-4 bg-zinc-200 rounded w-1/3 mb-6"></div>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="h-10 bg-zinc-200 rounded"></div>
              <div class="h-10 bg-zinc-200 rounded"></div>
              <div class="h-10 bg-zinc-200 rounded"></div>
              <div class="h-10 bg-zinc-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div
          v-else-if="errorMsg"
          class="rounded-2xl bg-red-50 border border-red-200 text-red-700 px-5 py-4"
        >
          {{ errorMsg }}
        </div>

        <!-- Profile content -->
        <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left: avatar card -->
          <div
            class="group rounded-2xl bg-white shadow-lg ring-1 ring-zinc-100 p-6 relative overflow-hidden"
          >
            <!-- aura -->
            <div
              class="pointer-events-none absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style="
                background: radial-gradient(
                  600px circle at var(--x, 50%) var(--y, 50%),
                  rgba(99, 102, 241, 0.15),
                  transparent 40%
                );
              "
            ></div>

            <div class="relative z-10 flex flex-col items-center text-center">
              <div class="relative">
                <img
                  :src="
                    user.profileImage ||
                    'https://pbs.twimg.com/profile_images/1283676276314632193/D1Wnm-EW_400x400.jpg'
                  "
                  alt="Profile"
                  class="w-28 h-28 rounded-full object-cover shadow ring-2 ring-white transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span
                  class="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-600 text-white shadow ring-2 ring-white"
                  title="Verified"
                >
                  ✓
                </span>
              </div>

              <h3 class="mt-4 text-lg font-semibold">{{ user.firstname }} {{ user.lastname }}</h3>
              <p class="text-zinc-500 text-sm break-all">{{ user.email }}</p>

              <transition name="fade">
                <div v-if="isEditing" class="w-full mt-4">
                  <label class="block text-sm font-medium text-zinc-600 mb-1"
                    >New Profile Image URL</label
                  >
                  <input
                    v-model="newImageUrl"
                    type="text"
                    placeholder="https://..."
                    class="w-full rounded-lg border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-2"
                  />
                </div>
              </transition>

              <div class="mt-5 flex gap-2 w-full">
                <button
                  v-if="!isEditing"
                  @click="enableEdit"
                  class="w-full rounded-lg px-4 py-2 bg-black text-white font-medium shadow hover:shadow-md hover:bg-zinc-800 active:scale-[0.98] transition"
                >
                  Edit Profile
                </button>
                <div v-else class="flex w-full gap-2">
                  <button
                    @click="cancelEdit"
                    class="w-1/2 rounded-lg px-4 py-2 bg-zinc-100 text-zinc-800 font-medium border border-zinc-200 hover:bg-zinc-200 active:scale-[0.98] transition"
                  >
                    Cancel
                  </button>
                  <button
                    @click="saveProfile"
                    :disabled="isSaving"
                    class="w-1/2 rounded-lg px-4 py-2 bg-black text-white font-medium shadow hover:shadow-md active:scale-[0.98] transition disabled:opacity-60"
                  >
                    {{ isSaving ? 'Saving…' : 'Save' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: info form -->
          <div class="lg:col-span-2 rounded-2xl bg-white shadow-lg ring-1 ring-zinc-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold">Profile Information</h4>
              <span
                class="text-xs px-2 py-1 rounded-full border"
                :class="
                  isEditing
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                "
              >
                {{ isEditing ? 'Editing' : 'Read-only' }}
              </span>
            </div>

            <div class="grid sm:grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-sm text-zinc-600">First Name</label>
                <input
                  v-model="user.firstname"
                  :readonly="!isEditing"
                  class="w-full rounded-lg border p-2 transition"
                  :class="
                    isEditing
                      ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-transparent bg-zinc-50 text-zinc-700 cursor-default'
                  "
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm text-zinc-600">Last Name</label>
                <input
                  v-model="user.lastname"
                  :readonly="!isEditing"
                  class="w-full rounded-lg border p-2 transition"
                  :class="
                    isEditing
                      ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-transparent bg-zinc-50 text-zinc-700 cursor-default'
                  "
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm text-zinc-600">Email</label>
                <input
                  v-model="user.email"
                  :readonly="!isEditing"
                  type="email"
                  class="w-full rounded-lg border p-2 transition"
                  :class="
                    isEditing
                      ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-transparent bg-zinc-50 text-zinc-700 cursor-default'
                  "
                />
              </div>

              <div class="space-y-1">
                <label class="text-sm text-zinc-600">New Password</label>
                <input
                  v-model="newPassword"
                  :readonly="!isEditing"
                  type="password"
                  placeholder="Enter new password"
                  class="w-full rounded-lg border p-2 transition"
                  :class="
                    isEditing
                      ? 'border-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                      : 'border-transparent bg-zinc-50 text-zinc-700 cursor-default'
                  "
                />
              </div>

              <div class="space-y-1 sm:col-span-2">
                <label class="text-sm text-zinc-600">Roles</label>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="r in user.roles"
                    :key="r"
                    class="rounded-full px-3 py-1 text-xs font-medium border bg-zinc-50 text-zinc-700"
                    >{{ r }}</span
                  >
                </div>
              </div>
            </div>

            <!-- action buttons (ซ้ำกับ card ซ้ายเพื่อความสะดวกบนหน้าจอเล็ก) -->
            <div class="mt-6 flex gap-2 lg:hidden">
              <button
                v-if="!isEditing"
                @click="enableEdit"
                class="w-full rounded-lg px-4 py-2 bg-indigo-600 text-white font-medium shadow hover:shadow-md hover:bg-indigo-700 active:scale-[0.98] transition"
              >
                Edit Profile
              </button>
              <div v-else class="flex w-full gap-2">
                <button
                  @click="cancelEdit"
                  class="w-1/2 rounded-lg px-4 py-2 bg-zinc-100 text-zinc-800 font-medium border border-zinc-200 hover:bg-zinc-200 active:scale-[0.98] transition"
                >
                  Cancel
                </button>
                <button
                  @click="saveProfile"
                  :disabled="isSaving"
                  class="w-1/2 rounded-lg px-4 py-2 bg-black text-white font-medium shadow hover:shadow-md active:scale-[0.98] transition disabled:opacity-60"
                >
                  {{ isSaving ? 'Saving…' : 'Save' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ถ้าไม่มี user -->
        <div v-else class="rounded-2xl bg-white shadow p-6 text-zinc-600">
          No profile to display.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* เอฟเฟกต์ออร่าตามตำแหน่งเมาส์ */
.group:hover {
  --x: 50%;
  --y: 50%;
}
.group {
  position: relative;
}
.group:where(:hover):not(:has(input:focus)) {
  cursor: default;
}
</style>
