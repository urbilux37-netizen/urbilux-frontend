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
    </nav>

    <!-- ===== Tab Content ===== -->
    <div class="tab-content">
      <div v-if="activeTab === 'dashboard'">
        <Dashboard />
      </div>

      <div v-else-if="activeTab === 'banners'">
        <BannerManager />
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

const activeTab = ref("dashboard"); // ✅ Default tab = Dashboard
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

/* Heading */
h1 {
  text-align: center;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* ===== Tabs ===== */
nav button {
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

/* Active tab */
.active-tab {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
  transform: translateY(-1px);
}

/* Inactive tab */
.inactive-tab {
  background: #e0e0e0;
  color: #444;
}
.inactive-tab:hover {
  background: #e8defc;
  color: #4a00e0;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* ===== Tab Content ===== */
.tab-content {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  min-height: 500px;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-page {
    width: 95%;
    padding: 20px;
  }
  nav {
    justify-content: center;
  }
  nav button {
    font-size: 14px;
    padding: 8px 16px;
  }
  .tab-content {
    padding: 16px;
  }
}
</style>
