<template>
  <div>
    <Navbar />

    <div class="home-content">
      <!-- Banner Slider -->
      <div class="banner-slider" v-if="banners.length">
        <router-link :to="banners[currentIndex].link || '#'">
          <img
            :src="banners[currentIndex].image_url || placeholder"
            :alt="banners[currentIndex].title || 'Banner'"
            class="banner-image"
          />
        </router-link>
        <h2 class="banner-title">{{ banners[currentIndex].title }}</h2>
      </div>

      <!-- Top Categories -->
      <div class="categories-section" v-if="categories.length">
        <h2 class="section-title">Top Categories</h2>
        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
          >
            <router-link :to="`/category/${category.slug}`">
              <img
                :src="category.image_url || placeholder"
                :alt="category.slug"
                class="category-image"
              />
              <p>{{ category.slug }}</p>
            </router-link>
          </div>
        </div>
        <span class="section-link" @click="router.push('/categories')">See All Categories</span>
      </div>

      <!-- Hot Deals Section -->
      <div class="products-section" v-if="hotDeals.length">
        <h2 class="section-title">Hot Deals</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in hotDeals"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/hot-deal')">View All Hot Deals</span>
      </div>

      <!-- Top Products Section -->
      <div class="products-section" v-if="topProducts.length">
        <h2 class="section-title">Top Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in topProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/top-products')">See All Top Products</span>
      </div>

      <!-- All Products Section -->
      <div class="products-section" v-if="allProducts.length">
        <h2 class="section-title">All Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in allProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/all-products')">View All Products</span>
      </div>
    </div>

    <Footer />
  </div>

  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&display=swap" rel="stylesheet">
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>AVADO</title>
  </head>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const placeholder = new URL('@/assets/no-image.png', import.meta.url).href;

// 🔗 Detect environment and auto baseURL
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ------------------ Banners ------------------
const banners = ref([]);
const currentIndex = ref(0);
let intervalId = null;

const fetchBanners = async () => {
  try {
    const res = await axios.get(`${API_BASE}/banners`);
    banners.value = res.data;
  } catch (err) {
    console.error("❌ Banners fetch error:", err);
  }
};

const startSlider = () => {
  intervalId = setInterval(() => {
    if (banners.value.length) {
      currentIndex.value = (currentIndex.value + 1) % banners.value.length;
    }
  }, 4000);
};

onMounted(async () => {
  await fetchBanners();
  startSlider();
});

onUnmounted(() => clearInterval(intervalId));

// ------------------ Categories ------------------
const categories = ref([]);
const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    categories.value = res.data;
  } catch (err) {
    console.error("❌ Categories fetch error:", err);
  }
};
onMounted(fetchCategories);

// ------------------ Products ------------------
const topProducts = ref([]);
const hotDeals = ref([]);
const allProducts = ref([]);

const fetchProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/products`);
    const data = res.data || [];
    topProducts.value = data.filter(p => p.is_top_product);
    hotDeals.value = data.filter(p => p.is_hot_deal);
    allProducts.value = data;
  } catch (err) {
    console.error("❌ Products fetch error:", err);
  }
};
onMounted(fetchProducts);
</script>

<style scoped>
@import "../views/home.css";
</style>
