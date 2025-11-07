<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />
<div class="wlcbanner">
    <!-- 🟣 Banner -->
    <WelcomeBanner />
</div>
    <!-- 🟣 Home Page Content -->
    <div class="home-content">

      <!-- 🟣 Service Features Section -->
      <section class="service-section">
        <div class="cards-container">
          <!-- 🚚 Delivery -->
          <div class="card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
              alt="Delivery Icon"
              class="icon"
            />
            <h3 class="card-title">Delivery</h3>
            <p class="card-text">
              Enjoy fast home delivery all over Bangladesh.
            </p>
          </div>

          <!-- 🔁 Easy Returns -->
          <div class="card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/10106/10106672.png"
              alt="Return Icon"
              class="icon"
            />
            <h3 class="card-title">Easy Returns</h3>
            <p class="card-text">
              Pay only after receiving and checking your product for peace of mind.
            </p>
          </div>

          <!-- 💸 Cash on Delivery -->
          <div class="card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
              alt="Cash on Delivery Icon"
              class="icon"
            />
            <h3 class="card-title">Cash on Delivery</h3>
            <p class="card-text">
              Pay conveniently when your order arrives at your doorstep.
            </p>
          </div>
        </div>
      </section>

      <!-- 🟣 Top Categories -->
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
        <span class="section-link" @click="router.push('/categories')">
          See All Categories
        </span>
      </div>

      <!-- 🟣 Top Products -->
      <div class="products-section" v-if="topProducts.length">
        <h2 class="section-title">Top Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in topProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/top-products')">
          See All Top Products
        </span>
      </div>

      <!-- 🟣 Hot Deals -->
      <div class="products-section" v-if="hotDeals.length">
        <h2 class="section-title">Hot Deals</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in hotDeals"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/hot-deal')">
          View All Hot Deals
        </span>
      </div>

      <!-- 🟣 All Products -->
      <div class="products-section" v-if="allProducts.length">
        <h2 class="section-title">All Products</h2>
        <div class="products-grid">
          <ProductCard
            v-for="product in allProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <span class="section-link" @click="router.push('/all-products')">
          View All Products
        </span>
      </div>

    </div> <!-- ✅ end .home-content -->

  </div>
</template>

<script setup>
import Navbar from "../components/NavBar.vue";
import ProductCard from "../components/ProductCard.vue";
import Footer from "../components/Footer.vue";
import { ref, onMounted, onUnmounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import WelcomeBanner from "../components/WelcomeBanner.vue";
const router = useRouter();
const placeholder = new URL('@/assets/no-image.png', import.meta.url).href;
import ServiceFeatures from "@/components/ServiceFeatures.vue";
// 🔗 Detect environment and auto baseURL
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

// ------------------ Banners ------------------
const banners = ref([]);
const currentIndex = ref(0);
let intervalId = null;

const fetchBanners = async () => {
  try {
const res = await axios.get(`${API_BASE}/api/banners`);
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
    const data = res.data || [];
    // ✅ Show only last 10 categories (latest first)
    categories.value = data.slice(-12).reverse();
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
    // ✅ Only show last 10 in each section
    topProducts.value = data
      .filter(p => p.is_top_product)
      .slice(-10)
      .reverse();
    hotDeals.value = data
      .filter(p => p.is_hot_deal)
      .slice(-10)
      .reverse();
    allProducts.value = data.slice(-10).reverse();
  } catch (err) {
    console.error("❌ Products fetch error:", err);
  }
};
onMounted(fetchProducts);
</script>


<style scoped>
@import "../views/home.css";
.banner-wrapper {
  width: 100%;
  margin-bottom: 30px;
}
.wlcbanner{
  padding-top: 72px;
}

/* ===== Base Section ===== */
/* ===== Section Wrapper ===== */
.service-section {
  width: 100%;
  background: white;
  padding: 4rem 2rem;
  text-align: center;
}

/* ===== Cards Layout ===== */
.cards-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  flex-wrap: wrap;
}

/* ===== Each Card ===== */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(74, 0, 224, 0.08);
  padding: 2rem 1rem;
  width: 320px;
  transition: 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(142, 45, 226, 0.25);
}

/* ===== Icon ===== */
.icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 6px rgba(142, 45, 226, 0.4));
  transition: 0.3s;
}

.card:hover .icon {
  transform: scale(1.05);
}

/* ===== Text ===== */
.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.6rem;
  font-family: "Georgia", serif;
}

.card-text {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
}

/* ===== Responsive ===== */
/* ===== Responsive Adjustments ===== */

/* Tablet */
@media (max-width: 1024px) {
  .cards-container {
    gap: 0.7rem;
  }
  .card {
    max-width: 100px;
    padding: 0.9rem 0.5rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .service-section {
    padding: 1.8rem 0;
  }

  .cards-container {
    gap: 0.6rem;
    max-width: 340px; /* ✅ balances edge spacing */
  }

  .card {
    max-width: 95px;
    padding: 0.8rem 0.4rem;
  }

  .icon {
    width: 30px;
    height: 30px;
  }

  .card-title {
    font-size: 0.8rem;
  }

  .card-text {
    font-size: 0.65rem;
  }
}

/* Very small phones */
@media (max-width: 480px) {
  .cards-container {
    gap: 0.5rem;
    max-width: 310px; /* ✅ keeps perfect equal margin on both sides */
  }

  .card {
    max-width: 90px;
    padding: 0.7rem 0.4rem;
  }

  .icon {
    width: 28px;
    height: 28px;
  }

  .card-title {
    font-size: 0.75rem;
  }

  .card-text {
    font-size: 0.6rem;
  }
}


</style>
