<template>
  <div class="secondary-banner">
    <transition name="fade">
      <img
        v-if="current"
        :src="current.image_url"
        :key="current.id"
        alt="Secondary Banner"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const banners = ref([]);
const current = ref(null);
let index = 0;

const load = async () => {
  try {
    const res = await axios.get(
      window.location.hostname === "localhost"
        ? "http://localhost:5000/api/secondary-banners"
        : "https://urbilux-backend.onrender.com/api/secondary-banners"
    );
    banners.value = res.data;
    current.value = banners.value[0] || null;
  } catch (err) {
    console.error("Failed to load banners:", err);
  }
};

onMounted(async () => {
  await load();

  setInterval(() => {
    if (banners.value.length > 1) {
      index = (index + 1) % banners.value.length;
      current.value = banners.value[index];
    }
  }, 4000);
});
</script>

<style scoped>
.secondary-banner {
  width: 100%;
  height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
}

.secondary-banner img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
