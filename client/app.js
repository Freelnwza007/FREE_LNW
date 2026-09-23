const photo = {
  espresso: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=900&q=85",
  latte: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=900&q=85",
  iced: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85",
  beans: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
  bakery: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=85",
  cookie: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=900&q=85",
  milk: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
  tea: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85"
};
const fallbackProducts = [
  ["Port Able House Blend", "COFFEE", "เอสเปรสโซเบลนด์คั่วกลางเข้ม บอดี้นุ่ม กลิ่นช็อกโกแลตและคาราเมล", 120, "espresso", "BEST SELLER"],
  ["Chiang Rai Single Origin", "COFFEE", "อาราบิก้าคั่วกลาง โทนส้มหวาน ช็อกโกแลต และอัลมอนด์", 150, "beans", "SINGLE ORIGIN"],
  ["Iced Orange Espresso", "COFFEE", "เอสเปรสโซเข้มข้นกับน้ำส้มสด หอม สดชื่น ดื่มง่าย", 135, "iced", "REFRESHING"],
  ["Americano", "COFFEE", "ช็อตเอสเปรสโซเต็มรสชาติ ดื่มง่ายในแบบร้อนหรือเย็น", 90, "espresso", "CLASSIC"],
  ["Cappuccino", "COFFEE", "เอสเปรสโซกับโฟมนมเนียนละเอียด หอมละมุนทุกคำ", 115, "latte", "BARISTA PICK"],
  ["Dirty Coffee", "COFFEE", "นมเย็นจัดรับเอสเปรสโซร้อน รสเข้มและนุ่มในแก้วเดียว", 130, "latte", "SIGNATURE"],
  ["Cold Brew", "COFFEE", "กาแฟสกัดเย็น 18 ชั่วโมง รสนุ่มหวาน ปลายสะอาด", 120, "iced", "SLOW BREW"],
  ["Mocha", "COFFEE", "เอสเปรสโซ ช็อกโกแลต และนมสด สำหรับคนรักกาแฟเข้ม", 125, "latte", "CHOCOLATE"],
  ["Oat Milk Latte", "MILK COFFEE", "ลาเต้นมโอ๊ตรสละมุน โฟมนุ่ม หวานธรรมชาติ", 145, "latte", "CREAMY"],
  ["Matcha Oat Latte", "MILK COFFEE", "มัทฉะเกรดพิธีการกับนมโอ๊ต หอม เข้ม และนุ่ม", 145, "latte", "NEW"],
  ["Butter Croissant", "BAKERY", "ครัวซองต์เนยสด อบใหม่ทุกเช้า กรอบนอก นุ่มใน", 85, "bakery", "BAKED DAILY"],
  ["Almond Croissant", "BAKERY", "ครัวซองต์ไส้อัลมอนด์หอมเนย เข้าคู่กับอเมริกาโน่", 105, "bakery", "COFFEE PAIRING"],
  ["Chocolate Cookie", "BAKERY", "คุกกี้ช็อกโกแลตชิพเนื้อหนึบ หวานพอดี", 65, "cookie", "FRESH BAKED"],
  ["Banana Bread", "BAKERY", "เค้กกล้วยหอมเนื้อนุ่ม หอมเนยและวอลนัต", 75, "bakery", "HOMEMADE"],
  ["Fresh Milk", "MILK", "นมสดเย็นรสนุ่ม ดื่มเดี่ยว ๆ หรือเพิ่มความละมุน", 75, "milk", "FRESH"],
  ["Chocolate Milk", "MILK", "นมสดช็อกโกแลตเข้มข้น หวานกำลังดี", 95, "milk", "FAVORITE"],
  ["Peach Tea Sparkling", "REFRESHER", "ชาพีชหอมหวานซ่าพอดี สำหรับวันที่อยากพักจากกาแฟ", 95, "tea", "SEASONAL"],
  ["Yuzu Soda", "REFRESHER", "ยูซุหอมสดชื่น ผสมโซดา ดื่มแล้วตื่นตัว", 105, "tea", "CITRUS"],
].map(([name, productType, description, price, image, badge]) => ({ name, productType, description, price, image: photo[image], badge }));

const apiBase = window.location.port === "5000" ? "" : "http://localhost:5000";
const productList = document.querySelector("#product-list");
const categoryButtons = document.querySelector("#menu-filters");
let activeCategory = "ALL";
let catalog = fallbackProducts;
let cart = JSON.parse(localStorage.getItem("portAbleCart") || "[]");
const currency = (number) => `฿${Number(number).toLocaleString("th-TH")}`;
const imageFor = (product) => product.image || fallbackProducts.find((item) => item.name === product.name)?.image || photo.espresso;
const productKey = (product) => product._id || product.name;
const normalizeType = (type = "coffee") => type.toLowerCase();
const renderProducts = () => { const products = activeCategory === "ALL" ? catalog : catalog.filter((product) => normalizeType(product.productType) === normalizeType(activeCategory)); productList.innerHTML = products.length ? products.map((product) => { const price = product.variants?.[0]?.price ?? product.price; return `<article class="product-card"><div class="product-image-wrap"><img class="product-image" src="${imageFor(product)}" alt="${product.name}" loading="lazy"><span class="product-badge">${product.badge || product.productType || "COFFEE"}</span></div><div class="product-content"><p class="product-type">${product.productType || "COFFEE"}</p><h3>${product.name}</h3><p class="product-description">${product.description || "คัดสรรและชงสดด้วยความตั้งใจในทุกแก้ว"}</p><div class="product-footer"><strong>${currency(price)}</strong><button class="add-cart" type="button" data-product="${productKey(product)}">เพิ่ม <span>+</span></button></div></div></article>`; }).join("") : "<p class=\"empty-products\">ยังไม่มีสินค้าในหมวดหมู่นี้</p>"; };
const saveCart = () => localStorage.setItem("portAbleCart", JSON.stringify(cart));
const renderCart = () => { const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0); const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); document.querySelector("#cart-count").textContent = totalItems; document.querySelector("#cart-total").textContent = currency(total); document.querySelector("#checkout-button").disabled = !cart.length; document.querySelector("#cart-empty").classList.toggle("is-hidden", !!cart.length); document.querySelector("#cart-items").innerHTML = cart.map((item) => `<li class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h4>${item.name}</h4><p>${currency(item.price)}</p><div class="quantity-control"><button data-cart-action="decrease" data-key="${item.key}" aria-label="ลดจำนวน">−</button><span>${item.quantity}</span><button data-cart-action="increase" data-key="${item.key}" aria-label="เพิ่มจำนวน">+</button></div></div><button class="remove-item" data-cart-action="remove" data-key="${item.key}" aria-label="ลบ ${item.name}">×</button></li>`).join(""); };
const addToCart = (key) => { const product = catalog.find((item) => productKey(item) === key) || fallbackProducts.find((item) => productKey(item) === key); if (!product) return; const price = product.variants?.[0]?.price ?? product.price; const existing = cart.find((item) => item.key === key); if (existing) existing.quantity += 1; else cart.push({ key, name: product.name, price, image: imageFor(product), quantity: 1 }); saveCart(); renderCart(); };
const toggleCart = (open) => { document.querySelector("#cart-drawer").classList.toggle("is-open", open); document.querySelector("#cart-overlay").classList.toggle("is-open", open); document.body.classList.toggle("cart-open", open); };
categoryButtons.addEventListener("click", (event) => { const button = event.target.closest("button[data-category]"); if (!button) return; activeCategory = button.dataset.category; categoryButtons.querySelectorAll("button").forEach((item) => item.classList.toggle("is-active", item === button)); renderProducts(); });
document.addEventListener("click", (event) => { const addButton = event.target.closest(".add-cart"); if (addButton) { addToCart(addButton.dataset.product); addButton.innerHTML = "เพิ่มแล้ว ✓"; setTimeout(() => { addButton.innerHTML = "เพิ่ม <span>+</span>"; }, 900); } const action = event.target.dataset.cartAction; if (action) { const index = cart.findIndex((item) => item.key === event.target.dataset.key); if (index < 0) return; if (action === "increase") cart[index].quantity += 1; if (action === "decrease") cart[index].quantity > 1 ? cart[index].quantity -= 1 : cart.splice(index, 1); if (action === "remove") cart.splice(index, 1); saveCart(); renderCart(); } });
document.querySelector("#open-cart").addEventListener("click", () => toggleCart(true)); document.querySelector("#close-cart").addEventListener("click", () => toggleCart(false)); document.querySelector("#cart-overlay").addEventListener("click", () => toggleCart(false));
document.querySelector("#checkout-button").addEventListener("click", () => { if (!cart.length) return; cart = []; saveCart(); renderCart(); toggleCart(false); document.querySelector("#checkout-message").textContent = "รับรายการสั่งซื้อแล้ว! ทางร้านจะติดต่อเพื่อยืนยันการชำระเงิน"; });
fetch(`${apiBase}/api/products`).then((response) => response.ok ? response.json() : []).then((products) => { catalog = products.length ? products : fallbackProducts; renderProducts(); }).catch(renderProducts);
const profilePanel = document.querySelector("#profile-panel"); const guestPanel = document.querySelector("#guest-panel"); const showProfile = (user) => { document.querySelector("#profile-name").textContent = user.name || "-"; document.querySelector("#profile-email").textContent = user.email || "-"; document.querySelector("#profile-phone").textContent = user.phone || "ยังไม่ได้เพิ่ม"; profilePanel.classList.remove("is-hidden"); guestPanel.classList.add("is-hidden"); document.querySelector(".nav-account").textContent = "บัญชีของฉัน"; document.querySelector(".nav-account").href = "#account"; if (user.role === "admin" && !document.querySelector(".nav-admin")) { const link = document.createElement("a"); link.className = "nav-admin"; link.href = "/admin.html"; link.textContent = "จัดการสินค้า"; document.querySelector(".site-nav nav").prepend(link); } };
const loadProfile = async () => { const token = localStorage.getItem("portAbleToken"); if (!token) return; try { const response = await fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error(); const data = await response.json(); showProfile(data.user); } catch { localStorage.removeItem("portAbleToken"); } }; document.querySelector("#logout-button").addEventListener("click", () => { localStorage.removeItem("portAbleToken"); location.reload(); }); loadProfile(); renderCart();
