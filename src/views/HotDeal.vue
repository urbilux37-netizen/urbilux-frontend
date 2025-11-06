<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- 🟣 Hot Deals Section -->
    <div class="products-page">
      <h2 class="page-title">🔥 Hot Deals</h2>

      <!-- Products Grid -->
      <div v-if="hotDeals.length" class="products-grid">
        <ProductCard
          v-for="product in hotDeals"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No Deals"
        />
        <p>No hot deals available right now!</p>
      </div>
    </div>

    <!-- 🟣 Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

// 🟣 Auto-detect backend (Local + Hosted)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ✅ Local axios instance (avoid /api prefix issues)
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Hot Deals Data
const hotDeals = ref([]);

// ✅ Fetch from Node.js backend
const fetchHotDeals = async () => {
  try {
    const res = await api.get("/products"); // 🚫 no /api prefix
    const allProducts = res.data || [];

    // 🔥 Filter products that have is_hot_deal = true
    hotDeals.value = allProducts.filter((p) => p.is_hot_deal === true);
  } catch (err) {
    console.error("❌ Failed to fetch hot deals:", err);
  }
};

onMounted(fetchHotDeals);
</script>

<style scoped>
.products-page {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 70px;
  font-family: "Zalando Sans", sans-serif;
}

.page-title {
  font-size: 2rem;
  margin-bottom: 20px;
  color: #8E2DE2;
  text-align: center;
  font-weight: 800;
}

/* ✅ Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

/* 🟣 Empty state */
.empty {
  text-align: center;
  margin-top: 50px;
  color: #777;
}
.empty img {
  width: 120px;
  opacity: 0.8;
  margin-bottom: 10px;
}

/* ✅ Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .products-page {
    width: 90%;
    margin-top: 20px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
