import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

import HomeView from '../views/HomeView.vue'
import CategoryView from '@/views/CategoryView.vue'
import AdminPanel from './../views/AdminPanel.vue'
import CheckoutPage from './../views/Checkout.vue'
import OrdersPage from './../components/Orders.vue'
import LoginPage from './../views/Login.vue'
import SignupPage from '../views/Signup.vue'
import AccountPage from '@/views/Account.vue'
import ProductPage from "../views/product.vue"; // Product.vue এর page
import HotDeal from "../views/HotDeal.vue"; // Product.vue এর page
import TopProducts from "../views/TopProducts.vue";
import AllProducts from "../views/AllProducts.vue";
import Categories from '../views/categories.vue'
import SearchPage from '../views/SearchPage.vue'

const routes = [
  {
    path: '/search',
    name: 'SearchPage',
    component: () => import('../views/SearchPage.vue'),
  },
  {
    path: "/terms-conditions",
    name: "TermsConditions",
    component: () => import("@/views/terms-conditions.vue"),
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,
  },
  {
    path: "/about-us",
    name: "AboutUs",
    component: () => import("@/views/about-us.vue"),
  },
  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: () => import("@/views/privacy-policy.vue"),
  },
  {
    path: "/blog",
    name: "Blog",
    component: () => import("@/views/blog.vue"),
  },
  {
    path: "/comingsoon",
    name: "ComingSoon",
    component: () => import("@/views/comingsoon.vue"),
  },
  {
    path: "/return-refund-policy",
    name: "ReturnRefundPolicy",
    component: () => import("@/views/return-refund-policy.vue"),
  },
  {
    path: "/delivery-policy",
    name: "DeliveryPolicy",
    component: () => import("../views/delivery-policy.vue"),
  },
  {
    path: "/top-products",
    name: "TopProducts",
    component: TopProducts,
  },
  {
    path: "/all-products",
    name: "AllProducts",
    component: AllProducts,
  },
  { path: '/hot-deal', name: 'HotDeal', component: HotDeal }, // ✅ new route
  { path: "/products", component: ProductPage }, // <-- এখানে add করলাম
  { path: "/product/:id", component: ProductPage }, // single product detail
  {
    path: '/account',
    name: 'Account',
    component: AccountPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: CategoryView,
    props: true
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutPage
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrdersPage
  },

  // ✅ Admin route এখন protected
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAdmin: true },
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
  path: '/access-denied',
  name: 'AccessDenied',
  component: () => import('@/views/AccessDenied.vue'),
},

  {
    path: '/signup',
    name: 'Signup',
    component: SignupPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/* ============================================================
   ✅ Router Guard — শুধুমাত্র admin allowed
============================================================ */
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    try {
      // 🔹 Backend থেকে current user তথ্য যাচাই (Render backend)
      const res = await axios.get(
        "https://avado-backend.onrender.com/api/auth/current-user",
        { withCredentials: true }
      );

      const user = res.data.user;

      // ✅ যদি admin হয় → access allow
      if (user && user.role === "admin") {
        console.log("✅ Admin verified:", user.email);
        next();
      }
      // 🚫 যদি user বা guest হয় → access denied page এ redirect
      else {
        console.warn("🚫 Non-admin tried to access admin panel!");
        next("/access-denied");
      }
    } catch (err) {
      console.error("❌ Auth check failed:", err.message);
      next("/access-denied"); // token invalid হলে এখানেও redirect
    }
  }
  // সাধারণ রুটগুলোর জন্য normal access
  else {
    next();
  }
});

export default router
