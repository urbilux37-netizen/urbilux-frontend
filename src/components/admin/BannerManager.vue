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

        <div class="field">
          <label>Banner Slot</label>
          <select v-model="newBanner.slot">
            <option value="main">Banner 1 – Main (Big)</option>
            <option value="side_top">Banner 2 – Right Top</option>
            <option value="side_bottom">Banner 3 – Right Bottom</option>
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
          <p class="hint">Upload a wide image (1500–2400px recommended)</p>

          <div v-if="uploading" class="uploading">
            Uploading... {{ uploadProgress }}%
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
        <button type="submit" class="btn-primary">Add Banner</button>
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
            <p class="title">{{ b.title || "Untitled banner" }}</p>
            <p class="sub">
              <strong>Slot:</strong>
              <span class="tag">{{ humanSlot(b.slot) }}</span>
            </p>
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

            <div class="field">
              <label>Banner Slot</label>
              <select v-model="editModel.slot">
                <option value="main">Banner 1 – Main (Big)</option>
                <option value="side_top">Banner 2 – Right Top</option>
                <option value="side_bottom">Banner 3 – Right Bottom</option>
              </select>
            </div>

            <div class="field col-span-2">
              <label>Banner Image</label>
              <input type="file" @change="onEditBannerFileChange" accept="image/*" />
              <div v-if="editUploading" class="uploading">
                Uploading... {{ editUploadProgress }}%
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
            <button type="submit" class="btn-primary">Save</button>
            <button type="button" class="btn-ghost" @click="closeEdit">Cancel</button>
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
});
const newBannerFile = ref(null);
const newBannerFilePreview = ref(null);
const uploading = ref(false);
const uploadProgress = ref(0);

function humanSlot(slot) {
  if (slot === "side_top") return "Banner 2 – Right Top";
  if (slot === "side_bottom") return "Banner 3 – Right Bottom";
  return "Banner 1 – Main";
}

function onBannerFileChange(e) {
  newBannerFile.value = e.target.files[0];
  newBannerFilePreview.value = newBannerFile.value
    ? URL.createObjectURL(newBannerFile.value)
    : null;
}

function resetForm() {
  newBanner.value = {
    title: "",
    button_text: "",
    button_link: "",
    slot: "main",
  };
  newBannerFile.value = null;
  newBannerFilePreview.value = null;
  uploadProgress.value = 0;
}

async function fetchBanners() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data;
  } catch (err) {
    console.error("❌ Fetch banners error:", err);
  } finally {
    loading.value = false;
  }
}

async function addBanner() {
  if (!newBannerFile.value) return alert("Please select an image");

  const formData = new FormData();
  formData.append("image", newBannerFile.value);
  formData.append("title", newBanner.value.title);
  formData.append("button_text", newBanner.value.button_text);
  formData.append("button_link", newBanner.value.button_link);
  formData.append("slot", newBanner.value.slot);

  try {
    uploading.value = true;
    await axios.post(`${API_BASE}/api/banners`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        uploadProgress.value = Math.round((e.loaded * 100) / e.total);
      },
    });
    resetForm();
    fetchBanners();
  } catch (err) {
    console.error("❌ Add banner error:", err);
  } finally {
    uploading.value = false;
  }
}

async function deleteBanner(id) {
  if (!confirm("Delete this banner?")) return;
  try {
    await axios.delete(`${API_BASE}/api/banners/${id}`);
    fetchBanners();
  } catch (err) {
    console.error("❌ Delete banner error:", err);
  }
}

// ---------- Edit ----------
const editing = ref(false);
const editModel = ref({});
const editFile = ref(null);
const editFilePreview = ref(null);
const editUploading = ref(false);
const editUploadProgress = ref(0);

function openEdit(b) {
  editModel.value = { ...b };
  editing.value = true;
}
function closeEdit() {
  editing.value = false;
  editFile.value = null;
  editFilePreview.value = null;
  editUploadProgress.value = 0;
}
function onEditBannerFileChange(e) {
  editFile.value = e.target.files[0];
  editFilePreview.value = editFile.value
    ? URL.createObjectURL(editFile.value)
    : null;
}

async function updateBanner() {
  const formData = new FormData();
  if (editFile.value) formData.append("image", editFile.value);
  formData.append("title", editModel.value.title);
  formData.append("button_text", editModel.value.button_text);
  formData.append("button_link", editModel.value.button_link);
  formData.append("slot", editModel.value.slot || "main");

  try {
    editUploading.value = true;
    await axios.put(`${API_BASE}/api/banners/${editModel.value.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        editUploadProgress.value = Math.round(
          (e.loaded * 100) / e.total
        );
      },
    });
    closeEdit();
    fetchBanners();
  } catch (err) {
    console.error("❌ Update banner error:", err);
  } finally {
    editUploading.value = false;
  }
}

onMounted(fetchBanners);
</script>

<style scoped>
.banner-manager {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 40px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* ===== Generic card ===== */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 22px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  margin-bottom: 24px;
}

/* Top form */
.form-card {
  margin-bottom: 28px;
}

/* Headings */
.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* Grid layout */
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px 18px;
  margin-bottom: 18px;
}

.col-span-2 {
  grid-column: span 2 / span 2;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-size: 14px;
  font-weight: 500;
}

.req {
  color: #e11d48;
  font-weight: 600;
}

input,
select {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
}

input:focus,
select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.35);
  background: #ffffff;
}

.hint {
  font-size: 12px;
  color: #6b7280;
}

/* Upload states */
.uploading {
  margin-top: 6px;
  font-size: 13px;
  color: #4b5563;
}

/* Preview image */
.image-preview {
  margin-top: 8px;
  max-width: 260px;
}

.image-preview img,
.preview {
  width: 100%;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  object-fit: cover;
}

/* Buttons */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

button {
  font-family: inherit;
}

.btn-primary {
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
}

.btn-primary:hover {
  filter: brightness(1.05);
}

.btn-ghost {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: transparent;
  font-size: 14px;
  cursor: pointer;
}

.btn-ghost:hover {
  background: #f3f4f6;
}

/* ===== List card ===== */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

/* Skeletons */
.skeleton-wrap {
  display: grid;
  gap: 12px;
}

.skeleton {
  height: 70px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 40%,
    #f3f4f6 80%
  );
  background-size: 200% 100%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    background-position: 0% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.empty {
  padding: 20px;
  text-align: center;
  color: #6b7280;
}

/* Items */
.items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.thumb {
  width: 120px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-weight: 600;
  font-size: 14px;
}

.sub {
  font-size: 13px;
  color: #4b5563;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 12px;
  margin-left: 4px;
}

.muted {
  color: #9ca3af;
}

.link {
  margin-left: 8px;
  color: #6366f1;
}

/* Row actions */
.row-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.btn-small {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 12px;
  cursor: pointer;
}

.btn-small:hover {
  background: #f3f4f6;
}

.btn-danger {
  padding: 4px 10px;
  border-radius: 999px;
  border: none;
  background: #f97373;
  color: #ffffff;
  font-size: 12px;
  cursor: pointer;
}

.btn-danger:hover {
  background: #ef4444;
}

/* ===== Modal ===== */
.modal-mask {
  position: fixed;
  z-index: 40;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #ffffff;
  border-radius: 14px;
  width: 640px;
  max-width: 95%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.35);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.x {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

.modal-body {
  padding: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .col-span-2 {
    grid-column: span 1 / span 1;
  }
  .item {
    grid-template-columns: 1fr;
    align-items: flex-start;
  }
  .thumb {
    width: 100%;
    height: 120px;
  }
  .row-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
}
</style>
