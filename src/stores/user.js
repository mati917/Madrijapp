import { defineStore } from 'pinia'
import { signIn, signOut, getProfile } from '@/services/auth'
import { useSupabase } from '@/supabaseClient'
const { supabase } = useSupabase()

export const useUserStore = defineStore('user', {
  state: () => ({
    authUser: null,
    profile: null,
  }),
  actions: {
    async login({ email, password }) {
      const user = await signIn({ email, password })
      this.authUser = user
      this.profile = await getProfile(user.id)
    },
    async logout() {
      await signOut()
      this.authUser = null
      this.profile = null
    },
    async fetchSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        this.authUser = data.session.user
        this.profile = await getProfile(this.authUser.id)
      }
    },
  },
})
