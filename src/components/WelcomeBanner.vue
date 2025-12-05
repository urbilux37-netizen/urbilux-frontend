<template>
  <div
    class="banner-slider"
    ref="sliderRef"
    @mouseenter="pauseAll"
    @mouseleave="resumeAll"
    tabindex="0"
  >
    <div
      class="banner-grid"
      v-if="mainCurrent || sideTopCurrent || sideBottomCurrent"
    >
      <!-- ========== LEFT: MAIN ========== -->
      <div class="main-banner" v-if="mainCurrent">
        <transition name="fade" mode="out-in">
          <div class="slide" :key="mainKey">
            <img
              :src="mainCurrent.image_url"
              :alt="mainCurrent.title || 'Banner'"
              class="img-main"
              loading="eager"
            />

            <!-- CTA only if text exists -->
            <div v-if="mainCurrent.button_text" class="cta">
              <!-- external -->
              <a
                v-if="isExternal(mainCurrent.button_link)"
                class="cta-btn"
                :href="mainCurrent.button_link"
                target="_blank"
                rel="noopener"
              >
                {{ mainCurrent.button_text }}
              </a>
              <!-- internal -->
              <router-link
                v-else
                class="cta-btn"
                :to="mainCurrent.button_link || '#'"
              >
                {{ mainCurrent.button_text }}
              </router-link>
            </div>
          </div>
        </transition>

        <!-- dots (desktop) -->
        <div class="dots" v-if="isDesktop && mainList.length > 1">
          <button
            v-for="(b, i) in mainList"
            :key="b.id ?? i"
            class="dot"
            :class="{ active: i === mainIndex }"
            @click="mainGo(i)"
          />
        </div>

        <!-- arrows (desktop) -->
        <button
          v-if="isDesktop && mainList.length > 1"
          class="arrow left"
          @click="mainPrev"
        >
          ‹
        </button>
        <button
          v-if="isDesktop && mainList.length > 1"
          class="arrow right"
          @click="mainNext"
        >
          ›
        </button>
      </div>

      <!-- ========== RIGHT: TWO SMALL ========== -->
      <div class="side-banners">
        <!-- TOP -->
        <div class="side-item" v-if="sideTopCurrent">
          <div class="side-inner">
            <transition name="fade" mode="out-in">
              <component
                :key="sideTopKey"
                :is="linkTag(sideTopCurrent.button_link)"
                class="side-link"
                :href="hrefValue(sideTopCurrent.button_link)"
                :to="toValue(sideTopCurrent.button_link)"
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
            </transition>

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

        <!-- BOTTOM -->
        <div class="side-item" v-if="sideBottomCurrent">
          <div class="side-inner">
            <transition name="fade" mode="out-in">
              <component
                :key="sideBottomKey"
                :is="linkTag(sideBottomCurrent.button_link)"
                class="side-link"
                :href="hrefValue(sideBottomCurrent.button_link)"
                :to="toValue(sideBottomCurrent.button_link)"
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

/* ----- helpers for links ----- */
const isExternal = (link) =>
  !!link && /^https?:\/\//i.test(link);

const linkTag = (link) => {
  if (!link) return "div";
  return isExternal(link) ? "a" : "router-link";
};
const hrefValue = (link) => (isExternal(link) ? link : undefined);
const toValue = (link) =>
  link && !isExternal(link) ? link : undefined;

/* ----- slot lists ----- */
const mainList = computed(() =>
  banners.value.filter((b) => b.slot === "main")
);
const sideTopList = computed(() =>
  banners.value.filter((b) => b.slot === "side_top")
);
const sideBottomList = computed(() =>
  banners.value.filter((b) => b.slot === "side_bottom")
);

/* ----- current banner per slot ----- */
const mainCurrent = computed(() =>
  mainList.value.length
    ? mainList.value[mainIndex.value % mainList.value.length]
    : null
);
const sideTopCurrent = computed(() =>
  sideTopList.value.length
    ? sideTopList.value[sideTopIndex.value % sideTopList.value.length]
    : null
);
const sideBottomCurrent = computed(() =>
  sideBottomList.value.length
    ? sideBottomList.value[sideBottomIndex.value % sideBottomList.value.length]
    : null
);

/* ----- keys for transition ----- */
const mainKey = computed(
  () => (mainCurrent.value?.id ?? mainIndex.value) + ":main"
);
const sideTopKey = computed(
  () => (sideTopCurrent.value?.id ?? sideTopIndex.value) + ":top"
);
const sideBottomKey = computed(
  () => (sideBottomCurrent.value?.id ?? sideBottomIndex.value) + ":bottom"
);

/* ----- API ----- */
async function fetchBanners() {
  try {
    const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data || [];
  } catch (err) {
    console.error("Banner fetch error:", err);
  }
}

/* ----- main controls ----- */
function mainNext() {
  if (!mainList.value.length) return;
  mainIndex.value = (mainIndex.value + 1) % mainList.value.length;
}
function mainPrev() {
  if (!mainList.value.length) return;
  mainIndex.value =
    (mainIndex.value - 1 + mainList.value.length) % mainList.value.length;
}
function mainGo(i) {
  if (!mainList.value.length) return;
  mainIndex.value = i;
}
function startMainTimer() {
  clearMainTimer();
  if (mainList.value.length > 1) {
    mainTimer.value = setInterval(mainNext, 5000);
  }
}
function clearMainTimer() {
  if (mainTimer.value) clearInterval(mainTimer.value);
  mainTimer.value = null;
}

/* ----- side top controls ----- */
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

/* ----- side bottom controls ----- */
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

/* ----- pause/resume ----- */
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

/* ----- responsive / touch ----- */
function updateDesktopFlag() {
  isDesktop.value = window.matchMedia("(min-width: 1024px)").matches;
}

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

/* ===================== DESKTOP (>=1024px) ===================== */
.banner-grid {
  display: grid;
  grid-template-columns: 2.1fr 1fr;
  gap: 16px;
  align-items: stretch;
}

/* MAIN */
.main-banner {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}

/* fixed ratio using padding hack */
.main-banner::before {
  content: "";
  display: block;
  padding-top: 42%; /* ~1600x700 ratio */
}

.slide {
  position: absolute;
  inset: 0;
}

.img-main {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* main CTA */
.cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 24px;
  pointer-events: none;
  z-index: 10;
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

/* main dots & arrows */
.dots {
  position: absolute;
  bottom: 18px;
  right: 22px;
  display: flex;
  gap: 6px;
  z-index: 6;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  border: 1px solid #ffffff;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.dot.active {
  background: #f97316;
}
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
  z-index: 6;
}
.arrow.left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.arrow.right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* SIDE (desktop: 2 ta top/bottom) */
.side-banners {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.side-item {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff;
}
.side-item::before {
  content: "";
  display: block;
  padding-top: 48%;
}
.side-inner {
  position: absolute;
  inset: 0;
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

/* side CTA */
.side-cta {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 14px;
  padding: 6px 14px;
  border-radius: 999px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 8px 18px rgba(67, 56, 202, 0.4);
  z-index: 10;
}

/* side dots / arrows */
.side-dots {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
  z-index: 7;
}
.side-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
}
.side-dot.active {
  background: #f97316;
}
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
  z-index: 7;
}
.side-left {
  left: 0;
  border-radius: 0 6px 6px 0;
}
.side-right {
  right: 0;
  border-radius: 6px 0 0 6px;
}

/* fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===================== MOBILE / TABLET (<1024px) ===================== */
@media (max-width: 1023px) {
  /* main + side ek column e niche niche */
  .banner-grid {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* main banner full width thakbe */
  .main-banner {
    border-radius: 12px;
  }

  /* side banners: 2 ta pasapasi Startech moto */
  .side-banners {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .side-item {
    border-radius: 12px;
  }

  .side-item::before {
    padding-top: 60%; /* choto square-ish size */
  }

  /* mobile-e arrow/dots off (swipe + auto slide) */
  .arrow,
  .side-arrow,
  .dots,
  .side-dots {
    display: none;
  }
}
</style>
