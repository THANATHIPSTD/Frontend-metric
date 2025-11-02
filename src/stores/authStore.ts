import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 1. Import Types และ Service ที่เราจะสร้างในขั้นตอนถัดไป
import apiService, {
  type UserReporter,
  type AuthResponse,
  type RegisterRequest,
} from '@/services/apiService'

// 2. อ่านข้อมูลเริ่มต้นจาก localStorage
// ไฟล์ AxiosInterceptorSetup.ts ของคุณจะอ่าน 'access_token' นี้ไปใช้เอง
const initialUser = localStorage.getItem('user')
const initialToken = localStorage.getItem('access_token')

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // --- STATE ---
  const user = ref<UserReporter | null>(initialUser ? JSON.parse(initialUser) : null)
  const token = ref<string | null>(initialToken)

  // --- GETTERS (Computed) ---
  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => {
    // เช็ค Role จาก UserReporter.java
    return user.value?.roles?.includes('ROLE_ADMIN') || false
  })

  // --- ACTIONS ---

  /**
   * (Helper) ฟังก์ชันสำหรับบันทึกข้อมูลตอน Login/Register
   */
  function _setAuth(authResponse: AuthResponse) {
    const { access_token, user: userData } = authResponse

    // 1. บันทึกลง State
    user.value = userData
    token.value = access_token

    // 2. บันทึกลง localStorage
    // (Axios Interceptor ของคุณจะอ่านจากที่นี่)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('access_token', access_token)
  }

  /**
   * (Helper) ฟังก์ชันสำหรับล้างข้อมูลตอน Logout
   */
  function _clearAuth() {
    // 1. ล้าง State
    user.value = null
    token.value = null

    // 2. ล้าง localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
  }

  /**
   * Action: Login
   */
  async function login(username: string, password: string) {
    try {
      // 1. เรียก API (จาก AuthenticationController.java)
      const response = await apiService.login(username, password)

      // 2. บันทึกข้อมูล
      _setAuth(response)

      // 3. เด้งไปหน้าแรก
      router.push('/')
    } catch (error) {
      console.error('Login Failed:', error)
      _clearAuth() // ถ้าพลาด ให้ล้างข้อมูลเก่า (ถ้ามี)
      throw error // ส่ง error ต่อไปให้ Component แสดงผล
    }
  }

  /**
   * Action: Register
   */
  async function register(payload: RegisterRequest) {
    try {
      // 1. เรียก API (จาก AuthenticationController.java)
      const response = await apiService.register(payload)

      // 2. บันทึกข้อมูล
      _setAuth(response)

      // 3. เด้งไปหน้าแรก
      router.push('/')
    } catch (error) {
      console.error('Register Failed:', error)
      _clearAuth()
      throw error
    }
  }

  /**
   * Action: Logout
   */
  async function logout() {
    try {
      // 1. (แนะนำ) เรียก API Logout ของ Backend
      // Interceptor จะแนบ Token ไปให้เอง
      await apiService.logout()
    } catch (error) {
      console.warn('Logout API failed, but logging out locally anyway:', error)
    }

    // 2. ล้างข้อมูลและเด้งไปหน้า Login
    _clearAuth()
    router.push('/login')
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
  }
})
