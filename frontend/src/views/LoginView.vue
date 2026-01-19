<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Autentificare</h2>
      <p>Intra in cont pentru a gestiona produsele.</p>

      <form @submit.prevent="handleLogin">
        <label>
          Email
          <input v-model="email" type="text" placeholder="email@exemplu.ro sau admin" />
        </label>

        <label>
          Parola
          <input v-model="password" type="password" placeholder="Parola ta" />
        </label>

        <button class="primary-button" :disabled="loading">
          Autentifica-te
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <div class="divider">
        <span>sau</span>
      </div>

      <button class="google-button" :disabled="loading" @click="handleGoogleLogin">
        Continua cu Google
      </button>

      <p class="auth-footer">
        Nu ai cont?
        <RouterLink to="/register">Creeaza unul aici</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const normalizeCredentials = () => {
  const rawEmail = email.value.trim()
  const rawPassword = password.value.trim()

  if (rawEmail === 'admin' && rawPassword === 'admin') {
    return { email: 'admin@minishop.local', password: 'admin123' }
  }

  return { email: rawEmail, password: rawPassword }
}

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true
    const credentials = normalizeCredentials()
    await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    router.push('/')
  } catch (err) {
    error.value = 'Autentificare esuata. Verifica datele.'
    console.error('Login failed:', err)
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  try {
    error.value = ''
    loading.value = true
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    await setDoc(
      doc(db, 'users', user.uid),
      {
        name: user.displayName || '',
        email: user.email || '',
        role: 'client',
        createdAt: serverTimestamp()
      },
      { merge: true }
    )
    router.push('/')
  } catch (err) {
    error.value = 'Autentificarea cu Google a esuat.'
    console.error('Google login failed:', err)
  } finally {
    loading.value = false
  }
}

watch(
  () => authStore.user,
  (user) => {
    if (user) router.push('/')
  },
  { immediate: true }
)
</script>

<style scoped>
.auth-page {
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.auth-card {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 18px;
  padding: 2rem;
  box-shadow: 0 16px 30px rgba(29, 26, 23, 0.12);
  border: 1px solid var(--color-border);
}

.auth-card h2 {
  margin-bottom: 0.4rem;
}

.auth-card p {
  color: var(--color-ink-muted);
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.9rem;
  font-weight: 600;
  color: var(--color-ink-muted);
}

input {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
}

.primary-button {
  width: 100%;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  border: none;
  background: var(--color-leaf);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.primary-button:hover {
  background: #256447;
}

.error {
  margin-top: 0.6rem;
  color: var(--color-clay-dark);
  font-size: 0.9rem;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin: 1.2rem 0;
  color: var(--color-ink-muted);
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  height: 1px;
  flex: 1;
  background: var(--color-border);
}

.google-button {
  width: 100%;
  padding: 0.65rem 1.2rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: #fff;
  font-weight: 600;
  cursor: pointer;
}

.google-button:hover {
  background: #f7f4ef;
}

.auth-footer {
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.9rem;
}

</style>
