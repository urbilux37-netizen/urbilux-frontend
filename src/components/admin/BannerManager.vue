<template>
  <div class="banner-manager">
    <h1 class="page-title">🖼️ Banner Manager</h1>

    <!-- Add Banner -->
    <form @submit.prevent="handleCreate" class="card form-card">
      <h2 class="card-title">Add New Banner</h2>
      <div class="grid">
        <div class="field">
          <label>Title (optional)</label>
          <input v-model.trim="form.title" placeholder="Summer Sale" />
        </div>

        <div class="field col-span-2">
          <label>Image URL <span class="req">*</span></label>
          <input
            v-model.trim="form.image_url"
            placeholder="https://res.cloudinary.com/.../banner.jpg"
            required
          />
          <p class="hint">Use a wide image (16:9 ~ 21:9). 1500–2400px width recommended.</p>
        </div>

        <div class="field">
          <label>Button Text (optional)</label>
          <input v-model.trim="form.button_text" placeholder="Shop Now" />
        </div>

        <div class="field">
          <label>Button Link (optional)</label>
          <input v-model.trim="form.button_link" placeholder="/category/new-arrivals" />
        </div>
      </div>

      <div class="preview-row" v-if="form.image_url">
        <img :src="form.image_url" alt="Preview" class="preview" />
      </div>

      <div class="actions">
        <button type="submit" class="btn-primary">Add Banner</button>
        <button type="button" class="btn-ghost" @click="resetForm">Reset</button>
      </div>
    </form>

    <!-- List -->
    <div class="card list-card">
      <div class="list-header">
        <h2 class="card-title">All Banners</h2>
        <button class="btn-ghost" @click="loadBanners" :disabled="loading">
          {{ loading ? 'Refreshing…' : 'Refresh' }}
        </button>
      </div>

      <div v-if="loading" class="skeleton-wrap">
        <div class="skeleton" v-for="n in 3" :key="n"></div>
      </div>

      <div v-else-if="!banners.length" class="empty">
        No banners yet. Add your first banner above.
      </div>

      <div v-else class="items">
        <div v-for="b in banners" :key="b.id" class="item">
          <img :src="b.image_url" class="thumb" alt="Banner" />
          <div class="meta">
            <div class="title-row">
              <p class="title">{{ b.title || 'Untitled banner' }}</p>
              <span class="id">#{{ b.id }}</span>
            </div>
            <p class="sub">
              <strong>Button:</strong>
              <span v-if="b.button_text">{{ b.button_text }}</span>
              <span v-else class="muted">—</span>
              <span v-if="b.button_link" class="link"> → {{ b.button_link }}</span>
            </p>
          </div>

          <div class="row-actions">
            <button class="btn-small" @click="openEdit(b)">Edit</button>
            <button class="btn-danger" @click="confirmDelete(b.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
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
              <label>Image URL <span class="req">*</span></label>
              <input v-model.trim="editModel.image_url" required />
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

          <div class="preview-row" v-if="editModel.image_url">
            <img :src="editModel.image_url" class="preview" alt="Preview" />
          </div>

          <div class="actions">
            <button type="submit" class="btn-primary">Save Changes</button>
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

// ✅ Auto-detect API base (same style you’re using)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

const banners = ref([]);
const loading = ref(false);

const form = ref({
  title: "",
  image_url: "",
  button_text: "",
  button_link: "",
});

function resetForm() {
  form.value = { title: "", image_url: "", button_text: "", button_link: "" };
}

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

async function handleCreate() {
  if (!form.value.image_url) return;
  try {
    const res = await axios.post(`${API_BASE}/banners`, form.value);
    banners.value.unshift(res.data);
    resetForm();
  } catch (e) {
    console.error("Banner create error:", e);
  }
}

function confirmDelete(id) {
  if (confirm("Delete this banner? This cannot be undone.")) {
    handleDelete(id);
  }
}

async function handleDelete(id) {
  try {
    await axios.delete(`${API_BASE}/banners/${id}`);
    banners.value = banners.value.filter((b) => b.id !== id);
  } catch (e) {
    console.error("Banner delete error:", e);
  }
}

// ----- Edit Modal -----
const editing = ref(false);
const editModel = ref({
  id: null,
  title: "",
  image_url: "",
  button_text: "",
  button_link: "",
});

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
    // patch list
    const idx = banners.value.findIndex((x) => x.id === id);
    if (idx !== -1) banners.value[idx] = res.data;
    closeEdit();
  } catch (e) {
    console.error("Banner update error:", e);
  }
}

onMounted(loadBanners);
</script>

<style scoped>
/* Layout */
.banner-manager {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 16px 64px;
}

.page-title {
  font-size: 28px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 18px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Cards */
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 24px rgba(0,0,0,.06);
  padding: 18px;
}

.form-card { margin-bottom: 18px; }
.list-card { margin-top: 18px; }

.card-title {
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 14px;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 14px;
}
.col-span-2 { grid-column: span 2; }

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; }
  .col-span-2 { grid-column: auto; }
}

/* Fields */
.field label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
  transition: border .2s, box-shadow .2s;
}
.field input:focus {
  border-color: #7B61FF;
  box-shadow: 0 0 0 3px rgba(123,97,255,.15);
}
.req { color: #ff4d4f; margin-left: 4px; }
.hint { font-size: 12px; color: #6b7280; margin-top: 6px; }

/* Preview */
.preview-row { margin-top: 10px; }
.preview {
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #eee;
}

/* Actions */
.actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}
.btn-primary {
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  color: #fff;
  border: 0;
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

/* List */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.items { display: grid; gap: 12px; }

.item {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  gap: 14px;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 14px;
}
@media (max-width: 768px) {
  .item { grid-template-columns: 100px 1fr; }
  .row-actions { grid-column: 1 / -1; justify-self: end; }
}

.thumb {
  width: 100%;
  height: 84px;
  object-fit: cover;
  border-radius: 10px;
}

.meta .title-row {
  display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
}
.meta .title { font-weight: 700; }
.meta .id { font-size: 12px; color: #9CA3AF; }
.meta .sub { font-size: 13px; color: #4B5563; }
.meta .muted { color: #9CA3AF; }
.meta .link { color: #7B61FF; }

.row-actions { display: flex; gap: 8px; }
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
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-weight: 700;
  cursor: pointer;
}

/* Empty & Skeletons */
.empty {
  padding: 18px;
  color: #6b7280;
}
.skeleton-wrap { display: grid; gap: 12px; }
.skeleton {
  height: 110px;
  background: linear-gradient(90deg, #f2f2f2 25%, #eaeaea 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  border-radius: 14px;
  animation: shimmer 1.4s ease infinite;
}
@keyframes shimmer { 0%{background-position: 100% 0} 100%{background-position: -100% 0} }

/* Modal */
.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,.35);
  display: grid; place-items: center; padding: 14px; z-index: 50;
}
.modal {
  width: 100%; max-width: 720px; background: #fff; border-radius: 16px;
  box-shadow: 0 24px 50px rgba(0,0,0,.18);
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid #f1f1f1;
}
.modal-header h3 {
  font-weight: 800;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.modal .x {
  background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 50%;
  width: 36px; height: 36px; cursor: pointer;
}
.modal-body { padding: 14px 16px 18px; }
</style>
