<template>
  <div class="orders-page">
    <Navbar />

    <section class="header">
      <h1>My Orders</h1>

      <div class="toolbar">
        <input
          v-model="q"
          class="search"
          type="text"
          placeholder="Search by Order ID or Product..."
        />
        <select v-model="statusFilter" class="select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
    </section>

    <!-- Loader -->
    <section v-if="loading" class="loader-wrap">
      <div class="skeleton" v-for="n in 3" :key="n"></div>
    </section>

    <!-- Empty -->
    <section v-else-if="!filteredOrders.length" class="empty">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty"
      />
      <p>No orders found.</p>
      <router-link to="/" class="btn">Go shopping</router-link>
    </section>

    <!-- Desktop Table -->
    <section v-else class="table-wrap desktop-only">
      <table class="orders-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Date & Time</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filteredOrders" :key="o.id">
            <td class="order-col">
              <span class="order-id">#{{ shortId(o.id) }}</span>
            </td>
            <td>{{ formatDate(o.created_at) }}</td>
            <td class="items-cell">
              <ul class="items-ul">
                <li v-for="(p, i) in o.items" :key="i" class="item">
                  <img :src="p.image_url || placeholder" :alt="p.name" />
                  <span class="name">{{ p.name }}</span>
                  <span class="meta">
                    x{{ p.quantity }} · ৳{{ num(p.price) }}
                  </span>
                </li>
              </ul>
            </td>
            <td class="total">৳{{ num(o.total) }}</td>
            <td>{{ o.payment_method }}</td>
            <td>
              <span :class="['badge', o.status.toLowerCase()]">{{ o.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Mobile Cards -->
    <section class="mobile-only cards">
      <article v-for="o in filteredOrders" :key="o.id" class="card">
        <header class="card-head">
          <div class="left">
            <h3>#{{ shortId(o.id) }}</h3>
            <small>{{ formatDate(o.created_at) }}</small>
          </div>
          <span :class="['badge', o.status.toLowerCase()]">{{ o.status }}</span>
        </header>

        <ul class="card-items">
          <li v-for="(p, i) in o.items" :key="i" class="card-item">
            <img :src="p.image_url || placeholder" :alt="p.name" />
            <div class="ci-right">
              <p class="nm">{{ p.name }}</p>
              <p class="in">
                x{{ p.quantity }}
                · ৳{{ num(p.price) }}
              </p>
            </div>
          </li>
        </ul>

        <footer class="card-foot">
          <div class="foot-left">
            <span class="label">Payment</span>
            <span>{{ o.payment_method }}</span>
          </div>
          <div class="foot-right">
            <span class="label">Total</span>
            <strong>৳{{ num(o.total) }}</strong>
          </div>
        </footer>
      </article>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";
import { ref, computed, onMounted } from "vue";

const orders = ref([]);
const loading = ref(true);
const q = ref("");
const statusFilter = ref("");

const placeholder = new URL("@/assets/no-image.png", import.meta.url).href;

// ✅ Auto-detect API base URL
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

// helpers
const shortId = (id) => String(id).slice(0, 8);
const num = (v) => Number(v).toFixed(2);
const formatDate = (d) =>
  new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// fetch
const fetchOrders = async () => {
  try {
    loading.value = true;
    const res = await axios.get("/checkout", { withCredentials: true });

    // Backend returns items/customer as JSON; keep safe:
    orders.value = (res.data?.orders || []).map((o) => ({
      ...o,
      items: Array.isArray(o.items) ? o.items : JSON.parse(o.items || "[]"),
      customer:
        typeof o.customer === "object"
          ? o.customer
          : JSON.parse(o.customer || "{}"),
    }));
  } catch (e) {
    console.error("Failed to load orders:", e);
  } finally {
    loading.value = false;
  }
};

// filters
const filteredOrders = computed(() => {
  const term = q.value.trim().toLowerCase();
  const s = statusFilter.value;

  return orders.value.filter((o) => {
    const matchStatus = s ? o.status?.toLowerCase() === s : true;
    const inId = String(o.id).toLowerCase().includes(term);
    const inItems = (o.items || []).some(
      (it) => it.name?.toLowerCase().includes(term)
    );
    const matchQuery = term ? inId || inItems : true;
    return matchStatus && matchQuery;
  });
});

onMounted(fetchOrders);
</script>


<style scoped>
/* Page Frame */
.orders-page {
  font-family: "Zalando Sans", system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji",
    "Segoe UI Emoji";
  min-height: 100vh;
  background: #f8f7fb;
}

/* Header */
.header {
  width: min(1100px, 92%);
  margin: 90px auto 20px;
  display: grid;
  gap: 14px;
}
.header h1 {
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
}
.search,
.select {
  border: 1px solid #e6e3f4;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  outline: none;
  font-size: 14px;
}
.search {
  flex: 1;
}
.select {
  min-width: 170px;
}

/* Loader */
.loader-wrap {
  width: min(1100px, 92%);
  margin: 10px auto 40px;
}
.skeleton {
  height: 90px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    #f0ecff 25%,
    #faf8ff 37%,
    #f0ecff 63%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
  margin-bottom: 14px;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Empty */
.empty {
  width: min(900px, 92%);
  margin: 40px auto 70px;
  text-align: center;
  color: #666;
}
.empty img {
  width: 120px;
  opacity: 0.9;
}
.empty .btn {
  display: inline-block;
  margin-top: 14px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
}

/* Desktop Table */
.table-wrap {
  width: min(1100px, 92%);
  margin: 10px auto 60px;
}
.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(142, 45, 226, 0.12);
}
.orders-table th,
.orders-table td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #f0ecff;
  vertical-align: top;
}
.orders-table thead th {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  font-weight: 700;
}
.order-col .order-id {
  font-weight: 800;
  color: #4a00e0;
}
.items-cell {
  padding-right: 8px;
}
.items-ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.item {
  display: grid;
  grid-template-columns: 42px 1fr auto;
  gap: 10px;
  align-items: center;
}
.item img {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #eee;
}
.item .name {
  font-weight: 600;
  color: #333;
}
.item .meta {
  color: #8e2de2;
  font-weight: 700;
}
.total {
  font-weight: 800;
  color: #4a00e0;
}

/* Badges */
.badge {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 800;
  letter-spacing: 0.2px;
  display: inline-block;
}
.badge.pending {
  background: #fff3cd;
  color: #856404;
}
.badge.processing {
  background: #e8f0ff;
  color: #1a56db;
}
.badge.delivered {
  background: #d9f7e9;
  color: #0f7b4a;
}

/* Mobile Cards */
.cards {
  width: min(680px, 92%);
  margin: 0 auto 40px;
  display: none;
  gap: 14px;
}
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(142, 45, 226, 0.08);
  padding: 14px;
  border-left: 5px solid #8e2de2;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-head h3 {
  font-size: 16px;
  margin: 0 0 2px;
  color: #4a00e0;
}
.card-head small {
  color: #666;
}
.card-items {
  margin: 10px 0 6px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.card-item {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 10px;
}
.card-item img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eee;
}
.ci-right .nm {
  margin: 0 0 2px;
  font-weight: 700;
  color: #333;
}
.ci-right .in {
  margin: 0;
  color: #8e2de2;
  font-weight: 700;
  font-size: 13px;
}
.card-foot {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px dashed #eee;
}
.card-foot .label {
  display: block;
  color: #777;
  font-size: 12px;
}
.card-foot strong {
  color: #4a00e0;
}

/* Responsive */
.desktop-only {
  display: block;
}
.mobile-only {
  display: none;
}

@media (max-width: 992px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .select {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: grid;
  }
  .header {
    margin: 76px auto 16px;
  }
  .header h1 {
    font-size: 24px;
  }
}
</style>
