<template>
  <div class="product-card" @click="goToProductPage">
    <div class="image-box">
      <img :src="product.image_url || placeholder" :alt="product.name" />
      <div v-if="product.discount_percent" class="discount-badge">
        -{{ product.discount_percent }}%
      </div>
    </div>

    <h2 class="product-name">{{ product.name }}</h2>

    <div class="price-section">
      <template v-if="product.discount_percent">
        <span class="discounted-price">{{ finalPrice }}৳</span>
        <span class="original-price">{{ product.price }}৳</span>
      </template>
      <template v-else>
        <span class="product-price">{{ product.price }}৳</span>
      </template>
    </div>

    <div class="button-group">
      <button class="btn" @click.stop="handleAddToCart">Add to cart</button>
      <button class="btn buy-now" @click.stop="handleBuyNow">Buy Now</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";

const placeholder = new URL("@/assets/no-image.png", import.meta.url).href;
const props = defineProps({ product: Object });
const router = useRouter();
const cartStore = useCartStore();

// ✅ Dynamic API
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ✅ Navigate to product page
const goToProductPage = () => {
  if (props.product.id) router.push(`/product/${props.product.id}`);
};

// ✅ Discounted price
const finalPrice = computed(() => {
  const price = Number(props.product.price) || 0;
  const discount = Number(props.product.discount_percent) || 0;
  return discount ? (price - (price * discount) / 100).toFixed(2) : price.toFixed(2);
});

// ✅ Add to cart
const handleAddToCart = async () => {
  try {
    await fetch(`${API_BASE}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ product_id: props.product.id, quantity: 1 }),
    });
    await cartStore.fetchCart();
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
  }
};

// ✅ Buy now
const handleBuyNow = async () => {
  try {
    await handleAddToCart();
    router.push("/checkout");
  } catch (err) {
    console.error("❌ Buy now failed:", err);
  }
};
</script>

<style scoped>
.product-card {
  font-family: "Zalando Sans", sans-serif;
  width: 260px;
  height: 380px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 16px rgba(74, 0, 224, 0.15);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
  padding: 12px;
}
.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 24px rgba(142, 45, 226, 0.25);
}
.image-box {
  height: 65%;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.image-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .image-box img {
  transform: scale(1.05);
}
.discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #ff4d4d, #ff9900);
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 6px;
}
.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #4a00e0;
  text-align: center;
  margin: 10px 0 4px;
}
.price-section {
  text-align: center;
  margin-bottom: 8px;
}
.discounted-price {
  font-size: 16px;
  font-weight: bold;
  color: #e67e22;
  margin-right: 6px;
}
.original-price {
  font-size: 14px;
  color: #888;
  text-decoration: line-through;
}
.product-price {
  font-size: 15px;
  font-weight: bold;
  color: #e67e22;
}
.button-group {
  display: flex;
  gap: 10px;
  margin-top: auto;
  width: 100%;
  justify-content: center;
}
.btn {
  flex: 1;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  color: #fff;
  background: linear-gradient(to right, #a100ff, #ff00ff);
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn:hover {
  background: linear-gradient(135deg, #5f18e2, #9b3ce6);
}
.buy-now {
  background: linear-gradient(135deg, #8e2de2, #4a00e0);
}
@media (max-width: 768px) {
  .product-card {
    width: 45%;
    height: auto;
  }
  .image-box {
    height: 120px;
  }
}
@media (max-width: 480px) {
  .product-card {
    width: 90%;
    margin: 6px auto;
  }
  .image-box {
    height: 100px;
  }
}
</style>
