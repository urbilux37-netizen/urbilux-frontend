<template>
  <div class="banner-manager">
    <h1 class="page-title">🖼️ Banner Manager</h1>

    <!-- ===== Add Banner Form ===== -->
    <form @submit.prevent="addBanner" class="card form-card">
      <h2 class="card-title">Add New Banner</h2>

      <div class="grid">
        <div class="field">
          <label>Title (optional)</label>
          <input v-model.trim="newBanner.title" placeholder="Summer Sale" />
        </div>

        <!-- 🔹 Slot select -->
        <div class="field">
          <label>Banner Slot</label>
          <select v-model="newBanner.slot">
            <option value="main">Main (big)</option>
            <option value="side_top">Right Top (small)</option>
            <option value="side_bottom">Right Bottom (small)</option>
          </select>
        </div>

        <div class="field col-span-2">
          <label>Banner Image <span class="req">*</span></label>
          <input
            type="file"
            @change="onBannerFileChange"
            accept="image/*"
            required
          />
          <p class="hint">
            Use 1600×700 for main, ~800×500 for side banners. (Wide image recommended)
          </p>

          <!-- 🔹 Cloud upload progress (same idea as product upload) -->
          <div v-if="uploading" class="uploading">
            Uploading to server... {{ uploadProgress }}%
          </div>

          <div v-if="newBannerFilePreview" class="image-preview">
            <img :src="newBannerFilePreview" alt="Preview" />
          </div>
        </div>

        <div class="field">
          <label>Button Text (optional)</label>
          <input v-model.trim="newBanner.button_text" placeholder="Shop Now" />
        </div>

        <div class="field">
          <label>Button Link (optional)</label>
          <input v-model.trim="newBanner.button_link" placeholder="/category/new" />
        </div>
      </div>

      <div class="actions">
        <button
          type="submit"
          class="btn-primary"
          :disabled="!newBanner.image_url || saving"
        >
          {{ saving ? "Saving..." : "Add Banner" }}
        </button>
        <button type="button" class="btn-ghost" @click="resetForm">Reset</button>
      </div>
    </form>

    <!-- ===== Banner List ===== -->
    <div class="card list-card">
      <div class="list-header">
        <h2 class="card-title">All Banners</h2>
        <button class="btn-ghost" @click="fetchBanners" :disabled="loading">
          {{ loading ? "Refreshing…" : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="!banners.length" class="empty">No banners found.</div>

      <div v-else class="items">
        <div v-for="b in banners" :key="b.id" class="item">
          <img :src="b.image_url" class="thumb" alt="Banner" />
          <div class="meta">
            <div class="title-row">
              <p class="title">{{ b.title || "Untitled banner" }}</p>
              <span class="slot-tag">{{ humanSlot(b.slot) }}</span>
            </div>
            <p class="sub">
              <strong>Button:</strong>
              <span v-if="b.button_text">{{ b.button_text }}</span>
              <span v-else class="muted">—</span>
              <span v-if="b.button_link" class="link">→ {{ b.button_link }}</span>
            </p>
          </div>

          <div class="row-actions">
            <button class="btn-small" @click="openEdit(b)">Edit</button>
            <button class="btn-danger" @click="deleteBanner(b.id)">Delete</button>
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

        <form @submit.prevent="updateBanner" class="modal-body">
          <div class="grid">
            <div class="field">
              <label>Title</label>
              <input v-model.trim="editModel.title" />
            </div>

            <!-- 🔹 Slot select (edit) -->
            <div class="field">
              <label>Banner Slot</label>
              <select v-model="editModel.slot">
                <option value="main">Main (big)</option>
                <option value="side_top">Right Top (small)</option>
                <option value="side_bottom">Right Bottom (small)</option>
              </select>
            </div>

            <div class="field col-span-2">
              <label>Banner Image</label>
              <input
                type="file"
                @change="onEditBannerFileChange"
                accept="image/*"
              />

              <div v-if="editUploading" class="uploading">
                Uploading new image... {{ editUploadProgress }}%
              </div>

              <div v-if="editFilePreview" class="image-preview">
                <img :src="editFilePreview" alt="Preview" />
              </div>
              <img
                v-else-if="editModel.image_url"
                :src="editModel.image_url"
                class="preview"
                alt="Current"
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
            <button type="submit" class="btn-primary" :disabled="savingEdit">
              {{ savingEdit ? "Saving..." : "Save" }}
            </button>
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

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const banners = ref([]);
const loading = ref(false);

// ---------- Add ----------
const newBanner = ref({
  title: "",
  button_text: "",
  button_link: "",
  slot: "main",
  image_url: "", // ⭐ persistent url
});
const newBannerFile = ref(null);
const newBannerFilePreview = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);
const saving = ref(false);

function humanSlot(slot) {
  if (slot === "side_top") return "Right Top";
  if (slot === "side_bottom") return "Right Bottom";
  return "Main";
}

async function uploadBannerImage(file) {
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

    // ✅ Cloud / R2 URL from same logic as ProductManager
    newBanner.value.image_url = data.image_url;
  } catch (err) {
    console.error("❌ Banner image upload error:", err);
    alert("Banner image upload failed");
  } finally {
    uploading.value = false;
    uploadProgress.value = 100;
  }
}

function onBannerFileChange(e) {
  const file = e.target.files[0];
  newBannerFile.value = file || null;
  newBannerFilePreview.value = file ? URL.createObjectURL(file) : null;

  // 🔹 Immediately upload to persistent storage (same as products)
  if (file) {
    uploadBannerImage(file);
  } else {
    newBanner.value.image_url = "";
  }
}

function resetForm() {
  newBanner.value = {
    title: "",
    button_text: "",
    button_link: "",
    slot: "main",
    image_url: "",
  };
  newBannerFile.value = null;
  newBannerFilePreview.value = null;
  uploadProgress.value = 0;
}

async function fetchBanners() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data || [];
  } catch (err) {
    console.error("❌ Fetch banners error:", err);
  } finally {
    loading.value = false;
  }
}

async function addBanner() {
  if (!newBanner.value.image_url) {
    return alert("Please wait for image upload to finish");
  }

  try {
    saving.value = true;
    // 🔹 Now just send JSON with image_url (no file)
    await axios.post(`${API_BASE}/api/banners`, {
      title: newBanner.value.title || "",
      button_text: newBanner.value.button_text || "",
      button_link: newBanner.value.button_link || "",
      slot: newBanner.value.slot || "main",
      image_url: newBanner.value.image_url,
    });

    resetForm();
    fetchBanners();
  } catch (err) {
    console.error("❌ Add banner error:", err);
    alert("Failed to add banner");
  } finally {
    saving.value = false;
  }
}

async function deleteBanner(id) {
  if (!confirm("Delete this banner?")) return;
  try {
    await axios.delete(`${API_BASE}/api/banners/${id}`);
    fetchBanners();
  } catch (err) {
    console.error("❌ Delete banner error:", err);
    alert("Failed to delete banner");
  }
}

// ---------- Edit ----------
const editing = ref(false);
const editModel = ref({});
const editFile = ref(null);
const editFilePreview = ref(null);
const editUploading = ref(false);
const editUploadProgress = ref(0);
const savingEdit = ref(false);

function openEdit(b) {
  editModel.value = { ...b }; // includes slot, button fields, image_url, etc.
  editing.value = true;
}

function closeEdit() {
  editing.value = false;
  editFile.value = null;
  editFilePreview.value = null;
  editUploadProgress.value = 0;
}

async function uploadEditImage(file) {
  if (!file) return;
  const formData = new FormData();
  formData.append("image", file);

  try {
    editUploading.value = true;
    editUploadProgress.value = 0;

    const res = await fetch(`${API_BASE}/products/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    editModel.value.image_url = data.image_url;
  } catch (err) {
    console.error("❌ Edit banner image upload error:", err);
    alert("Image upload failed");
  } finally {
    editUploading.value = false;
    editUploadProgress.value = 100;
  }
}

function onEditBannerFileChange(e) {
  const file = e.target.files[0];
  editFile.value = file || null;
  editFilePreview.value = file ? URL.createObjectURL(file) : null;

  if (file) {
    uploadEditImage(file);
  }
}

async function updateBanner() {
  try {
    savingEdit.value = true;

    // ❗ Same as add: only JSON, image_url already updated if new image selected
    await axios.put(`${API_BASE}/api/banners/${editModel.value.id}`, {
      title: editModel.value.title || "",
      button_text: editModel.value.button_text || "",
      button_link: editModel.value.button_link || "",
      slot: editModel.value.slot || "main",
      image_url: editModel.value.image_url,
    });

    closeEdit();
    fetchBanners();
  } catch (err) {
    console.error("❌ Update banner error:", err);
    alert("Failed to update banner");
  } finally {
    savingEdit.value = false;
  }
}

onMounted(fetchBanners);
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
