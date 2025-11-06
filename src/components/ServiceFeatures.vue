<template>
  <section class="service-section">
    <div class="cards-container">
      <!-- 🚚 Delivery -->
      <div class="card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/679/679720.png"
          alt="Delivery Icon"
          class="icon"
        />
        <h3 class="card-title">Delivery</h3>
        <p class="card-text">
          Enjoy fast home delivery all over Bangladesh.
        </p>
      </div>

      <!-- 🔁 Easy Returns -->
      <div class="card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10106/10106672.png"
          alt="Return Icon"
          class="icon"
        />
        <h3 class="card-title">Easy Returns</h3>
        <p class="card-text">
          Pay only after receiving and checking your product for peace of mind.
        </p>
      </div>

      <!-- 💸 Cash on Delivery -->
      <div class="card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
          alt="Cash on Delivery Icon"
          class="icon"
        />
        <h3 class="card-title">Cash on Delivery</h3>
        <p class="card-text">
          Pay conveniently when your order arrives at your doorstep.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
// no JS needed
</script>

<style scoped>
/* ===== Section Wrapper ===== */
.service-section {
  width: 100%;
  background: #fff;
  padding: 2rem 1rem;
  text-align: center;
}

/* ===== Cards Grid ===== */
.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem; /* equal spacing */
  justify-items: center;
  align-items: stretch;
}

/* ===== Individual Card ===== */
.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  width: 100%;
  max-width: 120px; /* 🟣 small & equal cards */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(160, 112, 255, 0.25);
}

/* ===== Icon ===== */
.icon {
  width: 36px;
  height: 36px;
  margin-bottom: 0.6rem;
  filter: drop-shadow(0 0 4px rgba(122, 0, 255, 0.3));
}

/* ===== Text ===== */
.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.3rem;
  font-family: "Georgia", serif;
}

.card-text {
  font-size: 0.7rem;
  color: #444;
  line-height: 1.3;
}

/* ===== Responsive ===== */

/* Tablet (medium) */
@media (max-width: 1024px) {
  .cards-container {
    gap: 0.8rem;
  }

  .card {
    max-width: 110px;
    padding: 0.9rem;
  }

  .icon {
    width: 32px;
    height: 32px;
  }

  .card-title {
    font-size: 0.85rem;
  }

  .card-text {
    font-size: 0.68rem;
  }
}

/* Mobile (small screens) */
@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.7rem;
  }

  .card {
    max-width: 100px;
    padding: 0.8rem 0.5rem;
    border-radius: 12px;
  }

  .icon {
    width: 30px;
    height: 30px;
  }

  .card-title {
    font-size: 0.8rem;
  }

  .card-text {
    font-size: 0.65rem;
    line-height: 1.2;
  }
}

/* Very small phones */
@media (max-width: 480px) {
  .cards-container {
    gap: 0.5rem;
  }

  .card {
    max-width: 90px;
    padding: 0.7rem 0.4rem;
  }

  .icon {
    width: 28px;
    height: 28px;
  }

  .card-title {
    font-size: 0.75rem;
  }

  .card-text {
    font-size: 0.6rem;
  }
}
</style>
