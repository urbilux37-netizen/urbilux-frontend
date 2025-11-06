<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- 🟣 Top Products Section -->
    <h2 class="page-title">⭐ Top Products</h2>

    <!-- Products Grid -->
    <div v-if="topProducts.length" class="products-grid">
      <ProductCard
        v-for="product in topProducts"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="No Products"
      />
      <p>No top products available right now!</p>
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

// 🟣 Auto-detect backend (local or hosted)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ✅ Create local axios instance (override global one to avoid /api prefix)
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Reactive list for top products
const topProducts = ref([]);

// ✅ Fetch from Node.js backend
const fetchTopProducts = async () => {
  try {
    const res = await api.get("/products"); // 🚫 No /api prefix here
    const allProducts = res.data || [];

    // ⭐ Filter only top products
    topProducts.value = allProducts.filter((p) => p.is_top_product === true);
  } catch (err) {
    console.error("❌ Failed to fetch top products:", err);
  }
};

onMounted(fetchTopProducts);
</script>


<style scoped>
/* Two side 10% margin */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 20px;
}

/* Page title gradient & underline */
.page-title {
  margin-left: 10%;
  margin-top: 100px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  margin-top: 6px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  border-radius: 2px;
}

/* Empty state */
.empty {
  text-align: center;
  margin-top: 60px;
  color: #777;
}
.empty img {
  width: 120px;
  opacity: 0.8;
  margin-bottom: 10px;
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ✅ Mobile - Always 2 per row */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .page-title {
    margin: 20px 5%;
    font-size: 1.7rem;
  }
}

/* Very small screens - keep 2 per row */
@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
