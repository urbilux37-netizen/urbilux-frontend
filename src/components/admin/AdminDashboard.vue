<template>
  <div class="admin-dashboard">
    <h1 class="title">📊 Dashboard Overview</h1>

    <!-- ===== Top Summary Cards ===== -->
    <div class="cards-grid">
      <div v-for="card in cards" :key="card.title" class="card">
        <div class="card-icon">
          <i :class="card.icon"></i>
        </div>
        <div class="card-info">
          <h3>{{ card.title }}</h3>
          <p>{{ card.value }}</p>
        </div>
      </div>
    </div>

    <!-- ===== Sales Chart ===== -->
    <div class="chart-container">
      <h2>📈 Monthly Sales</h2>
      <canvas id="salesChart"></canvas>
    </div>

    <!-- ===== Recent Orders ===== -->
    <div class="recent-orders">
      <h2>🧾 Recent Orders</h2>
      <div v-if="recentOrders.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in recentOrders" :key="o.id">
              <td>#{{ o.id.slice(0, 6) }}</td>
              <td>{{ o.customer?.name || "Guest" }}</td>
              <td>
                <span :class="['status', o.status]">{{ o.status }}</span>
              </td>
              <td>৳{{ o.total }}</td>
              <td>{{ formatDate(o.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty">No recent orders found</div>
    </div>

    <!-- ===== Top Products ===== -->
    <div class="top-products">
      <h2>🏆 Top Selling Products</h2>
      <div v-if="topProducts.length" class="product-list">
        <div v-for="p in topProducts" :key="p.id" class="product-item">
          <img :src="p.image_url" alt="" />
          <div class="info">
            <p class="name">{{ p.name }}</p>
            <p class="sales">Sold: {{ p.sold_count }}</p>
            <p class="revenue">৳{{ p.revenue }}</p>
          </div>
        </div>
      </div>
      <div v-else class="empty">No top products found</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "chart.js/auto";

const cards = ref([
  { title: "Total Orders", value: 0, icon: "fas fa-shopping-bag" },
  { title: "Pending Orders", value: 0, icon: "fas fa-hourglass-half" },
  { title: "Delivered Orders", value: 0, icon: "fas fa-truck" },
  { title: "Total Revenue", value: "৳0", icon: "fas fa-sack-dollar" },
  { title: "Profit", value: "৳0", icon: "fas fa-coins" },
]);

const recentOrders = ref([]);
const topProducts = ref([]);
const monthlySales = ref([]);

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });

// ==================== Fetch Dashboard Data ====================
const fetchDashboard = async () => {
  try {
    const res = await axios.get("/stats/overview");
    const data = res.data;

    // Update summary cards
    cards.value[0].value = data.totalOrders;
    cards.value[1].value = data.pendingOrders;
    cards.value[2].value = data.deliveredOrders;
    cards.value[3].value = `৳${data.totalRevenue}`;
    cards.value[4].value = `৳${data.totalProfit}`;

    recentOrders.value = data.recentOrders || [];
    topProducts.value = data.topProducts || [];
    monthlySales.value = data.monthlySales || [];

    drawChart();
  } catch (err) {
    console.error("❌ Dashboard fetch error:", err);
  }
};

// ==================== Draw Chart ====================
const drawChart = () => {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  const chartData = monthlySales.value.map((m) => m.total);
  const labels = monthlySales.value.map((m) => m.month);

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Sales (৳)",
          data: chartData,
          borderColor: "#8e2de2",
          backgroundColor: "rgba(142, 45, 226, 0.15)",
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true },
      },
    },
  });
};

onMounted(fetchDashboard);
</script>

<style scoped>
.admin-dashboard {
  width: 94%;
  max-width: 1300px;
  margin: 60px auto 100px;
  font-family: "Inter", "Zalando Sans", sans-serif;
  color: #2b2b2b;
  background: linear-gradient(180deg, #faf8ff 0%, #f5f3fa 100%);
  border-radius: 20px;
  padding: 40px 35px;
  box-shadow: 0 20px 60px rgba(74, 0, 224, 0.05);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 0.5px;
  margin-bottom: 50px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2, #b845f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.title::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -10px;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  border-radius: 10px;
}

/* ===== Cards Grid ===== */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  box-shadow: 0 6px 16px rgba(142, 45, 226, 0.08);
  border: 1px solid rgba(142, 45, 226, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(142, 45, 226, 0.15), transparent);
  transition: all 0.5s ease;
}

.card:hover::before {
  left: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(142, 45, 226, 0.15);
}

.card-icon {
  font-size: 32px;
  color: #8e2de2;
  background: rgba(142, 45, 226, 0.08);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info h3 {
  font-size: 15px;
  color: #666;
  font-weight: 600;
}

.card-info p {
  font-size: 26px;
  font-weight: 800;
  color: #2b2b2b;
  margin-top: 4px;
}

/* ===== Chart Section ===== */
.chart-container {
  background: #fff;
  border-radius: 20px;
  padding: 30px 28px;
  margin-bottom: 50px;
  box-shadow: 0 6px 18px rgba(142, 45, 226, 0.08);
  border: 1px solid rgba(142, 45, 226, 0.1);
  transition: 0.3s;
}

.chart-container h2 {
  font-size: 22px;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ===== Table (Recent Orders) ===== */
.recent-orders {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 50px;
  box-shadow: 0 6px 18px rgba(142, 45, 226, 0.08);
  border: 1px solid rgba(142, 45, 226, 0.1);
}

.recent-orders h2 {
  font-size: 22px;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 16px;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  border-radius: 12px;
  overflow: hidden;
}

thead {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
}

th {
  text-align: left;
  padding: 12px 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
}
td {
  padding: 12px 14px;
  border-bottom: 1px solid #eee;
}
tbody tr:hover {
  background-color: #faf6ff;
}

.status {
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  text-transform: capitalize;
}
.status.pending {
  background: #fff7e6;
  color: #c28400;
}
.status.delivered {
  background: #e6ffed;
  color: #0b8e00;
}
.status.processing {
  background: #f0edff;
  color: #4a00e0;
}

/* ===== Top Products ===== */
.top-products {
  background: #fff;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 6px 18px rgba(142, 45, 226, 0.08);
  border: 1px solid rgba(142, 45, 226, 0.1);
}
.top-products h2 {
  font-size: 22px;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 16px;
}

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.product-item {
  background: #faf8ff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  gap: 14px;
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.05);
  transition: all 0.3s;
}
.product-item:hover {
  transform: translateY(-4px);
  background: #f4edff;
  box-shadow: 0 8px 20px rgba(142, 45, 226, 0.15);
}
.product-item img {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #e6d9ff;
}
.product-item .name {
  font-weight: 700;
  color: #333;
  font-size: 15px;
}
.product-item .sales {
  font-size: 13px;
  color: #666;
}
.product-item .revenue {
  font-size: 13px;
  color: #8e2de2;
  font-weight: 700;
}

.empty {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 24px 0;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
@media (max-width: 768px) {
  .admin-dashboard {
    width: 96%;
    padding: 24px 18px;
  }
  .cards-grid {
    grid-template-columns: 1fr 1fr;
  }
  .chart-container, .recent-orders, .top-products {
    padding: 20px;
  }
  .title {
    font-size: 26px;
  }
}
</style>
