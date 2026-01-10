<template>
  <section class="blog-details">
    <!-- ===== Loading ===== -->
    <div v-if="loading" class="state loading">
      Loading blog...
    </div>

    <!-- ===== Error ===== -->
    <div v-else-if="error" class="state error">
      {{ error }}
    </div>

    <!-- ===== Blog Content ===== -->
    <article v-else-if="blog" class="container">
      <img
        :src="blog.image_url"
        :alt="blog.title"
        class="cover"
      />

      <h1 class="title">{{ blog.title }}</h1>

      <p class="date">
        {{ formatDate(blog.created_at) }}
      </p>

      <div class="content">
        {{ blog.content }}
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const blog = ref(null);
const loading = ref(false);
const error = ref("");

// ✅ SAME API_BASE logic everywhere
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const fetchBlog = async () => {
  try {
    loading.value = true;
    error.value = "";

    const res = await axios.get(
      `${API_BASE}/api/blogs/${route.params.id}`
    );

    blog.value = res.data;
  } catch (err) {
    console.error("❌ Fetch blog details error:", err);
    error.value = "Blog not found or failed to load.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchBlog);
</script>

<style scoped>
/* ===== Page ===== */
.blog-details {
  padding: 32px 16px;
}

/* ===== States ===== */
.state {
  text-align: center;
  padding: 60px 20px;
  font-size: 1rem;
  color: #6b7280;
}
.state.error {
  color: #dc2626;
}

/* ===== Container ===== */
.container {
  max-width: 760px;
  margin: 0 auto;
}

/* ===== Image ===== */
.cover {
  width: 100%;
  height: auto;
  border-radius: 18px;
  margin-bottom: 28px;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.15);
}

/* ===== Title ===== */
.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 10px;
}

/* ===== Date ===== */
.date {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 28px;
}

/* ===== Content ===== */
.content {
  font-size: 1.05rem;
  line-height: 1.85;
  color: #374151;
  white-space: pre-line;
}

/* ===== Mobile ===== */
@media (max-width: 640px) {
  .title {
    font-size: 1.7rem;
  }

  .content {
    font-size: 1rem;
  }

  .cover {
    border-radius: 14px;
  }
}
</style>
