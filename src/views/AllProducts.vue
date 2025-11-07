<template>
  <div>
    <div class="">
    <!-- 🟣 Navbar -->
    <Navbar />
     </div>

    <!-- 🟣 All Products Section -->
    <h2 class="page-title">🛒 All Products</h2>

    <!-- Products Grid -->
    <div v-if="allProducts.length" class="products-grid">
      <ProductCard
        v-for="product in allProducts"
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
      <p>No products available at the moment!</p>
    </div>

    <!-- 🟣 Footer -->
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

// 🟣 Auto-detect backend (Local + Render)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

// ✅ Local axios instance override (no /api prefix)
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Reactive product list
const allProducts = ref([]);

// ✅ Fetch all products from Node.js backend
const fetchAllProducts = async () => {
  try {
    const res = await api.get("/products"); // 🚫 No /api prefix
    allProducts.value = res.data || [];
  } catch (err) {
    console.error("❌ Failed to fetch all products:", err);
  }
};

onMounted(fetchAllProducts);
</script>

<style scoped>
/* ===== Products Grid ===== */
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* ✅ 5 per row on desktop */
  gap: 20px;
  width: 85%;
  margin: 30px auto;
  justify-items: center;
}

/* ===== Responsive Layout ===== */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr); /* tablet */
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* mobile */
    width: 90%;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr); /* small phones */
    gap: 10px;
  }
}

/* ===== Section Wrapper ===== */
.service-section {
  width: 100%;
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  padding: 3rem 1rem;
  text-align: center;
  overflow-x: hidden; /* ✅ Prevent side scroll on mobile */
}

/* ===== Cards Layout ===== */
.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); /* ✅ responsive grid */
  justify-items: center;
  align-items: stretch;
  gap: 0.8rem;
  max-width: 100%;
}

/* ===== Each Card ===== */
.card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(74, 0, 224, 0.08);
  padding: 1rem;
  transition: 0.3s ease;
  width: 100%;
  max-width: 115px; /* ✅ ensures 3 fit in a row */
  text-align: center;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(142, 45, 226, 0.25);
}

/* ===== Icon ===== */
.icon {
  width: 40px;
  height: 40px;
  margin-bottom: 0.6rem;
  filter: drop-shadow(0 0 6px rgba(142, 45, 226, 0.4));
  transition: 0.3s;
}

.card:hover .icon {
  transform: scale(1.05);
}

/* ===== Text ===== */
.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.4rem;
  font-family: "Georgia", serif;
}

.card-text {
  font-size: 0.75rem;
  color: #444;
  line-height: 1.3;
}

/* ===== Responsive ===== */
@media (min-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .card {
    max-width: 280px;
    padding: 1.8rem 1.2rem;
  }

  .icon {
    width: 60px;
    height: 60px;
  }

  .card-title {
    font-size: 1.2rem;
  }

  .card-text {
    font-size: 0.95rem;
  }
}

</style>
