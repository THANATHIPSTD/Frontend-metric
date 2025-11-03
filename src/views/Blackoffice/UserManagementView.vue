<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import backofficeApiService from '@/services/backofficeApiService'
import type { UserReporter } from '@/services/apiService'
import { useAuthStore } from '@/stores/authStore'

enum Role {
  ROLE_ADMIN = 'ROLE_ADMIN',
  ROLE_USER = 'ROLE_USER',
}

const users = ref<UserReporter[]>([])
const isLoading = ref(true)
const errorMsg = ref<string | null>(null)
const submittingIds = ref<Set<string>>(new Set())

const authStore = useAuthStore()
const currentUserId = computed(() => authStore.user?.id)

async function fetchUsers() {
  isLoading.value = true
  errorMsg.value = null
  try {
    users.value = await backofficeApiService.fetchAllUsers()
  } catch (err: unknown) {
    errorMsg.value = (err as Error).message || 'Failed to fetch users.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchUsers)

// 3. ฟังก์ชันสำหรับอัปเดต (เหลือแค่ Role)
async function handleUpdate(user: UserReporter, newRoles: Role[]) {
  if (submittingIds.value.has(user.id)) return
  submittingIds.value.add(user.id)
  errorMsg.value = null

  try {
    const updatedUser = await backofficeApiService.updateUserRoles(
      user.id,
      newRoles,
      // ⬅️ ไม่ต้องส่ง enabled
    )

    // อัปเดตข้อมูลในตารางทันที
    const index = users.value.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
  } catch (err: unknown) {
    errorMsg.value =
      (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
      'Failed to update user.'
  } finally {
    submittingIds.value.delete(user.id)
  }
}

// 4. ฟังก์ชันย่อยสำหรับปุ่ม Role
function handleChangeRole(user: UserReporter) {
  const newRoles = user.roles.includes(Role.ROLE_ADMIN) ? [Role.ROLE_USER] : [Role.ROLE_ADMIN]
  handleUpdate(user, newRoles) // ⬅️ ส่งแค่ newRoles
}

// 5. ❌ ลบฟังก์ชัน handleChangeStatus ทิ้ง

function isSubmitting(id: string): boolean {
  return submittingIds.value.has(id)
}
</script>

<template>
  <div class="p-4 sm:p-8">
    <header class="flex justify-between items-center mb-6 border-b border-zinc-400 pb-4">
      <h2 class="text-2xl sm:text-3xl font-bold">User Management</h2>
    </header>

    <div v-if="isLoading" class="space-y-4">
      <div
        v-for="n in 5"
        :key="n"
        class="animate-pulse flex items-center bg-white p-4 rounded-lg shadow-sm space-x-4"
      >
        <div class="h-10 w-10 rounded-full bg-gray-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div class="flex gap-2">
          <div class="h-8 w-24 rounded-full bg-gray-200"></div>
          <div class="h-8 w-24 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="errorMsg"
      class="text-center py-10 text-red-600 border border-red-300 bg-red-50 rounded-lg p-4"
    >
      <p class="font-semibold">Error:</p>
      <p>{{ errorMsg }}</p>
      <button @click="fetchUsers" class="mt-4 text-blue-600 hover:underline">Retry Loading</button>
    </div>

    <div v-else class="overflow-x-auto shadow-md rounded-lg">
      <table class="min-w-full bg-white">
        <thead class="bg-zinc-900 text-white text-sm">
          <tr>
            <th class="py-3 px-6 text-left">User</th>
            <th class="py-3 px-6 text-center">Role</th>
            <th class="py-3 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in users"
            :key="user.id"
            class="border-b border-zinc-200 hover:bg-gray-50"
          >
            <td class="py-4 px-6 font-medium text-gray-900">
              <div class="flex items-center gap-3">
                <img
                  :src="user.profileImage"
                  alt=""
                  class="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <div class="truncate">
                  <div class="font-semibold truncate">{{ user.firstname }} {{ user.lastname }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ user.email }}</div>
                </div>
              </div>
            </td>

            <td class="py-4 px-6 text-center">
              <span
                v-if="user.roles.includes(Role.ROLE_ADMIN)"
                class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"
              >
                Administrator
              </span>
              <span
                v-else
                class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                Customer
              </span>
            </td>

            <td class="py-4 px-6 text-right space-x-2 whitespace-nowrap">
              <div v-if="user.id === currentUserId" class="text-sm text-gray-400 italic pr-4">
                (Your Account)
              </div>

              <div v-else>
                <button
                  @click="handleChangeRole(user)"
                  :disabled="isSubmitting(user.id)"
                  class="px-3 py-1.5 rounded-full text-xs font-medium transition"
                  :class="{
                    'bg-yellow-500 hover:bg-yellow-600 text-white': user.roles.includes(
                      Role.ROLE_ADMIN,
                    ),
                    'bg-green-500 hover:bg-green-600 text-white': !user.roles.includes(
                      Role.ROLE_ADMIN,
                    ),
                    'opacity-50 cursor-wait': isSubmitting(user.id),
                  }"
                >
                  {{ user.roles.includes(Role.ROLE_ADMIN) ? 'Demote to User' : 'Promote to Admin' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
