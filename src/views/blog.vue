<template>
  <section class="blog-page">
    <!-- ===== Header ===== -->
    <div class="header">
      <h1 class="title">Urbilux Blog</h1>
      <p class="subtitle">
        Latest news, updates & insights from Urbilux
      </p>
    </div>

    <!-- ===== Loading ===== -->
    <div v-if="loading" class="loading">
      Loading blogs...
    </div>

    <!-- ===== Empty ===== -->
    <div v-else-if="!blogs.length" class="empty">
      No blogs published yet.
    </div>

    <!-- ===== Blog Grid ===== -->
    <div v-else class="grid">
      <article
        v-for="blog in blogs"
        :key="blog.id"
        class="blog-card"
        @click="goBlog(blog.id)"
      >
        <div class="image-wrap">
          <img :src="blog.image_url" :alt="blog.title" />
        </div>

        <div class="content">
          <h3 class="blog-title">{{ blog.title }}</h3>
          <span class="date">
            {{ formatDate(blog.created_at) }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const blogs = ref([]);
const loading = ref(false);

// ✅ SAME logic as Banner Manager
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const goBlog = (id) => {
  router.push(`/blog/${id}`);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchBlogs = async () => {
  try {
    loading.value = true;
    const res = await axios.get(`${API_BASE}/api/blogs`);
    blogs.value = res.data || [];
  } catch (err) {
    console.error("❌ Fetch blogs error:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBlogs);
</script>

<style scoped>
/* ===== Page ===== */
.blog-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
}

/* ===== Header ===== */
.header {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 50px;
}
.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
}
.subtitle {
  margin-top: 8px;
  color: #6b7280;
  font-size: 1rem;
}

/* ===== States ===== */
.loading,
.empty {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

/* ===== Grid ===== */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

/* ===== Card ===== */
.blog-card {
  cursor: pointer;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
}

/* ===== Image ===== */
.image-wrap {
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.4s ease;
}
.blog-card:hover img {
  transform: scale(1.06);
}

/* ===== Content ===== */
.content {
  padding: 16px 18px 20px;
}
.blog-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
  margin-bottom: 8px;
}
.date {
  font-size: 0.85rem;
  color: #6b7280;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.8rem;
  }

  .image-wrap {
    height: 180px;
  }
}
</style>
