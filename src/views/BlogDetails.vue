<template>
  <div class="max-w-3xl mx-auto p-6" v-if="blog">
    <img :src="blog.image_url" class="w-full rounded-xl mb-6" />
    <h1 class="text-3xl font-bold mb-4">{{ blog.title }}</h1>
    <p class="leading-7 whitespace-pre-line">{{ blog.content }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const blog = ref(null);
const route = useRoute();

onMounted(async () => {
  const res = await axios.get(`/api/blogs/${route.params.id}`);
  blog.value = res.data;
});
</script>
