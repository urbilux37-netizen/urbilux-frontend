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

/* 🟣 Service Features Section Styles */
.service-section {
  width: 100%;
  background: #fff;
  padding: 4rem 2rem;
  text-align: center;
}

/* ===== Cards Layout (Desktop Default) ===== */
.cards-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  flex-wrap: wrap;
}

/* ===== Individual Card ===== */
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(74, 0, 224, 0.08);
  padding: 2rem 1.5rem;
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
  filter: drop-shadow(0 0 6px rgba(122, 0, 255, 0.3));
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

/* Tablet */
@media (max-width: 1024px) {
  .cards-container {
    gap: 1.5rem;
  }

  .card {
    width: 260px;
    padding: 1.8rem 1.2rem;
  }

  .card-title {
    font-size: 1.15rem;
  }

  .card-text {
    font-size: 0.95rem;
  }
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .service-section {
    padding: 3rem 1rem;
  }

  .cards-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin: 0 10px;
  }

  .card {
    width: 100%;
    max-width: 110px;
    padding: 1rem 0.6rem;
    border-radius: 14px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  .icon {
    width: 35px;
    height: 35px;
    margin-bottom: 0.4rem;
  }

  .card-title {
    font-size: 0.85rem;
  }

  .card-text {
    font-size: 0.7rem;
    line-height: 1.2;
  }
}

/* ===== Small Phones ===== */
@media (max-width: 480px) {
  .cards-container {
    gap: 0.7rem;
    margin: 0 12px;
  }

  .card {
    max-width: 95px;
    padding: 0.8rem 0.4rem;
    border-radius: 12px;
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

</style>
