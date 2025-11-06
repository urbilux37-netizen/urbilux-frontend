<template>
  <footer class="footer">
    <div class="footer-top">
      <!-- Support Column -->
      <div class="footer-column">
        <h4>SUPPORT</h4>
        <ul>
          <li v-for="item in supportItems" :key="item.id">
            <div class="contact-info">
              <i class="phone-icon">📞</i>
              <div class="info-details">
                <span class="hours">{{ item.label }}</span>
                <span class="number">{{ item.value }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- About Us Column (3 Sub-columns) -->
      <div class="footer-column">
        <h4>ABOUT US</h4>
        <div class="about-us-row">
          <ul v-for="(column, index) in aboutColumns" :key="index" class="sub-column">
            <li v-for="item in column" :key="item.id">
              <a :href="item.link" target="_blank">{{ item.label }}</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Stay Connected Column -->
      <div class="footer-column">
        <h4>STAY CONNECTED</h4>
        <div class="address-box" v-if="stayConnected">
          <h5>{{ stayConnected.name }}</h5>
          <p>{{ stayConnected.address }}</p>
          <p>Email: <a :href="`mailto:${stayConnected.email}`">{{ stayConnected.email }}</a></p>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <!-- App & Social Links -->
    <div class="footer-middle">
      <div class="footer-middle-left">
        <p>{{ appText }}</p>
      </div>

      <div class="footer-middle-center">
        <div class="app-links">
          <a v-for="app in appLinks" :key="app.id" :href="app.link" target="_blank">
            <img :src="app.icon" alt="App Link" />
          </a>
        </div>
      </div>

      <div class="footer-middle-right">
        <div class="social-links">
          <a v-for="social in socialLinks" :key="social.id" :href="social.link" target="_blank">
            <img :src="social.icon" alt="Social Link" />
          </a>
        </div>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-bottom">
      <p>{{ copyright }}</p>
      <p>Powered By: {{ poweredBy }}</p>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// ✅ Backend Base URL detect automatically (Render or Localhost)
const backendURL =
  window.location.hostname.includes("localhost")
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com"; // 🔹 তোমার Render API লিংক বসাও

// Footer state variables
const supportItems = ref([]);
const aboutColumns = ref([[], [], []]);
const stayConnected = ref(null);
const appLinks = ref([]);
const socialLinks = ref([]);
const appText = ref("");
const copyright = ref("");
const poweredBy = ref("");

// ✅ Fetch Footer Data from Node.js Backend
const fetchFooterData = async () => {
  try {
    const [support, about, stay, app, social, text] = await Promise.all([
      axios.get(`${backendURL}/api/footer/support`),
      axios.get(`${backendURL}/api/footer/about`),
      axios.get(`${backendURL}/api/footer/stay-connected`),
      axios.get(`${backendURL}/api/footer/app-links`),
      axios.get(`${backendURL}/api/footer/social-links`),
      axios.get(`${backendURL}/api/footer/texts`),
    ]);

    supportItems.value = support.data || [];
    appLinks.value = app.data || [];
    socialLinks.value = social.data || [];
    stayConnected.value = stay.data || null;

    // about data কে তিন কলামে ভাগ করা
    aboutColumns.value = [[], [], []];
    (about.data || []).forEach((item) => {
      aboutColumns.value[item.column_order - 1].push(item);
    });

    if (text.data) {
      appText.value = text.data.app_text;
      copyright.value = text.data.copyright;
      poweredBy.value = text.data.powered_by;
    }
  } catch (err) {
    console.error("❌ Footer load error:", err);
  }
};

onMounted(fetchFooterData);
</script>
<style scoped>
.footer {
  background-color: #0b1a28;
  color: #c0c0c0;
  padding: 40px 80px;
  font-family: "Zalando Sans", sans-serif;
  font-optical-sizing: auto;
  font-weight: <weight>;
  font-style: normal;
  font-variation-settings:
    "wdth" 100;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  flex-wrap: wrap;
  padding-bottom: 20px;
}

.footer-column {
  flex: 1;
  min-width: 200px;
}

.footer-column h4 {
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
  border-bottom: 1px solid #334455;
  padding-bottom: 10px;
}

.footer-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-column li {
  margin-bottom: 10px;
}

.footer-column a {
  color: #c0c0c0;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-column a:hover {
  color: #fff;
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  border: 1px solid #334455;
  padding: 15px;
  border-radius: 8px;
}

.info-details {
  display: flex;
  flex-direction: column;
}

.info-details .hours,
.info-details .text {
  font-size: 12px;
  color: #888;
}

.info-details .number {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.about-us-row {
  display: flex;
  gap: 40px;
}

.about-us-row .sub-column {
  flex: 1;
}

.address-box {
  background-color: #1a2a38;
  padding: 20px;
  border-radius: 8px;
}

.address-box h5 {
  color: #fff;
  margin-top: 0;
  font-size: 16px;
}

.address-box p {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 10px;
}

.address-box a {
  color: #c0c0c0;
  text-decoration: underline;
}

.divider {
  border: none;
  border-top: 1px solid #334455;
  margin: 20px 0;
}

/* Footer Middle */
.footer-middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  text-align: center;
}

.footer-middle-left,
.footer-middle-center,
.footer-middle-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer-middle-left {
  justify-content: flex-start;
  flex: 1;
}

.footer-middle-center {
  justify-content: center;
  flex: 1;
}

.footer-middle-right {
  justify-content: flex-end;
  flex: 1;
}

.app-links img {
  height: 48px;
  margin: 0 10px;
  transition: transform 0.3s;
}

.app-links img:hover {
  transform: scale(1.05);
}

.social-links img {
  height: 48px;
  margin: 0 10px;
  transition: transform 0.3s;
}

.social-links img:hover {
  transform: scale(1.15);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
}

@media (max-width: 768px) {
  .footer {
    padding: 20px;
  }
  .footer-top {
    flex-direction: column;
  }
  .footer-middle {
    flex-direction: column;
    gap: 20px;
  }
  .footer-middle-left,
  .footer-middle-center,
  .footer-middle-right {
    justify-content: center;
    flex: none;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  .about-us-row {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
