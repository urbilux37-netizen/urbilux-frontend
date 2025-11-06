<template>
  <div class="account-page">
    <h1>My Account</h1>

    <div v-if="user" class="account-info">
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Phone:</strong> {{ user.phone || "Not set" }}</p>

      <button class="logout-btn" @click="handleLogout">Logout</button>
    </div>

    <div v-else>
      <p>You are not logged in.</p>
      <router-link to="/login" class="login-link">Go to Login</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const user = ref(null);
const router = useRouter();

// ✅ Auto-detect local or cloudflare API base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

// ✅ Axios setup for cookies & base URL
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE;

console.log("🔗 Using API base URL:", API_BASE);

// ✅ Load user info from backend
const getUser = async () => {
  try {
    const res = await axios.get(`${API_BASE}/auth/current-user`);
    user.value = res.data.user || null;
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    user.value = null;
  }
};

// ✅ Logout user via backend
const handleLogout = async () => {
  try {
    await axios.post(`${API_BASE}/auth/logout`);
    user.value = null;
    router.push("/login");
  } catch (err) {
    console.error("❌ Logout error:", err);
  }
};

onMounted(getUser);
</script>

<style scoped>
.account-page {
  font-family: "Zalando Sans";
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #4a00e0;
}

.account-info p {
  font-size: 18px;
  margin: 10px 0;
}

.logout-btn {
  display: block;
  margin: 20px auto 0;
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #c0392b;
}

.login-link {
  display: block;
  text-align: center;
  margin-top: 15px;
  color: #4a00e0;
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}
</style>
