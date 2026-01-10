<template>
  <section class="complaint">
    <h1>Submit a Complaint</h1>

    <form @submit.prevent="submitComplaint" class="card">
      <input v-model.trim="form.customer_name" placeholder="Your Name *" />
      <input v-model.trim="form.phone" placeholder="Phone Number *" />
      <textarea
        v-model.trim="form.message"
        placeholder="Write your complaint *"
      ></textarea>

      <!-- Image -->
      <input type="file" accept="image/*" @change="onFileChange" />

      <div v-if="preview" class="preview">
        <img :src="preview" />
      </div>

      <button :disabled="loading">
        {{ loading ? "Submitting..." : "Submit Complaint" }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://urbilux-backend.onrender.com";

const form = ref({
  customer_name: "",
  phone: "",
  message: "",
  image_url: "",
});

const preview = ref(null);
const loading = ref(false);

async function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  preview.value = URL.createObjectURL(file);

  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE}/products/upload`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json();
  form.value.image_url = data.image_url;
}

async function submitComplaint() {
  if (!form.value.customer_name || !form.value.phone || !form.value.message) {
    return alert("Please fill all required fields");
  }

  try {
    loading.value = true;

    await axios.post(`${API_BASE}/api/complaints`, form.value);

    alert("Complaint submitted successfully");
    form.value = { customer_name: "", phone: "", message: "", image_url: "" };
    preview.value = null;
  } catch {
    alert("Failed to submit complaint");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.complaint {
  max-width: 600px;
  margin: 60px auto;
  padding: 20px;
}
.card {
  background: #fff;
  padding: 24px;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}
input, textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
textarea {
  min-height: 120px;
}
button {
  width: 100%;
  background: #6d28d9;
  color: #fff;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
}
.preview img {
  width: 100%;
  margin-top: 12px;
  border-radius: 10px;
}
</style>
