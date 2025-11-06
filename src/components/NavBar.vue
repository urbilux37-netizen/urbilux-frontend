<template>
  <div class="nav">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Alice&family=Zalando+Sans:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet"
      />
    </head>

    <!-- 🔹 NAVBAR -->
    <header :class="['navbar', { scrolled: isScrolled }]">
      <div class="nav-inner">
        <!-- ✅ Logo -->
        <div class="logo" @click="goHome">
          <img src="@/assets/logo.png" alt="AVADO" />
          <h3>AVADO</h3>
        </div>

        <!-- ✅ Search Box (Desktop Only) -->
        <div class="search-box pc-only">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            @focus="showSuggestions = true"
            @input="fetchSuggestions"
            @keydown.enter="goToSearchPage"
          />
          <button class="search-btn" @click="goToSearchPage">🔍</button>

          <ul
            v-if="showSuggestions && suggestions.length"
            class="suggestion-list"
          >
            <li
              v-for="(product, index) in suggestions"
              :key="index"
              @click="goToProduct(product.id)"
            >
              <img :src="product.image_url" />
              <span>{{ product.name }}</span>
            </li>
          </ul>
        </div>

        <!-- ✅ Desktop Nav Icons -->
        <nav class="pc-only">
          <ul class="nav-items">
            <li @click="goHotDeals">
              <img :src="giftIcon" /><span>Offer</span>
            </li>
            <li @click="goOrders">
              <img :src="bagIcon" /><span>Orders</span>
            </li>

            <li @click="toggleCart" class="cart-item">
              <img :src="cartIcon" /><span>Cart</span>
              <span
                v-if="itemCount > 0"
                :class="['cart-badge', { bounce: animateCart }]"
                >{{ itemCount }}</span
              >
            </li>

            <li @click="goAccount">
              <img :src="userIcon" />
              <span>{{
                currentUser
                  ? currentUser.email || currentUser.phone
                  : "Account"
              }}</span>
            </li>
          </ul>
        </nav>

        <!-- ✅ Mobile Search Icon -->
        <button class="mobile-search-btn mobile-only" @click="toggleMobileSearch">
          🔍
        </button>
      </div>
    </header>

    <!-- 🔍 Mobile Search Overlay -->
    <div v-if="mobileSearchOpen" class="mobile-search">
      <div class="search-input">
        <input
          v-model="searchQuery"
          placeholder="Search products..."
          @input="fetchSuggestions"
          @keydown.enter="goToSearchPage"
        />
        <i class="fas fa-times close" @click="toggleMobileSearch"></i>
      </div>

     <ul
  v-if="showSuggestions && suggestions.length"
  class="mobile-suggestion-list"
>
  <li
    v-for="(product, index) in suggestions"
    :key="index"
    @click="goToProduct(product.id)"
  >
    <img :src="product.image_url" alt="product" />
    <span>{{ product.name }}</span>
  </li>
</ul>

    </div>

    <!-- 📱 Mobile Bottom Bar -->
    <nav class="mobile-bottom-bar">
      <ul>
        <li @click="goHome">
          <img :src="homeIcon" /><span>Home</span>
        </li>
        <li @click="goHotDeals">
          <img :src="giftIcon" /><span>Offer</span>
        </li>
        <li @click="goOrders">
          <img :src="bagIcon" /><span>Orders</span>
        </li>
        <li @click="toggleCart" class="cart-item">
          <img :src="cartIcon" /><span>Cart</span>
          <span
            v-if="itemCount > 0"
            :class="['cart-badge-mobile', { bounce: animateCart }]"
            >{{ itemCount }}</span
          >
        </li>
        <li @click="goAccount">
          <img :src="userIcon" /><span>Account</span>
        </li>
      </ul>
    </nav>

    <!-- 🛒 Cart Drawer -->
    <CartDrawer v-if="cartOpen" @close="toggleCart" />
  </div>
</template>
<script setup>
import homeIcon from "@/assets/icons/icons8-home-50.png";
import giftIcon from "@/assets/icons/gift.svg";
import bagIcon from "@/assets/icons/shopping-bag.svg";
import cartIcon from "@/assets/icons/shopping-cart.svg";
import userIcon from "@/assets/icons/circle-user-round.svg";
import CartDrawer from "../components/cart.vue";
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useCartStore } from "../stores/cart";
import { storeToRefs } from "pinia";
import axios from "axios";

const router = useRouter();
const cartStore = useCartStore();
const { itemCount } = storeToRefs(cartStore);

// ✅ Auto-detect API base (local + production)
axios.defaults.baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://avado-backend.onrender.com/api";

axios.defaults.withCredentials = true; // ✅ Cookie পাঠানোর জন্য

console.log("🔗 Using API base URL:", axios.defaults.baseURL);

const currentUser = ref(null);
const cartOpen = ref(false);
const mobileSearchOpen = ref(false);
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const isScrolled = ref(false);
const animateCart = ref(false);

// ✅ Corrected getUser (no extra /api)
const getUser = async () => {
  try {
    const res = await axios.get("/auth/current-user"); // ✅ fixed
    currentUser.value = res.data.user;
  } catch {
    currentUser.value = null;
  }
};
onMounted(getUser);

// ✅ Search products (use full backend base without /api)
const fetchSuggestions = async () => {
  const query = searchQuery.value.trim();

  if (!query) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  showSuggestions.value = true; // ✅ type শুরু হতেই visible রাখবো

  try {
    const base =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://avado-backend.onrender.com";
    const res = await axios.get(
      `${base}/products/search?q=${encodeURIComponent(query)}`
    );

    suggestions.value = res.data || [];
  } catch (err) {
    console.error("❌ Search failed:", err);
  }
};


// ✅ Navigation Functions
const goToProduct = (id) => {
  showSuggestions.value = false;
  mobileSearchOpen.value = false;
  router.push(`/product/${id}`);
};

const goToSearchPage = () => {
  const query = searchQuery.value.trim();
  if (!query) return;
  router.push({ path: "/search", query: { q: query } });
  showSuggestions.value = false;
  mobileSearchOpen.value = false;
};

const goHome = () => router.push("/");
const goOrders = () => router.push("/orders");
const goHotDeals = () => router.push("/hot-deal");

// ✅ Account redirect logic (fix)
const goAccount = () => {
  if (currentUser.value) router.push("/account");
  else router.push("/login");
};

const toggleCart = () => (cartOpen.value = !cartOpen.value);
// ✅ Mobile search toggle with suggestion handling
const toggleMobileSearch = () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;

  if (mobileSearchOpen.value) {
    // যখন mobile search খুলবে, suggestion visible করবো
    showSuggestions.value = true;
    document.body.style.overflow = "hidden"; // background scroll বন্ধ
  } else {
    // বন্ধ করলে সব clear
    showSuggestions.value = false;
    suggestions.value = [];
    document.body.style.overflow = "auto"; // scroll আবার চালু
  }
};

// ✅ Scroll detection for navbar background
const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;
};

// ✅ Mount / Unmount events
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "auto"; // fallback cleanup
});

// ✅ Cart badge bounce animation
watch(itemCount, () => {
  animateCart.value = true;
  setTimeout(() => (animateCart.value = false), 400);
});

</script>


<style scoped>
:root {
  --purple-dark: #4a00e0;
  --purple-light: #8e2de2;
  --accent-gradient: linear-gradient(90deg, var(--purple-dark), var(--purple-light));
  --shadow: rgba(142, 45, 226, 0.3);
  --font-main: "Zalando Sans", sans-serif;
}

/* ---------- Desktop / Common ---------- */
.pc-only {
  display: flex;
}
.mobile-only {
  display: none;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: 0.3s ease;
}
.nav-inner {
  width: 100%;
  padding: 0 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}
.navbar.scrolled {
  background: rgba(0, 0, 0, 0.95);
  box-shadow: 0 3px 15px var(--shadow);
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.logo img {
  width: 70px;
}
.logo h3 {
  font-size: 30px;
  color: white;
  font-family: "Abril Fatface", serif;
}
.search-box {
  position: relative;
  width: 40%;
  display: flex;
  background: white;
  border-radius: 50px;
  padding: 5px 15px;
}
.search-box input {
  border: none;
  flex: 1;
  padding: 10px;
  font-size: 15px;
  outline: none;
  border-radius: 50px;
  font-family: var(--font-main);
}
.search-btn {
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 50%;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;
}
.suggestion-list {
  position: absolute;
  top: 50px;
  left: 0;
  width: 95%;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1001;
}
.suggestion-list li {
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 10px;
  cursor: pointer;
}
.suggestion-list li:hover {
  background: rgba(142, 45, 226, 0.1);
}
.suggestion-list img {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  object-fit: cover;
}
.nav-items {
  display: flex;
  align-items: center;
  gap: 30px;
  color: white;
  font-size: 14px;
  font-family: var(--font-main);
  font-weight: 500;
}
.nav-items li {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.nav-items li img {
  width: 30px;
  height: 30px;
  filter: brightness(0) invert(1);
  margin-bottom: 3px;
}
.nav-items li:hover {
  color: var(--purple-light);
}
.nav-items li:hover img {
  filter: brightness(0) invert(32%) sepia(84%) saturate(2800%)
    hue-rotate(257deg) brightness(90%) contrast(95%);
}

/* ---------- Cart Badge ---------- */
.cart-item {
  position: relative;
}
.cart-badge,
.cart-badge-mobile {
  position: absolute;
  top: -6px;
  right: -10px;
  background: red;
  color: white;
  font-size: 11px;
  border-radius: 50%;
  padding: 2px 6px;
  z-index: 5;
}
.cart-badge-mobile {
  font-size: 10px;
  top: -5px;
  right: -8px;
}
.cart-badge.bounce,
.cart-badge-mobile.bounce {
  transform: scale(1.2);
  transition: transform 0.25s ease;
}

/* ---------- Mobile Bottom Bar ---------- */
.mobile-bottom-bar {
  display: none;
}

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .pc-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }

  /* Prevent content overlap */
  body {
    padding-bottom: 65px !important;
  }

  /* ✅ Fixed bottom bar */
  .mobile-bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #000;
    border-top: 1px solid rgba(142, 45, 226, 0.4);
    display: flex;
    justify-content: center;
    z-index: 1200;
  }

  .mobile-bottom-bar ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    width: 100%;
    max-width: 420px;
    padding: 8px 20px;
    margin: 0;
  }

  .mobile-bottom-bar li {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    flex: 1;
    position: relative;
    text-align: center;
  }

  .mobile-bottom-bar li img {
    width: 25px;
    height: 25px;
    filter: brightness(0) invert(1);
    margin-bottom: 3px;
  }

  /* ✅ Fix cart badge alignment */
  .mobile-bottom-bar .cart-item {
    position: relative;
  }
  .mobile-bottom-bar .cart-badge-mobile {
    position: absolute;
    right: 12px;
    top: -8px;
    background: red;
    color: #fff;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
  }

  /* ✅ Search overlay */
  .mobile-search {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(6px);
    z-index: 2000;
    padding: 20px;
    padding-bottom: 80px; /* ✅ keyboard overlap fix */
  overscroll-behavior: contain; /* ✅ prevent scroll jump */
    overflow-y: auto;
  }
  .search-input {
    background: white;
    border-radius: 50px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }
  .search-input input {
    border: none;
    flex: 1;
    font-size: 16px;
    outline: none;
  }
  .close {
    font-size: 22px;
    color: var(--purple-dark);
    margin-left: 8px;
    cursor: pointer;
  }

  /* ✅ Mobile suggestions */
/* ✅ Mobile suggestions (Fixed for keyboard view) */
.mobile-suggestion-list {
  position: fixed; /* 🔥 Previously was relative */
  top: 100px; /* input box এর নিচে থেকে শুরু হবে */
  left: 0;
  width: 100%;
  background: #fff;
  border-radius: 14px 14px 0 0;
  margin-top: 0;
  padding: 10px 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.25);
  max-height: 55vh;
  overflow-y: auto;
  z-index: 4000; /* overlay-এর উপরে রাখার জন্য */
  -webkit-overflow-scrolling: touch;
  transition: all 0.3s ease;
}

.mobile-suggestion-list li {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  gap: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}
.mobile-suggestion-list li:hover {
  background: rgba(142, 45, 226, 0.08);
}
.mobile-suggestion-list img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}
.mobile-suggestion-list span {
  font-size: 15px;
  color: #222;
  font-family: var(--font-main);
}

}
</style>
