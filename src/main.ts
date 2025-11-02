import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import App from './App.vue'
import router from './router'
import './services/AxiosInterceptorSetup'

import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'

const app = createApp(App)
app.use(createPinia())
app.use(router)

const authStore = useAuthStore()
const cartStore = useCartStore()
if (authStore.isLoggedIn) {
  cartStore.fetchCart()
}
app.mount('#app')
