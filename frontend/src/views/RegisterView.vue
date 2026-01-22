<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Creeaza cont</h2>
      <p>Completeaza datele pentru a-ti crea un cont nou.</p>

      <form @submit.prevent="handleRegister">
        <label>
          Nume
          <input v-model="name" type="text" placeholder="Numele tau" />
        </label>

        <label>
          Email
          <input v-model="email" type="email" placeholder="email@exemplu.ro" />
        </label>

        <label>
          Parola
          <input v-model="password" type="password" placeholder="Minim 6 caractere" />
        </label>

        <button class="primary-button" :disabled="loading">
          Creeaza cont
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>

      <p class="auth-footer">
        Ai deja cont?
        <RouterLink to="/login">Autentifica-te</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  try {
    error.value = ''
    loading.value = true
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value
    )
    if (name.value.trim()) {
      await updateProfile(credentials.user, {
        displayName: name.value.trim()
      })
    }

    await setDoc(doc(db, 'users', credentials.user.uid), {
      name: name.value.trim() || '',
      email: credentials.user.email,
      role: 'client',
      createdAt: serverTimestamp()
    })

    router.push('/')
  } catch (err) {
    error.value = 'Crearea contului a esuat. Verifica datele.'
    console.error('Register failed:', err)
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
  width: min(440px, 92vw);
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

.auth-footer {
  margin-top: 1.4rem;
  text-align: center;
  font-size: 0.9rem;
}

</style>
