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
    <!-- GRID: Left big + right 2 small -->
    <div
      class="banner-grid"
      v-if="mainBanners.length || sideTopCurrent || sideBottomCurrent"
    >
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

            <!-- Main CTA -->
            <div v-if="mainBanners[current]?.button_text" class="cta">
              <!-- External -->
              <a
                v-if="mainBanners[current]?.button_link?.startsWith('http')"
                class="cta-btn"
                :href="mainBanners[current]?.button_link"
                target="_blank"
                rel="noopener"
              >
                {{ mainBanners[current]?.button_text }}
              </a>

              <!-- Internal -->
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

        <!-- Dots -->
        <div class="dots" v-if="isDesktop && mainBanners.length > 1">
          <button
            v-for="(b, i) in mainBanners"
            :key="b.id ?? i"
            class="dot"
            :class="{ active: i === current }"
            @click="go(i)"
          />
        </div>

        <!-- Arrows -->
        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow left"
          @click="prev"
        >
          ‹
        </button>

        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow right"
          @click="next"
        >
          ›
        </button>
      </div>

      <!-- ========== RIGHT: 2 SMALL SLIDERS ========== -->
      <div class="side-banners" v-if="isDesktop">
        <!-- TOP small (slot = side_top) -->
        <div class="side-item" v-if="sideTopCurrent">
          <component
            :is="
              sideTopCurrent.button_link
                ? sideTopCurrent.button_link.startsWith('http')
                  ? 'a'
                  : 'router-link'
                : 'div'
            "
            class="side-link"
            :href="
              sideTopCurrent.button_link?.startsWith('http')
                ? sideTopCurrent.button_link
                : undefined
            "
            :to="
              !sideTopCurrent.button_link ||
              sideTopCurrent.button_link.startsWith('http')
                ? undefined
                : sideTopCurrent.button_link
            "
            target="_blank"
            rel="noopener"
          >
            <img
              :src="sideTopCurrent.image_url"
              :alt="sideTopCurrent.title || 'Banner'"
              class="img-side"
              loading="lazy"
            />
            <div
              v-if="sideTopCurrent.button_text"
              class="side-cta"
            >
              {{ sideTopCurrent.button_text }}
            </div>
          </component>
        </div>

        <!-- BOTTOM small (slot = side_bottom) -->
        <div class="side-item" v-if="sideBottomCurrent">
          <component
            :is="
              sideBottomCurrent.button_link
                ? sideBottomCurrent.button_link.startsWith('http')
                  ? 'a'
                  : 'router-link'
                : 'div'
            "
            class="side-link"
            :href="
              sideBottomCurrent.button_link?.startsWith('http')
                ? sideBottomCurrent.button_link
                : undefined
            "
            :to="
              !sideBottomCurrent.button_link ||
              sideBottomCurrent.button_link.startsWith('http')
                ? undefined
                : sideBottomCurrent.button_link
            "
            target="_blank"
            rel="noopener"
          >
            <img
              :src="sideBottomCurrent.image_url"
              :alt="sideBottomCurrent.title || 'Banner'"
              class="img-side"
              loading="lazy"
            />
            <div
              v-if="sideBottomCurrent.button_text"
              class="side-cta"
            >
              {{ sideBottomCurrent.button_text }}
            </div>
          </component>
        </div>
      </div>
    </div>

    <!-- Empty state -->
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

const current = ref(0); // main
const sideTopIndex = ref(0);
const sideBottomIndex = ref(0);

const timer = ref(null);
const isDesktop = ref(false);
const sliderRef = ref(null);

// ---- Filtered lists by slot ----
const mainBanners = computed(() =>
  banners.value.filter((b) => b.slot === "main")
);
const sideTopList = computed(() =>
  banners.value.filter((b) => b.slot === "side_top")
);
const sideBottomList = computed(() =>
  banners.value.filter((b) => b.slot === "side_bottom")
);

// Current items for each side
const sideTopCurrent = computed(() => {
  if (!sideTopList.value.length) return null;
  return sideTopList.value[sideTopIndex.value % sideTopList.value.length];
});
const sideBottomCurrent = computed(() => {
  if (!sideBottomList.value.length) return null;
  return sideBottomList.value[
    sideBottomIndex.value % sideBottomList.value.length
  ];
});

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
  if (mainBanners.value.length) {
    current.value = (current.value + 1) % mainBanners.value.length;
    softPreload(current.value + 1);
  }
  if (sideTopList.value.length > 1) {
    sideTopIndex.value =
      (sideTopIndex.value + 1) % sideTopList.value.length;
  }
  if (sideBottomList.value.length > 1) {
    sideBottomIndex.value =
      (sideBottomIndex.value + 1) % sideBottomList.value.length;
  }
}

function prev() {
  if (mainBanners.value.length) {
    current.value =
      (current.value - 1 + mainBanners.value.length) %
      mainBanners.value.length;
    softPreload(current.value - 1);
  }
  if (sideTopList.value.length > 1) {
    sideTopIndex.value =
      (sideTopIndex.value - 1 + sideTopList.value.length) %
      sideTopList.value.length;
  }
  if (sideBottomList.value.length > 1) {
    sideBottomIndex.value =
      (sideBottomIndex.value - 1 + sideBottomList.value.length) %
      sideBottomList.value.length;
  }
}

function go(i) {
  if (!mainBanners.value.length) return;
  current.value = i;
  softPreload(i + 1);
}

function start() {
  stop();
  // jodi kono ekta place e multiple banner thake tahole auto slide
  if (
    mainBanners.value.length > 1 ||
    sideTopList.value.length > 1 ||
    sideBottomList.value.length > 1
  ) {
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
  width: 100%;
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
  position: relative;
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

/* side CTA label */
.side-cta {
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
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
