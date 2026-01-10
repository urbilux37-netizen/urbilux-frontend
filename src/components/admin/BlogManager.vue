<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Blog Manager</h2>

    <form @submit.prevent="createBlog" class="space-y-4 mb-8">
      <input v-model="title" placeholder="Blog Title" class="input" />
      <input v-model="image_url" placeholder="Image URL" class="input" />
      <textarea v-model="content" placeholder="Blog Content" class="input h-40"></textarea>

      <button class="btn">Publish Blog</button>
    </form>

    <div v-if="blogs.length">
      <h3 class="font-semibold mb-2">Existing Blogs</h3>
      <ul>
        <li v-for="b in blogs" :key="b.id">{{ b.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const title = ref("");
const image_url = ref("");
const content = ref("");
const blogs = ref([]);

const fetchBlogs = async () => {
  const res = await axios.get("/api/blogs");
  blogs.value = res.data;
};

const createBlog = async () => {
  await axios.post("/api/blogs", {
    title: title.value,
    image_url: image_url.value,
    content: content.value,
  });

  title.value = image_url.value = content.value = "";
  fetchBlogs();
};

onMounted(fetchBlogs);
</script>

<style>
.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.btn {
  background: #6d28d9;
  color: white;
  padding: 10px 16px;
  border-radius: 6px;
}
</style>
