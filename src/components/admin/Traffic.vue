<template>
  <div class="traffic-wrapper">
    <h1 class="title">Website Traffic Overview</h1>

    <div class="cards">
      <div class="card">
        <h2>আজকের ভিজিটর</h2>
        <p class="count">{{ visitsToday }}</p>
      </div>

      <div class="card">
        <h2>শেষ ৭ দিনের ভিজিটর</h2>
        <p class="count">{{ visits7 }}</p>
      </div>

      <div class="card">
        <h2>শেষ ৩০ দিনের ভিজিটর</h2>
        <p class="count">{{ visits30 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const visitsToday = ref(0);
const visits7 = ref(0);
const visits30 = ref(0);

onMounted(async () => {
  const api = axios.create({
    baseURL:
      window.location.hostname === "localhost"
        ? "http://localhost:5000/api"
        : "https://urbilux-backend.onrender.com/api",
    withCredentials: true,
  });

  visitsToday.value = (await api.get("/traffic/visits-today")).data.total;
  visits7.value = (await api.get("/traffic/visits-7days")).data.total;
  visits30.value = (await api.get("/traffic/visits-30days")).data.total;
});
</script>

<style scoped>
.traffic-wrapper {
  padding: 20px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 25px;
  color: #4a00e0;
}

.cards {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.card {
  width: 250px;
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.card h2 {
  font-size: 18px;
  color: #555;
}

.count {
  font-size: 40px;
  font-weight: bold;
  margin-top: 10px;
  color: #8e2de2;
}
</style>
