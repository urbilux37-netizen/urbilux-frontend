<template>
  <div>
    <Navbar />
    <div class="signup-container">
      <h2 class="signup-title">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="signup-form">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <input v-model="phone" type="text" placeholder="Phone (optional)" />
        <button type="submit">Sign Up</button>
      </form>
      <p class="login-text">
        Already have an account? <router-link to="/login">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Navbar from "@/components/NavBar.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const phone = ref("");

// ✅ Auto-detect local or Cloudflare API base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

console.log("🔗 Using API base URL:", API_BASE);

// ✅ Handle Signup
const handleSignup = async () => {
  try {
    const res = await axios.post(`${API_BASE}/auth/signup`, {
      email: email.value,
      password: password.value,
      phone: phone.value,
    });
    alert(res.data.message || "Signup successful!");
    router.push("/login");
  } catch (err) {
    console.error("❌ Signup error:", err);
    alert(err.response?.data?.message || "Signup failed");
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.signup-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #4a00e0;
}

.signup-form input {
  width: 100%;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.signup-form input:focus {
  border-color: #8e2de2;
  outline: none;
}

.signup-form button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #4a00e0, #8e2de2);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.signup-form button:hover {
  background: linear-gradient(45deg, #3b00c0, #7321c8);
}

.login-text {
  margin-top: 15px;
  color: #555;
  font-size: 14px;
}

.login-text a {
  color: #4a00e0;
  text-decoration: none;
  font-weight: bold;
}

.login-text a:hover {
  text-decoration: underline;
}
</style>
