<template>
  <div class="blog-page">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <section class="hero">
      <h1>AVADO Blog</h1>
      <p>আপডেট, টিপস, ও প্রযুক্তি বিষয়ক সর্বশেষ খবর জানুন AVADO থেকে 💜</p>
    </section>

    <!-- Blog Grid -->
    <section class="blog-grid">
      <div
        v-for="(post, index) in blogPosts"
        :key="index"
        class="blog-card"
        @click="goToPost(post)"
      >
        <img :src="post.image" alt="blog image" class="blog-img" />
        <div class="blog-content">
          <h2>{{ post.title }}</h2>
          <p>{{ post.excerpt }}</p>
          <span class="read-more">Read More →</span>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const blogPosts = [
  {
    title: "২০২৫ সালে টেকনোলজির নতুন ধারা",
    excerpt:
      "AI, IoT ও স্মার্ট হোম গ্যাজেটস কিভাবে বদলে দিচ্ছে আমাদের জীবনধারা, জানুন বিস্তারিত...",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
  },
  {
    title: "AVADO Store: কেন আমাদের থেকে কেনাকাটা করবেন?",
    excerpt:
      "বিশ্বস্ত ডেলিভারি, মানসম্মত পণ্য ও অসাধারণ কাস্টমার সার্ভিস — AVADO সবসময় পাশে।",
    image: "https://images.unsplash.com/photo-1607082349566-187342175e2b?w=800",
  },
  {
    title: "আপনার প্রথম গেমিং সেটআপ তৈরির টিপস 🎮",
    excerpt:
      "বাজেট অনুযায়ী সেরা গেমিং মনিটর, কীবোর্ড, এবং চেয়ারের সাজেশন জানুন এখানে...",
    image: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d1?w=800",
  },
];

const goToPost = (post) => {
  // ভবিষ্যতে ডাইনামিক পেজে রিডাইরেক্ট করতে পারবে
  alert(`Opening post: ${post.title}`);
};
</script>

<style scoped>
.blog-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f9fb;
  font-family: "Poppins", sans-serif;
  color: #333;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #4A00E0, #8E2DE2);
  color: white;
  text-align: center;
  padding: 80px 20px;
}
.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}
.hero p {
  font-size: 1.2rem;
  opacity: 0.9;
}

/* Blog Grid */
.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 25px;
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.blog-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.blog-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.blog-content {
  padding: 20px;
}
.blog-content h2 {
  font-size: 1.4rem;
  color: #4A00E0;
  margin-bottom: 10px;
}
.blog-content p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 15px;
}
.read-more {
  font-size: 0.9rem;
  color: #8E2DE2;
  font-weight: 600;
}
.read-more:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 600px) {
  .hero h1 {
    font-size: 2.2rem;
  }
  .blog-grid {
    padding: 40px 20px;
  }
}
</style>
