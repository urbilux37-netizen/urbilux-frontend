<template>
  <div class="category-manager">
    <h2 class="page-title">🖼 Secondary Banner Manager</h2>

    <form @submit.prevent="addBanner" class="category-form">
      <div class="form-section">
        <label class="form-label">Select Banner Image</label>

        <input type="file" @change="onFileChange" required />
        <div v-if="preview" class="image-preview">
          <img :src="preview" />
        </div>
      </div>

      <button class="btn-add">+ Add Banner</button>
    </form>

    <div class="category-grid" v-if="banners.length">
      <div v-for="b in banners" :key="b.id" class="category-card">
        <img :src="API + b.image_url" />
        <button class="btn-delete" @click="deleteBanner(b.id)">
          Delete
        </button>
      </div>
    </div>
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
const file = ref(null);
const preview = ref(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
  preview.value = URL.createObjectURL(file.value);
};

const fetchBanners = async () => {
  const res = await axios.get(`${API}/secondary-banners`);
  banners.value = res.data;
};

const addBanner = async () => {
  const fd = new FormData();
  fd.append("image", file.value);

  await axios.post(`${API}/secondary-banners`, fd);
  file.value = null;
  preview.value = null;
  fetchBanners();
};

const deleteBanner = async (id) => {
  await axios.delete(`${API}/secondary-banners/${id}`);
  fetchBanners();
};

onMounted(fetchBanners);
</script>
