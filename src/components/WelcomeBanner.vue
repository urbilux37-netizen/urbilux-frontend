<template>
  <div
    class="banner-slider"
    ref="sliderRef"
    @mouseenter="pauseAll"
    @mouseleave="resumeAll"
    @keydown.left.prevent="mainPrev"
    @keydown.right.prevent="mainNext"
    tabindex="0"
  >
    <div
      class="banner-grid"
      v-if="mainBanners.length || sideTopCurrent || sideBottomCurrent"
    >
      <!-- ========== LEFT: MAIN SLIDER (slot = main) ========== -->
      <div class="main-banner" v-if="mainBanners.length">
        <transition name="fade" mode="out-in">
          <div class="slide" :key="mainKey">
            <img
              :src="mainBanners[mainIndex]?.image_url"
              :alt="mainBanners[mainIndex]?.title || 'Banner'"
              class="img-main"
              loading="eager"
              @load="onLoaded"
            />

            <!-- Main CTA (bottom center) -->
            <div v-if="mainCTA" class="cta">
              <!-- External -->
              <a
                v-if="mainBanners[mainIndex]?.button_link?.startsWith('http')"
                class="cta-btn"
                :href="mainBanners[mainIndex]?.button_link"
                target="_blank"
                rel="noopener"
              >
                {{ mainCTA }}
              </a>

              <!-- Internal -->
              <router-link
                v-else
                class="cta-btn"
                :to="mainBanners[mainIndex]?.button_link || '#'"
              >
                {{ mainCTA }}
              </router-link>
            </div>
          </div>
        </transition>

        <!-- Dots for main (PC only) -->
        <div class="dots" v-if="isDesktop && mainBanners.length > 1">
          <button
            v-for="(b, i) in mainBanners"
            :key="b.id ?? i"
            class="dot"
            :class="{ active: i === mainIndex }"
            @click="mainGo(i)"
          />
        </div>

        <!-- Arrows for main (PC only) -->
        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow left"
          @click="mainPrev"
        >
          ‹
        </button>

        <button
          v-if="isDesktop && mainBanners.length > 1"
          class="arrow right"
          @click="mainNext"
        >
          ›
        </button>
      </div>

      <!-- ========== RIGHT: 2 SMALL SLIDERS ========== -->
      <div class="side-banners">
        <!-- TOP small (slot = side_top) -->
        <div class="side-item" v-if="sideTopCurrent">
          <div class="side-inner">
            <transition name="fade" mode="out-in">
              <component
                :key="sideTopKey"
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
                <div v-if="sideTopCTA" class="side-cta">
                  {{ sideTopCTA }}
                </div>
              </component>
            </transition>

            <!-- side top dots & arrows (PC only if multiple) -->
            <div
              class="side-dots"
              v-if="isDesktop && sideTopList.length > 1"
            >
              <button
                v-for="(b, i) in sideTopList"
                :key="b.id ?? i"
                class="side-dot"
                :class="{ active: i === sideTopIndex }"
                @click="sideTopGo(i)"
              />
            </div>

            <button
              v-if="isDesktop && sideTopList.length > 1"
              class="side-arrow side-left"
              @click="sideTopPrev"
            >
              ‹
            </button>
            <button
              v-if="isDesktop && sideTopList.length > 1"
              class="side-arrow side-right"
              @click="sideTopNext"
            >
              ›
            </button>
          </div>
        </div>

        <!-- BOTTOM small (slot = side_bottom) -->
        <div class="side-item" v-if="sideBottomCurrent">
          <div class="side-inner">
            <transition name="fade" mode="out-in">
              <component
                :key="sideBottomKey"
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
                <div v-if="sideBottomCTA" class="side-cta">
                  {{ sideBottomCTA }}
                </div>
              </component>
            </transition>

            <div
              class="side-dots"
              v-if="isDesktop && sideBottomList.length > 1"
            >
              <button
                v-for="(b, i) in sideBottomList"
                :key="b.id ?? i"
                class="side-dot"
                :class="{ active: i === sideBottomIndex }"
                @click="sideBottomGo(i)"
              />
            </div>

            <button
              v-if="isDesktop && sideBottomList.length > 1"
              class="side-arrow side-left"
              @click="sideBottomPrev"
            >
              ‹
            </button>
            <button
              v-if="isDesktop && sideBottomList.length > 1"
              class="side-arrow side-right"
              @click="sideBottomNext"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-else class="banner-loading"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const banners = ref([]);

const mainIndex = ref(0);
const sideTopIndex = ref(0);
const sideBottomIndex = ref(0);

const mainTimer = ref(null);
const sideTopTimer = ref(null);
const sideBottomTimer = ref(null);

const isDesktop = ref(false);
const sliderRef = ref(null);

/* -------------------------
   Filter by slot
-------------------------- */
const mainBanners = computed(() =>
  banners.value.filter((b) => b.slot === "main")
);
const sideTopList = computed(() =>
  banners.value.filter((b) => b.slot === "side_top")
);
const sideBottomList = computed(() =>
  banners.value.filter((b) => b.slot === "side_bottom")
);

const sideTopCurrent = computed(() => {
  if (!sideTopList.value.length) return null;
  return sideTopList.value[sideTopIndex.value % sideTopList.value.length];
});
const sideBottomCurrent = computed(() => {
  if (!sideBottomList.value.length) return null;
  return sideBottomList.value[sideBottomIndex.value % sideBottomList.value.length];
});

/* -------------------------
   CTA text (fallback “Shop Now”)
-------------------------- */
const mainCTA = computed(() => {
  const b = mainBanners.value[mainIndex.value];
  if (!b) return "";
  return b.button_text || (b.button_link ? "Shop Now" : "");
});

const sideTopCTA = computed(() => {
  const b = sideTopCurrent.value;
  if (!b) return "";
  return b.button_text || (b.button_link ? "Shop Now" : "");
});

const sideBottomCTA = computed(() => {
  const b = sideBottomCurrent.value;
  if (!b) return "";
  return b.button_text || (b.button_link ? "Shop Now" : "");
});

/* keys for transitions */
const mainKey = computed(
  () =>
    (mainBanners.value[mainIndex.value]?.id ?? mainIndex.value) +
    ":" +
    mainIndex.value
);
const sideTopKey = computed(
  () =>
    (sideTopCurrent.value?.id ?? sideTopIndex.value) +
    ":top:" +
    sideTopIndex.value
);
const sideBottomKey = computed(
  () =>
    (sideBottomCurrent.value?.id ?? sideBottomIndex.value) +
    ":bot:" +
    sideBottomIndex.value
);

async function fetchBanners() {
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data;
  } catch (e) {
    console.error("Banner load error:", e);
  }
}

/* ==== Main controls ==== */
function mainNext() {
  if (!mainBanners.value.length) return;
  mainIndex.value = (mainIndex.value + 1) % mainBanners.value.length;
}

function mainPrev() {
  if (!mainBanners.value.length) return;
  mainIndex.value =
    (mainIndex.value - 1 + mainBanners.value.length) %
    mainBanners.value.length;
}

function mainGo(i) {
  if (!mainBanners.value.length) return;
  mainIndex.value = i;
}

function startMainTimer() {
  clearMainTimer();
  if (mainBanners.value.length > 1) {
    mainTimer.value = setInterval(mainNext, 5000);
  }
}

function clearMainTimer() {
  if (mainTimer.value) clearInterval(mainTimer.value);
  mainTimer.value = null;
}

/* ==== Side top controls ==== */
function sideTopNext() {
  if (!sideTopList.value.length) return;
  sideTopIndex.value =
    (sideTopIndex.value + 1) % sideTopList.value.length;
}

function sideTopPrev() {
  if (!sideTopList.value.length) return;
  sideTopIndex.value =
    (sideTopIndex.value - 1 + sideTopList.value.length) %
    sideTopList.value.length;
}

function sideTopGo(i) {
  if (!sideTopList.value.length) return;
  sideTopIndex.value = i;
}

function startSideTopTimer() {
  clearSideTopTimer();
  if (sideTopList.value.length > 1) {
    sideTopTimer.value = setInterval(sideTopNext, 6000);
  }
}

function clearSideTopTimer() {
  if (sideTopTimer.value) clearInterval(sideTopTimer.value);
  sideTopTimer.value = null;
}

/* ==== Side bottom controls ==== */
function sideBottomNext() {
  if (!sideBottomList.value.length) return;
  sideBottomIndex.value =
    (sideBottomIndex.value + 1) % sideBottomList.value.length;
}

function sideBottomPrev() {
  if (!sideBottomList.value.length) return;
  sideBottomIndex.value =
    (sideBottomIndex.value - 1 + sideBottomList.value.length) %
    sideBottomList.value.length;
}

function sideBottomGo(i) {
  if (!sideBottomList.value.length) return;
  sideBottomIndex.value = i;
}

function startSideBottomTimer() {
  clearSideBottomTimer();
  if (sideBottomList.value.length > 1) {
    sideBottomTimer.value = setInterval(sideBottomNext, 7000);
  }
}

function clearSideBottomTimer() {
  if (sideBottomTimer.value) clearInterval(sideBottomTimer.value);
  sideBottomTimer.value = null;
}

/* ==== Global pause/resume ==== */
function pauseAll() {
  clearMainTimer();
  clearSideTopTimer();
  clearSideBottomTimer();
}

function resumeAll() {
  startMainTimer();
  startSideTopTimer();
  startSideBottomTimer();
}

/* ==== Others ==== */
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
  if (dx > 50) mainPrev();
  else if (dx < -50) mainNext();
  touchActive = false;
}

function updateDesktopFlag() {
  isDesktop.value = window.matchMedia("(min-width: 1024px)").matches;
}

onMounted(async () => {
  updateDesktopFlag();
  window.addEventListener("resize", updateDesktopFlag);
  await fetchBanners();
  resumeAll();

  const el = sliderRef.value;
  if (el) {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
  }
});

onUnmounted(() => {
  pauseAll();
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

/* GRID: big left, 2 small right */
.banner-grid {
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 16px;
  align-items: stretch;
}

/* LEFT MAIN */
.main-banner {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}

.slide {
  width: 100%;
  height: 100%;
}

/* 🔁 No crop/zoom – full image dekhao */
.img-main {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
  background: #ffffff;
}

/* ⭐ Main center CTA – nicher dike, upar e layer e */
.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 26px;
  pointer-events: none;
  z-index: 10; /* important */
}

.cta-btn {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  text-decoration: none;
  box-shadow: 0 10px 25px rgba(67, 56, 202, 0.45);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(67, 56, 202, 0.6);
  opacity: 0.96;
}

/* Dots for main */
.dots {
  position: absolute;
  bottom: 18px;
  right: 22px;
  display: flex;
  gap: 6px;
  z-index: 5;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid #ffffff;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.dot.active {
  background: #f97316;
}

/* Arrows for main */
.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(15, 23, 42, 0.35);
  color: #fff;
  width: 30px;
  height: 52px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}
.arrow.left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.arrow.right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* RIGHT COLUMN 2 SMALL */
.side-banners {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.side-item {
  flex: 1;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
  position: relative;
}

.side-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.side-link {
  display: block;
  width: 100%;
  height: 100%;
}

/* 🔁 No crop/zoom for side */
.img-side {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #ffffff;
  display: block;
}

/* ⭐ Side CTA – purple chip, bottom center */
.side-cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 8px 18px rgba(67, 56, 202, 0.4);
  z-index: 10; /* 🔥 bottom-er button ekdom upore */
}

/* side dots */
.side-dots {
  position: absolute;
  bottom: 8px;
  right: 10px;
  display: flex;
  gap: 4px;
  z-index: 6;
}
.side-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1px solid #e5e7eb;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.side-dot.active {
  background: #f97316;
}

/* side arrows */
.side-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: rgba(15, 23, 42, 0.4);
  color: #ffffff;
  width: 24px;
  height: 40px;
  cursor: pointer;
  font-size: 14px;
  z-index: 6;
}
.side-left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.side-right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile / tablet */
@media (max-width: 1023px) {
  .banner-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  /* main top, side নিচে side-by-side */
  .side-banners {
    flex-direction: row;
    gap: 10px;
    margin-top: 4px;
  }

  .side-item {
    height: 150px;
  }

  /* phone e arrow/dots নাই */
  .arrow,
  .side-arrow,
  .dots,
  .side-dots {
    display: none;
  }

  .cta {
    bottom: 18px;
  }
}

/* Extra small phones <=480px */
@media (max-width: 480px) {
  .side-item {
    height: 140px;
  }
}
</style>
