<template>
  <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="blog in blogs"
      :key="blog.id"
      class="blog-card"
      @click="goBlog(blog.id)"
    >
      <img :src="blog.image_url" />
      <h3>{{ blog.title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const blogs = ref([]);
const router = useRouter();

const goBlog = (id) => {
  router.push(`/blog/${id}`);
};

onMounted(async () => {
  const res = await axios.get("/api/blogs");
  blogs.value = res.data;
});
</script>

<style>
.blog-card {
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}
.blog-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.blog-card h3 {
  padding: 12px;
  font-weight: 600;
}
</style>
