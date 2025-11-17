<template>
  <div class="floating-container">
    <!-- Google Map Button -->
    <a
      :href="mapLink"
      target="_blank"
      rel="noopener"
      class="floating-btn map-btn"
    >
      <img
        src="../assets/icons/icons8-google-maps.svg"
        alt="Map"
      />
    </a>

    <!-- WhatsApp Button -->
    <a
      :href="whatsAppLink"
      target="_blank"
      rel="noopener"
      class="floating-btn whatsapp-btn"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp"
      />
    </a>
  </div>
</template>

<script setup>
// 👉 এখানেই তোমার লিঙ্কগুলো বসাবে
const whatsAppLink = "https://wa.me/8801631822765"; // তোমার WhatsApp নম্বর
const mapLink = "https://maps.app.goo.gl/DTC6xUpMtKwHC4QC7?g_st=ac"; // Google Map Link
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

/* Floating Button Base Style */
.floating-btn {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: 0.3s;
}

/* Button Icons */
.floating-btn img {
  width: 44px;
  height: 44px;
}

/* WhatsApp color */
.whatsapp-btn {
  background: #25d366;
}

/* Hover effect */
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
    width: 33px;
    height: 33px;
  }

  .floating-container {
    bottom: 70px;
    right: 15px;
  }
}
</style>
