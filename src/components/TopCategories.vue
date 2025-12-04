<template>
  <!-- 🟣 Top Categories Section -->
  <section class="categories-section" v-if="categoriesToShow.length">
    <h2 class="section-title">Top Categories</h2>

    <div class="categories-grid">
      <!-- প্রতিটি ক্যাটাগরি কার্ড -->
      <router-link
        v-for="category in categoriesToShow"
        :key="category.id"
        :to="`/category/${category.slug}`"
        class="category-card"
      >
        <div class="image-wrapper">
          <img
            :src="category.image_url || placeholder"
            :alt="category.title || category.slug"
            class="category-image"
          />
        </div>

        <!-- নিচে bold title -->
        <p class="category-title">
          {{ category.title || category.slug }}
        </p>
      </router-link>
    </div>

    <button class="section-link" type="button" @click="router.push('/categories')">
      See All Categories
    </button>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: "",
  },
  // কতগুলো দেখাবে (default: 12)
  showCount: {
    type: Number,
    default: 12,
  },
});

const router = useRouter();

// ✅ সর্বশেষ showCount সংখ্যক ক্যাটাগরি রিভার্স করে দেখাচ্ছি
const categoriesToShow = computed(() =>
  (props.categories || []).slice(-props.showCount).reverse()
);
</script>

<style scoped>
.categories-section {
  margin-top: 40px;
}

.section-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
}

/* 🔳 Responsive Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 18px;
}

/* 🔲 Card Full Clickable */
.category-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 10px 10px 14px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* 🖼 Image */
.image-wrapper {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.category-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

/* 🔤 Title নিচে bold */
.category-title {
  margin-top: 8px;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  color: #222;
}

/* "See All" button style */
.section-link {
  margin-top: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  border: none;
  background: transparent;
  color: #6c40ff;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

/* 📱 Mobile tweaks */
@media (max-width: 768px) {
  .section-title {
    font-size: 20px;
  }

  .categories-grid {
    gap: 12px;
  }

  .category-card {
    border-radius: 12px;
    padding: 8px 8px 12px;
  }

  .category-image {
    height: 100px;
  }

  .category-title {
    font-size: 13px;
  }
}

/* ছোট ফোনে */
@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  .category-image {
    height: 90px;
  }

  .category-title {
    font-size: 12px;
  }
}
</style>
