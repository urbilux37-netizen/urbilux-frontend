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
  // ✅ Fetch Cart (with product details)
  // ================================
  const fetchCart = async () => {
    loading.value = true;
    try {
      const res = await axios.get("/cart");
      const rawCart = res.data.cart || [];

      // fetch full product details for each cart item
      const updatedCart = await Promise.all(
        rawCart.map(async (item) => {
          try {
            const prodRes = await axios.get(`/products/${item.product_id}`);
            const prod = prodRes.data || {};
            const discount = Number(prod.discount_percent || 0);
            const price = Number(prod.price || 0);

            return {
              ...item,
              name: prod.name,
              final_price: price,
              final_image: prod.image_url || "/images/no-image.png",
              discount_percent: discount,
            };
          } catch {
            return item; // fallback if product fetch fails
          }
        })
      );

      cart.value = updatedCart;
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
