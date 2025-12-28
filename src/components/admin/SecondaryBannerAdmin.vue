<template>
  <div class="banner-manager">
    <h2 class="page-title">🖼 Secondary Banner Manager</h2>

    <!-- Add Banner Form -->
    <form @submit.prevent="addBanner" class="card form-card">
      <div class="field">
        <label>Select Banner Image</label>
        <input type="file" @change="onFileChange" required />
      </div>

      <div v-if="preview" class="image-preview">
        <img :src="preview" alt="Preview" />
      </div>

      <button type="submit" class="btn-primary" :disabled="!file || uploading">
        {{ uploading ? "Uploading..." : "+ Add Banner" }}
      </button>
    </form>

    <!-- Banner List -->
    <div class="banner-list" v-if="banners.length">
      <div v-for="b in banners" :key="b.id" class="banner-card">
   <img :src="b.image_url" alt="Banner" />

        <button class="btn-delete" @click="deleteBanner(b.id)">Delete</button>
      </div>
    </div>
    <div v-else class="empty">No banners found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const BACKEND =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const banners = ref([]);
const file = ref(null);
const preview = ref(null);
const uploading = ref(false);

// Fetch banners
const fetchBanners = async () => {
  try {
    const res = await axios.get(`${BACKEND}/api/secondary-banners`);
    banners.value = res.data;
  } catch (err) {
    console.error("Fetch secondary banners failed:", err);
  }
};

// File change
const onFileChange = (e) => {
  file.value = e.target.files[0];
  preview.value = file.value ? URL.createObjectURL(file.value) : null;
};

// Add banner
const addBanner = async () => {
  if (!file.value) return alert("Select a file first");

  try {
    uploading.value = true;
    const fd = new FormData();
    fd.append("image", file.value);

    // Replace this with your actual upload endpoint (R2/Cloud)
    const resUpload = await fetch(`${BACKEND}/products/upload`, {
      method: "POST",
      body: fd,
    });
    const data = await resUpload.json();
    if (!resUpload.ok) throw new Error(data.message || "Upload failed");

    // Save banner in DB
    await axios.post(`${BACKEND}/api/secondary-banners`, { image_url: data.image_url });

    file.value = null;
    preview.value = null;
    fetchBanners();
  } catch (err) {
    console.error("Add secondary banner failed:", err);
    alert("Upload or save failed");
  } finally {
    uploading.value = false;
  }
};

// Delete banner
const deleteBanner = async (id) => {
  if (!confirm("Delete this banner?")) return;
  try {
    await axios.delete(`${BACKEND}/api/secondary-banners/${id}`);
    fetchBanners();
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Failed to delete banner");
  }
};

onMounted(fetchBanners);
</script>

<style scoped>
.banner-manager {
  max-width: 800px;
  margin: auto;
  padding: 1rem;
  font-family: sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 1rem;
}

.card.form-card {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.field {
  margin-bottom: 1rem;
}

.image-preview {
  margin-top: 1rem;
  max-width: 100%;
}

.image-preview img {
  width: 100%;
  border-radius: 8px;
}

.btn-primary {
  background: #4a00e0;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.banner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.banner-card {
  width: 200px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
}

.banner-card img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.btn-delete {
  margin-top: 0.5rem;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: #999;
  margin-top: 1rem;
}
</style>
