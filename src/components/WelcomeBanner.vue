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
    <!-- Slides -->
    <div class="slides">
      <transition name="fade" mode="out-in">
        <div class="slide" :key="currentKey">
          <img
            :src="banners[current]?.image_url || placeholder"
            :alt="banners[current]?.title || 'Banner'"
            class="img"
            loading="eager"
            @load="onLoaded"
          />
          <!-- Optional CTA -->
          <div
            v-if="banners[current]?.button_text"
            class="cta"
          >
            <router-link
              class="cta-btn"
              :to="banners[current]?.button_link || '#'"
            >
              {{ banners[current]?.button_text }}
            </router-link>
          </div>
        </div>
      </transition>
    </div>

    <!-- Dots (PC top overlay; mobile bottom) -->
    <div class="dots" :class="{ top: isDesktop }">
      <button
        v-for="(b, i) in banners"
        :key="b.id ?? i"
        class="dot"
        :class="{ active: i === current }"
        @click="go(i)"
        :aria-label="`Go to slide ${i+1}`"
      />
    </div>

    <!-- Arrows (show on hover on desktop) -->
    <button
      v-if="isDesktop && banners.length > 1"
      class="arrow left"
      @click="prev"
      aria-label="Previous"
    >‹</button>

    <button
      v-if="isDesktop && banners.length > 1"
      class="arrow right"
      @click="next"
      aria-label="Next"
    >›</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com";

const banners = ref([]);
const current = ref(0);
const timer = ref(null);
const isDesktop = ref(false);
const sliderRef = ref(null);
const placeholder =
  "https://dummyimage.com/1600x600/eeeeee/222222.jpg&text=Urbilux+Banner";

const currentKey = computed(() => (banners.value[current.value]?.id ?? current.value) + ":" + current.value);

async function fetchBanners() {
  try {
const res = await axios.get(`${API_BASE}/api/banners`);
    banners.value = res.data;
    // if no banners, keep placeholder flow
  } catch (e) {
    console.error("Banner load error:", e);
  }
}

function next() {
  if (!banners.value.length) return;
  current.value = (current.value + 1) % banners.value.length;
  softPreload(current.value + 1);
}
function prev() {
  if (!banners.value.length) return;
  current.value = (current.value - 1 + banners.value.length) % banners.value.length;
  softPreload(current.value - 1);
}
function go(i) {
  if (!banners.value.length) return;
  current.value = i;
  softPreload(i + 1);
}

// autoplay
function start() {
  stop();
  timer.value = setInterval(next, 4500);
}
function stop() {
  if (timer.value) clearInterval(timer.value);
  timer.value = null;
}
function pause() { stop(); }
function resume() { start(); }

// image preloading (soft)
function softPreload(idx) {
  if (!banners.value.length) return;
  const nextIndex = (idx + banners.value.length) % banners.value.length;
  const url = banners.value[nextIndex]?.image_url;
  if (url) {
    const img = new Image();
    img.src = url;
  }
}
// accessibility focus show arrows
function onLoaded() {
  // no-op hook for now
}

// swipe (mobile)
let startX = 0;
let touchActive = false;
function onTouchStart(e) {
  touchActive = true;
  startX = e.touches[0].clientX;
}
function onTouchMove(e) {
  if (!touchActive) return;
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
  if (banners.value.length > 1) start();

  // swipe listeners on container only
  const el = sliderRef.value;
  if (el) {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
  }
});

onUnmounted(() => {
  stop();
  window.removeEventListener("resize", updateDesktopFlag);
  const el = sliderRef.value;
  if (el) {
    el.removeEventListener("touchstart", onTouchStart);
    el.removeEventListener("touchmove", onTouchMove);
    el.removeEventListener("touchend", onTouchEnd);
  }
});
</script>

<style scoped>
/* Container */
.banner-slider {
  position: relative;
  width: 100%;
  height: 46vw;           /* responsive height */
  max-height: 520px;      /* desktop cap */
  min-height: 180px;      /* mobile floor */
  border-radius: 16px;
  overflow: hidden;
  outline: none;
  box-shadow: 0 14px 35px rgba(0,0,0,.12);
  background: #f8f8fb;
}
@media (min-width: 1024px) {
  .banner-slider { height: 400px; }
}

/* Slides */
.slides, .slide {
  position: absolute; inset: 0;
}
.img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
}

/* CTA Button */
.cta {
  position: absolute;
  left: 50%; transform: translateX(-50%);
  bottom: 10%;
}
@media (max-width: 480px) {
  .cta { bottom: 8%; }
}
.cta-btn {
  text-decoration: none;
  padding: 12px 28px;
  font-weight: 800;
  border-radius: 999px;
  background: linear-gradient(90deg, #4A00E0, #8E2DE2);
  color: #fff;
  box-shadow: 0 12px 24px rgba(142,45,226,.25);
}

/* Dots */
.dots {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 12px;
  display: flex; gap: 10px;
}
.dots.top { top: 14px; bottom: auto; }
.dot {
  width: 12px; height: 12px; border-radius: 999px;
  background: rgba(255,255,255,.75);
  border: 2px solid rgba(0,0,0,.12);
  box-shadow: 0 2px 6px rgba(0,0,0,.12);
  cursor: pointer;
  transition: transform .15s, opacity .15s, background .15s;
  opacity: .7;
}
.dot.active {
  background: #fff;
  opacity: 1;
  transform: scale(1.08);
  border-color: transparent;
}

/* Arrows (desktop hover) */
.arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px; border-radius: 999px;
  background: rgba(255,255,255,.78);
  border: none; font-size: 26px; font-weight: 700;
  display: none; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(0,0,0,.18);
}
.arrow.left { left: 12px; }
.arrow.right { right: 12px; }
@media (hover: hover) and (pointer: fine) {
  .banner-slider:hover .arrow { display: inline-flex; }
}

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity .55s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
