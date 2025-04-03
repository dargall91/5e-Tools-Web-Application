import { LoginRegisterRequest } from '@/models/LoginRegisterRequest';
import { defineStore } from 'pinia'
import { User } from 'src/models/User'
import agent from '@/api/agent';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: { id: 0 } as User
  }),
  actions: {
    async login(request: LoginRegisterRequest) {
      await agent.user.login(request).then((data) => {
        this.user = data;
      });
    },
    logout() {
      this.user = { id: 0 } as User;
    },
    async register(request: LoginRegisterRequest) {
      agent.user.register(request).then((data) => {
        this.user = data;
      });
    },
  },
  persist: true
})