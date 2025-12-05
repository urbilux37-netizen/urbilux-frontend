<template>
  <!-- 🔹 Slim secondary ticker bar -->
  <div class="sec-ticker-wrapper" v-if="messages.length">
    <div class="sec-ticker-viewport">
      <div class="sec-ticker-track" :style="trackStyle">
        <div
          v-for="(msg, index) in loopedMessages"
          :key="index"
          class="sec-ticker-item"
        >
          {{ msg }}
        </div>
      </div>
    </div>
  </div>

  <!-- Optional small error -->
  <div v-else-if="error" class="sec-ticker-error">
    {{ error }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  // main-er cheye ektu fast
  speed: {
    type: Number,
    default: 22,
  },
});

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://urbilux-backend.onrender.com/api";

const messages = ref([]);
const error = ref("");

const loopedMessages = computed(() => {
  if (!messages.value.length) return [];
  return [...messages.value, ...messages.value];
});

const trackStyle = computed(() => ({
  "--sec-ticker-duration": `${props.speed}s`,
}));

const fetchMessages = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/secondary-tickers`);
    if (Array.isArray(data.messages)) {
      messages.value = data.messages;
    }
  } catch (err) {
    console.error(err);
    error.value = "Header message load korte parini.";
  }
};

onMounted(fetchMessages);
</script>

<style scoped>
/* ============================
   SECONDARY TICKER STYLE
============================ */
.sec-ticker-wrapper {
  width: 100%;
  padding: 6px 0;
  background: linear-gradient(90deg, #ff8a00, #e52e71);
  overflow: hidden;
  box-sizing: border-box;
}

.sec-ticker-viewport {
  overflow: hidden;
  position: relative;
}

.sec-ticker-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 32px;
  animation: sec-ticker var(--sec-ticker-duration, 22s) linear infinite;
}

.sec-ticker-item {
  display: inline-flex;
  align-items: center;
  padding: 3px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
}

.sec-ticker-item::before {
  content: "★";
  margin-right: 6px;
  font-size: 11px;
}

/* Animation */
@keyframes sec-ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Error */
.sec-ticker-error {
  width: 100%;
  padding: 4px 10px;
  font-size: 11px;
  color: #fff;
  background: #d32f2f;
}

@media (max-width: 768px) {
  .sec-ticker-wrapper {
    padding: 4px 0;
  }

  .sec-ticker-item {
    font-size: 12px;
    padding: 2px 10px;
  }
}
</style>
