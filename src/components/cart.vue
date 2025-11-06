<template>
  <div class="overlay" @click.self="closeDrawer">
    <div class="drawer">
      <!-- ✅ Header -->
      <header>
        <h2>🛒 My Cart</h2>
        <button class="close" @click="closeDrawer">✖</button>
      </header>

      <!-- ✅ Cart Content -->
      <section v-if="cart.length && !loading" class="cart-list">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <img :src="item.image_url" alt="Product Image" class="product-image" />

          <div class="details">
            <h3>{{ item.name }}</h3>

            <!-- ✅ Price (support discount) -->
            <p class="price">
              <template v-if="item.discount_percent">
                <span class="discounted">৳ {{ discountedPrice(item).toFixed(2) }}</span>
                <span class="original">৳ {{ item.price }}</span>
              </template>
              <template v-else>৳ {{ item.price }}</template>
            </p>

            <div class="quantity">
              <button @click="decrease(item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>
          </div>

          <button class="remove" @click="remove(item.id)" title="Remove item">🗑</button>
        </div>

        <!-- ✅ Subtotal -->
        <div class="cart-summary">
          <p class="total-text">Subtotal:</p>
          <p class="total-amount">৳ {{ totalPrice }}</p>
        </div>

        <button class="checkout-btn" @click="goCheckout">Proceed to Checkout</button>
      </section>

      <section v-else-if="loading" class="empty-box">
        <p>Loading your cart...</p>
      </section>

      <section v-else class="empty-box">
        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty" />
        <p>Your cart is empty 🛍️</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCart } from "@/composables/useCart";

const emit = defineEmits(["close"]);
const { cart, loading, fetchCart, addToCart } = useCart();
const router = useRouter();

// ✅ Dynamic API base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

onMounted(fetchCart);

// ✅ Discounted Price
const discountedPrice = (item) => {
  if (!item.discount_percent) return item.price;
  const price = Number(item.price);
  const discount = Number(item.discount_percent);
  return price - (price * discount) / 100;
};

// ✅ Total with discounts
const totalPrice = computed(() =>
  cart.value.reduce(
    (sum, item) => sum + discountedPrice(item) * item.quantity,
    0
  )
);

// ✅ Increase
const increase = async (item) => {
  await addToCart(item.product_id, 1);
  await fetchCart();
};

// ✅ Decrease
const decrease = async (item) => {
  if (item.quantity > 1) {
    await fetch(`${API_BASE}/api/cart/update/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: item.quantity - 1 }),
      credentials: "include",
    });
    await fetchCart();
  }
};

// ✅ Remove Product
const remove = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/api/cart/remove/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      await fetchCart();
    }
  } catch (err) {
    console.error("❌ Remove item failed:", err);
  }
};

// ✅ Close Drawer & Checkout
const closeDrawer = () => emit("close");
const goCheckout = () => {
  emit("close");
  router.push("/checkout");
};
</script>


<style scoped>
/* 🔹 Overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

/* 🔹 Drawer */
.drawer {
  background: #fff;
  width: 400px;
  height: 100vh;
  box-shadow: -3px 0 15px rgba(0, 0, 0, 0.25);
  padding: 20px;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease forwards;
  overflow-y: auto;
}

/* 🔹 Header */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(142, 45, 226, 0.2);
  padding-bottom: 10px;
  margin-bottom: 15px;
}
header h2 {
  color: #4a00e0;
  font-size: 20px;
  font-weight: 700;
}
.close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: #8e2de2;
  transition: 0.2s;
}
.close:hover {
  transform: rotate(90deg);
}

/* 🔹 Cart Items */
.cart-list {
  flex-grow: 1;
}
.cart-item {
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #ddd;
  padding: 10px 0;
  position: relative;
}
.product-image {
  width: 65px;
  height: 65px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 10px;
}
.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.details h3 {
  font-size: 15px;
  color: #333;
  font-weight: 600;
}
.price {
  display: flex;
  align-items: center;
  gap: 6px;
}
.price .discounted {
  color: #e67e22;
  font-weight: 700;
}
.price .original {
  color: #999;
  text-decoration: line-through;
  font-size: 13px;
}
.quantity {
  display: flex;
  align-items: center;
  gap: 8px;
}
.quantity button {
  background: #8e2de2;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 26px;
  height: 26px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.quantity button:hover {
  background: #4a00e0;
}

/* ✅ Remove Button Visible */
.remove {
  position: absolute;
  right: 5px;
  top: 35%;
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}
.remove:hover {
  transform: scale(1.2);
}

/* 🔹 Subtotal */
.cart-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid rgba(142, 45, 226, 0.1);
}
.total-text {
  font-size: 17px;
  font-weight: 600;
  color: #333;
}
.total-amount {
  font-size: 18px;
  font-weight: 700;
  color: #4a00e0;
}

/* 🔹 Checkout */
.checkout-btn {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  border: none;
  color: white;
  width: 100%;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.checkout-btn:hover {
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  transform: scale(1.02);
}
/* 🔹 Empty State (Fixed for mobile + desktop) */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 150px); /* পুরো drawer এর মধ্যে vertically center */
  text-align: center;
  color: #666;
  gap: 12px;
}

.empty-box img {
  width: 120px;
  height: auto;
  opacity: 0.85;
  margin-bottom: 6px;
  transition: all 0.3s ease;
}

.empty-box p {
  font-size: 16px;
  font-weight: 500;
}
/* 🔹 Animation */
@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 🔹 Scrollbar */
.drawer::-webkit-scrollbar {
  width: 6px;
}
.drawer::-webkit-scrollbar-thumb {
  background-color: rgba(142, 45, 226, 0.3);
  border-radius: 5px;
}
/* ✅ Mobile responsive adjustment */
@media (max-width: 768px) {
  .empty-box {
    height: calc(100vh - 120px);
    gap: 8px;
  }
  .empty-box img {
    width: 80px; /* 🔹 ছোট করা হলো */
    opacity: 0.9;
  }
  .empty-box p {
    font-size: 14px;
  }
}
</style>
