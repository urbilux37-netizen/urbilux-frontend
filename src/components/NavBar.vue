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

    <!-- 🔹 NAVBAR (White) -->
    <header :class="['navbar', { scrolled: isScrolled }]">
      <div class="nav-inner">
        <!-- ✅ Brand (left) -->
        <div class="brand" @click="goHome">
          <!-- Keep your logo image optionally -->
<img src="@/assets/logo.png" alt="URBILUX Logo" class="brand-logo" />
          <h3 class="brand-text">URBILUX</h3>

        </div>

        <!-- ✅ Search (center, desktop only) -->
        <div class="search-box pc-only">
          <i class="search-icon">🔍</i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search products..."
            @focus="showSuggestions = true"
            @input="fetchSuggestions"
            @keydown.enter="goToSearchPage"
          />
          <button class="search-btn" @click="goToSearchPage">Search</button>

          <!-- Suggestions -->
          <ul v-if="showSuggestions && suggestions.length" class="suggestion-list">
            <li
              v-for="(product, index) in suggestions"
              :key="index"
              @click="goToProduct(product.id)"
            >
              <img :src="product.image_url" alt="" />
              <span>{{ product.name }}</span>
            </li>
          </ul>
        </div>

        <!-- ✅ Right Menu (desktop) -->
        <nav class="pc-only">
          <ul class="right-menu">
            <li class="menu-link" @click="goHotDeals">Offers</li>
            <li class="menu-link" @click="goOrders">Orders</li>

            <!-- Cart text with badge (kept drawer logic) -->
            <li class="menu-link cart-link" @click="toggleCart">
              Cart
              <span v-if="itemCount > 0" :class="['cart-badge', { bounce: animateCart }]">
                {{ itemCount }}
              </span>
            </li>

            <!-- Account / Sign up -->
            <li class="menu-account" @click="goAccount" v-if="currentUser">
              <img :src="userIcon" class="acc-icon" />
              <small class="acc-name">
                {{ currentUser.email || currentUser.phone }}
              </small>
            </li>
            <li v-else>
              <button class="signup-btn" @click="goAccount">Sign Up</button>
            </li>
          </ul>
        </nav>

        <!-- ✅ Mobile Search Icon -->
        <button class="mobile-search-btn mobile-only" @click="toggleMobileSearch" aria-label="Search">
          🔍
        </button>
      </div>
    </header>

    <!-- 🔍 Mobile Search Overlay (unchanged logic) -->
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

      <ul v-if="showSuggestions && suggestions.length" class="mobile-suggestion-list">
        <li v-for="(product, index) in suggestions" :key="index" @click="goToProduct(product.id)">
          <img :src="product.image_url" alt="product" />
          <span>{{ product.name }}</span>
        </li>
      </ul>
    </div>

    <!-- 📱 Mobile Bottom Bar (white with purple icons/text) -->
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
          <span v-if="itemCount > 0" :class="['cart-badge-mobile', { bounce: animateCart }]">
            {{ itemCount }}
          </span>
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
    : "https://urbilux-backend.onrender.com/api";

axios.defaults.withCredentials = true;
console.log("🔗 Using API base URL:", axios.defaults.baseURL);

const currentUser = ref(null);
const cartOpen = ref(false);
const mobileSearchOpen = ref(false);
const searchQuery = ref("");
const suggestions = ref([]);
const showSuggestions = ref(false);
const isScrolled = ref(false);
const animateCart = ref(false);

// ✅ User
const getUser = async () => {
  try {
    const res = await axios.get("/auth/current-user");
    currentUser.value = res.data.user;
  } catch {
    currentUser.value = null;
  }
};
onMounted(getUser);

// ✅ Search suggestions
const fetchSuggestions = async () => {
  const query = searchQuery.value.trim();
  if (!query) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }
  showSuggestions.value = true;
  try {
    const base =
      window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : "https://urbilux-backend.onrender.com";
    const res = await axios.get(`${base}/products/search?q=${encodeURIComponent(query)}`);
    suggestions.value = res.data || [];
  } catch (err) {
    console.error("❌ Search failed:", err);
  }
};

// ✅ Navigation
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

// ✅ Account (same logic)
const goAccount = () => {
  if (currentUser.value) router.push("/account");
  else router.push("/login");
};

// ✅ Cart
const toggleCart = () => (cartOpen.value = !cartOpen.value);

// ✅ Mobile search toggle
const toggleMobileSearch = () => {
  mobileSearchOpen.value = !mobileSearchOpen.value;
  if (mobileSearchOpen.value) {
    showSuggestions.value = true;
    document.body.style.overflow = "hidden";
  } else {
    showSuggestions.value = false;
    suggestions.value = [];
    document.body.style.overflow = "auto";
  }
};

// ✅ Scroll shadow
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};
onMounted(() => window.addEventListener("scroll", handleScroll));
onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "auto";
});

// ✅ Cart badge anim
watch(itemCount, () => {
  animateCart.value = true;
  setTimeout(() => (animateCart.value = false), 400);
});
</script>

<style scoped>
:root {
  --purple: #8e2de2;           /* bright purple */
  --purple-light: #b38dff;     /* soft tint */
  --text-dark: #121212;
  --text-muted: #555;
  --brand-font: "Zalando Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
}

/* ---------- Desktop / Common ---------- */
.pc-only { display: flex; }
.mobile-only { display: none; }

.navbar {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 72px;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; transition: box-shadow .25s ease;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.navbar.scrolled {
  box-shadow: 0 10px 25px rgba(142, 45, 226, 0.10);
}
.nav-inner {
  width: 100%; padding: 0 10%;
  display: flex; justify-content: space-between; align-items: center;
  box-sizing: border-box;
}

/* ---------- Brand ---------- */
.brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.brand-logo { width: 36px; height: 36px; border-radius: 9px; object-fit: contain; }
.brand-text {
  font-size: 28px; letter-spacing: .6px; font-weight: 800;
  color: #7a00ff;
  font-family: var(--brand-font);
}

/* ---------- Search (center) ---------- */
.search-box {
  position: relative; width: 40%;
  background: #fff;
  border-radius: 999px;
  border: 2px solid rgba(142, 45, 226, 0.25);                /* crisp border */
  box-shadow:
    0 2px 10px rgba(142, 45, 226, 0.10),                     /* soft outer */
    inset 0 0 0 1px rgba(255,255,255,0.9);                   /* clean edge */
  padding: 6px 10px 6px 14px;
  display: flex; align-items: center; gap: 8px;
}
.search-box:focus-within {
  border-color: rgba(142, 45, 226, 0.50);
  box-shadow:
    0 6px 22px rgba(142, 45, 226, 0.18),
    inset 0 0 0 1px rgba(255,255,255,1);
}
.search-icon { font-size: 16px; opacity: .7; }
.search-box input {
  border: none; flex: 1; padding: 8px 6px; font-size: 14px; outline: none;
  background: transparent; color: var(--text-dark); font-family: var(--brand-font);
}
.search-btn {
  background: var(--purple);
  color: #fff; border: none; border-radius: 999px;
  padding: 8px 14px; font-size: 13px; cursor: pointer; font-weight: 600;
}
.suggestion-list {
  position: absolute; top: 50px; left: 0; width: 100%;
  background: #fff; border-radius: 14px;
  box-shadow: 0 14px 40px rgba(0,0,0,.15);
  max-height: 260px; overflow-y: auto; z-index: 1001;
  border: 1px solid rgba(0,0,0,0.06);
}
.suggestion-list li {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; cursor: pointer;
}
.suggestion-list li:hover { background: rgba(142, 45, 226, 0.06); }
.suggestion-list img {
  width: 36px; height: 36px; border-radius: 8px; object-fit: cover;
}

/* ---------- Right menu (text only) ---------- */
.right-menu {
  display: flex; align-items: center; gap: 26px;
  list-style: none; margin: 0; padding: 0;
  font-family: var(--brand-font);
}
.menu-link {
  color: #000; font-size: 17px; font-weight: 600; cursor: pointer;
}
.menu-link:hover { color: var(--purple); }

.cart-link { position: relative; padding-right: 18px; }
.cart-badge {
  position: absolute; top: -8px; right: 0;
  background: #ff3b3b; color: #fff; font-size: 11px;
  border-radius: 999px; padding: 2px 6px;
}
.cart-badge.bounce { transform: scale(1.15); transition: transform .25s; }

/* Account display (logged-in) */
.menu-account { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.acc-icon { width: 28px; height: 28px; }
.acc-name { display: block; color: var(--text-muted); font-size: 12px; }

/* Sign up pill (when logged out) */
.signup-btn {
  background: linear-gradient(90deg, #7a00ff, #b38dff); /* bright purple gradient */
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(122, 0, 255, 0.25);
}
.signup-btn:hover {
  box-shadow: 0 8px 22px rgba(122, 0, 255, 0.35);
  transform: translateY(-1px);
  transition: 0.2s ease;
}

/* ---------- Mobile bottom bar ---------- */
.mobile-bottom-bar { display: none; }

/* ---------- Responsive ---------- */
@media (max-width: 768px) {
  .pc-only { display: none; }
  .mobile-only { display: flex; }

  .nav-inner { padding: 0 16px; }
  .brand-text { font-size: 18px; }
  .brand-logo { width: 30px; height: 30px; }
  .mobile-search-btn {
    border: none; background: none; font-size: 22px; color: var(--purple); cursor: pointer;
  }

  /* Keep content clear of bottom bar */
  body { padding-bottom: 65px !important; }

  .mobile-bottom-bar {
    position: fixed; bottom: 0; left: 0; width: 100%;
    background: #fff; border-top: 1px solid rgba(0,0,0,.08);
    display: flex; justify-content: center; z-index: 1200;
  }
  .mobile-bottom-bar ul {
    display: flex; justify-content: space-between; align-items: center;
    list-style: none; width: 100%; max-width: 460px;
    padding: 8px 18px; margin: 0;
  }
  .mobile-bottom-bar li {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    font-size: 12px; flex: 1; position: relative; text-align: center; color: var(--purple);
  }
  .mobile-bottom-bar li img {
    width: 24px; height: 24px; margin-bottom: 3px;
    filter: invert(26%) sepia(94%) saturate(1566%) hue-rotate(257deg) brightness(96%) contrast(94%); /* purple tint */
  }
  .mobile-bottom-bar .cart-item { position: relative; }
  .mobile-bottom-bar .cart-badge-mobile {
    position: absolute; right: 8px; top: -6px;
    background: #ff3b3b; color: #fff; border-radius: 999px; padding: 2px 6px; font-size: 10px;
  }

  /* ✅ Mobile search overlay */
  .mobile-search {
    position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(6px); z-index: 2000; padding: 20px;
    padding-bottom: 80px; overscroll-behavior: contain; overflow-y: auto;
  }
  .search-input {
    background: #fff; border-radius: 999px; padding: 10px 14px;
    display: flex; align-items: center;
    border: 2px solid rgba(142, 45, 226, 0.35);
    box-shadow: 0 10px 22px rgba(142,45,226,.18);
  }
  .search-input input {
    border: none; flex: 1; font-size: 16px; outline: none; background: transparent;
  }
  .close { font-size: 22px; color: var(--purple); margin-left: 8px; cursor: pointer; }

  /* ✅ Mobile suggestions pinned under input */
  .mobile-suggestion-list {
    position: fixed; top: 110px; left: 0; width: 100%;
    background: #fff; border-radius: 14px 14px 0 0; margin-top: 0; padding: 10px 0;
    box-shadow: 0 -2px 20px rgba(0,0,0,.25); max-height: 55vh; overflow-y: auto;
    z-index: 4000; -webkit-overflow-scrolling: touch; transition: all .3s ease;
  }
  .mobile-suggestion-list li {
    display: flex; align-items: center; padding: 10px 14px; gap: 10px;
    border-bottom: 1px solid #eee; cursor: pointer;
  }
  .mobile-suggestion-list li:hover { background: rgba(142,45,226,.08); }
  .mobile-suggestion-list img { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
  .mobile-suggestion-list span { font-size: 15px; color: #222; font-family: var(--brand-font); }
}
</style>
