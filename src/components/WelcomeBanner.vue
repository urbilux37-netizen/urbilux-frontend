<template>
  <div
    class="banner-slider"
    ref="sliderRef"
    @mouseenter="pause"
    @mouseleave="resume"
    @keydown.left.prevent="prev"
    @keydown.right.prevent="next"
    tabindex="0"
  >
    <!-- 🟣 GRID: Left big slider + right 2 small -->
    <div class="banner-grid" v-if="mainBanners.length || sideTop || sideBottom">
      <!-- ========== LEFT: MAIN SLIDER (slot = main) ========== -->
      <div class="main-banner" v-if="mainBanners.length">
        <transition name="fade" mode="out-in">
          <div class="slide" :key="currentKey">
            <img
              :src="mainBanners[current]?.image_url"
              :alt="mainBanners[current]?.title || 'Banner'"
              class="img-main"
              loading="eager"
              @load="onLoaded"
            />

            <!-- ✅ Smart CTA on main banner -->
            <div v-if="mainBanners[current]?.button_text" class="cta">
              <!-- 🌐 External link -->
              <a
                v-if="mainBanners[current]?.button_link?.startsWith('http')"
                class="cta-btn"
                :href="mainBanners[current]?.button_link"
                target="_blank"
                rel="noopener"
              >
                {{ mainBanners[current]?.button_text }}
              </a>

              <!-- 🔗 Internal route -->
              <router-link
                v-else
                class="cta-btn"
                :to="mainBanners[current]?.button_link || '#'"
              >
                {{ mainBanners[current]?.button_text }}
              </router-link>
            </div>
          </div>
        </transition>

        <!-- ⚪ Dots (only on desktop, bottom of main banner) -->
        <div class="dots" v-if="isDesktop && mainBanners.length > 1">
          <button
            v-for="(b, i) in mainBanners"
            :key="b.id ?? i"
            class="dot"
            :class="{ active: i === current }"
            @click="go(i)"
            :aria-label="`Go to slide ${i + 1}`"
          />
        </div>

        <!-- ⬅️➡️ Arrows -->
        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow left"
          @click="prev"
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow right"
          @click="next"
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <!-- ========== RIGHT: 2 SMALL BANNERS (slot = side_top / side_bottom) ========== -->
      <div class="side-banners" v-if="isDesktop">
        <!-- TOP small banner -->
        <div class="side-item" v-if="sideTop">
          <component
            :is="sideTop.button_link ? (sideTop.button_link.startsWith('http') ? 'a' : 'router-link') : 'div'"
            class="side-link"
            :href="sideTop.button_link?.startsWith('http') ? sideTop.button_link : undefined"
            :to="!sideTop.button_link || sideTop.button_link.startsWith('http') ? undefined : sideTop.button_link"
            target="_blank"
            rel="noopener"
          >
            <img
              :src="sideTop.image_url"
              :alt="sideTop.title || 'Banner'"
              class="img-side"
              loading="lazy"
            />
          </component>
        </div>

        <!-- BOTTOM small banner -->
        <div class="side-item" v-if="sideBottom">
          <component
            :is="sideBottom.button_link ? (sideBottom.button_link.startsWith('http') ? 'a' : 'router-link') : 'div'"
            class="side-link"
            :href="sideBottom.button_link?.startsWith('http') ? sideBottom.button_link : undefined"
            :to="!sideBottom.button_link || sideBottom.button_link.startsWith('http') ? undefined : sideBottom.button_link"
            target="_blank"
            rel="noopener"
          >
            <img
              :src="sideBottom.image_url"
              :alt="sideBottom.title || 'Banner'"
              class="img-side"
              loading="lazy"
            />
          </component>
        </div>
      </div>
    </div>

    <!-- 🟣 Empty state -->
    <div v-else class="banner-loading"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const banners = ref([]);
const current = ref(0);
const timer = ref(null);
const isDesktop = ref(false);
const sliderRef = ref(null);

// 🔹 Main big slider banners (slot = main)
const mainBanners = computed(() =>
  banners.value.filter((b) => b.slot === "main")
);

// 🔹 Right top + bottom (single each)
const sideTop = computed(
  () => banners.value.find((b) => b.slot === "side_top") || null
);
const sideBottom = computed(
  () => banners.value.find((b) => b.slot === "side_bottom") || null
);

const currentKey = computed(
  () =>
    (mainBanners.value[current.value]?.id ?? current.value) + ":" + current.value
);

async function fetchBanners() {
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data;
  } catch (e) {
    console.error("Banner load error:", e);
  }
}

function next() {
  if (!mainBanners.value.length) return;
  current.value = (current.value + 1) % mainBanners.value.length;
  softPreload(current.value + 1);
}
function prev() {
  if (!mainBanners.value.length) return;
  current.value =
    (current.value - 1 + mainBanners.value.length) % mainBanners.value.length;
  softPreload(current.value - 1);
}
function go(i) {
  if (!mainBanners.value.length) return;
  current.value = i;
  softPreload(i + 1);
}

function start() {
  stop();
  if (mainBanners.value.length > 1) {
    timer.value = setInterval(next, 4500);
  }
}
function stop() {
  if (timer.value) clearInterval(timer.value);
  timer.value = null;
}
function pause() {
  stop();
}
function resume() {
  start();
}

function softPreload(idx) {
  if (!mainBanners.value.length) return;
  const nextIndex = (idx + mainBanners.value.length) % mainBanners.value.length;
  const url = mainBanners.value[nextIndex]?.image_url;
  if (url) {
    const img = new Image();
    img.src = url;
  }
}

function onLoaded() {}

let startX = 0;
let touchActive = false;
function onTouchStart(e) {
  touchActive = true;
  startX = e.touches[0].clientX;
}
function onTouchEnd(e) {
  if (!touchActive) return;
  const dx = e.changedTouches[0].clientX - startX;
  if (dx > 50) prev();
  else if (dx < -50) next();
  touchActive = false;
}
function updateDesktopFlag() {
  isDesktop.value = window.matchMedia("(min-width: 1024px)").matches;
}

onMounted(async () => {
  updateDesktopFlag();
  window.addEventListener("resize", updateDesktopFlag);
  await fetchBanners();
  start();

  const el = sliderRef.value;
  if (el) {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
  }
});
onUnmounted(() => {
  stop();
  window.removeEventListener("resize", updateDesktopFlag);
  const el = sliderRef.value;
  if (el) {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchend", onTouchEnd);
  }
});
</script>

<style scoped>
.banner-slider {
  width: 80%;
  margin: 0 auto;
}

/* 2-column grid: big left, 2 small right */
.banner-grid {
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 16px;
  align-items: stretch;
}

/* LEFT MAIN */
.main-banner {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f3f3;
}

.slide {
  width: 100%;
  height: 100%;
}

.img-main {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

/* CTA on main banner */
.cta {
  position: absolute;
  bottom: 18px;
  left: 18px;
}
.cta-btn {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 999px;
  background: #ff6b00;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
}

/* Dots */
.dots {
  position: absolute;
  bottom: 18px;
  right: 22px;
  display: flex;
  gap: 6px;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid #fff;
  background: rgba(0, 0, 0, 0.15);
}
.dot.active {
  background: #ff6b00;
}

/* Arrows */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(0, 0, 0, 0.25);
  color: #fff;
  width: 28px;
  height: 48px;
  cursor: pointer;
}
.arrow.left {
  left: 0;
  border-radius: 0 4px 4px 0;
}
.arrow.right {
  right: 0;
  border-radius: 4px 0 0 4px;
}

/* RIGHT COLUMN 2 SMALL */
.side-banners {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-item {
  flex: 1;
  border-radius: 10px;
  overflow: hidden;
  background: #f3f3f3;
}

.side-link {
  display: block;
  width: 100%;
  height: 100%;
}

.img-side {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Mobile / tablet: শুধু main banner দেখাও */
@media (max-width: 1023px) {
  .banner-grid {
    grid-template-columns: 1fr;
  }
  .side-banners {
    display: none;
  }
}
</style>
