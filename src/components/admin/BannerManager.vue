<template>
  <div class="banner-manager max-w-6xl mx-auto p-6">
    <h2 class="text-3xl font-bold text-center mb-8 text-gray-900">Manage Banners</h2>

    <!-- Add Banner Form -->
    <form @submit.prevent="addBanner" class="flex flex-col md:flex-row items-start gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg">

      <!-- File Input + Preview -->
      <div class="flex flex-col w-full md:w-1/3">
        <label class="text-gray-700 mb-2 font-medium">Select Banner Image</label>
        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          required
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <div v-if="newFile" class="mt-3 w-full h-36 rounded-md overflow-hidden border border-gray-200 shadow-inner">
          <img :src="newFilePreview" class="w-full h-full object-cover" />
        </div>
      </div>

      <!-- Link Input -->
      <div class="flex flex-col w-full md:w-1/2">
        <label class="text-gray-700 mb-2 font-medium">Link URL (optional)</label>
        <input
          v-model="newBannerLink"
          placeholder="Enter banner link"
          class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      <!-- Add Button -->
      <div class="flex items-end">
        <button
          type="submit"
          class="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-900 transition shadow-md hover:shadow-lg"
        >
          Add Banner
        </button>
      </div>
    </form>

    <!-- Banner List -->
    <div v-if="banners.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="b in banners"
        :key="b.id"
        class="banner-item bg-white rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
      >
        <div class="overflow-hidden h-40 w-full">
          <img
            :src="b.image_url"
            alt="Banner Image"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div class="p-4 flex flex-col gap-2">
          <p v-if="b.link" class="text-sm text-gray-600 flex items-center gap-2 break-words">
            🔗 <a :href="b.link" target="_blank" class="hover:underline">{{ b.link }}</a>
          </p>
          <button
            @click="deleteBanner(b.id)"
            class="bg-red-500 text-white px-4 py-2 rounded-md font-medium hover:bg-red-600 transition shadow-sm hover:shadow-md w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <p v-else class="text-gray-500 text-center mt-8">No banners available. Add one above!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Auto detect environment (Local + Production)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

console.log("🔗 Using API base:", API_BASE);

const banners = ref([]);
const newFile = ref(null);
const newFilePreview = ref(null);
const newBannerLink = ref("");

// File select
const onFileChange = (e) => {
  newFile.value = e.target.files[0];
  newFilePreview.value = URL.createObjectURL(newFile.value);
};

// Fetch banners
const fetchBanners = async () => {
  try {
    const res = await axios.get(`${API_BASE}/banners`);
    banners.value = res.data;
  } catch (err) {
    console.error("❌ Fetch banners error:", err);
  }
};

// Add banner
const addBanner = async () => {
  if (!newFile.value) return;

  const formData = new FormData();
  formData.append("image", newFile.value);
  formData.append("link", newBannerLink.value);

  try {
    await axios.post(`${API_BASE}/banners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newFile.value = null;
    newFilePreview.value = null;
    newBannerLink.value = "";
    await fetchBanners();
  } catch (err) {
    console.error("❌ Add banner error:", err);
  }
};

// Delete banner
const deleteBanner = async (id) => {
  try {
    await axios.delete(`${API_BASE}/banners/${id}`);
    await fetchBanners();
  } catch (err) {
    console.error("❌ Delete banner error:", err);
  }
};

onMounted(fetchBanners);
</script>

<style scoped>
.banner-manager {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
}

/* Add Form */
form {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}
form:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
}

/* File Input + Preview */
input[type="file"],
input[type="text"] {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  transition: all 0.3s ease;
}
input[type="file"]:focus,
input[type="text"]:focus {
  outline: none;
  border-color: #7c3aed;
  box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.3);
}

/* Preview Image */
form div img {
  border-radius: 0.5rem;
  object-fit: cover;
  height: 9rem;
  width: 100%;
  transition: transform 0.3s ease;
}
form div img:hover {
  transform: scale(1.05);
}

/* Add Button */
button[type="submit"] {
  background: linear-gradient(90deg, #7c3aed, #5b21b6);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
button[type="submit"]:hover {
  background: linear-gradient(90deg, #6d28d9, #4c1d95);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Banner List Grid */
.banner-item {
  background-color: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}
.banner-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 18px rgba(0,0,0,0.12);
}

/* Banner Image */
.banner-item img {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.banner-item img:hover {
  transform: scale(1.05);
}

/* Delete Button */
.banner-item button {
  background-color: #ef4444;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.banner-item button:hover {
  background-color: #dc2626;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Text Styling */
.banner-item p {
  font-size: 0.875rem;
  color: #4b5563;
  word-break: break-word;
}
h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
}
</style>
