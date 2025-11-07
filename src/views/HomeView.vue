<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- 🟣 Banner -->
    <WelcomeBanner />

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

    <!-- 🟣 Footer -->
    <Footer />
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

/* ===== Section Wrapper ===== */
.service-section {
  width: 100%;
  background: #fff;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ===== Cards Wrapper ===== */
.cards-container {
  display: flex;
  justify-content: center; /* ✅ centers all cards evenly */
  align-items: stretch;
  gap: 0.8rem; /* equal space between cards */
  flex-wrap: wrap;
  max-width: 360px; /* ✅ ensures perfect width for 3 cards on phone */
}

/* ===== Each Card ===== */
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1rem 0.6rem;
  width: 100%;
  max-width: 105px; /* ✅ small and consistent */
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(160, 112, 255, 0.25);
}

/* ===== Icon ===== */
.icon {
  width: 36px;
  height: 36px;
  margin-bottom: 0.6rem;
  filter: drop-shadow(0 0 4px rgba(122, 0, 255, 0.3));
}

/* ===== Text ===== */
.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.3rem;
  font-family: "Georgia", serif;
}

.card-text {
  font-size: 0.7rem;
  color: #444;
  line-height: 1.3;
}

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
