<template>
  <div class="search-page">
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- 🟣 Main Wrapper -->
    <div class="search-content">
      <h1 class="search-title">Search Results for "{{ query }}"</h1>

      <!-- 🔄 Loading -->
      <div v-if="loading" class="loading">Loading...</div>

      <!-- ✅ Results -->
      <div v-else>
        <div v-if="products.length" class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
          />
        </div>

        <!-- ❌ No Results -->
        <div v-else class="no-results">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
            alt="No Results"
          />
          <p>No products found for "{{ query }}"</p>
        </div>
      </div>
    </div>

    <!-- 🟣 Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import ProductCard from "@/components/ProductCard.vue";

// 🌍 Auto Detect Backend
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// 🔎 Reactive Data
const route = useRoute();
const query = ref(route.query.q || "");
const products = ref([]);
const allProducts = ref([]);
const loading = ref(false);

// 🔍 Fetch and Filter Products
const fetchProducts = async (searchTerm) => {
  loading.value = true;
  try {
    if (!searchTerm.trim()) {
      products.value = [];
      loading.value = false;
      return;
    }

    const res = await api.get("/products");
    allProducts.value = res.data || [];

    const q = searchTerm.toLowerCase().trim();

    products.value = allProducts.value
      .filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const category = (p.category_slug || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || category.includes(q);
      })
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
        if (!aName.startsWith(q) && bName.startsWith(q)) return 1;
        return aName.localeCompare(bName);
      });
  } catch (err) {
    console.error("❌ Search Error:", err.message);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

// 🔁 React to query changes
watch(
  () => route.query.q,
  (newQuery) => {
    query.value = newQuery || "";
    fetchProducts(query.value);
  },
  { immediate: true }
);

onMounted(() => {
  fetchProducts(query.value);
});
</script>

<style scoped>
/* ===============================
   🟣 Search Page Layout
=================================*/
.search-page {
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.search-content {
  flex: 1;
  padding-top: 120px;
  text-align: center;
  width: 90%;
  max-width: 1300px;
  margin: 0 auto;
}

/* ===============================
   🟣 Title
=================================*/
.search-title {
  font-family: "Abril Fatface", serif;
  font-size: 32px;
  color: #4a00e0;
  margin-bottom: 30px;
}

/* ===============================
   🟣 Loading / No Results
=================================*/
.loading,
.no-results {
  font-size: 18px;
  color: #555;
  margin-top: 60px;
  text-align: center;
}

.no-results img {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
  opacity: 0.7;
}

/* ===============================
   🟣 Product Grid Layout
=================================*/
.products-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  justify-items: center;
  margin-bottom: 60px;
}

/* 📱 Responsive */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
}

@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .search-title {
    font-size: 24px;
  }
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    width: 95%;
    margin: 0 auto 40px;
    gap: 14px;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

/* ===============================
   🟣 Footer spacing
=================================*/
footer {
  margin-top: auto;
}
</style>
