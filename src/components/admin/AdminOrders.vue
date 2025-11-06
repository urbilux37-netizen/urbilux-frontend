<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";

const orders = ref([]);
const loading = ref(false);
const activeTab = ref("Pending");
const tabs = ["Pending", "Processing", "Delivered"];

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

const shortId = (id) => id.slice(0, 8);
const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fetchOrders = async () => {
  try {
    loading.value = true;
    const res = await axios.get("/checkout/admin/all");

    orders.value = (res.data.orders || []).map((o) => ({
      ...o,
      newStatus: o.status,
      items: typeof o.items === "string" ? JSON.parse(o.items) : o.items || [],
      customer:
        typeof o.customer === "string"
          ? JSON.parse(o.customer)
          : o.customer || {},
    }));
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (order) => {
  try {
    if (order.newStatus === order.status) {
      alert("⚠️ No change detected!");
      return;
    }

    await axios.put(`/checkout/admin/${order.id}/status`, {
      status: order.newStatus,
    });

    alert(`✅ Order ${shortId(order.id)} updated to ${order.newStatus}`);
    fetchOrders();
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    alert("Update failed. Please try again!");
  }
};

const filteredOrders = computed(() =>
  orders.value
    .filter(
      (o) => o.status?.toLowerCase() === activeTab.value.toLowerCase()
    )
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
);

onMounted(fetchOrders);
</script>

<template>
  <div class="admin-orders">
    <h1 class="title">📦 Manage Orders</h1>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="t in tabs"
        :key="t"
        :class="['tab-btn', activeTab === t ? 'active' : '']"
        @click="activeTab = t"
      >
        {{ t }}
      </button>
    </div>

    <!-- Table -->
    <div v-if="filteredOrders.length && !loading" class="table-wrapper">
      <div class="order-card" v-for="(o, i) in filteredOrders" :key="i">
        <div class="order-top">
          <span class="order-id">#{{ shortId(o.id) }}</span>
          <span class="order-date">{{ formatDate(o.created_at) }}</span>
        </div>

        <div class="order-body">
          <div class="info">
            <p class="customer"><b>{{ o.customer.name }}</b></p>
            <p class="phone">📞 {{ o.customer.phone }}</p>
            <p class="address">
              {{ o.customer.address }}
              <span v-if="o.customer.district">
                , {{ o.customer.district }}, {{ o.customer.upazila }},
                {{ o.customer.thana }}
              </span>
            </p>
          </div>

          <div class="details">
            <p><b>Payment:</b> {{ o.payment_method }}</p>
            <p class="total"><b>Total:</b> ৳{{ o.total }}</p>
          </div>
        </div>

        <div class="order-actions">
          <select v-model="o.newStatus" class="status-select">
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
          </select>
          <button class="update-btn" @click="updateStatus(o)">Update</button>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-else-if="loading" class="loading">
      <div class="loader"></div>
      <p>Loading orders...</p>
    </div>

    <!-- Empty -->
    <div v-else class="empty">
      <img
        src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
        alt="Empty"
      />
      <p>No {{ activeTab }} orders found</p>
    </div>
  </div>
</template>

<style scoped>
.admin-orders {
  width: 92%;
  max-width: 1100px;
  margin: 80px auto;
  font-family: "Zalando Sans", sans-serif;
}

.title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 22px;
  flex-wrap: wrap;
}
.tab-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  background: #f2f2f2;
  color: #444;
  cursor: pointer;
  transition: all 0.3s;
}
.tab-btn.active {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  box-shadow: 0 3px 10px rgba(142, 45, 226, 0.3);
}

/* Order Card */
.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
  padding: 16px 18px;
  border-left: 5px solid #8e2de2;
}

.order-top {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 10px;
}
.order-body {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.info {
  flex: 1;
  min-width: 200px;
}
.details {
  flex: 1;
  min-width: 160px;
  text-align: right;
}
.total {
  color: #4a00e0;
  font-weight: 700;
}
.address {
  font-size: 13px;
  color: #666;
}
.phone {
  font-size: 13px;
  color: #777;
}

/* Actions */
.order-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  gap: 10px;
  flex-wrap: wrap;
}
.status-select {
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1;
  min-width: 120px;
}
.update-btn {
  flex: 1;
  min-width: 100px;
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.update-btn:hover {
  opacity: 0.9;
}

/* Loader */
.loading {
  text-align: center;
  color: #555;
}
.loader {
  border: 4px solid #eee;
  border-top: 4px solid #8e2de2;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  margin: 15px auto;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/* Empty */
.empty {
  text-align: center;
  margin-top: 60px;
  color: #777;
}
.empty img {
  width: 110px;
  opacity: 0.8;
  margin-bottom: 8px;
}

/* ✅ Responsive */
@media (max-width: 768px) {
  .admin-orders {
    width: 95%;
    margin: 60px auto;
  }

  .order-card {
    padding: 14px;
  }

  .order-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .details {
    text-align: left;
  }

  .order-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .update-btn,
  .status-select {
    width: 100%;
  }
}
</style>
