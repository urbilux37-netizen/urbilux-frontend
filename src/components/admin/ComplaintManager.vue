<template>
  <div class="card">
    <h2>Customer Complaints</h2>

    <div v-if="loading">Loading...</div>
    <div v-else-if="!complaints.length">No complaints found</div>

    <div v-for="c in complaints" :key="c.id" class="item">
      <div>
        <strong>{{ c.customer_name }}</strong> ({{ c.phone }})
        <p>{{ c.message }}</p>
        <img v-if="c.image_url" :src="c.image_url" />
      </div>

      <button @click="remove(c.id)">Delete</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const complaints = ref([]);
const loading = ref(false);

async function fetchComplaints() {
  loading.value = true;
  const res = await axios.get(`${API_BASE}/api/complaints`);
  complaints.value = res.data;
  loading.value = false;
}

async function remove(id) {
  if (!confirm("Delete this complaint?")) return;
  await axios.delete(`${API_BASE}/api/complaints/${id}`);
  fetchComplaints();
}

onMounted(fetchComplaints);
</script>

<style scoped>
.card {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
}
.item {
  border-bottom: 1px solid #eee;
  padding: 16px 0;
}
img {
  width: 200px;
  margin-top: 8px;
  border-radius: 8px;
}
button {
  background: #dc2626;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
}
</style>
