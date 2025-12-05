<template>
  <div class="ticker-manager">
    <!-- Title Bar -->
    <div class="tm-header">
      <div>
        <h2>Secondary Ticker Manager</h2>
        <p>
          Homepage er onnanno section e je colourful ticker cholbe, seta ekhane
          manage korun.
        </p>
      </div>
      <span class="badge">Secondary</span>
    </div>

    <!-- Add New Ticker Card -->
    <div class="tm-card tm-add-card">
      <h3>New Secondary Ticker Add</h3>
      <p class="subtext">
        Short highlight line likhun. Ex: "আজকের মেগা ফ্ল্যাশ সেল চলছে 🔥"
      </p>

      <form @submit.prevent="createTicker" class="tm-form">
        <div class="form-row">
          <label>Text</label>
          <textarea
            v-model="newTicker.text"
            placeholder="Secondary ticker text likhun..."
            rows="2"
          ></textarea>
        </div>

        <div class="form-grid">
          <div class="form-row">
            <label>Sort Order</label>
            <input
              type="number"
              v-model.number="newTicker.sort_order"
              placeholder="0"
            />
            <small>Choto number agey dekhabe.</small>
          </div>

          <div class="form-row form-row-inline">
            <label class="switch-label">
              <input type="checkbox" v-model="newTicker.is_active" />
              <span class="switch"></span>
              <span class="switch-text">
                {{ newTicker.is_active ? "Active" : "Inactive" }}
              </span>
            </label>
          </div>
        </div>

        <button type="submit" class="btn-primary" :disabled="creating">
          {{ creating ? "Saving..." : "Add Secondary Ticker" }}
        </button>
      </form>
    </div>

    <!-- List Card -->
    <div class="tm-card">
      <div class="list-header">
        <h3>All Secondary Tickers</h3>
        <button class="btn-soft" @click="fetchTickers" :disabled="loading">
          {{ loading ? "Refreshing..." : "Refresh" }}
        </button>
      </div>

      <div class="table-wrapper" v-if="tickers.length">
        <table class="tm-table">
          <thead>
            <tr>
              <th>Text</th>
              <th class="th-small">Order</th>
              <th class="th-small">Status</th>
              <th class="th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ticker in tickers"
              :key="ticker.id"
              :class="{ inactive: !ticker.is_active }"
            >
              <td>
                <div v-if="editingId !== ticker.id">
                  <p class="ticker-text">{{ ticker.text }}</p>
                  <small class="meta">
                    ID: {{ ticker.id }} • Updated:
                    {{ formatDate(ticker.updated_at || ticker.created_at) }}
                  </small>
                </div>

                <div v-else class="edit-block">
                  <textarea
                    v-model="editForm.text"
                    rows="2"
                    class="edit-textarea"
                  ></textarea>
                </div>
              </td>

              <td class="td-center">
                <div v-if="editingId !== ticker.id">
                  {{ ticker.sort_order }}
                </div>
                <div v-else>
                  <input
                    type="number"
                    v-model.number="editForm.sort_order"
                    class="input-small"
                  />
                </div>
              </td>

              <td class="td-center">
                <span
                  class="status-pill"
                  :class="ticker.is_active ? 'active' : 'inactive'"
                  @click="toggleActive(ticker)"
                >
                  {{ ticker.is_active ? "Active" : "Inactive" }}
                </span>
              </td>

              <td class="td-actions">
                <div v-if="editingId !== ticker.id" class="action-group">
                  <button class="btn-text" @click="startEdit(ticker)">
                    Edit
                  </button>
                  <button class="btn-text danger" @click="deleteTicker(ticker)">
                    Delete
                  </button>
                </div>
                <div v-else class="action-group">
                  <button class="btn-text" @click="saveEdit(ticker)">
                    Save
                  </button>
                  <button class="btn-text" @click="cancelEdit">
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="empty-text">
        Kon secondary ticker nai. Upore form theke ekta add kore nin.
      </p>
    </div>

    <transition name="fade">
      <div v-if="message" class="toast">
        {{ message }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://urbilux-backend.onrender.com/api";

const tickers = ref([]);
const loading = ref(false);
const creating = ref(false);
const message = ref("");

const newTicker = ref({
  text: "",
  sort_order: 0,
  is_active: true,
});

const editingId = ref(null);
const editForm = ref({
  text: "",
  sort_order: 0,
});

// fetch
const fetchTickers = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(
      `${API_BASE}/secondary-tickers/admin/all`
    );
    tickers.value = data;
  } catch (err) {
    console.error(err);
    showMessage("Secondary ticker load korte problem holo.");
  } finally {
    loading.value = false;
  }
};

// create
const createTicker = async () => {
  if (!newTicker.value.text.trim()) {
    return showMessage("Text dikhun, empty rakhen na.");
  }

  creating.value = true;
  try {
    const { data } = await axios.post(`${API_BASE}/secondary-tickers/admin`, {
      text: newTicker.value.text,
      sort_order: newTicker.value.sort_order,
      is_active: newTicker.value.is_active,
    });

    tickers.value.unshift(data);
    newTicker.value.text = "";
    newTicker.value.sort_order = 0;
    newTicker.value.is_active = true;
    showMessage("Secondary ticker successfully add hoyeche.");
  } catch (err) {
    console.error(err);
    showMessage("Secondary ticker add korte problem holo.");
  } finally {
    creating.value = false;
  }
};

// edit
const startEdit = (ticker) => {
  editingId.value = ticker.id;
  editForm.value = {
    text: ticker.text,
    sort_order: ticker.sort_order,
  };
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async (ticker) => {
  try {
    const { data } = await axios.put(
      `${API_BASE}/secondary-tickers/admin/${ticker.id}`,
      {
        text: editForm.value.text,
        sort_order: editForm.value.sort_order,
      }
    );

    const index = tickers.value.findIndex((t) => t.id === ticker.id);
    if (index !== -1) {
      tickers.value[index] = data;
    }
    showMessage("Secondary ticker update hoyeche.");
  } catch (err) {
    console.error(err);
    showMessage("Update korte problem holo.");
  } finally {
    editingId.value = null;
  }
};

// toggle
const toggleActive = async (ticker) => {
  try {
    const { data } = await axios.patch(
      `${API_BASE}/secondary-tickers/admin/${ticker.id}/toggle`
    );
    const index = tickers.value.findIndex((t) => t.id === ticker.id);
    if (index !== -1) {
      tickers.value[index].is_active = data.is_active;
    }
    showMessage(
      `Secondary ticker ${data.is_active ? "Active" : "Inactive"} hoyeche.`
    );
  } catch (err) {
    console.error(err);
    showMessage("Status change korte problem holo.");
  }
};

// delete
const deleteTicker = async (ticker) => {
  if (!confirm("Nishchoi delete korte chacchen?")) return;

  try {
    await axios.delete(
      `${API_BASE}/secondary-tickers/admin/${ticker.id}`
    );
    tickers.value = tickers.value.filter((t) => t.id !== ticker.id);
    showMessage("Secondary ticker delete hoyeche.");
  } catch (err) {
    console.error(err);
    showMessage("Delete korte problem holo.");
  }
};

const showMessage = (text) => {
  message.value = text;
  setTimeout(() => {
    message.value = "";
  }, 2500);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString();
};

onMounted(fetchTickers);
</script>

<style scoped>
/* same style as TickerManager.vue */
.ticker-manager {
  padding: 16px;
  max-width: 1100px;
  margin: 0 auto 40px;
}

.tm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.tm-header h2 {
  font-size: 22px;
  font-weight: 700;
}

.tm-header p {
  font-size: 13px;
  color: #666;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.tm-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px 16px 12px;
  box-shadow: 0 10px 30px rgba(74, 0, 224, 0.12);
  margin-bottom: 16px;
  border: 1px solid rgba(138, 115, 235, 0.2);
}

.tm-add-card {
  background: linear-gradient(
    135deg,
    rgba(255, 138, 0, 0.06),
    rgba(229, 46, 113, 0.04)
  );
}

.tm-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.subtext {
  font-size: 12px;
  color: #777;
  margin-bottom: 12px;
}

.tm-form .form-row {
  margin-bottom: 10px;
}

.tm-form label {
  display: block;
  font-size: 12px;
  margin-bottom: 4px;
  font-weight: 500;
}

.tm-form textarea,
.tm-form input {
  width: 100%;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  font-size: 13px;
  outline: none;
}

.tm-form textarea:focus,
.tm-form input:focus {
  border-color: #4a00e0;
  box-shadow: 0 0 0 1px rgba(74, 0, 224, 0.1);
}

.form-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.form-row-inline {
  display: flex;
  align-items: flex-end;
}

/* Switch */
.switch-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.switch-label input {
  display: none;
}

.switch {
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: #ddd;
  position: relative;
  transition: 0.2s;
}

.switch::before {
  content: "";
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #fff;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: 0.2s;
}

.switch-label input:checked + .switch {
  background: linear-gradient(90deg, #ff8a00, #e52e71);
}

.switch-label input:checked + .switch::before {
  transform: translateX(16px);
}

.switch-text {
  font-size: 12px;
}

/* Buttons */
.btn-primary {
  margin-top: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-soft {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255, 138, 0, 0.4);
  background: #fff7f1;
  font-size: 12px;
  cursor: pointer;
}

.btn-text {
  border: none;
  background: transparent;
  font-size: 12px;
  cursor: pointer;
  color: #4a00e0;
}

.btn-text.danger {
  color: #d32f2f;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.tm-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.tm-table th,
.tm-table td {
  padding: 8px 6px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  vertical-align: top;
}

.tm-table th {
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  color: #666;
}

.th-small {
  width: 70px;
}

.th-actions {
  width: 120px;
}

.td-center {
  text-align: center;
}

.td-actions {
  text-align: right;
}

.ticker-text {
  margin: 0 0 4px;
}

.meta {
  font-size: 10px;
  color: #999;
}

.inactive {
  opacity: 0.6;
}

.status-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  cursor: pointer;
  user-select: none;
}

.status-pill.active {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.status-pill.inactive {
  background: rgba(244, 67, 54, 0.08);
  color: #c62828;
}

.action-group {
  display: flex;
  justify-content: flex-end;
  gap: 4px;
}

.edit-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-textarea {
  font-size: 13px;
}

.input-small {
  width: 60px;
  font-size: 13px;
}

.empty-text {
  font-size: 12px;
  color: #777;
  margin-top: 10px;
}

.toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  background: #323232;
  color: #fff;
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .ticker-manager {
    padding: 12px;
  }

  .tm-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tm-card {
    padding: 12px;
  }

  .tm-table th,
  .tm-table td {
    font-size: 12px;
    padding: 6px 4px;
  }

  .th-actions {
    width: 100px;
  }
}
</style>
