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

        <div v-if="newCategoryFilePreview" class="image-preview">
          <img :src="newCategoryFilePreview" alt="Preview" />
        </div>
      </div>

      <!-- Slug Input -->
      <div class="form-section">
        <label class="form-label">Category Slug</label>
        <input
          v-model="newCategorySlug"
          placeholder="e.g. electronics, gadgets..."
          required
          class="text-input"
        />
      </div>

      <!-- Add Button -->
      <div class="form-section">
        <button type="submit" class="btn-add">+ Add Category</button>
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
          <p class="slug-text">{{ c.slug }}</p>
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
    : "https://avado-backend.onrender.com";

const categories = ref([]);
const newCategoryFile = ref(null);
const newCategoryFilePreview = ref(null);
const newCategorySlug = ref("");

const onCategoryFileChange = (e) => {
  newCategoryFile.value = e.target.files[0] || null;
  newCategoryFilePreview.value = newCategoryFile.value
    ? URL.createObjectURL(newCategoryFile.value)
    : null;
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
  if (!newCategoryFile.value || !newCategorySlug.value) return;
  const formData = new FormData();
  formData.append("image", newCategoryFile.value);
  formData.append("slug", newCategorySlug.value);

  try {
    await axios.post(`${API_BASE}/categories`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newCategoryFile.value = null;
    newCategoryFilePreview.value = null;
    newCategorySlug.value = "";
    await fetchCategories();
  } catch (err) {
    console.error("❌ Add category error:", err);
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
.category-manager {
  max-width: 1100px;
  margin: auto;
  padding: 2rem;
  background: #f9fafc;
  min-height: 100vh;
}

/* Title */
.page-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 2rem;
  color: #333;
  letter-spacing: 0.5px;
}

/* Form */
.category-form {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
}

@media (max-width: 768px) {
  .category-form {
    grid-template-columns: 1fr;
  }
}

/* Form Inputs */
.form-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #444;
  font-size: 0.95rem;
}

.file-upload-wrapper {
  position: relative;
}

.file-input {
  opacity: 0;
  width: 100%;
  height: 45px;
  position: absolute;
  cursor: pointer;
}

.file-label {
  display: inline-block;
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.file-label:hover {
  transform: scale(1.03);
}

.text-input {
  border: 1.5px solid #ddd;
  border-radius: 8px;
  padding: 10px 12px;
  transition: 0.3s;
}

.text-input:focus {
  border-color: #8e2de2;
  outline: none;
  box-shadow: 0 0 6px rgba(142, 45, 226, 0.3);
}

/* Preview */
.image-preview {
  margin-top: 0.8rem;
  border: 2px dashed #ccc;
  border-radius: 10px;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

/* Buttons */
.btn-add {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  width: 100%;
}

.btn-add:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-delete {
  background: #ff4d4d;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.btn-delete:hover {
  background: #e63939;
  transform: scale(1.05);
}

/* Category Grid */
.category-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-info {
  padding: 1rem;
  text-align: center;
}

.slug-text {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-text {
  text-align: center;
  color: #777;
  margin-top: 3rem;
  font-size: 1.1rem;
}
</style>
