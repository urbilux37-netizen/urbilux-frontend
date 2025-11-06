<template>
  <div id="app">
    <!-- 🟣 Global Navbar -->
    <Navbar />

    <!-- 🟢 Main Page Area -->
    <main class="page-container">
      <router-view />
    </main>

    <!-- 🔵 Global Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style>
/* Reset */
html,
body,
#app {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Zalando Sans", sans-serif;
  scroll-behavior: smooth;
}

/* ✅ Keep pages below fixed navbar */
.page-container {
  min-height: calc(100vh - 160px); /* adjust if footer is ~70px high */
  background-color: #fff;
}

/* Optional - style scrollbars */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: #f5f5f5;
}
</style>
