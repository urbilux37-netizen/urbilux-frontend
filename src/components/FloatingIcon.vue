<template>
  <div class="floating-container">
    <!-- WhatsApp Floating Button -->
    <a
      :href="whatsAppLink"
      target="_blank"
      rel="noopener"
      class="floating-btn whatsapp-btn"
    >
      <img
        src="../assets/icons/whatsapp-business-icon.svg"
        alt="WhatsApp"
      />
    </a>
  </div>
</template>

<script setup>
const whatsAppLink = "https://wa.me/8801631822765";
// 👉 এখানে তোমার WhatsApp number বসাবে
// example: https://wa.me/88018XXXXXXXX
</script>

<style scoped>
.floating-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* WhatsApp Button Style */
.floating-btn {
  width: 60px;
  height: 60px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: 0.3s;
}

.floating-btn img {
  width: 35px;
  height: 35px;
}

.floating-btn:hover {
  transform: scale(1.1);
}

/* 🔹 Mobile Responsive */
@media (max-width: 768px) {
  .floating-btn {
    width: 50px;
    height: 50px;
  }

  .floating-btn img {
    width: 28px;
    height: 28px;
  }

  .floating-container {
    bottom: 15px;
    right: 15px;
  }
}
</style>
