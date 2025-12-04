<template>
  <div class="ticker-wrapper" v-if="messages.length">
    <div class="ticker-label">
      <span class="dot"></span>
      <span>Notice</span>
    </div>

    <div class="ticker-viewport">
      <div class="ticker-track" :style="trackStyle">
        <div
          v-for="(msg, index) in loopedMessages"
          :key="index"
          class="ticker-item"
        >
          {{ msg }}
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="ticker-error">
    {{ error }}
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const props = defineProps({
  speed: {
    type: Number,
    default: 30,
  },
});

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avadotechbackend.onrender.com/api";

const messages = ref([]);
const error = ref("");

const loopedMessages = computed(() => {
  if (!messages.value.length) return [];
  return [...messages.value, ...messages.value];
});

const trackStyle = computed(() => ({
  "--ticker-duration": `${props.speed}s`,
}));

const fetchMessages = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}/tickers`);
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
.ticker-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #ffffff;
  overflow: hidden;
  font-size: 14px;
  box-sizing: border-box;
}

.ticker-label {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  font-weight: 600;
  font-size: 12px;
  white-space: nowrap;
  flex-shrink: 0;
}

.ticker-label .dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #00ff9d;
}

.ticker-viewport {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.ticker-track {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  gap: 40px;
  animation: ticker var(--ticker-duration, 30s) linear infinite;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.15);
  font-weight: 500;
}

.ticker-item::before {
  content: "•";
  margin-right: 8px;
  font-size: 16px;
}

@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.ticker-error {
  width: 100%;
  padding: 8px 16px;
  font-size: 12px;
  color: #ffebee;
  background: #c62828;
}

@media (max-width: 768px) {
  .ticker-wrapper {
    padding: 6px 10px;
    font-size: 12px;
  }

  .ticker-item {
    padding: 3px 10px;
  }

  .ticker-label {
    display: none;
  }
}
</style>
