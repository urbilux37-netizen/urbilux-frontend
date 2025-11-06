<template>
  <div class="about-page">
    <!-- Navbar -->
    <Navbar />

    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-inner">
        <h1>About AVADO</h1>
        <p>Discover who we are, our mission, vision, and what drives us forward.</p>
      </div>
    </header>

    <!-- Main content -->
    <main class="container">
      <article class="card">
        <!-- About Us -->
        <section class="section">
          <h2>আমাদের সম্পর্কে</h2>
          <p>
            AVADO হলো একটি আধুনিক অনলাইন ই-কমার্স স্টোর যা আপনাকে প্রতিদিনের প্রয়োজনীয় পণ্য ও প্রযুক্তি সরঞ্জাম সরাসরি আপনার দোরগোড়ায় পৌঁছে দেয়। আমরা বিশ্বাস করি মান, স্বচ্ছতা ও দ্রুত ডেলিভারির মাধ্যমে গ্রাহক সন্তুষ্টিই আমাদের সবচেয়ে বড় অগ্রাধিকার। আমাদের লক্ষ্য হলো বাংলাদেশের প্রতিটি ঘরে নিরাপদ, সহজ এবং সময়োপযোগী অনলাইন শপিং অভিজ্ঞতা পৌঁছে দেওয়া।
          </p>
        </section>

        <!-- Vision -->
        <section class="section">
          <h2>Vision / ভিশন</h2>
          <p>
            AVADO এর ভিশন হলো একটি বিশ্বস্ত, নির্ভরযোগ্য এবং আধুনিক অনলাইন শপিং প্ল্যাটফর্ম হিসেবে উদ্ভাবন ও সেবা প্রদানের মাধ্যমে গ্রাহকের জীবনকে সহজ করা। আমরা চাই আমাদের গ্রাহকরা প্রতিদিন AVADO থেকে কেনাকাটা করতে আত্মবিশ্বাসী হোক।
          </p>
        </section>

        <!-- Mission -->
        <section class="section">
          <h2>Mission / মিশন</h2>
          <ul>
            <li>উচ্চমানের পণ্য সরবরাহ করা প্রতিযোগিতামূলক দামে।</li>
            <li>গ্রাহককে দ্রুত ও নির্ভরযোগ্য ডেলিভারি নিশ্চিত করা।</li>
            <li>স্বচ্ছতা ও সততার মাধ্যমে দীর্ঘমেয়াদী সম্পর্ক তৈরি করা।</li>
            <li>নতুন প্রযুক্তি ও সমাধান প্রয়োগ করে অনলাইন শপিং অভিজ্ঞতা উন্নত করা।</li>
          </ul>
        </section>

        <!-- Values -->
        <section class="section">
          <h2>Our Values / আমাদের মান</h2>
          <ul>
            <li><strong>Customer First:</strong> গ্রাহকের সন্তুষ্টিই আমাদের মূল মাপকাঠি।</li>
            <li><strong>Integrity:</strong> ব্যবসায় স্বচ্ছতা ও সততা আমাদের নীতি।</li>
            <li><strong>Innovation:</strong> নতুন প্রযুক্তি ও সমাধানের মাধ্যমে উন্নতি করা।</li>
            <li><strong>Quality:</strong> পণ্যের মান ও সেবার মান সর্বোচ্চ রাখা।</li>
            <li><strong>Reliability:</strong> নির্ভরযোগ্যতা আমাদের প্রতিশ্রুতি।</li>
          </ul>
        </section>

        <footer class="small-note">
          <p>AVADO © {{ new Date().getFullYear() }}. সকল অধিকার সংরক্ষিত।</p>
        </footer>
      </article>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f7f9fb;
  color: #222;
  font-family: "Noto Sans", "Poppins", sans-serif;
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #4A00E0, #8E2DE2);
  color: #fff;
  padding: 64px 20px;
  text-align: center;
}
.hero h1 {
  font-size: 34px;
  margin-bottom: 12px;
  font-weight: 700;
}
.hero p {
  font-size: 16px;
  opacity: 0.9;
}

/* Container */
.container {
  max-width: 1100px;
  margin: -40px auto 60px;
  padding: 0 20px;
  width: 100%;
}

/* Card */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  box-shadow: 0 8px 30px rgba(12, 24, 64, 0.06);
  line-height: 1.8;
}

/* Sections */
.section + .section {
  margin-top: 20px;
}
.section h2 {
  font-size: 18px;
  color: #4A00E0;
  margin-bottom: 10px;
  font-weight: 700;
}
.section p {
  color: #444;
  font-size: 15px;
  text-align: justify;
}
.section ul {
  margin-left: 18px;
  color: #444;
  font-size: 15px;
  list-style: disc;
}

/* Small footer note */
.small-note {
  text-align: center;
  margin-top: 20px;
  color: #777;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 44px 16px;
  }
  .hero h1 {
    font-size: 26px;
  }
  .card {
    padding: 20px;
  }
}
</style>
