<template>
  <div class="overlay" @click.self="closeDrawer">
    <div class="drawer">
      <header>
        <h2>🛒 My Cart</h2>
        <button class="close" @click="closeDrawer">✖</button>
      </header>

      <!-- ================= Cart Items ================= -->
      <section v-if="cart.length && !loading" class="cart-list">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <!-- Product Image -->
          <img :src="item.final_image" alt="Product Image" class="product-image" />

          <div class="details">
            <!-- Product Name -->
            <h3>{{ item.name }}</h3>

            <!-- Price with discount -->
            <p class="price">
              <template v-if="item.discount_percent && item.discount_percent > 0">
                <span class="discounted">
                  ৳ {{ discounted(item).toFixed(2) }}
                </span>
                <span class="original">
                  ৳ {{ Number(item.final_price).toFixed(2) }}
                </span>
              </template>
              <template v-else>
                ৳ {{ Number(item.final_price).toFixed(2) }}
              </template>
            </p>

            <!-- Quantity controls -->
            <div class="quantity">
              <button @click="decrease(item)">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increase(item)">+</button>
            </div>
          </div>

          <!-- Remove Button -->
          <button class="remove" @click="remove(item.id)">🗑</button>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <p class="total-text">Subtotal:</p>
          <p class="total-amount">৳ {{ totalPrice.toFixed(2) }}</p>
        </div>

        <button class="checkout-btn" @click="goCheckout">
          Proceed to Checkout
        </button>
      </section>

      <!-- Loading -->
      <section v-else-if="loading" class="empty-box">
        <p>Loading your cart...</p>
      </section>

      <!-- Empty Cart -->
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
const { cart, loading, fetchCart, updateQty, removeItem } = useCart();
const router = useRouter();

onMounted(fetchCart);

// 🔹 Discounted price calculator
const discounted = (item) => {
  const price = Number(item.final_price || 0);
  const discount = Number(item.discount_percent || 0);
  return discount > 0 ? price - (price * discount) / 100 : price;
};

// 🔹 Total cart amount
const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + discounted(item) * item.quantity, 0)
);

// 🔹 Increase quantity
const increase = async (item) => {
  await updateQty(item.id, item.quantity + 1);
};

// 🔹 Decrease quantity
const decrease = async (item) => {
  if (item.quantity > 1) await updateQty(item.id, item.quantity - 1);
};

// 🔹 Remove item
const remove = async (id) => {
  await removeItem(id);
};

// 🔹 Drawer actions
const closeDrawer = () => emit("close");
const goCheckout = () => {
  emit("close");
  router.push("/checkout");
};
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
}

.drawer {
  width: 400px;
  max-width: 100%;
  background: #fff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

header .close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.cart-list {
  margin-top: 1rem;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 1rem;
  border-radius: 8px;
}

.details {
  flex: 1;
}

.details h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.price {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.price .original {
  text-decoration: line-through;
  color: #888;
  margin-left: 0.5rem;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity button {
  width: 24px;
  height: 24px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  cursor: pointer;
}

.remove {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
}

.cart-summary {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-top: 1rem;
}

.checkout-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: #6b46c1;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.checkout-btn:hover {
  background: #553c9a;
}
</style>
