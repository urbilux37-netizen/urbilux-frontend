<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- ================= Checkout Section ================= -->
    <div class="checkout-page">
      <h1 class="checkout-title">🛒 Checkout</h1>

      <div v-if="cartItems.length" class="checkout-container">
        <div v-for="item in cartItems" :key="item.id" class="checkout-item">
          <!-- Left: Image -->
          <div class="checkout-image">
            <img :src="getItemImage(item)" alt="Product Image" />
          </div>

          <!-- Right: Details -->
          <div class="checkout-details">
            <h2 class="item-name">{{ item.name }}</h2>

            <!-- Variant selectors -->
            <div
              v-for="variant in item.variants || []"
              :key="variant.id"
              class="variant-selector"
            >
              <label>{{ variant.name }}</label>
              <select
                v-model="item.selected_variants[variant.id]"
                @change="updateItemPrice(item)"
              >
                <option value="">-- Select {{ variant.name }} --</option>
                <option
                  v-for="opt in variant.options || []"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.option_name }}
                  {{ opt.option_price ? `( +${opt.option_price}৳ )` : "" }}
                </option>
              </select>
            </div>

            <!-- Quantity -->
            <div class="quantity-box">
              <label>Quantity:</label>
              <input
                type="number"
                v-model.number="item.quantity"
                min="1"
                @change="updateItemPrice(item)"
              />
            </div>

            <!-- Price -->
            <p class="price">
              <span v-if="item.discount_percent && item.discount_percent > 0">
                <span class="original-price">{{ item.price.toFixed(2) }}৳</span>
                <span class="discounted-price">{{ item.final_price.toFixed(2) }}৳</span>
              </span>
              <span v-else>{{ item.final_price.toFixed(2) }}৳</span>
            </p>

            <!-- Remove -->
            <button class="remove-btn" @click="removeItem(item.id)">🗑 Remove</button>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="checkout-summary">
          <p>Subtotal: <strong>৳ {{ subtotal.toFixed(2) }}</strong></p>
        </div>

        <!-- Checkout Button -->
        <button class="checkout-btn" @click="goToPayment">Proceed to Payment</button>
      </div>

      <div v-else class="empty-cart">
        <p>Your cart is empty 🛍️</p>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import { useCart } from "@/composables/useCart";

const router = useRouter();
const { cart: cartItems, fetchCart, updateQty, removeItem } = useCart();

// Load cart on mount
onMounted(fetchCart);

// ---------- Price & Image Helpers ----------
const getItemImage = (item) => {
  // Variant image > final_image > main product image
  if (item.variants) {
    for (let v of item.variants) {
      const optId = item.selected_variants[v.id];
      if (!optId) continue;
      const opt = (v.options || []).find((o) => String(o.id) === String(optId));
      if (opt?.option_image_url) return opt.option_image_url;
    }
  }
  return item.final_image || item.image_url || "/images/no-image.png";
};

const updateItemPrice = (item) => {
  // base price
  let price = Number(item.price || 0);

  // add selected variant prices
  if (item.variants) {
    for (let v of item.variants) {
      const optId = item.selected_variants[v.id];
      if (!optId) continue;
      const opt = (v.options || []).find((o) => String(o.id) === String(optId));
      if (opt?.option_price) price += Number(opt.option_price);
    }
  }

  // apply discount once
  const discount = Number(item.discount_percent || 0);
  item.final_price = discount > 0 ? price - (price * discount) / 100 : price;

  // update cart quantity if changed
  updateQty(item.id, item.quantity);
};

// ---------- Cart Subtotal ----------
const subtotal = computed(() =>
  cartItems.value.reduce((sum, item) => sum + Number(item.final_price) * item.quantity, 0)
);

// ---------- Actions ----------
const goToPayment = () => router.push("/payment");
</script>

<style scoped>
.checkout-page {
  max-width: 90%;
  margin: 80px auto;
  font-family: "Zalando Sans", sans-serif;
}

.checkout-title {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 30px;
  color: #4a00e0;
  text-align: center;
}

.checkout-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.checkout-item {
  display: flex;
  gap: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 15px;
}

.checkout-image img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.checkout-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  font-size: 1.2em;
  margin-bottom: 10px;
}

.variant-selector {
  margin-bottom: 10px;
}
.variant-selector label {
  display: block;
  font-weight: 500;
  margin-bottom: 3px;
}
.variant-selector select {
  padding: 5px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.quantity-box {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-box input {
  width: 60px;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-align: center;
}

.price {
  font-weight: 700;
  font-size: 1.2em;
  margin: 10px 0;
}
.original-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 8px;
}
.discounted-price {
  color: #e53935;
}

.remove-btn {
  padding: 6px 10px;
  border: none;
  background: #ff6b6b;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
}
.remove-btn:hover {
  background: #e53935;
}

.checkout-summary {
  font-size: 1.2em;
  font-weight: 600;
  text-align: right;
  margin-top: 15px;
}

.checkout-btn {
  width: 100%;
  padding: 12px 0;
  background: #6b46c1;
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  margin-top: 20px;
  cursor: pointer;
}
.checkout-btn:hover {
  background: #553c9a;
}

/* Mobile */
@media (max-width: 768px) {
  .checkout-item {
    flex-direction: column;
    align-items: center;
  }
  .checkout-image img {
    width: 100%;
    max-width: 250px;
    height: auto;
  }
  .checkout-details {
    width: 100%;
    text-align: center;
  }
}
</style>
