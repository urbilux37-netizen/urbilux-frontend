// composables/useCart.js
import axios from "axios";
import { ref } from "vue";

// ✅ Auto-detect Base URL (Local + Production)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

export function useCart() {
  const cart = ref([]);
  const loading = ref(false);

  // ✅ Fetch Cart
  const fetchCart = async () => {
    loading.value = true;
    try {
      const res = await axios.get("/cart");
      cart.value = res.data.cart || [];
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    } finally {
      loading.value = false;
    }
  };

  // ✅ Add to Cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post("/cart/add", { productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
    }
  };

  // ✅ Update Quantity
  const updateQty = async (cartId, quantity) => {
    try {
      await axios.patch(`/cart/${cartId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Update qty failed:", err);
    }
  };

  // ✅ Remove Item
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`/cart/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error("❌ Remove item failed:", err);
    }
  };

  return { cart, loading, fetchCart, addToCart, updateQty, removeItem };
}
