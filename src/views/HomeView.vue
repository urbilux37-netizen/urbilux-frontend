<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />
<div class="wlcbanner">
    <!-- 🟣 Banner -->
 <WelcomeBanner />
     <FloatingIcon /> <!-- এখানে বসাবে -->
</div>

    <!-- 🟣 Home Page Content -->
    <div class="home-content">
 <WelcomeBanner />
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
import FloatingIcon from "@/components/FloatingIcon.vue";

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
     ;
    hotDeals.value = data
      .filter(p => p.is_hot_deal)
      .slice(-10)
   ;
    allProducts.value = data.slice(-10).reverse();
  } catch (err) {
    console.error("❌ Products fetch error:", err);
  }
};
onMounted(fetchProducts);
</script>

<style scoped>
.banner-slider {
  width: 100%;
  margin: 0 auto;
}

/* GRID: big left, 2 small right */
.banner-grid {
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 16px;
  align-items: stretch;
}

/* LEFT MAIN */
.main-banner {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}

.slide {
  width: 100%;
  height: 100%;
}

/* 🔁 No crop/zoom – full image dekhao */
.img-main {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #ffffff;
}

/* ⭐ Main center CTA – nicher dike, upar e layer e */
.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26px;
  pointer-events: none;
  z-index: 10; /* important */
}

.cta-btn {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(67, 56, 202, 0.45);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(67, 56, 202, 0.6);
  opacity: 0.96;
}

/* Dots for main */
.dots {
  position: absolute;
  bottom: 18px;
  right: 22px;
  display: flex;
  gap: 6px;
  z-index: 5;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.dot.active {
  background: #f97316;
}

/* Arrows for main */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(15, 23, 42, 0.35);
  color: #fff;
  width: 30px;
  height: 52px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
.arrow.left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.arrow.right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* RIGHT COLUMN 2 SMALL */
.side-banners {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-item {
  flex: 1;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  position: relative;
}

.side-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.side-link {
  display: block;
  width: 100%;
  height: 100%;
}

/* 🔁 No crop/zoom for side */
.img-side {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #ffffff;
  display: block;
}

/* ⭐ Side CTA – purple chip, bottom center */
.side-cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 8px 18px rgba(67, 56, 202, 0.4);
  z-index: 10; /* 🔥 bottom-er button ekdom upore */
}

/* side dots */
.side-dots {
  position: absolute;
  bottom: 8px;
  right: 10px;
  display: flex;
  gap: 4px;
  z-index: 6;
}
.side-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.side-dot.active {
  background: #f97316;
}

/* side arrows */
.side-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(15, 23, 42, 0.4);
  color: #ffffff;
  width: 24px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  z-index: 6;
}
.side-left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.side-right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile / tablet */
@media (max-width: 1023px) {
  .banner-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  /* main top, side নিচে side-by-side */
  .side-banners {
    flex-direction: row;
    gap: 10px;
    margin-top: 4px;
  }

  .side-item {
    height: 150px;
  }

  /* phone e arrow/dots নাই */
  .arrow,
  .side-arrow,
  .dots,
  .side-dots {
    display: none;
  }

  .cta {
    bottom: 18px;
  }
}

/* Extra small phones <=480px */
@media (max-width: 480px) {
  .side-item {
    height: 140px;
  }
}
</style>
