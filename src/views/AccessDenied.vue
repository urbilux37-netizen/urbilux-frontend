<template>
  <div class="access-denied-page">
    <div class="content">
      <h1 class="title">🚫 Access Denied</h1>
      <p class="message">
        Sorry! You don’t have permission to access this page.
      </p>

      <p class="hint">
        Only <strong>Admin</strong> users can open this section.
      </p>

      <button class="home-btn" @click="goHome">← Back to Home</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.access-denied-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4A00E0, #8E2DE2);
  color: #fff;
  text-align: center;
  font-family: "Zalando Sans", sans-serif;
  padding: 20px;
}

.content {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 40px 25px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.title {
  font-size: 2.3em;
  font-weight: 800;
  margin-bottom: 10px;
}

.message {
  font-size: 1.1em;
  margin-bottom: 8px;
  opacity: 0.95;
}

.hint {
  font-size: 0.95em;
  margin-bottom: 25px;
  color: #ffe8ff;
}

.home-btn {
  background: #fff;
  color: #4A00E0;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1em;
  transition: all 0.3s ease;
}

.home-btn:hover {
  background: #eee;
  transform: translateY(-2px);
}
</style>
