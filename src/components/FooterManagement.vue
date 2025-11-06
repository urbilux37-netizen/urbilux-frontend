<template>
  <div class="footer-manager">
    <h2 class="page-title">⚙️ Footer Manager</h2>

    <!-- SUPPORT -->
    <section class="section-card">
      <h3 class="section-title">Support Section</h3>
      <div class="input-row">
        <input v-model="newSupport.label" placeholder="Label" />
        <input v-model="newSupport.value" placeholder="Value" />
        <button class="add-btn" @click="addSupport">Add</button>
      </div>

      <div class="responsive-table">
        <table>
          <thead>
            <tr><th>Label</th><th>Value</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="item in supportItems" :key="item.id">
              <td><input v-model="item.label" /></td>
              <td><input v-model="item.value" /></td>
              <td class="action-cell">
                <button class="update-btn" @click="updateSupport(item)">Update</button>
                <button class="delete-btn" @click="deleteSupport(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- ABOUT US -->
    <section class="section-card">
      <h3 class="section-title">About Us (3 Columns)</h3>
      <div class="columns">
        <div v-for="(column, index) in aboutColumns" :key="index" class="about-column">
          <h4>Column {{ index + 1 }}</h4>
          <div class="input-row">
            <input v-model="newAbout.label" placeholder="Label" />
            <input v-model="newAbout.link" placeholder="Link" />
            <button class="add-btn" @click="addAbout(index)">Add</button>
          </div>

          <div class="responsive-table">
            <table>
              <thead><tr><th>Label</th><th>Link</th><th>Actions</th></tr></thead>
              <tbody>
                <tr v-for="item in column" :key="item.id">
                  <td><input v-model="item.label" /></td>
                  <td><input v-model="item.link" /></td>
                  <td class="action-cell">
                    <button class="update-btn" @click="updateAbout(item)">Update</button>
                    <button class="delete-btn" @click="deleteAbout(item.id, index)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <!-- STAY CONNECTED -->
    <section class="section-card">
      <h3 class="section-title">Stay Connected</h3>
      <div class="input-grid">
        <input v-model="stayConnected.name" placeholder="Name" />
        <input v-model="stayConnected.address" placeholder="Address" />
        <input v-model="stayConnected.email" placeholder="Email" />
      </div>
      <button class="update-btn full-btn" @click="updateStayConnected">Update</button>
    </section>

    <!-- APP LINKS -->
    <section class="section-card">
      <h3 class="section-title">App Links</h3>
      <div class="input-row">
        <input v-model="newApp.link" placeholder="App Link" />
        <input type="file" @change="handleAppIcon" />
        <button class="add-btn" @click="addAppLink">Add</button>
      </div>

      <div class="responsive-table">
        <table>
          <thead><tr><th>Link</th><th>Icon</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="item in appLinks" :key="item.id">
              <td><input v-model="item.link" /></td>
              <td><img :src="item.icon" class="icon-img" /></td>
              <td class="action-cell">
                <input type="file" @change="e => handleUpdateAppIcon(e, item)" />
                <button class="update-btn" @click="updateAppLink(item)">Update</button>
                <button class="delete-btn" @click="deleteAppLink(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SOCIAL LINKS -->
    <section class="section-card">
      <h3 class="section-title">Social Links</h3>
      <div class="input-row">
        <input v-model="newSocial.link" placeholder="Social Link" />
        <input type="file" @change="handleSocialIcon" />
        <button class="add-btn" @click="addSocialLink">Add</button>
      </div>

      <div class="responsive-table">
        <table>
          <thead><tr><th>Link</th><th>Icon</th><th>Actions</th></tr></thead>
          <tbody>
            <tr v-for="item in socialLinks" :key="item.id">
              <td><input v-model="item.link" /></td>
              <td><img :src="item.icon" class="icon-img" /></td>
              <td class="action-cell">
                <input type="file" @change="e => handleUpdateSocialIcon(e, item)" />
                <button class="update-btn" @click="updateSocialLink(item)">Update</button>
                <button class="delete-btn" @click="deleteSocialLink(item.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- FOOTER TEXT -->
    <section class="section-card">
      <h3 class="section-title">Footer Texts</h3>
      <div class="input-grid">
        <input v-model="appText" placeholder="App Text" />
        <input v-model="copyright" placeholder="Copyright" />
        <input v-model="poweredBy" placeholder="Powered By" />
      </div>
      <button class="update-btn full-btn" @click="updateFooterTexts">Update</button>
    </section>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000/api/footer"
  : "https://avado-backend.onrender.com/api/footer";

const supportItems = ref([]);
const aboutColumns = ref([[], [], []]);
const stayConnected = ref({ name: "", address: "", email: "" });
const appLinks = ref([]);
const socialLinks = ref([]);
const appText = ref("");
const copyright = ref("");
const poweredBy = ref("");
const newSupport = ref({ label: "", value: "" });
const newAbout = ref({ label: "", link: "" });
const newApp = ref({ link: "", icon: "" });
const newSocial = ref({ link: "", icon: "" });

const fetchAll = async () => {
  try {
    const [support, about, stay, app, social, texts] = await Promise.all([
      axios.get(`${BASE_URL}/support`),
      axios.get(`${BASE_URL}/about`),
      axios.get(`${BASE_URL}/stay-connected`),
      axios.get(`${BASE_URL}/app-links`),
      axios.get(`${BASE_URL}/social-links`),
      axios.get(`${BASE_URL}/texts`),
    ]);
    supportItems.value = support.data || [];
    aboutColumns.value = [[], [], []];
    (about.data || []).forEach((item) =>
      aboutColumns.value[item.column_order - 1].push(item)
    );
    stayConnected.value = stay.data || {};
    appLinks.value = app.data || [];
    socialLinks.value = social.data || [];
    if (texts.data) {
      appText.value = texts.data.app_text;
      copyright.value = texts.data.copyright;
      poweredBy.value = texts.data.powered_by;
    }
  } catch (err) {
    console.error("❌ Footer fetch failed:", err);
  }
};
onMounted(fetchAll);

const addSupport = async () => {
  if (!newSupport.value.label || !newSupport.value.value)
    return alert("Fill all fields");
  const res = await axios.post(`${BASE_URL}/support`, newSupport.value);
  supportItems.value.push(res.data);
  newSupport.value = { label: "", value: "" };
};
const updateSupport = async (item) =>
  await axios.put(`${BASE_URL}/support/${item.id}`, item);
const deleteSupport = async (id) => {
  await axios.delete(`${BASE_URL}/support/${id}`);
  supportItems.value = supportItems.value.filter((i) => i.id !== id);
};

const addAbout = async (colIndex) => {
  const item = { ...newAbout.value, column_order: colIndex + 1 };
  const res = await axios.post(`${BASE_URL}/about`, item);
  aboutColumns.value[colIndex].push(res.data);
  newAbout.value = { label: "", link: "" };
};
const updateAbout = async (item) =>
  await axios.put(`${BASE_URL}/about/${item.id}`, item);
const deleteAbout = async (id, colIndex) => {
  await axios.delete(`${BASE_URL}/about/${id}`);
  aboutColumns.value[colIndex] = aboutColumns.value[colIndex].filter(
    (i) => i.id !== id
  );
};

const updateStayConnected = async () => {
  if (!stayConnected.value.id)
    await axios.post(`${BASE_URL}/stay-connected`, stayConnected.value);
  else
    await axios.put(
      `${BASE_URL}/stay-connected/${stayConnected.value.id}`,
      stayConnected.value
    );
};

const handleAppIcon = (e) => (newApp.value.iconFile = e.target.files[0]);
const handleUpdateAppIcon = (e, item) => (item.iconFile = e.target.files[0]);
const addAppLink = async () => {
  const f = new FormData();
  f.append("link", newApp.value.link);
  if (newApp.value.iconFile) f.append("icon", newApp.value.iconFile);
  const res = await axios.post(`${BASE_URL}/app-links`, f);
  appLinks.value.push(res.data);
  newApp.value = { link: "" };
};
const updateAppLink = async (item) => {
  const f = new FormData();
  f.append("link", item.link);
  if (item.iconFile) f.append("icon", item.iconFile);
  await axios.put(`${BASE_URL}/app-links/${item.id}`, f);
};
const deleteAppLink = async (id) => {
  await axios.delete(`${BASE_URL}/app-links/${id}`);
  appLinks.value = appLinks.value.filter((i) => i.id !== id);
};

const handleSocialIcon = (e) => (newSocial.value.iconFile = e.target.files[0]);
const handleUpdateSocialIcon = (e, item) =>
  (item.iconFile = e.target.files[0]);
const addSocialLink = async () => {
  const f = new FormData();
  f.append("link", newSocial.value.link);
  if (newSocial.value.iconFile) f.append("icon", newSocial.value.iconFile);
  const res = await axios.post(`${BASE_URL}/social-links`, f);
  socialLinks.value.push(res.data);
  newSocial.value = { link: "" };
};
const updateSocialLink = async (item) => {
  const f = new FormData();
  f.append("link", item.link);
  if (item.iconFile) f.append("icon", item.iconFile);
  await axios.put(`${BASE_URL}/social-links/${item.id}`, f);
};
const deleteSocialLink = async (id) => {
  await axios.delete(`${BASE_URL}/social-links/${id}`);
  socialLinks.value = socialLinks.value.filter((i) => i.id !== id);
};
const updateFooterTexts = async () =>
  await axios.put(`${BASE_URL}/texts`, {
    app_text: appText.value,
    copyright: copyright.value,
    powered_by: poweredBy.value,
  });
</script>

<style scoped>
.footer-manager {
  max-width: 1100px;
  margin: 70px auto;
  padding: 10px;
  font-family: "Zalando Sans", sans-serif;
}
.page-title {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 25px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.section-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.05);
  padding: 20px;
  margin-bottom: 25px;
  border-left: 5px solid #8e2de2;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 15px;
}
.input-row,
.input-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}
.input-row input,
.input-grid input {
  flex: 1;
  min-width: 140px;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}
.add-btn,
.update-btn,
.delete-btn {
  padding: 7px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.add-btn {
  background: linear-gradient(90deg, #8e2de2, #4a00e0);
  color: white;
}
.update-btn {
  background: #4a00e0;
  color: #fff;
}
.delete-btn {
  background: #f44;
  color: #fff;
}
.add-btn:hover,
.update-btn:hover,
.delete-btn:hover {
  opacity: 0.85;
}
.responsive-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border-bottom: 1px solid #eee;
  padding: 8px;
  text-align: left;
  font-size: 14px;
}
.icon-img {
  height: 40px;
  border-radius: 6px;
}
.full-btn {
  margin-top: 8px;
  width: 100%;
}
.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}
@media (max-width: 768px) {
  .footer-manager {
    width: 95%;
  }
  th,
  td {
    font-size: 13px;
    padding: 6px;
  }
  .input-row,
  .input-grid {
    flex-direction: column;
  }
  .add-btn,
  .update-btn,
  .delete-btn {
    width: 100%;
  }
}
</style>
