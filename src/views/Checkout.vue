<template>
  <div>
    <!-- 🟣 Navbar -->
    <Navbar />

    <!-- ================= Main Product Details ================= -->
    <div class="product-page">
      <div class="product-wrapper">
        <div class="product-container">
          <!-- Left: Main Image -->
          <div class="image-container">
            <img :src="displayImage" alt="Product Image" class="main-image" />

            <!-- Thumbnails -->
            <div class="thumbnail-container">
              <!-- main product image -->
              <img
                v-if="product.image_url"
                :src="product.image_url"
                alt="Main"
                class="thumb"
                @click="handleThumbClick(product.image_url)"
              />

              <!-- secondary images -->
              <img
                v-for="(img, idx) in secondaryImages"
                :key="'sec-' + idx"
                :src="img"
                alt="Secondary"
                class="thumb"
                @click="handleThumbClick(img)"
              />

              <!-- variant option images -->
              <template v-for="variant in variants || []" :key="'var-' + variant.id">
                <template v-for="opt in (variant.options || [])" :key="'opt-' + opt.id">
                  <img
                    v-if="opt.option_image_url"
                    :src="opt.option_image_url"
                    alt="Option Image"
                    class="thumb"
                    @click="handleThumbClick(opt.option_image_url)"
                  />
                </template>
              </template>
            </div>
          </div>

          <!-- Right: Details -->
          <div class="details-container">
            <h1 class="product-title">{{ product.name }}</h1>
            <p class="product-description">{{ product.description }}</p>

            <!-- Price with Discount -->
            <p class="price">
              <span v-if="Number(product.discount_percent)">
                <span class="original-price">{{ displayPriceOriginal }}৳</span>
                <span class="discounted-price">{{ displayPriceDiscounted }}৳</span>
              </span>
              <span v-else>
                {{ displayPriceDiscounted }}৳
              </span>
            </p>

            <!-- Variant Selectors -->
            <div
              v-for="variant in variants || []"
              :key="variant.id"
              class="variant-selector"
            >
              <label class="variant-label">{{ variant.name }}</label>
              <select
                v-model="selectedOptions[variant.id]"
                @change="updateDisplay"
                class="variant-select"
              >
                <option value="">-- Select {{ variant.name }} --</option>
                <option
                  v-for="opt in (variant.options || [])"
                  :key="opt.id"
                  :value="opt.id"
                >
                  {{ opt.option_name }}
                  {{ opt.option_price ? `( +${opt.option_price}৳ )` : "" }}
                </option>
              </select>
            </div>

            <!-- Quantity -->
            <div class="quantity-box">
              <label>Quantity:</label>
              <input
                type="number"
                v-model.number="quantity"
                min="1"
                class="quantity-input"
              />
            </div>

            <!-- Buttons -->
            <div class="button-group">
              <button @click="handleAddToCart" class="btn">Add to Cart</button>
              <button @click="handleBuyNow" class="btn">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= Related Products ================= -->
    <div v-if="relatedProducts.length" class="related-products-page">
      <h2 class="section-title">Related Products</h2>
      <div class="related-products-container">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
        />
      </div>
    </div>

    <!-- ================= Footer ================= -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import ProductCard from "@/components/ProductCard.vue";
import { useCart } from "@/composables/useCart";

const router = useRouter();
const route = useRoute();
const { addToCart: addToCartApi } = useCart();

// ✅ API Base
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

// ---------- States ----------
const productId = ref(route.params.id);
const product = ref({});
const variants = ref([]);
const selectedOptions = ref({});
const quantity = ref(1);
const displayImageOverride = ref(null);
const relatedProducts = ref([]);
const allProducts = ref([]);

// ---------- Secondary Images ----------
const secondaryImages = computed(() => {
  const si = product.value.secondary_images;
  if (!si) return [];
  if (Array.isArray(si)) return si;
  try {
    const parsed = JSON.parse(si);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
});

// ---------- Display Image ----------
const displayImage = computed(() => {
  if (displayImageOverride.value) return displayImageOverride.value;

  for (let v of variants.value || []) {
    const optId = selectedOptions.value[v.id];
    if (!optId) continue;
    const opt = (v.options || []).find((o) => String(o.id) === String(optId));
    if (opt?.option_image_url) return opt.option_image_url;
  }

  return product.value.image_url || "/images/no-image.png";
});

// ---------- Price Calculation ----------
const basePrice = computed(() => {
  let price = Number(product.value.price || 0);
  for (let v of variants.value || []) {
    const optId = selectedOptions.value[v.id];
    if (!optId) continue;
    const opt = (v.options || []).find((o) => String(o.id) === String(optId));
    if (opt?.option_price) price += Number(opt.option_price);
  }
  return price;
});

const displayPriceOriginal = computed(() => basePrice.value.toFixed(2));

const displayPriceDiscounted = computed(() => {
  const original = basePrice.value;
  const dp = Number(product.value.discount_percent || 0);
  return dp > 0 ? (original - (original * dp) / 100).toFixed(2) : original.toFixed(2);
});

// ---------- Fetch Product ----------
const fetchProduct = async () => {
  if (!productId.value) return;
  try {
    const { data } = await axios.get(`${API_BASE}/products/${productId.value}`);
    product.value = data || {};
    variants.value = Array.isArray(data?.variants) ? data.variants : [];
    selectedOptions.value = {};

    variants.value.forEach((v) => {
      selectedOptions.value[v.id] = "";
    });

    displayImageOverride.value = null;

    const resAll = await axios.get(`${API_BASE}/products`);
    allProducts.value = resAll.data || [];

    if (product.value.category_slug) {
      relatedProducts.value = allProducts.value
        .filter(
          (p) =>
            p.category_slug === product.value.category_slug &&
            String(p.id) !== String(product.value.id)
        )
        .slice(0, 8);
    } else {
      relatedProducts.value = allProducts.value
        .filter((p) => String(p.id) !== String(product.value.id))
        .slice(0, 8);
    }
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    product.value = {};
    variants.value = [];
    relatedProducts.value = [];
  }
};

// ---------- Update Display ----------
const updateDisplay = () => {
  displayImageOverride.value = null;
};

const handleThumbClick = (img) => {
  displayImageOverride.value = img;
};

// ---------- Cart Handlers ----------
const handleAddToCart = async () => {
  try {
    const payload = {
      product_id: Number(product.value.id),
      quantity: Number(quantity.value),
      final_price: Number(displayPriceDiscounted.value),
      final_image: displayImage.value || product.value.image_url,
      selected_variants: selectedOptions.value,
      variants: variants.value || []
    };

    await addToCartApi(payload);
    alert("✅ Product added to cart successfully!");
  } catch (err) {
    console.error("❌ Add to cart failed:", err);
    alert("Failed to add to cart!");
  }
};

const handleBuyNow = async () => {
  await handleAddToCart();
  router.push("/checkout");
};

// ---------- Lifecycle ----------
onMounted(() => {
  fetchProduct();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(
  () => route.params.id,
  (newId) => {
    productId.value = newId;
    fetchProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
);
</script>

<style scoped>
/* Keep your previous CSS (product page, buttons, thumbnails, etc.) */
.quantity-box {
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.quantity-input {
  width: 60px;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
  text-align: center;
}
.product-page {
  max-width: 80%;
  margin-top: 100px;
  margin-left: 10%;
  margin-right: 10%;
  padding: 20px;
  font-family: "Zalando Sans", sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(74, 0, 224, 0.1);
}
/* Rest of your previous CSS remains the same... */
</style>
