import { defineStore } from 'pinia'

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim())
  .filter(Boolean)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    adminEmails
  }),
  getters: {
    isAdmin: (state) => {
      if (!state.user) return false
      if (state.adminEmails.length === 0) return false
      return state.adminEmails.includes(state.user.email)
    }
  },
  actions: {
    setUser(user) {
      this.user = user
    }
  }
})
