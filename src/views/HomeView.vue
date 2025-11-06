<template>
  <section class="welcome-banner">
    <div class="content">
      <h1 class="title">Welcome to <span class="brand">URBILUX</span></h1>
      <p class="subtitle">
        Discover elegance and style across our exclusive collections, tailored for your sophisticated taste.
      </p>
      <a href="https://urbilux.pages.dev/all-products" class="shop-btn">
        Shop Now
      </a>
    </div>
  </section>
</template>

<script setup>
// No JS needed — purely static section
</script>

<style scoped>
.welcome-banner {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
  font-family: "Georgia", serif;
  padding: 2rem;
}

.content {
  max-width: 800px;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.brand {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.1rem;
  color: #2d2d2d;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.shop-btn {
  display: inline-block;
  background: linear-gradient(90deg, #a24eff, #c977ff);
  color: white;
  font-weight: 600;
  padding: 0.8rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  transition: 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shop-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}
</style>
