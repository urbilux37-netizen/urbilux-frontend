<template>
  <div class="coming-soon-page">
    <!-- Navbar -->
    <Navbar />

    <div class="coming-soon-content">
      <h1>Coming Soon</h1>
      <p>আমরা শীঘ্রই আমাদের নতুন ফিচার নিয়ে আসছি। সঙ্গে থাকুন 💜</p>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
.coming-soon-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #4A00E0, #8E2DE2);
  color: #fff;
  font-family: "Poppins", sans-serif;
}

.coming-soon-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
}

.coming-soon-content h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 2px;
  animation: fadeIn 1.5s ease-in-out;
}

.coming-soon-content p {
  font-size: 1.2rem;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0.9;
  animation: fadeIn 2.5s ease-in-out;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
