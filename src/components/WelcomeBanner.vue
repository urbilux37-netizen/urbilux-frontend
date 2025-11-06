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
// No JS needed
</script>

<style scoped>
/* === Base Section === */
.welcome-banner {
  width: 100%;
  min-height: 70vh; /* 🟣 Reduced from full-screen to 60% height */
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Georgia", serif;
  padding: 2rem;
  box-sizing: border-box;
}

/* === Content Wrapper === */
.content {
  max-width: 800px;
}

/* === Title === */
.title {
  font-size: 3.5rem; /* 🟣 Increased text size */
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #000;
  line-height: 1.2;
}

.brand {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* === Subtitle === */
.subtitle {
  font-size: 1.25rem; /* 🟣 Slightly larger text */
  color: #2d2d2d;
  line-height: 1.7;
  margin-bottom: 3rem;
}

/* === Button === */
.shop-btn {
  display: inline-block;
  background: linear-gradient(90deg, #a24eff, #c977ff);
  color: white;
  font-weight: 600;
  font-size: 1.05rem;
  padding: 1rem 2.4rem;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(142, 45, 226, 0.25);
}

.shop-btn:hover {
  transform: translateY(-3px);
  opacity: 0.92;
}

/* === Mobile Responsive === */
@media (max-width: 768px) {
  .welcome-banner {
    min-height: 55vh;
    padding: 1.5rem;
  }

  .title {
    font-size: 2.4rem;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .shop-btn {
    font-size: 0.95rem;
    padding: 0.8rem 1.8rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .welcome-banner {
    min-height: 50vh;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .shop-btn {
    font-size: 0.9rem;
    padding: 0.7rem 1.5rem;
  }
}
</style>
