<template>
  <div class="blog-manager">
    <h1 class="page-title">📝 Blog Manager</h1>

    <!-- ===== Add Blog ===== -->
    <form @submit.prevent="addBlog" class="card form-card">
      <h2 class="card-title">Add New Blog</h2>

      <div class="grid">
        <div class="field col-span-2">
          <label>Blog Title <span class="req">*</span></label>
          <input v-model.trim="newBlog.title" placeholder="Blog title" required />
        </div>

        <!-- 🔹 Image Upload -->
        <div class="field col-span-2">
          <label>Blog Image <span class="req">*</span></label>
          <input
            type="file"
            accept="image/*"
            @change="onBlogFileChange"
            required
          />

          <div v-if="uploading" class="uploading">
            Uploading image... {{ uploadProgress }}%
          </div>

          <div v-if="filePreview" class="image-preview">
            <img :src="filePreview" alt="Preview" />
          </div>
        </div>

        <div class="field col-span-2">
          <label>Blog Content <span class="req">*</span></label>
          <textarea
            v-model.trim="newBlog.content"
            placeholder="Write blog content..."
            rows="8"
            required
          ></textarea>
        </div>
      </div>

      <div class="actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="!newBlog.image_url || saving"
        >
          {{ saving ? "Publishing..." : "Publish Blog" }}
        </button>
        <button type="button" class="btn-ghost" @click="resetForm">
          Reset
        </button>
      </div>
    </form>

    <!-- ===== Blog List ===== -->
    <div class="card list-card">
      <div class="list-header">
        <h2 class="card-title">All Blogs</h2>
        <button class="btn-ghost" @click="fetchBlogs" :disabled="loading">
          {{ loading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="!blogs.length" class="empty">
        No blogs found.
      </div>

      <div v-else class="items">
        <div v-for="b in blogs" :key="b.id" class="item">
          <img :src="b.image_url" class="thumb" alt="Blog" />
          <div class="meta">
            <p class="title">{{ b.title }}</p>
            <p class="date">
              {{ new Date(b.created_at).toLocaleDateString() }}
            </p>
          </div>

          <div class="row-actions">
            <button class="btn-danger" @click="deleteBlog(b.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const blogs = ref([]);
const loading = ref(false);

// ---------- Add ----------
const newBlog = ref({
  title: "",
  content: "",
  image_url: "", // ⭐ persistent URL
});

const uploading = ref(false);
const uploadProgress = ref(0);
const saving = ref(false);
const filePreview = ref(null);

// 🔹 Upload image (same as Banner/Product)
async function uploadBlogImage(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    uploading.value = true;
    uploadProgress.value = 0;

    const res = await fetch(`${API_BASE}/products/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    newBlog.value.image_url = data.image_url;
  } catch (err) {
    console.error("❌ Blog image upload error:", err);
    alert("Image upload failed");
  } finally {
    uploading.value = false;
    uploadProgress.value = 100;
  }
}

function onBlogFileChange(e) {
  const file = e.target.files[0];
  filePreview.value = file ? URL.createObjectURL(file) : null;

  if (file) {
    uploadBlogImage(file);
  } else {
    newBlog.value.image_url = "";
  }
}

function resetForm() {
  newBlog.value = {
    title: "",
    content: "",
    image_url: "",
  };
  filePreview.value = null;
  uploadProgress.value = 0;
}

// ---------- API ----------
async function fetchBlogs() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/blogs`);
    blogs.value = res.data || [];
  } catch (err) {
    console.error("❌ Fetch blogs error:", err);
  } finally {
    loading.value = false;
  }
}

async function addBlog() {
  if (!newBlog.value.image_url) {
    return alert("Please wait for image upload to finish");
  }

  try {
    saving.value = true;
    await axios.post(`${API_BASE}/api/blogs`, {
      title: newBlog.value.title,
      content: newBlog.value.content,
      image_url: newBlog.value.image_url,
    });

    resetForm();
    fetchBlogs();
  } catch (err) {
    console.error("❌ Add blog error:", err);
    alert("Failed to publish blog");
  } finally {
    saving.value = false;
  }
}

async function deleteBlog(id) {
  if (!confirm("Delete this blog?")) return;

  try {
    await axios.delete(`${API_BASE}/api/blogs/${id}`);
    fetchBlogs();
  } catch (err) {
    console.error("❌ Delete blog error:", err);
    alert("Failed to delete blog");
  }
}

onMounted(fetchBlogs);
</script>

<style scoped>
.blog-manager {
  padding: 10px;
}
.page-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.col-span-2 {
  grid-column: span 2;
}
.field label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}
.field input,
.field textarea {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
.req {
  color: red;
}
.image-preview img,
.thumb {
  width: 120px;
  border-radius: 8px;
  margin-top: 10px;
}
.items .item {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}
.title {
  font-weight: 700;
}
.date {
  font-size: 13px;
  color: #777;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.btn-primary {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
}
.btn-ghost {
  background: #eee;
  padding: 10px 18px;
  border-radius: 8px;
}
.btn-danger {
  background: #dc2626;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
}
</style>
