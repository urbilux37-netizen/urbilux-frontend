<template>
  <div class="banner-manager">
    <h1 class="page-title">🖼️ Banner Manager</h1>

    <!-- ===== Add Banner Form ===== -->
    <form @submit.prevent="handleCreate" class="card form-card">
      <h2 class="card-title">Add New Banner</h2>

      <div class="grid">
        <div class="field">
          <label>Title (optional)</label>
          <input v-model.trim="form.title" placeholder="Summer Sale" />
        </div>

        <div class="field col-span-2">
          <label>Banner Image <span class="req">*</span></label>
          <input type="file" @change="handleFileUpload" accept="image/*" />
          <p class="hint">
            Upload a wide image (1500–2400px recommended)
          </p>

          <div v-if="uploading" class="uploading">Uploading...</div>
          <img
            v-if="form.image_url"
            :src="form.image_url"
            alt="Preview"
            class="preview"
          />
        </div>

        <div class="field">
          <label>Button Text (optional)</label>
          <input v-model.trim="form.button_text" placeholder="Shop Now" />
        </div>

        <div class="field">
          <label>Button Link (optional)</label>
          <input v-model.trim="form.button_link" placeholder="/category/new" />
        </div>
      </div>

      <div class="actions">
        <button type="submit" class="btn-primary">Add Banner</button>
        <button type="button" class="btn-ghost" @click="resetForm">Reset</button>
      </div>
    </form>

    <!-- ===== Banner List ===== -->
    <div class="card list-card">
      <div class="list-header">
        <h2 class="card-title">All Banners</h2>
        <button class="btn-ghost" @click="loadBanners" :disabled="loading">
          {{ loading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="!banners.length" class="empty">
        No banners yet. Add one above.
      </div>

      <div v-else class="items">
        <div v-for="b in banners" :key="b.id" class="item">
          <img :src="b.image_url" class="thumb" alt="Banner" />
          <div class="meta">
            <div class="title-row">
              <p class="title">{{ b.title || "Untitled banner" }}</p>
              <span class="id">#{{ b.id }}</span>
            </div>
            <p class="sub">
              <strong>Button:</strong>
              <span v-if="b.button_text">{{ b.button_text }}</span>
              <span v-else class="muted">—</span>
              <span v-if="b.button_link" class="link">
                → {{ b.button_link }}
              </span>
            </p>
          </div>

          <div class="row-actions">
            <button class="btn-small" @click="openEdit(b)">Edit</button>
            <button class="btn-danger" @click="confirmDelete(b.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== Edit Modal ===== -->
    <div v-if="editing" class="modal-mask" @click.self="closeEdit">
      <div class="modal">
        <div class="modal-header">
          <h3>Edit Banner #{{ editModel.id }}</h3>
          <button class="x" @click="closeEdit">✕</button>
        </div>

        <form @submit.prevent="handleUpdate" class="modal-body">
          <div class="grid">
            <div class="field">
              <label>Title</label>
              <input v-model.trim="editModel.title" />
            </div>

            <div class="field col-span-2">
              <label>Banner Image</label>
              <input type="file" @change="handleEditFileUpload" accept="image/*" />
              <div v-if="uploadingEdit" class="uploading">Uploading...</div>
              <img
                v-if="editModel.image_url"
                :src="editModel.image_url"
                class="preview"
                alt="Preview"
              />
            </div>

            <div class="field">
              <label>Button Text</label>
              <input v-model.trim="editModel.button_text" />
            </div>

            <div class="field">
              <label>Button Link</label>
              <input v-model.trim="editModel.button_link" />
            </div>
          </div>

          <div class="actions">
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" class="btn-ghost" @click="closeEdit">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

// 🔗 API Base URL
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://urbilux-backend.onrender.com/api";

const banners = ref([]);
const loading = ref(false);
const uploading = ref(false);
const uploadingEdit = ref(false);

// ====== Add Banner ======
const form = ref({
  title: "",
  image_url: "",
  button_text: "",
  button_link: "",
});

function resetForm() {
  form.value = { title: "", image_url: "", button_text: "", button_link: "" };
}

// ====== Load Banners ======
async function loadBanners() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/banners`);
    banners.value = res.data;
  } catch (e) {
    console.error("Banner fetch error:", e);
  } finally {
    loading.value = false;
  }
}

// ====== File Upload (Add) ======
async function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`${API_BASE}/banners/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    form.value.image_url = res.data.url;
  } catch (err) {
    alert("❌ Image upload failed");
    console.error(err);
  } finally {
    uploading.value = false;
  }
}

// ====== File Upload (Edit) ======
async function handleEditFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadingEdit.value = true;

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`${API_BASE}/banners/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    editModel.value.image_url = res.data.url;
  } catch (err) {
    alert("❌ Upload failed");
    console.error(err);
  } finally {
    uploadingEdit.value = false;
  }
}

// ====== Create ======
async function handleCreate() {
  if (!form.value.image_url) return alert("Please upload an image first!");
  try {
    const res = await axios.post(`${API_BASE}/banners`, form.value);
    banners.value.unshift(res.data);
    resetForm();
  } catch (e) {
    console.error("Create error:", e);
  }
}

// ====== Delete ======
function confirmDelete(id) {
  if (confirm("Delete this banner?")) handleDelete(id);
}

async function handleDelete(id) {
  try {
    await axios.delete(`${API_BASE}/banners/${id}`);
    banners.value = banners.value.filter((b) => b.id !== id);
  } catch (e) {
    console.error("Delete error:", e);
  }
}

// ====== Edit ======
const editing = ref(false);
const editModel = ref({});

function openEdit(b) {
  editModel.value = { ...b };
  editing.value = true;
}

function closeEdit() {
  editing.value = false;
}

async function handleUpdate() {
  try {
    const { id, title, image_url, button_text, button_link } = editModel.value;
    const res = await axios.put(`${API_BASE}/banners/${id}`, {
      title,
      image_url,
      button_text,
      button_link,
    });
    const idx = banners.value.findIndex((x) => x.id === id);
    if (idx !== -1) banners.value[idx] = res.data;
    closeEdit();
  } catch (e) {
    console.error("Update error:", e);
  }
}

onMounted(loadBanners);
</script>

<style scoped>
.banner-manager {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 60px;
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
.field input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
}
.field input:focus {
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
.meta .id {
  font-size: 12px;
  color: #9ca3af;
}
.meta .sub {
  font-size: 13px;
  color: #4b5563;
}
.meta .link {
  color: #7b61ff;
  margin-left: 4px;
}

/* Empty */
.empty {
  padding: 20px;
  text-align: center;
  color: #6b7280;
}

/* Skeleton */
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
