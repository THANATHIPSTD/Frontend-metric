import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import apiService, {
  type UserReporter,
  type AuthResponse,
  type RegisterRequest,
} from '@/services/apiService'

import { useCartStore } from './cartStore'

const initialUser = localStorage.getItem('user')
const initialToken = localStorage.getItem('access_token')

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  let cartStore: ReturnType<typeof useCartStore> | null = null

  const user = ref<UserReporter | null>(initialUser ? JSON.parse(initialUser) : null)
  const token = ref<string | null>(initialToken)

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => {
    return user.value?.roles?.includes('ROLE_ADMIN') || false
  })

  function _setAuth(authResponse: AuthResponse) {
    const { access_token, user: userData } = authResponse
    if (!cartStore) cartStore = useCartStore()

    user.value = userData
    token.value = access_token

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('access_token', access_token)

    cartStore.fetchCart()
  }

  function _clearAuth() {
    if (!cartStore) cartStore = useCartStore()
    user.value = null
    token.value = null

    localStorage.removeItem('user')
    localStorage.removeItem('access_token')

    cartStore.clearCart()
  }

  async function login(username: string, password: string) {
    try {
      const response = await apiService.login(username, password)

      _setAuth(response)

      await refreshUser()

      router.push('/')
    } catch (error) {
      console.error('Login Failed:', error)
      _clearAuth()
      throw error
    }
  }

  async function register(payload: RegisterRequest) {
    try {
      const response = await apiService.register(payload)

      _setAuth(response)


      await refreshUser()

      router.push('/')
    } catch (error) {
      console.error('Register Failed:', error)
      _clearAuth()
      throw error
    }
  }

  async function logout() {
    try {
      await apiService.logout()
    } catch (error) {
      console.warn('Logout API failed, but logging out locally anyway:', error)
    }

    _clearAuth()
    router.push('/login')
  }

  function setUser(u: UserReporter) {
    user.value = u
    localStorage.setItem('user', JSON.stringify(u))
  }

  async function refreshUser() {
    const me = await apiService.getCurrentUser()
    setUser(me)
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    setUser,
    refreshUser,
  }
})
