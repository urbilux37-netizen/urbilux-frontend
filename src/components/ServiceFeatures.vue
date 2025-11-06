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
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  padding: 4rem 2rem;
  text-align: center;
}

/* ===== Cards Layout ===== */
.cards-container {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 2rem;
  flex-wrap: wrap;
}

/* ===== Each Card ===== */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(74, 0, 224, 0.08);
  padding: 2rem 1rem;
  width: 320px;
  transition: 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(142, 45, 226, 0.25);
}

/* ===== Icon ===== */
.icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 6px rgba(142, 45, 226, 0.4));
  transition: 0.3s;
}

.card:hover .icon {
  transform: scale(1.05);
}

/* ===== Text ===== */
.card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 0.6rem;
  font-family: "Georgia", serif;
}

.card-text {
  font-size: 1rem;
  color: #444;
  line-height: 1.5;
}

/* ===== Responsive ===== */

/* Tablet */
@media (max-width: 1024px) {
  .cards-container {
    gap: 1.2rem;
    flex-wrap: wrap;
  }

  .card {
    width: 260px;
    padding: 1.8rem 1rem;
  }

  .card-title {
    font-size: 1.15rem;
  }

  .card-text {
    font-size: 0.95rem;
  }
}

/* Mobile (🟣 3 cards per row) */
@media (max-width: 768px) {
  .cards-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
  }

  .card {
    width: 100%;
    padding: 1.2rem 0.8rem;
  }

  .icon {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 0.95rem;
  }

  .card-text {
    font-size: 0.75rem;
    line-height: 1.3;
  }
}

/* Small Phones (🟣 still 3 per row but tighter) */
@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.6rem;
  }

  .card {
    padding: 1rem 0.5rem;
  }

  .icon {
    width: 35px;
    height: 35px;
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 0.85rem;
  }

  .card-text {
    font-size: 0.7rem;
  }
}
</style>
