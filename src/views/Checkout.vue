<template>
  <div>
    <Navbar />

    <div class="checkout-page">
      <h1 class="checkout-title">Checkout</h1>

      <div class="checkout-container">
        <!-- 🟣 Left: Order Summary -->
        <div class="order-summary">
          <h2>Your Cart</h2>

          <div v-if="cart.length">
            <div v-for="item in cart" :key="item.id" class="summary-item">
              <img :src="item.image_url" alt="Product Image" class="summary-img" />
              <div class="summary-details">
                <p class="summary-name">{{ item.name }}</p>
                <p class="summary-price">
                  <template v-if="item.discount_percent">
                    <span class="discounted">৳{{ discountedPrice(item).toFixed(2) }}</span>
                    <span class="original">৳{{ item.price }}</span>
                  </template>
                  <template v-else>
                    ৳{{ item.price }}
                  </template>
                  × {{ item.quantity }}
                </p>
              </div>
            </div>

            <div class="total-section">
              <h3>
                Total: ৳{{ (Number(totalPrice) - Number(onlinePayment.amount || 0)).toFixed(2) }}
              </h3>
              <p v-if="onlinePayment.amount">
                (Paid ৳{{ onlinePayment.amount }} by {{ onlinePayment.method }})
              </p>
            </div>
          </div>

          <div v-else>
            <p>Your cart is empty.</p>
          </div>
        </div>

        <!-- 🟣 Right: Customer Details -->
        <div class="checkout-form">
          <h2>Customer Details</h2>

          <form @submit.prevent="placeOrder">
            <input v-model="customer.name" type="text" placeholder="Full Name" required />
            <input v-model="customer.phone" type="text" placeholder="Phone Number" required />
            <input v-model="customer.address" type="text" placeholder="Full Address" required />

            <label>Payment Method</label>
            <select v-model="paymentMethod">
              <option>Cash on Delivery</option>
              <option>Online Payment</option>
            </select>

            <!-- 🟣 Online Payment Section -->
            <div v-if="paymentMethod === 'Online Payment'" class="payment-box">
              <label>Choose Payment App:</label>
              <div class="radio-group">
                <label>
                  <input type="radio" value="Bkash" v-model="onlinePayment.method" />
                  Bkash
                </label>
                <label>
                  <input type="radio" value="Nagad" v-model="onlinePayment.method" />
                  Nagad
                </label>
              </div>

              <div class="instructions">
                <p>
                  <strong>{{ onlinePayment.method }} Personal Number:</strong>
                  {{ onlinePayment.method === "Bkash" ? "01631822765" : "01631822765" }}
                </p>
                <p>অনুগ্রহ করে Send Money করুন উপরের নম্বরে।</p>
              </div>

              <input
                v-model="onlinePayment.amount"
                type="number"
                placeholder="কতো টাকা পাঠিয়েছেন (৳)"
                required
              />
              <input
                v-model="onlinePayment.last2"
                type="text"
                maxlength="2"
                placeholder="যে নাম্বার থেকে পাঠিয়েছেন তার শেষ ২ সংখ্যা দিন"
                required
              />
            </div>

            <button type="submit" class="checkout-btn">Confirm Order</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/NavBar.vue";
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useCart } from "@/composables/useCart";

// ✅ Auto detect API
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://urbilux-backend.onrender.com/api";

// ✅ Ensure cookies work (important for guest user auto-create)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_BASE;

// 🛒 Load cart composable
const { cart, fetchCart } = useCart();

// 🧾 Customer info
const customer = ref({
  name: "",
  phone: "",
  address: "",
});

const paymentMethod = ref("Cash on Delivery");
const onlinePayment = ref({
  method: "Bkash",
  amount: "",
  last2: "",
});

// ✅ Price with discount
const discountedPrice = (item) => {
  const price = Number(item.price);
  const discount = Number(item.discount_percent || 0);
  return discount ? price - (price * discount) / 100 : price;
};

// ✅ Total cart amount
const totalPrice = computed(() =>
  cart.value
    .reduce((sum, item) => sum + discountedPrice(item) * (item.quantity || 1), 0)
    .toFixed(2)
);

// ✅ Place Order (includes manual payment + auto guest)
const placeOrder = async () => {
  try {
    await fetchCart(); // 🟣 refresh cart before order
    if (!cart.value.length) {
      alert("Your cart is empty!");
      return;
    }

    const payload = {
      items: cart.value.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        quantity: i.quantity,
        price: discountedPrice(i).toFixed(2),
        image_url: i.image_url,
        discount_percent: i.discount_percent,
      })),
      total: totalPrice.value,
      customer: customer.value,
      payment_method: paymentMethod.value,
    };

    // 🟣 Include manual payment data
    if (paymentMethod.value === "Online Payment") {
      payload.online_payment = {
        method: onlinePayment.value.method,
        amount: Number(onlinePayment.value.amount || 0),
        last2: onlinePayment.value.last2,
        note: `Manual ${onlinePayment.value.method} payment verification pending`,
      };
    }

const res = await axios.post(`${API_BASE}/checkout`, payload, { withCredentials: true });
    if (res.data.success) {
      alert("✅ Order placed successfully!");

      // Reset everything
      customer.value = { name: "", phone: "", address: "" };
      onlinePayment.value = { method: "Bkash", amount: "", last2: "" };
      paymentMethod.value = "Cash on Delivery";
      await fetchCart();
    } else {
      alert("❌ Checkout failed: " + (res.data.error || "Unknown error"));
    }
  } catch (err) {
    console.error("❌ Checkout Error:", err);
    alert("Checkout failed! " + (err.response?.data?.error || err.message));
  }
};

// ✅ Load cart on page open
onMounted(fetchCart);
</script>


<style scoped>
.checkout-page {
  margin: 100px auto;
  width: 85%;
  max-width: 1200px;
  font-family: "Zalando Sans", sans-serif;
}

.checkout-title {
  text-align: center;
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 40px;
}

.checkout-container {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

/* 🟣 Order Summary */
.order-summary {
  flex: 1;
  min-width: 350px;
  background: #fff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(142, 45, 226, 0.08);
}

.order-summary h2 {
  font-size: 20px;
  color: #4a00e0;
  font-weight: 700;
  margin-bottom: 15px;
}

.summary-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.summary-img {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.summary-details {
  flex: 1;
}

.summary-name {
  font-weight: 600;
  color: #333;
  font-size: 15px;
  margin-bottom: 3px;
}

.summary-price {
  font-size: 14px;
  color: #555;
}

.discounted {
  color: #e67e22;
  font-weight: 600;
}

.original {
  text-decoration: line-through;
  color: #999;
  font-size: 12px;
  margin-left: 6px;
}

.total-section {
  margin-top: 15px;
  text-align: right;
}

.total-section h3 {
  color: #4a00e0;
  font-size: 19px;
  font-weight: 700;
}

/* 🟣 Checkout Form */
.checkout-form {
  flex: 1;
  min-width: 350px;
  background: #fff;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(142, 45, 226, 0.08);
}

.checkout-form h2 {
  font-size: 20px;
  color: #4a00e0;
  margin-bottom: 20px;
  font-weight: 700;
}

.checkout-form input,
.checkout-form select {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  background: #fafafa;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.checkout-form input:focus,
.checkout-form select:focus {
  border-color: #8e2de2;
  box-shadow: 0 0 0 2px rgba(142, 45, 226, 0.15);
  outline: none;
}

/* 🟣 Confirm Button */
.checkout-btn {
  background: linear-gradient(90deg, #4a00e0, #8e2de2);
  color: #fff;
  padding: 12px 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  opacity: 0.9;
  transform: scale(1.02);
}

/* ✅ Tablet */
@media (max-width: 992px) {
  .checkout-page {
    width: 95%;
    margin: 70px auto;
  }

  .checkout-title {
    font-size: 26px;
    margin-bottom: 30px;
  }

  .checkout-container {
    flex-direction: column;
    gap: 25px;
  }

  .order-summary,
  .checkout-form {
    padding: 20px;
    border-radius: 14px;
  }

  .summary-img {
    width: 65px;
    height: 65px;
  }

  .summary-name {
    font-size: 14px;
  }

  .summary-price {
    font-size: 13px;
  }

  .total-section h3 {
    font-size: 17px;
  }

  .checkout-form input,
  .checkout-form select {
    font-size: 13px;
    padding: 9px 10px;
  }

  .checkout-btn {
    font-size: 15px;
    padding: 10px 0;
  }
}

/* ✅ Mobile */
@media (max-width: 600px) {
  .checkout-page {
    width: 94%;
    margin: 40px auto;
  }

  .checkout-title {
    font-size: 22px;
    margin-bottom: 25px;
  }

  .order-summary,
  .checkout-form {
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 3px 10px rgba(142, 45, 226, 0.08);
  }

  .order-summary h2,
  .checkout-form h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .summary-img {
    width: 55px;
    height: 55px;
  }

  .summary-name {
    font-size: 13.5px;
  }

  .summary-price {
    font-size: 12.5px;
  }

  /* 🔹 Compact Inputs */
  .checkout-form input,
  .checkout-form select {
    padding: 8px 9px;
    font-size: 13px;
    border-radius: 7px;
    margin-bottom: 10px;
  }

  .checkout-btn {
    font-size: 14px;
    padding: 9px 0;
    border-radius: 8px;
  }

  .total-section h3 {
    font-size: 16px;
  }
}

/* ✅ Extra Small Devices */
@media (max-width: 400px) {
  .checkout-page {
    width: 98%;
    margin: 25px auto;
  }

  .checkout-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .summary-img {
    width: 50px;
    height: 50px;
  }

  .summary-name {
    font-size: 13px;
  }

  .summary-price {
    font-size: 12px;
  }

  .checkout-form input,
  .checkout-form select {
    padding: 7px 8px;
    font-size: 12px;
  }

  .checkout-btn {
    font-size: 13px;
    padding: 8px 0;
  }
}
</style>
