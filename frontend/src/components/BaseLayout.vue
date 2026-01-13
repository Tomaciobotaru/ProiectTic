<template>
  <div class="layout">
    <header class="site-header">
      <div class="header-inner">
        <div class="header-left">
          <img src="@/assets/logo.jpg" alt="Mini Shop Logo" class="logo" />
          <div>
            <h1>Mini Shop</h1>
            <p class="tagline">Produse esentiale, alese cu grija.</p>
          </div>
        </div>

        <div class="header-right">
          <nav class="nav-bar">
            <RouterLink to="/" class="nav-link">Acasa</RouterLink>
            <RouterLink to="/about" class="nav-link">Despre</RouterLink>
          </nav>
          <div class="user-pill">
            <span v-if="authStore.user" class="user-name">
              {{ displayName }}
            </span>
            <span v-else>Guest</span>
            <span v-if="authStore.isAdmin" class="user-role">Admin</span>
          </div>
          <div class="auth-links">
            <template v-if="!authStore.user">
              <RouterLink to="/login" class="nav-link">Login</RouterLink>
              <RouterLink to="/register" class="nav-link">Creeaza cont</RouterLink>
            </template>
            <button v-else class="signout-button" @click="handleSignOut">
              Delogare
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="site-main">
      <slot />
    </main>

    <footer class="site-footer">
      <p>© 2026 Mini Shop · Experienta de cumparare simpla si clara.</p>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const displayName = computed(() => {
  if (!authStore.user) return ''
  return authStore.user.displayName || authStore.user.email
})

const handleSignOut = async () => {
  try {
    await signOut(auth)
  } catch (err) {
    console.error('Logout failed:', err)
  }
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at top, #fdf8f2 0%, #f7f4ef 35%, #f2eee7 100%);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
}

.header-left h1 {
  font-size: 1.6rem;
  color: var(--color-ink);
  margin: 0;
}

.tagline {
  margin: 0.1rem 0 0;
  font-size: 0.9rem;
  color: var(--color-ink-muted);
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-weight: 600;
  color: var(--color-ink-muted);
  transition: color 0.2s ease, transform 0.2s ease;
}

.nav-link:hover {
  color: var(--color-ink);
  transform: translateY(-1px);
}

.site-main {
  flex: 1;
  padding: 2rem 1.5rem 3rem;
}

.site-footer {
  padding: 1.5rem;
  text-align: center;
  background: #fffaf3;
  border-top: 1px solid var(--color-border);
  font-size: 0.9rem;
  color: var(--color-ink-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  font-size: 0.85rem;
  color: var(--color-ink-muted);
  background: #fff;
}

.user-name {
  font-weight: 600;
  color: var(--color-ink);
}

.user-role {
  padding: 0.1rem 0.4rem;
  border-radius: 999px;
  background: rgba(47, 125, 93, 0.12);
  color: var(--color-leaf);
  font-weight: 600;
  font-size: 0.75rem;
}

.auth-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.signout-button {
  border: none;
  background: var(--color-leaf);
  color: #fff;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.signout-button:hover {
  background: #256447;
}

@media (max-width: 720px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .nav-bar {
    justify-content: flex-start;
  }
}
</style>
