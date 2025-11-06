<template>
  <div>
    <!-- ================= Navbar ================= -->
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
              <!-- product main image -->
              <img
                v-if="product.image_url"
                :src="product.image_url"
                alt="Main"
                class="thumb"
                @click="handleThumbClick(product.image_url)"
              />

              <!-- product secondary images -->
              <img
                v-for="(img, idx) in secondaryImages"
                :key="'sec-' + idx"
                :src="img"
                alt="Secondary"
                class="thumb"
                @click="handleThumbClick(img)"
              />

              <!-- variant option images -->
              <template v-for="variant in variants" :key="'var-' + variant.id">
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
              v-for="variant in variants"
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
import { useCart } from "@/composables/useCart"; // ✅ Composable for cart

const router = useRouter();
const route = useRoute();
const { addToCart: addToCartApi } = useCart(); // alias নাম দিলাম

// ✅ Auto-detect API Base (Render + Localhost)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://avado-backend.onrender.com";

// ---------- Product States ----------
const productId = ref(route.params.id);
const product = ref({});
const variants = ref([]);
const selectedOptions = ref({});
const quantity = ref(1);
const displayImageOverride = ref(null);
const relatedProducts = ref([]);
const allProducts = ref([]);

// ---------- Safe parse for secondary images ----------
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

  for (let v of variants.value) {
    const optId = selectedOptions.value[v.id];
    if (!optId) continue;
    const opt = (v.options || []).find((o) => String(o.id) === String(optId));
    if (opt?.option_image_url) return opt.option_image_url;
  }

  return product.value.image_url || "/images/no-image.png";
});

// ---------- Price Calculations ----------
const basePrice = computed(() => {
  let price = Number(product.value.price || 0);
  for (let v of variants.value) {
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
  if (dp > 0) {
    const discount = (original * dp) / 100;
    return (original - discount).toFixed(2);
  }
  return original.toFixed(2);
});

// ---------- Fetch Product Data ----------
const fetchProduct = async () => {
  if (!productId.value) return;
  try {
    const { data } = await axios.get(`${API_BASE}/products/${productId.value}`);
    product.value = data || {};
    variants.value = data?.variants || [];

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

// ---------- Update Handlers ----------
const updateDisplay = () => {
  displayImageOverride.value = null;
};

const handleThumbClick = (img) => {
  displayImageOverride.value = img;
};

// ---------- Cart Handlers ----------
const handleAddToCart = async () => {
  try {
    await addToCartApi(Number(product.value.id), Number(quantity.value));
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

  // ✅ সবসময় টপ থেকে পেজ লোড হবে
  window.scrollTo({ top: 0, behavior: "smooth" });
});

watch(
  () => route.params.id,
  (newId) => {
    productId.value = newId;
    fetchProduct();

    // ✅ নতুন প্রোডাক্টে ঢুকলে পেজ আবার টপে যাবে
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
);

</script>


<style scoped>
/* ======== Desktop Design ======== */
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
.product-wrapper {
  margin-left: 10%;
  margin-right: 10%;
}
.product-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}
.image-container {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.main-image {
  width: 100%;
  max-height: 450px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: transform 0.3s ease;
}
.main-image:hover {
  transform: scale(1.02);
}
.thumbnail-container {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.thumb:hover {
  transform: scale(1.1);
}

.details-container {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
}
.product-title {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 10px;
  color: #4a00e0;
}
.product-description {
  font-size: 1em;
  color: #555;
  margin-bottom: 20px;
  line-height: 1.5;
}

.price {
  font-weight: 700;
  font-size: 1.5em;
  margin-bottom: 20px;
}
.original-price {
  text-decoration: line-through;
  color: #888;
  margin-right: 10px;
  font-size: 1.2em;
}
.discounted-price {
  color: #e53935;
  font-weight: 700;
  font-size: 1.5em;
}

.variant-selector {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
}
.variant-label {
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}
.variant-select {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1em;
  outline: none;
  transition: border 0.2s ease;
}
.variant-select:focus {
  border-color: #4a00e0;
}
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}
.btn {
  flex: 1;
  padding: 12px 20px;
  background: linear-gradient(to right, #a100ff, #ff00ff);
  color: #fff;
  font-weight: 700;
  font-size: 1em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}
.btn:hover {
  background: linear-gradient(to right, #8800cc, #cc00cc);
  transform: translateY(-2px);
}

/* ======== Related Products ======== */
.related-products-page {
  max-width: 90%;
  margin: 50px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}
.section-title {
  font-size: 1.8em;
  font-weight: 700;
  color: #4a00e0;
  margin-bottom: 20px;
  text-align: center;
}
.related-products-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-items: center;
}

/* ======== Mobile Design ======== */
@media (max-width: 768px) {
  .product-page {
    margin: 90px 5%;
    padding: 15px;
    border-radius: 16px;
  }
  .product-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .details-container {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    border-radius: 12px;
    box-shadow: 0 0 8px rgba(138, 43, 226, 0.1);
  }
.price {
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 1.2em;
    margin-bottom: 15px;
    word-wrap: break-word;
    text-align: center;
  }
   .original-price {
    text-decoration: line-through;
    color: #888;
    font-size: 1em;
    margin: 0;
  }
  .discounted-price {
    color: #e53935;
    font-weight: 700;
    font-size: 1.3em;
    margin: 0;
  }
  .related-products-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
   .details-container {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
}
</style>
