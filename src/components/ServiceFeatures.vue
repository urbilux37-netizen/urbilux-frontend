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

    <!-- 📝 Icon Credits -->
    <div class="credits">
      <a
        href="https://www.flaticon.com/free-icons/delivery"
        title="delivery icons"
        target="_blank"
      >
        Delivery icons created by Freepik
      </a>
      <span> | </span>
      <a
        href="https://www.flaticon.com/free-icons/return"
        title="return icons"
        target="_blank"
      >
        Return icons created by BomSymbols
      </a>
      <span> | </span>
      <a
        href="https://www.flaticon.com/free-icons/profit"
        title="profit icons"
        target="_blank"
      >
        Profit icons created by monkik
      </a>
    </div>
  </section>
</template>

<script setup>
// No JS needed
</script>

<style scoped>
/* ===== Section Wrapper ===== */
.service-section {
  width: 100%;
  background: linear-gradient(135deg, #a070ff, #b682ff, #c394ff);
  padding: 4rem 2rem;
  text-align: center;
  color: #000;
}

/* ===== Cards Layout ===== */
.cards-container {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

/* ===== Card ===== */
.card {
  background: #ffffff;
  border: none;
  border-radius: 18px;
  box-shadow: 0 3px 10px rgba(74, 0, 224, 0.1);
  padding: 2rem 1.5rem;
  width: 320px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 25px rgba(142, 45, 226, 0.35);
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
  transform: scale(1.08);
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
  color: #333;
  line-height: 1.5;
}

/* ===== Credits ===== */
.credits {
  margin-top: 2.5rem;
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
}

.credits a {
  color: #fff;
  opacity: 0.9;
  text-decoration: none;
}

.credits a:hover {
  text-decoration: underline;
  opacity: 1;
}

/* ===== Responsive Design ===== */

/* Tablet */
@media (max-width: 1024px) {
  .card {
    width: 280px;
    padding: 1.8rem 1.2rem;
  }
}

/* Mobile */
@media (max-width: 768px) {
  .service-section {
    padding: 3rem 1.5rem;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
  }

  .card {
    width: 100%;
    max-width: 350px;
    margin-bottom: 1.5rem;
  }

  .icon {
    width: 50px;
    height: 50px;
  }

  .card-title {
    font-size: 1.15rem;
  }

  .card-text {
    font-size: 0.9rem;
  }
}

/* Small Phones */
@media (max-width: 480px) {
  .service-section {
    padding: 2.5rem 1rem;
  }

  .card {
    padding: 1.5rem 1rem;
    border-radius: 14px;
  }

  .icon {
    width: 45px;
    height: 45px;
  }

  .card-title {
    font-size: 1.05rem;
  }

  .card-text {
    font-size: 0.88rem;
  }

  .credits {
    font-size: 0.7rem;
  }
}
</style>
