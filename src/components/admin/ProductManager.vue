
<template>
  <div class="product-manager">
    <h2>Manage Products</h2>

    <!-- ✅ Product Add Form -->
    <form @submit.prevent="addProduct" class="product-form">
      <!-- Basic Info -->
      <div class="form-group">
        <input v-model="product.name" placeholder="Product Name" required />
      </div>
      <div class="form-group">
        <input v-model.number="product.price" type="number" placeholder="Price" required />
      </div>
      <div class="form-group">
        <textarea v-model="product.description" placeholder="Description"></textarea>
      </div>

      <!-- Category dropdown -->
      <div class="form-group">
        <select v-model="product.category_slug" required>
          <option value="">Select Category</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.slug">
            {{ cat.slug }}
          </option>
        </select>
      </div>

      <!-- Primary Image Upload -->
      <div class="form-group">
        <label>Primary Image:</label>
        <input type="file" @change="uploadImage($event, 'image_url')" />
        <span v-if="product.image_url" class="uploaded">Uploaded ✅</span>
      </div>

      <!-- Secondary Image Upload -->
      <div class="form-group">
        <label>Secondary Image:</label>
        <input type="file" @change="uploadImage($event, 'secondary_image_url')" />
        <span v-if="product.secondary_image_url" class="uploaded">Uploaded ✅</span>
      </div>

      <!-- Flags -->
      <div class="form-group checkbox-group">
        <label><input type="checkbox" v-model="product.is_top_product" /> Top Product</label>
        <label><input type="checkbox" v-model="product.is_hot_deal" /> Hot Deal</label>
      </div>

      <!-- Discount -->
      <div class="form-group discount-group">
        <input v-model.number="product.discount_percent" type="number" placeholder="Discount (%)" />
        <input v-model="product.offer_end_date" type="datetime-local" />
      </div>

      <!-- Variants -->
      <div v-for="(variant, vIndex) in variants" :key="vIndex" class="variant-box">
        <h3>{{ variant.level === 1 ? "Primary Variant" : "Secondary Variant" }}</h3>
        <div class="form-group">
          <input v-model="variant.name" placeholder="Variant Name" />
        </div>

        <!-- Variant Options -->
        <div v-for="(option, oIndex) in variant.options" :key="oIndex" class="option-box">
          <div class="form-group">
            <input v-model="option.option_name" placeholder="Option Name" />
            <input v-model.number="option.option_price" type="number" placeholder="Option Price" />
            <input type="file" @change="uploadOptionImage($event, vIndex, oIndex)" />
            <span v-if="option.option_image_url" class="uploaded">Uploaded ✅</span>
          </div>
        </div>

        <button type="button" class="btn-secondary" @click="addOption(vIndex)">
          + Add Option
        </button>
      </div>

      <div class="variant-buttons">
        <button type="button" class="btn-primary" @click="addVariant(1)">+ Add Primary Variant</button>
        <button type="button" class="btn-primary" @click="addVariant(2)">+ Add Secondary Variant</button>
      </div>

      <button type="submit" class="btn-submit">
        {{ editingId ? "Update Product" : "Save Product" }}
      </button>
    </form>

    <!-- ✅ Product List Table -->
    <div class="product-list">
      <h2>All Products</h2>

      <div v-if="loading" class="loading">Loading products...</div>
      <div v-else-if="products.length === 0" class="no-products">
        No products found.
      </div>

      <table v-else class="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price (৳)</th>
            <th>Category</th>
            <th>Discount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prod in products" :key="prod.id">
            <td><img :src="prod.image_url" class="thumb" alt="product" /></td>
            <td>{{ prod.name }}</td>
            <td>{{ prod.price }}</td>
            <td>{{ prod.category_slug }}</td>
            <td>{{ prod.discount_percent || 0 }}%</td>
            <td>
              <button class="btn-edit" @click="editProduct(prod)">✏️ Edit</button>
              <button class="btn-delete" @click="deleteProduct(prod.id)">🗑️ Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductManager",
  data() {
    return {
      API_BASE:
        window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://avado-backend.onrender.com",
      categories: [],
      products: [],
      loading: false,
      editingId: null,
      product: {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      },
      variants: [],
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchProducts();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await fetch(`${this.API_BASE}/categories`);
        this.categories = await res.json();
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    },

    async fetchProducts() {
      this.loading = true;
      try {
        const res = await fetch(`${this.API_BASE}/products`);
        this.products = await res.json();
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        this.loading = false;
      }
    },

    async uploadImage(event, field) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`${this.API_BASE}/products/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.product[field] = data.image_url;
      } catch (err) {
        console.error("Image upload error:", err);
      }
    },

    async uploadOptionImage(event, vIndex, oIndex) {
      const file = event.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch(`${this.API_BASE}/products/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.variants[vIndex].options[oIndex].option_image_url = data.image_url;
      } catch (err) {
        console.error("Option image upload error:", err);
      }
    },

    addVariant(level) {
      this.variants.push({ level, name: "", options: [] });
    },

    addOption(vIndex) {
      this.variants[vIndex].options.push({
        option_name: "",
        option_price: null,
        option_image_url: "",
      });
    },

    async addProduct() {
      const url = this.editingId
        ? `${this.API_BASE}/products/${this.editingId}`
        : `${this.API_BASE}/products`;
      const method = this.editingId ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...this.product,
            variants: this.variants,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert("❌ Error: " + (err.message || "Server error"));
          return;
        }

        alert(this.editingId ? "✅ Product updated!" : "✅ Product added!");
        this.resetForm();
        this.fetchProducts();
      } catch (err) {
        console.error("Add/Update error:", err);
      }
    },

    editProduct(prod) {
      this.product = { ...prod };
      this.editingId = prod.id;
      this.variants = prod.variants || [];
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    async deleteProduct(id) {
      if (!confirm("Are you sure you want to delete this product?")) return;
      try {
        const res = await fetch(`${this.API_BASE}/products/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          alert("🗑️ Product deleted!");
          this.fetchProducts();
        } else {
          const err = await res.json();
          alert("❌ Delete failed: " + (err.message || "Server error"));
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    },

    resetForm() {
      this.product = {
        name: "",
        price: null,
        description: "",
        category_slug: "",
        image_url: "",
        secondary_image_url: "",
        is_top_product: false,
        is_hot_deal: false,
        discount_percent: null,
        offer_end_date: null,
      };
      this.variants = [];
      this.editingId = null;
    },
  },
};
</script>


<style scoped>
.product-manager {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  font-family: "Poppins", sans-serif;
}
h2 {
  text-align: center;
  color: #4a00e0;
  margin-bottom: 25px;
  font-size: 28px;
  font-weight: 600;
}
.product-form .form-group {
  margin-bottom: 15px;
}
input,
textarea,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
}
input:focus,
textarea:focus,
select:focus {
  border-color: #8e2de2;
  outline: none;
}
.checkbox-group {
  display: flex;
  gap: 20px;
  align-items: center;
}
.discount-group {
  display: flex;
  gap: 15px;
}
.variant-box,
.option-box {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  background: #f9f9f9;
}
.variant-box h3 {
  color: #4a00e0;
  margin-bottom: 10px;
}
.uploaded {
  color: green;
  font-weight: 500;
  margin-left: 10px;
}
button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  transition: 0.3s;
}
.btn-primary {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  margin-right: 10px;
}
.btn-primary:hover {
  opacity: 0.9;
}
.btn-secondary {
  background: #eee;
  color: #333;
  margin-top: 10px;
}
.btn-secondary:hover {
  background: #ddd;
}
.btn-submit {
  display: block;
  width: 100%;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 25px;
}
.btn-submit:hover {
  opacity: 0.9;
}

/* Table */
.product-list {
  margin-top: 50px;
}
.product-table {
  width: 100%;
  border-collapse: collapse;
}
.product-table th,
.product-table td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}
.thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}
.btn-edit {
  background: #ffd700;
  color: #333;
  margin-right: 10px;
}
.btn-delete {
  background: #ff4d4d;
  color: white;
}
.btn-edit:hover,
.btn-delete:hover {
  opacity: 0.8;
}
.loading,
.no-products {
  text-align: center;
  color: #777;
  margin-top: 20px;
} /* ✅ Mobile Responsive Fix for All Products Section */
@media (max-width: 768px) {
  .product-list {
    overflow-x: auto;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  }

  .product-table {
    min-width: 600px; /* টেবিল মোবাইলেও সুন্দরভাবে স্ক্রল হবে */
    border-collapse: separate;
    border-spacing: 0;
  }

  .product-table th,
  .product-table td {
    padding: 8px 6px;
    font-size: 13px;
    white-space: nowrap;
  }

  .thumb {
    width: 45px;
    height: 45px;
    border-radius: 5px;
  }

  .product-list h2 {
    font-size: 22px;
    text-align: center;
    margin-bottom: 15px;
  }

  .btn-edit,
  .btn-delete {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
  }

  /* টেবিলটাকে সুন্দরভাবে স্ক্রলযোগ্য করলাম */
  .product-list::-webkit-scrollbar {
    height: 6px;
  }
  .product-list::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #4a00e0, #8e2de2);
    border-radius: 10px;
  }
  .product-list::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
}

/* ✅ Extra Small Devices (<= 480px) */
@media (max-width: 480px) {
  .product-manager {
    padding: 15px;
  }

  h2 {
    font-size: 22px;
  }

  input,
  textarea,
  select {
    font-size: 13px;
  }

  .btn-submit {
    font-size: 14px;
    padding: 8px;
  }

  .product-table th,
  .product-table td {
    padding: 6px 4px;
  }

  .thumb {
    width: 40px;
    height: 40px;
  }
}

</style>
