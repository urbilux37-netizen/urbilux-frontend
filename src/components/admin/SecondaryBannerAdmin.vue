<template>
  <div class="secondary-banner-manager">
    <h2 class="page-title">🖼 Secondary Banner Manager</h2>

    <!-- ===== Add Banner Form ===== -->
    <form @submit.prevent="addBanner" class="banner-form">
      <div class="form-section">
        <label class="form-label">Select Banner Image</label>
        <input type="file" @change="onFileChange" required />
        <div v-if="preview" class="image-preview">
          <img :src="preview" alt="preview" />
        </div>
      </div>
      <button type="submit" class="btn-add">+ Add Banner</button>
    </form>

    <!-- ===== Existing Banners ===== -->
    <div class="banner-grid" v-if="banners.length">
      <div v-for="b in banners" :key="b.id" class="banner-card">
        <img :src="API + b.image_url" alt="banner" />
        <button class="btn-delete" @click="deleteBanner(b.id)">Delete</button>
      </div>
    </div>

    <p v-else class="no-banners">No banners found.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Backend URL
const API =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api/secondary-banners"
    : "https://urbilux-backend.onrender.com/api/secondary-banners";

const banners = ref([]);
const file = ref(null);
const preview = ref(null);

// ===== File select handler =====
const onFileChange = (e) => {
  file.value = e.target.files[0];
  preview.value = URL.createObjectURL(file.value);
};

// ===== Fetch existing banners =====
const fetchBanners = async () => {
  try {
    const res = await axios.get(API);
    banners.value = res.data;
  } catch (err) {
    console.error("Fetch banners error:", err);
  }
};

// ===== Add new banner =====
const addBanner = async () => {
  if (!file.value) return;

  try {
    const fd = new FormData();
    fd.append("image", file.value);

    await axios.post(API, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    file.value = null;
    preview.value = null;
    fetchBanners();
  } catch (err) {
    console.error("Add banner error:", err);
  }
};

// ===== Delete banner =====
const deleteBanner = async (id) => {
  try {
    await axios.delete(`${API}/${id}`);
    fetchBanners();
  } catch (err) {
    console.error("Delete banner error:", err);
  }
};

onMounted(fetchBanners);
</script>

<style scoped>
.secondary-banner-manager {
  padding: 30px;
  max-width: 1100px;
  margin: 50px auto;
  background: #f9f9fb;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  font-family: "Inter", sans-serif;
}

/* Heading */
.page-title {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 24px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ===== Form ===== */
.banner-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
}

input[type="file"] {
  padding: 6px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.image-preview img {
  max-width: 200px;
  max-height: 120px;
  margin-top: 8px;
  border-radius: 6px;
  object-fit: cover;
}

/* ===== Buttons ===== */
.btn-add {
  padding: 10px 20px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(142, 45, 226, 0.3);
}

.btn-delete {
  padding: 6px 12px;
  background: #ff4d4f;
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 8px;
}
.btn-delete:hover {
  background: #ff7875;
}

/* ===== Banner Grid ===== */
.banner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.banner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.banner-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
}

.no-banners {
  text-align: center;
  color: #666;
  font-style: italic;
  margin-top: 20px;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .secondary-banner-manager {
    width: 95%;
    padding: 20px;
  }
  .banner-card img {
    height: 100px;
  }
}
</style>
