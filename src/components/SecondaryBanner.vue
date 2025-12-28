<template>
  <div class="secondary-banner">
    <transition name="fade">
      <img
        v-if="current"
        :src="API + current.image_url"
        :key="current.id"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const banners = ref([]);
const current = ref(null);
let index = 0;

const load = async () => {
  const res = await axios.get(`${API}/secondary-banners`);
  banners.value = res.data;
  current.value = banners.value[0];
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
  position: relative;
  overflow: hidden;
}
.secondary-banner img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  position: absolute;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
