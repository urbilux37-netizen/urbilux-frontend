<template>
  <div class="admin-page">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Admin Panel</h1>

    <!-- ===== Nav Tabs ===== -->
    <nav class="flex flex-wrap gap-3 mb-6 justify-center">
      <button
        @click="activeTab = 'dashboard'"
        :class="activeTab === 'dashboard' ? 'active-tab' : 'inactive-tab'"
      >
        Dashboard
      </button>

      <button
        @click="activeTab = 'banners'"
        :class="activeTab === 'banners' ? 'active-tab' : 'inactive-tab'"
      >
        Banners
      </button>

      <!-- 🟣 TAB 1: Main Tickers -->
      <button
        @click="activeTab = 'tickers'"
        :class="activeTab === 'tickers' ? 'active-tab' : 'inactive-tab'"
      >
        Tickers
      </button>

      <!-- 🟣 TAB 2: Secondary Tickers -->
      <button
        @click="activeTab = 'secondary-tickers'"
        :class="activeTab === 'secondary-tickers' ? 'active-tab' : 'inactive-tab'"
      >
        Secondary Tickers
      </button>

      <!-- 🟣 TAB 3: Secondary Banners -->
      <button
        @click="activeTab = 'secondary-banners'"
        :class="activeTab === 'secondary-banners' ? 'active-tab' : 'inactive-tab'"
      >
        Secondary Banners
      </button>

      <!-- 🟢 NEW TAB: BLOGS -->
      <button
        @click="activeTab = 'blogs'"
        :class="activeTab === 'blogs' ? 'active-tab' : 'inactive-tab'"
      >
        Blogs
      </button>

      <button
        @click="activeTab = 'categories'"
        :class="activeTab === 'categories' ? 'active-tab' : 'inactive-tab'"
      >
        Categories
      </button>

      <button
        @click="activeTab = 'products'"
        :class="activeTab === 'products' ? 'active-tab' : 'inactive-tab'"
      >
        Products
      </button>

      <button
        @click="activeTab = 'orders'"
        :class="activeTab === 'orders' ? 'active-tab' : 'inactive-tab'"
      >
        Orders
      </button>

      <button
        @click="activeTab = 'footer'"
        :class="activeTab === 'footer' ? 'active-tab' : 'inactive-tab'"
      >
        Footer
      </button>

      <!-- 🟣 TAB: Traffic -->
      <button
        @click="activeTab = 'traffic'"
        :class="activeTab === 'traffic' ? 'active-tab' : 'inactive-tab'"
      >
        Traffic
      </button>
    </nav>

    <!-- ===== Tab Content ===== -->
    <div class="tab-content">
      <div v-if="activeTab === 'dashboard'">
        <Dashboard />
      </div>

      <div v-else-if="activeTab === 'banners'">
        <BannerManager />
      </div>

      <div v-else-if="activeTab === 'tickers'">
        <TickerManager />
      </div>

      <div v-else-if="activeTab === 'secondary-tickers'">
        <SecondaryTickerManager />
      </div>

      <div v-else-if="activeTab === 'secondary-banners'">
        <SecondaryBannerAdmin />
      </div>

      <!-- 🟢 BLOG MANAGER CONTENT -->
      <div v-else-if="activeTab === 'blogs'">
        <BlogManager />
      </div>

      <div v-else-if="activeTab === 'categories'">
        <CategoryManager />
      </div>

      <div v-else-if="activeTab === 'products'">
        <ProductsManager />
      </div>

      <div v-else-if="activeTab === 'orders'">
        <OrdersManager />
      </div>

      <div v-else-if="activeTab === 'footer'">
        <FooterManagement />
      </div>

      <div v-else-if="activeTab === 'traffic'">
        <Traffic />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import Dashboard from "../components/admin/AdminDashboard.vue";
import BannerManager from "../components/admin/BannerManager.vue";
import CategoryManager from "../components/admin/CategoryManager.vue";
import ProductsManager from "../components/admin/ProductManager.vue";
import OrdersManager from "../components/admin/AdminOrders.vue";
import FooterManagement from "../components/FooterManagement.vue";

// 🟣 IMPORT: Traffic
import Traffic from "../components/admin/Traffic.vue";

// 🟣 IMPORT: Ticker Manager (Main)
import TickerManager from "../components/admin/TickerManager.vue";

// 🟣 IMPORT: Secondary Ticker Manager
import SecondaryTickerManager from "../components/admin/SecondaryTickerManager.vue";

// 🟣 IMPORT: Secondary Banner Admin
import SecondaryBannerAdmin from "../components/admin/SecondaryBannerAdmin.vue";

// 🟢 IMPORT: BLOG MANAGER
import BlogManager from "../components/admin/BlogManager.vue";

const activeTab = ref("dashboard");
</script>

<style scoped>
.admin-page {
  padding: 30px;
  max-width: 1100px;
  margin: 60px auto;
  font-family: "Inter", sans-serif;
  background-color: #f9f9fb;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

h1 {
  text-align: center;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
}

nav button {
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.active-tab {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
}

.inactive-tab {
  background: #e0e0e0;
  color: #444;
}
.inactive-tab:hover {
  background: #e8defc;
  color: #4a00e0;
}

.tab-content {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  min-height: 500px;
}

@media (max-width: 768px) {
  .admin-page {
    width: 95%;
    padding: 20px;
  }
}
</style>
