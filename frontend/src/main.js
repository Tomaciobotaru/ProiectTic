import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { onAuthStateChanged } from 'firebase/auth'

import App from './App.vue'
import router from './router'
import { auth } from './firebase'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

const authStore = useAuthStore(pinia)
onAuthStateChanged(auth, (user) => {
  authStore.setUser(user)
})

app.mount('#app')
