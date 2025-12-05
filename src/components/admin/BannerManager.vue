<template>
  <div class="category-manager">
    <!-- Header -->
    <h2 class="page-title">🗂 Manage Categories</h2>

    <!-- Add Category Form -->
    <form @submit.prevent="addCategory" class="category-form">
      <!-- File Input + Preview -->
      <div class="form-section">
        <label class="form-label">Select Category Image</label>

        <div class="file-upload-wrapper">
          <input
            type="file"
            @change="onCategoryFileChange"
            accept="image/*"
            required
            class="file-input"
            id="file-upload"
          />
          <label for="file-upload" class="file-label">Choose Image</label>
        </div>

        <div v-if="uploading" class="uploading">
          Uploading image... {{ uploadProgress }}%
        </div>

        <div v-if="newCategoryFilePreview" class="image-preview">
          <img :src="newCategoryFilePreview" alt="Preview" />
        </div>
      </div>

      <!-- Title Input -->
      <div class="form-section">
        <label class="form-label">Category Title</label>
        <input
          v-model="newCategoryTitle"
          placeholder="e.g. Fashions, Beauty, Toys..."
          required
          class="text-input"
        />
      </div>

      <!-- Slug Input -->
      <div class="form-section">
        <label class="form-label">Category Slug</label>
        <input
          v-model="newCategorySlug"
          placeholder="e.g. fashions, beauty, kids-toys..."
          required
          class="text-input"
        />
      </div>

      <!-- Add Button -->
      <div class="form-section">
        <button
          type="submit"
          class="btn-add"
          :disabled="!newCategoryImageUrl || uploading"
        >
          + Add Category
        </button>
      </div>
    </form>

    <!-- Category List -->
    <div v-if="categories.length" class="category-grid">
      <div
        v-for="c in categories"
        :key="c.id"
        class="category-card"
      >
        <div class="card-image">
          <img :src="c.image_url" alt="Category" />
        </div>
        <div class="card-info">
          <!-- Title + Slug show -->
          <p class="slug-text">
            {{ c.title || c.slug }}
            <span class="slug-small">({{ c.slug }})</span>
          </p>
          <button @click="deleteCategory(c.id)" class="btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <p v-else class="empty-text">No categories found. Add one above!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategoryFilePreview = ref(null);
const newCategorySlug = ref("");
const newCategoryTitle = ref("");
const newCategoryImageUrl = ref(""); // ⭐ persistent url

const uploading = ref(false);
const uploadProgress = ref(0);

const uploadCategoryImage = async (file) => {
  if (!file) return;
  const formData = new FormData();
  formData.append("image", file);

  try {
    uploading.value = true;
    uploadProgress.value = 0;

    // ✅ Same upload logic / endpoint as ProductManager
    const res = await fetch(`${API_BASE}/products/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    newCategoryImageUrl.value = data.image_url;
  } catch (err) {
    console.error("❌ Category image upload error:", err);
    alert("Category image upload failed");
  } finally {
    uploading.value = false;
    uploadProgress.value = 100;
  }
};

const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0] || null;
  newCategoryFilePreview.value = newCategoryFile.value
    ? URL.createObjectURL(newCategoryFile.value)
    : null;

  if (newCategoryFile.value) {
    uploadCategoryImage(newCategoryFile.value);
  } else {
    newCategoryImageUrl.value = "";
  }
};

const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE}/categories`);
    categories.value = res.data;
  } catch (err) {
    console.error("❌ Fetch categories error:", err);
  }
};

const addCategory = async () => {
  if (
    !newCategoryImageUrl.value ||
    !newCategorySlug.value ||
    !newCategoryTitle.value
  )
    return alert("Please fill all fields and wait for image upload");

  try {
    // 🔹 Now we only send JSON with image_url, no file
    await axios.post(`${API_BASE}/categories`, {
      slug: newCategorySlug.value,
      title: newCategoryTitle.value,
      image_url: newCategoryImageUrl.value,
    });

    newCategoryFile.value = null;
    newCategoryFilePreview.value = null;
    newCategorySlug.value = "";
    newCategoryTitle.value = "";
    newCategoryImageUrl.value = "";
    uploadProgress.value = 0;

    await fetchCategories();
  } catch (err) {
    console.error("❌ Add category error:", err);
    alert("Failed to add category");
  }
};

const deleteCategory = async (id) => {
  try {
    await axios.delete(`${API_BASE}/categories/${id}`);
    await fetchCategories();
  } catch (err) {
    console.error("❌ Delete category error:", err);
  }
};

onMounted(fetchCategories);
</script>

<style scoped>
.banner-manager {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  overflow: hidden;
}
.newBannerFilePreview {
  overflow: hidden;
  height: 200px;
  width: 200px;
}
.page-title {
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 18px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Card Layouts */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  padding: 18px;
  margin-bottom: 20px;
}
.card-title {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 14px;
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.col-span-2 {
  grid-column: span 2;
}
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: auto;
  }
}

/* Inputs */
.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}
.field input,
.field select {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.field input:focus,
.field select:focus {
  border-color: #7b61ff;
  box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.15);
}
.req {
  color: #ff4d4f;
}
.hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

/* Preview */
.image-preview img,
.preview {
  margin-top: 10px;
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eee;
}
.uploading {
  font-size: 14px;
  color: #8e2de2;
  font-weight: 600;
  margin-top: 8px;
}

/* Buttons */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.btn-primary {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 700;
  cursor: pointer;
}
.btn-ghost {
  background: #f5f5f7;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
}
.btn-small {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
}
.btn-danger {
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
}

/* List */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.items {
  display: grid;
  gap: 12px;
}
.item {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 14px;
}
.thumb {
  width: 100%;
  height: 84px;
  object-fit: cover;
  border-radius: 10px;
}
.meta .title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.meta .title {
  font-weight: 700;
}
.slot-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
}
.meta .sub {
  font-size: 13px;
  color: #4b5563;
}
.meta .link {
  color: #7b61ff;
  margin-left: 4px;
}
.muted {
  color: #9ca3af;
}

/* Empty */
.empty {
  padding: 20px;
  text-align: center;
  color: #6b7280;
}

/* Skeleton */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.skeleton {
  height: 110px;
  background: linear-gradient(90deg, #f2f2f2 25%, #eaeaea 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  border-radius: 14px;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer {
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
}

/* Modal */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  padding: 14px;
  z-index: 50;
}
.modal {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.18);
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f1f1f1;
}
.modal-header h3 {
  font-weight: 800;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.modal .x {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
}
.modal-body {
  padding: 14px 16px 18px;
}
</style>
