import staticCatalog from "./catalog.json";

const apiBase = ["localhost", "127.0.0.1"].includes(window.location.hostname) && window.location.port !== "5000" ? "http://localhost:5000" : "";
const catalogPhotos = [
  "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1502453271340-254777686dd9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1564327367919-cb377ea6a88f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1721257075205-c26d4a22c695?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1520093259885-5852d270f788?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1569659129413-a6e3f22327bd?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1625021659159-f63f546d74a7?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1657657366123-b5bf60bc9ff4?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1776176623816-c4fd0e55f61c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85",
];
const productList = document.querySelector("#product-list");
const categoryButtons = document.querySelector("#menu-filters");
let activeCategory = "ALL";
let catalog = staticCatalog;
let cart = JSON.parse(localStorage.getItem("portAbleCart") || "[]");
const currency = (number) => `฿${Number(number).toLocaleString("th-TH")}`;
const imageFor = (product, index = 0) => product.images?.[0] || product.image || catalogPhotos[Math.abs(index) % catalogPhotos.length];
const productKey = (product) => product._id || product.name;
const normalizeType = (type = "coffee") => type.toLowerCase();
const renderProducts = () => { const products = activeCategory === "ALL" ? catalog : catalog.filter((product) => normalizeType(product.productType) === normalizeType(activeCategory)); productList.innerHTML = products.length ? products.map((product, index) => { const price = product.variants?.[0]?.price ?? product.price; const image = imageFor(product, catalog.indexOf(product)); return `<article class="product-card"><div class="product-image-wrap"><img class="product-image" src="${image}" alt="${product.name}" loading="lazy"><span class="product-badge">${product.badge || product.productType || "COFFEE"}</span></div><div class="product-content"><p class="product-type">${product.productType || "COFFEE"}</p><h3>${product.name}</h3><p class="product-description">${product.description || "คัดสรรและชงสดด้วยความตั้งใจในทุกแก้ว"}</p><div class="product-footer"><strong>${currency(price)}</strong><button class="add-cart" type="button" data-product="${productKey(product)}">เพิ่ม <span>+</span></button></div></div></article>`; }).join("") : "<p class=\"empty-products\">ยังไม่มีสินค้าในหมวดหมู่นี้</p>"; };
const saveCart = () => localStorage.setItem("portAbleCart", JSON.stringify(cart));
const renderCart = () => { const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); document.querySelector("#cart-count").textContent = totalItems; document.querySelector("#cart-total").textContent = currency(total); document.querySelector("#checkout-button").disabled = !cart.length; document.querySelector("#cart-empty").classList.toggle("is-hidden", !!cart.length); document.querySelector("#cart-items").innerHTML = cart.map((item) => `<li class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h4>${item.name}</h4><p>${currency(item.price)}</p><div class="quantity-control"><button data-cart-action="decrease" data-key="${item.key}" aria-label="ลดจำนวน">−</button><span>${item.quantity}</span><button data-cart-action="increase" data-key="${item.key}" aria-label="เพิ่มจำนวน">+</button></div></div><button class="remove-item" data-cart-action="remove" data-key="${item.key}" aria-label="ลบ ${item.name}">×</button></li>`).join(""); };
const addToCart = (key) => { const productIndex = catalog.findIndex((item) => productKey(item) === key); const product = catalog[productIndex]; if (!product) return; const price = product.variants?.[0]?.price ?? product.price; const existing = cart.find((item) => item.key === key); if (existing) existing.quantity += 1; else cart.push({ key, name: product.name, price, image: imageFor(product, productIndex), quantity: 1 }); saveCart(); renderCart(); };
const toggleCart = (open) => { document.querySelector("#cart-drawer").classList.toggle("is-open", open); document.querySelector("#cart-overlay").classList.toggle("is-open", open); document.body.classList.toggle("cart-open", open); };
categoryButtons.addEventListener("click", (event) => { const button = event.target.closest("button[data-category]"); if (!button) return; activeCategory = button.dataset.category; categoryButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button)); renderProducts(); });
document.addEventListener("click", (event) => { const addButton = event.target.closest(".add-cart"); if (addButton) { addToCart(addButton.dataset.product); addButton.innerHTML = "เพิ่มแล้ว ✓"; setTimeout(() => { addButton.innerHTML = "เพิ่ม <span>+</span>"; }, 900); } const action = event.target.dataset.cartAction; if (action) { const index = cart.findIndex((item) => item.key === event.target.dataset.key); if (index < 0) return; if (action === "increase") cart[index].quantity += 1; if (action === "decrease") cart[index].quantity > 1 ? cart[index].quantity -= 1 : cart.splice(index, 1); if (action === "remove") cart.splice(index, 1); saveCart(); renderCart(); } });
document.querySelector("#open-cart").addEventListener("click", () => toggleCart(true)); document.querySelector("#close-cart").addEventListener("click", () => toggleCart(false)); document.querySelector("#cart-overlay").addEventListener("click", () => toggleCart(false));
const checkoutForm = document.querySelector("#checkout-form");
const paymentPanel = document.querySelector("#payment-panel");
let pendingOrderNumber = "";
document.querySelector("#checkout-button").addEventListener("click", () => {
  if (!cart.length) return;
  document.querySelector("#checkout-message").textContent = "";
  checkoutForm.classList.remove("is-hidden");
  checkoutForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
});
checkoutForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!cart.length) return;
  const submit = checkoutForm.querySelector("[type=submit]");
  submit.disabled = true;
  document.querySelector("#checkout-message").textContent = "กำลังสร้างคำสั่งซื้อ...";
  try {
    const formData = new FormData(checkoutForm);
    const response = await fetch(`${apiBase}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shippingAddress: { name: formData.get("name"), phone: formData.get("phone"), fullAddress: formData.get("fullAddress") },
        items: cart.map(({ key, quantity }) => ({ key, quantity })),
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "สร้างคำสั่งซื้อไม่สำเร็จ");
    pendingOrderNumber = result.orderNumber;
    document.querySelector("#payment-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(result.promptPayPayload)}`;
    document.querySelector("#payment-order").textContent = `เลขที่คำสั่งซื้อ ${result.orderNumber} · ${currency(result.total)}`;
    paymentPanel.classList.remove("is-hidden");
    checkoutForm.classList.add("is-hidden");
    document.querySelector("#checkout-message").textContent = "สร้างคำสั่งซื้อแล้ว กรุณาชำระเงินตาม QR ด้านล่าง";
  } catch (error) {
    document.querySelector("#checkout-message").textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});
document.querySelector("#payment-done").addEventListener("click", () => {
  if (!pendingOrderNumber) return;
  cart = [];
  saveCart();
  renderCart();
  paymentPanel.classList.add("is-hidden");
  toggleCart(false);
  document.querySelector("#checkout-message").textContent = `บันทึกคำสั่งซื้อ ${pendingOrderNumber} แล้ว กรุณาติดต่อร้านค้าพร้อมแจ้งเลขคำสั่งซื้อเพื่อยืนยันยอดโอน`;
  pendingOrderNumber = "";
  checkoutForm.reset();
});
fetch(`${apiBase}/api/products`).then((response) => response.ok ? response.json() : []).then((products) => { catalog = products.length ? products : staticCatalog; cart = cart.map((item) => { const productIndex = catalog.findIndex((product) => productKey(product) === item.key); return { ...item, image: imageFor(catalog[productIndex] || {}, productIndex < 0 ? 0 : productIndex) }; }); saveCart(); renderProducts(); renderCart(); }).catch(() => { catalog = staticCatalog; renderProducts(); renderCart(); });
const profilePanel = document.querySelector("#profile-panel"); const guestPanel = document.querySelector("#guest-panel"); const showProfile = (user) => { document.querySelector("#profile-name").textContent = user.name || "-"; document.querySelector("#profile-email").textContent = user.email || "-"; document.querySelector("#profile-phone").textContent = user.phone || "ยังไม่ได้เพิ่ม"; profilePanel.classList.remove("is-hidden"); guestPanel.classList.add("is-hidden"); document.querySelector(".nav-account").textContent = "บัญชีของฉัน"; document.querySelector(".nav-account").href = "#account"; if (user.role === "admin" && !document.querySelector(".nav-admin")) { const link = document.createElement("a"); link.className = "nav-admin"; link.href = "/admin.html"; link.textContent = "จัดการสินค้า"; document.querySelector(".site-nav nav").prepend(link); } };
const loadProfile = async () => { const token = localStorage.getItem("portAbleToken"); if (!token) return; try { const response = await fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error(); const data = await response.json(); showProfile(data.user); } catch { localStorage.removeItem("portAbleToken"); } }; document.querySelector("#logout-button").addEventListener("click", () => { localStorage.removeItem("portAbleToken"); location.reload(); }); loadProfile(); renderCart();
