<template>
  <div class="banner-manager">
    <h1 class="page-title">🖼️ Banner Manager</h1>

    <!-- Add form -->
    <form @submit.prevent="createBanner" class="card form-card">
      <h2 class="card-title">Add New Banner</h2>

      <div class="grid">
        <div class="field">
          <label>Title (optional)</label>
          <input v-model.trim="form.title" placeholder="Winter Offer" />
        </div>

        <div class="field">
          <label>Slot</label>
          <select v-model="form.slot">
            <option value="main">Main (big)</option>
            <option value="side_top">Right Top (small)</option>
            <option value="side_bottom">Right Bottom (small)</option>
          </select>
        </div>

        <!-- 🔥 Image upload instead of raw URL -->
        <div class="field col-span-2">
          <label>Image <span class="req">*</span></label>

          <div class="upload-row">
            <input
              type="file"
              accept="image/*"
              @change="(e) => onFileChange(e, 'create')"
            />

            <button
              v-if="form.image_url"
              type="button"
              class="btn-ghost small"
              @click="openInNew(form.image_url)"
            >
              View
            </button>

            <span v-if="uploadingCreate" class="uploading-text">
              Uploading...
            </span>
          </div>

          <p class="hint">
            Use 1600×700 for main, ~800×500 for side banners.
          </p>

          <div v-if="form.image_url" class="preview">
            <img :src="form.image_url" alt="Preview" />
          </div>
        </div>

        <div class="field">
          <label>Button Text (optional)</label>
          <input v-model.trim="form.button_text" placeholder="Shop Now" />
        </div>

        <div class="field">
          <label>Button Link (optional)</label>
          <input
            v-model.trim="form.button_link"
            placeholder="/category/health"
          />
        </div>
      </div>

      <div class="actions">
        <button
          class="btn-primary"
          type="submit"
          :disabled="saving || uploadingCreate"
        >
          {{ saving ? "Saving..." : "Add Banner" }}
        </button>
        <button class="btn-ghost" type="button" @click="resetForm">
          Reset
        </button>
      </div>
    </form>

    <!-- List -->
    <div class="card list-card">
      <div class="list-header">
        <h2 class="card-title">All Banners</h2>
        <button class="btn-ghost" @click="fetchBanners" :disabled="loading">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="!banners.length" class="empty">
        No banners yet.
      </div>

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
              <span v-if="b.button_link" class="link">
                → {{ b.button_link }}
              </span>
            </p>
          </div>

          <div class="row-actions">
            <button class="btn-small" @click="openEdit(b)">Edit</button>
            <button class="btn-danger" @click="removeBanner(b.id)">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="editing" class="modal-mask" @click.self="closeEdit">
      <div class="modal">
        <div class="modal-header">
          <h3>Edit Banner #{{ editForm.id }}</h3>
          <button class="x" @click="closeEdit">✕</button>
        </div>

        <form @submit.prevent="updateBanner" class="modal-body">
          <div class="grid">
            <div class="field">
              <label>Title</label>
              <input v-model.trim="editForm.title" />
            </div>

            <div class="field">
              <label>Slot</label>
              <select v-model="editForm.slot">
                <option value="main">Main (big)</option>
                <option value="side_top">Right Top (small)</option>
                <option value="side_bottom">Right Bottom (small)</option>
              </select>
            </div>

            <!-- 🔥 Edit image upload -->
            <div class="field col-span-2">
              <label>Image</label>

              <div class="upload-row">
                <input
                  type="file"
                  accept="image/*"
                  @change="(e) => onFileChange(e, 'edit')"
                />

                <button
                  v-if="editForm.image_url"
                  type="button"
                  class="btn-ghost small"
                  @click="openInNew(editForm.image_url)"
                >
                  View
                </button>

                <span v-if="uploadingEdit" class="uploading-text">
                  Uploading...
                </span>
              </div>

              <div v-if="editForm.image_url" class="preview">
                <img :src="editForm.image_url" alt="Preview" />
              </div>
            </div>

            <div class="field">
              <label>Button Text</label>
              <input v-model.trim="editForm.button_text" />
            </div>

            <div class="field">
              <label>Button Link</label>
              <input v-model.trim="editForm.button_link" />
            </div>
          </div>

          <div class="actions">
            <button
              class="btn-primary"
              type="submit"
              :disabled="savingEdit || uploadingEdit"
            >
              {{ savingEdit ? "Saving..." : "Save" }}
            </button>
            <button class="btn-ghost" type="button" @click="closeEdit">
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
const saving = ref(false);
const savingEdit = ref(false);

const uploadingCreate = ref(false);
const uploadingEdit = ref(false);

const form = ref({
  title: "",
  image_url: "",
  button_text: "",
  button_link: "",
  slot: "main",
});

const editing = ref(false);
const editForm = ref({});

function humanSlot(slot) {
  if (slot === "side_top") return "Right Top";
  if (slot === "side_bottom") return "Right Bottom";
  return "Main";
}

function resetForm() {
  form.value = {
    title: "",
    image_url: "",
    button_text: "",
    button_link: "",
    slot: "main",
  };
}

async function fetchBanners() {
  loading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data || [];
  } catch (err) {
    console.error("Fetch banners error:", err);
  } finally {
    loading.value = false;
  }
}

async function createBanner() {
  if (!form.value.image_url) return alert("Please upload an image first");
  saving.value = true;
  try {
    await axios.post(`${API_BASE}/api/banners`, form.value);
    resetForm();
    fetchBanners();
  } catch (err) {
    console.error("Create banner error:", err);
    alert("Failed to create banner");
  } finally {
    saving.value = false;
  }
}

function openEdit(b) {
  editForm.value = { ...b };
  editing.value = true;
}
function closeEdit() {
  editing.value = false;
}

/* --------- upload helpers ---------- */
async function uploadImage(file, mode) {
  if (!file) return;

  const isEdit = mode === "edit";
  if (isEdit) uploadingEdit.value = true;
  else uploadingCreate.value = true;

  try {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post(
      `${API_BASE}/api/upload/banner`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const url = res.data.url;

    if (isEdit) {
      editForm.value.image_url = url;
    } else {
      form.value.image_url = url;
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Image upload failed");
  } finally {
    if (isEdit) uploadingEdit.value = false;
    else uploadingCreate.value = false;
  }
}

function onFileChange(e, mode) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  uploadImage(file, mode);
}

function openInNew(url) {
  if (!url) return;
  window.open(url, "_blank");
}

async function updateBanner() {
  if (!editForm.value.image_url) {
    if (
      !confirm(
        "No image uploaded. Save anyway with empty image_url?"
      )
    ) {
      return;
    }
  }

  savingEdit.value = true;
  try {
    await axios.put(
      `${API_BASE}/api/banners/${editForm.value.id}`,
      editForm.value
    );
    editing.value = false;
    fetchBanners();
  } catch (err) {
    console.error("Update banner error:", err);
    alert("Failed to update");
  } finally {
    savingEdit.value = false;
  }
}

async function removeBanner(id) {
  if (!confirm("Delete this banner?")) return;
  try {
    await axios.delete(`${API_BASE}/api/banners/${id}`);
    fetchBanners();
  } catch (err) {
    console.error("Delete banner error:", err);
  }
}

onMounted(fetchBanners);
</script>

<style scoped>
.banner-manager {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

/* cards */
.card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.08);
  padding: 16px 18px 20px;
  margin-bottom: 20px;
}
.card-title {
  font-size: 18px;
  font-weight: 600;
}

/* grid */
.grid {
  display: grid;
  gap: 12px 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 12px;
}
.col-span-2 {
  grid-column: 1 / -1;
}

/* field */
.field label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
}
.field input,
.field select {
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  font-size: 14px;
}
.req {
  color: #ef4444;
}
.hint {
  font-size: 12px;
  color: #6b7280;
}

/* upload row & preview */
.upload-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.uploading-text {
  font-size: 12px;
  color: #6b7280;
}
.preview {
  margin-top: 8px;
}
.preview img {
  max-width: 260px;
  max-height: 130px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  object-fit: cover;
}

/* buttons */
.actions {
  margin-top: 14px;
  display: flex;
  gap: 10px;
}
.btn-primary {
  background: linear-gradient(135deg, #4a00e0, #8e2de2);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 14px;
  cursor: pointer;
}
.btn-ghost {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 8px 14px;
  font-size: 14px;
  cursor: pointer;
}
.btn-ghost.small {
  padding: 4px 10px;
  font-size: 12px;
}

/* list */
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #edf2f7;
}
.thumb {
  width: 140px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
}
.meta {
  flex: 1;
}
.title {
  font-weight: 600;
  margin-bottom: 4px;
}
.sub {
  font-size: 13px;
  color: #4b5563;
}
.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: #eef2ff;
  color: #4f46e5;
  margin-left: 4px;
}
.muted {
  color: #9ca3af;
}
.link {
  margin-left: 6px;
  font-size: 12px;
  color: #6366f1;
}
.row-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.btn-small {
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
}
.btn-danger {
  border-radius: 999px;
  border: 1px solid #fecaca;
  padding: 4px 10px;
  font-size: 12px;
  color: #b91c1c;
  background: #fef2f2;
  cursor: pointer;
}

/* modal */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px 20px;
  width: 520px;
  max-width: 95%;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.modal-header .x {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
}

/* skeleton / empty */
.skeleton-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.skeleton {
  height: 60px;
  border-radius: 10px;
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.empty {
  padding: 12px 4px 8px;
  font-size: 14px;
  color: #6b7280;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@media (max-width: 768px) {
  .banner-manager {
    padding: 16px 10px 32px;
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .thumb {
    width: 110px;
    height: 60px;
  }
}
</style>
