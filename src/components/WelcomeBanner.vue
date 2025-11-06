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
  min-height: 100vh;
  background: linear-gradient(135deg, #b27bff, #c495ff, #d0a9ff);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: "Georgia", serif;
  padding: 2rem;
}

/* === Content Wrapper === */
.content {
  max-width: 800px;
}

/* === Title === */
.title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #000;
}

.brand {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* === Subtitle === */
.subtitle {
  font-size: 1.1rem;
  color: #2d2d2d;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* === Button === */
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

/* === Mobile Responsive Styles === */
@media (max-width: 768px) {
  .welcome-banner {
    padding: 1.5rem;
  }

  .title {
    font-size: 2.2rem;
    line-height: 1.3;
  }

  .subtitle {
    font-size: 1rem;
    line-height: 1.5;
    margin-bottom: 2rem;
  }

  .shop-btn {
    font-size: 0.95rem;
    padding: 0.7rem 1.6rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .shop-btn {
    font-size: 0.9rem;
    padding: 0.6rem 1.4rem;
  }
}
</style>
