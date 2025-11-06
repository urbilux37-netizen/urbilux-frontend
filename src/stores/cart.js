// ✅ src/stores/cart.js
import { defineStore } from "pinia";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartItems: [],
    userId: null,
    isLoaded: false,
  }),

  getters: {
    // 🧮 মোট quantity গণনা
    itemCount: (state) =>
      state.cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
  },

  actions: {
    // 🔹 ইউজার সেট করা
    async initUser(userId = null) {
      this.userId = userId;
      await this.fetchCart();
    },

    // 🔹 কার্ট আনো (User বা Guest)
    async fetchCart() {
      try {
        const res = await axios.get("/cart");
        this.cartItems = res.data.cart || [];
        this.isLoaded = true;
        console.log("🛒 Cart Loaded:", this.cartItems.length, "items");
      } catch (err) {
        console.error("❌ Fetch cart error:", err);
      }
    },

    // 🔹 কার্টে নতুন প্রোডাক্ট যোগ
    async addToCart(productId, quantity = 1) {
      try {
        await axios.post("/cart/add", { productId, quantity });
        // 👉 সাথে সাথে refresh
        await this.fetchCart();
      } catch (err) {
        console.error("❌ Add to cart failed:", err);
      }
    },

    // 🔹 কার্ট থেকে আইটেম মুছে ফেলা
    async removeFromCart(cartId) {
      try {
        await axios.delete(`/cart/${cartId}`);
        await this.fetchCart();
      } catch (err) {
        console.error("❌ Remove failed:", err);
      }
    },

    // 🔹 লগআউট হলে রিসেট
    resetCart() {
      this.cartItems = [];
      this.userId = null;
      this.isLoaded = false;
    },
  },
});
