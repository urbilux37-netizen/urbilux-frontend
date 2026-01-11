// composables/useCart.js
import axios from "axios";
import { ref } from "vue";

// ⚡ API BASE (auto switch)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://urbilux-backend.onrender.com/api";

// Axios global config
axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

export function useCart() {
  const cart = ref([]);
  const loading = ref(false);

  // ================================
  // ✅ Fetch Cart (ALWAYS axios)
  // ================================
  const fetchCart = async () => {
    loading.value = true;
    try {
      const res = await axios.get("/cart");
      const rawCart = res.data.cart || [];

      // 🔹 Fix: ensure price, image, name, discount always exist
      cart.value = rawCart.map((item) => {
        return {
          ...item,
          final_price: item.final_price || Number(item.price || 0),
          final_image: item.final_image || item.image_url || "/images/no-image.png",
          name: item.name || item.product_name || "Unnamed Product",
          discount_percent: item.discount_percent || 0,
        };
      });
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err);
    } finally {
      loading.value = false;
    }
  };

  // ================================
  // ✅ Add to Cart (axios only)
  // ================================
  const addToCart = async (payload) => {
    try {
      await axios.post("/cart/add", payload);
      await fetchCart();
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
    }
  };

  // ================================
  // ✅ Update Quantity
  // ================================
  const updateQty = async (cartId, quantity) => {
    try {
      await axios.put(`/cart/update/${cartId}`, { quantity });
      await fetchCart();
    } catch (err) {
      console.error("❌ Update qty failed:", err);
    }
  };

  // ================================
  // ✅ Remove Item
  // ================================
  const removeItem = async (cartId) => {
    try {
      await axios.delete(`/cart/remove/${cartId}`);
      await fetchCart();
    } catch (err) {
      console.error("❌ Remove item failed:", err);
    }
  };

  return { cart, loading, fetchCart, addToCart, updateQty, removeItem };
}
