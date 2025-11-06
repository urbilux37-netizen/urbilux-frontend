// src/stores/user.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: null,
    name: null,
    email: null,
    isLoggedIn: false,
  }),
  actions: {
    setUser(user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.isLoggedIn = true;
    },
    clearUser() {
      this.id = null;
      this.name = null;
      this.email = null;
      this.isLoggedIn = false;
    },
  },
});
