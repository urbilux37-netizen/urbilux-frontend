<template>
  <div>
    <!-- Navbar -->
    <Navbar />

    <!-- Categories Section -->
    <div class="categories-section" v-if="categories.length">
      <h2 class="page-title">📂 All Categories</h2>

      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
        >
          <router-link :to="`/category/${category.slug}`">
            <img
              :src="category.image_url"
              :alt="category.name"
              class="category-image"
            />
            <p>{{ category.name }}</p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

// 🟣 Auto-detect backend (Local + Render + Cloudflare)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ✅ Local axios instance to avoid /api prefix conflicts
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Reactive list of categories
const categories = ref([]);

// ✅ Fetch all categories from backend
const fetchCategories = async () => {
  try {
    const res = await api.get("/categories"); // 🚫 no /api prefix
    categories.value = res.data || [];
    console.log("✅ Loaded categories:", categories.value.length);
  } catch (err) {
    console.error("❌ Error fetching categories:", err.message);
    categories.value = [];
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
/* Categories */
.categories-section {
  margin-left: 10%;
  margin-right: 10%;
  margin-bottom: 40px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-content: space-between;
}

.category-card {
  text-align: center;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  width: 200px;
  height: 150px;
  margin-top: 10px;
}

.category-card:hover {
  transform: scale(1.05);
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card p {
  font-size: 14px;
}

/* ======== Page Title ======== */
.page-title {
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
  width: 70px;
  height: 4px;
  margin-top: 6px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  border-radius: 2px;
}

/* ======== Responsive ======== */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-section {
    margin-left: 5%;
    margin-right: 5%;
  }

  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .category-card {
    text-align: center;
    border-radius: 8px;
    height: 100px;
    width: 100px;
  }

  .category-card:hover {
    transform: scale(1.05);
  }

  .category-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .page-title {
    margin: 12px;
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  .category-image {
    height: 120px;
  }

  .category-name {
    font-size: 12px;
  }
}
</style>
