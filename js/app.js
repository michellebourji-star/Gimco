/* ==========================================================================
   Core site script: shared header/footer, cart, product cards, helpers.
   You normally don't need to edit this file — change products in
   js/products.js and business details in js/config.js.
   ========================================================================== */

/* -------------------------------- Icons -------------------------------- */

const ICONS = {
  fuel: '<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  menu: '<line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  arrow: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  sliders: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
  shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
  store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/>',
  package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  eye: '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  droplet: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  instagram: '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>',
  tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c0 3 2.5 5.5 6 5.5"/>',
  youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>',
};

const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z";

function icon(name, cls = "") {
  if (name === "whatsapp") {
    return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WHATSAPP_PATH}"/></svg>`;
  }
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}

const CATEGORY_ICONS = { car: "car", truck: "truck", tools: "wrench" };

/* ------------------------------- Helpers ------------------------------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function money(n) {
  return STORE.currencySymbol + Number(n).toFixed(2);
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id);
}

function typeName(categoryId, typeId) {
  const cat = getCategory(categoryId);
  const type = cat && cat.types.find((t) => t.id === typeId);
  return type ? type.name : "";
}

function productUrl(p) {
  return `product.html?id=${encodeURIComponent(p.id)}`;
}

function waLink(text) {
  return `https://wa.me/${STORE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

function telLink() {
  return `tel:${STORE.phoneLink}`;
}

function mapEmbedUrl() {
  return `https://www.google.com/maps?q=${encodeURIComponent(STORE.mapQuery)}&output=embed`;
}

function mapLink() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STORE.mapQuery)}`;
}

// Neutral placeholder shown if a product photo can't be loaded.
const IMG_FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f4f4f5"/><g fill="none" stroke="#a1a1aa" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" transform="translate(140 140) scale(5)"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" stroke-width="1.6"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12" stroke-width="1.6"/></g></svg>'
  );

document.addEventListener(
  "error",
  (e) => {
    const img = e.target;
    if (img.tagName === "IMG" && img.src !== IMG_FALLBACK) img.src = IMG_FALLBACK;
  },
  true
);

/* --------------------------------- Cart -------------------------------- */

const Cart = (() => {
  const KEY = "gimco-cart";
  let items = [];

  try {
    items = JSON.parse(localStorage.getItem(KEY)) || [];
  } catch (e) {
    items = [];
  }
  // Drop products that no longer exist (e.g. removed from products.js)
  items = items.filter((i) => getProduct(i.id) && i.qty > 0);

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch (e) {
      /* storage unavailable — cart still works for this page view */
    }
    document.dispatchEvent(new CustomEvent("cart:change"));
  }

  return {
    lines() {
      return items.map((i) => {
        const product = getProduct(i.id);
        return { product, qty: i.qty, total: product.price * i.qty };
      });
    },
    count() {
      return items.reduce((sum, i) => sum + i.qty, 0);
    },
    subtotal() {
      return this.lines().reduce((sum, l) => sum + l.total, 0);
    },
    add(id, qty = 1) {
      const existing = items.find((i) => i.id === id);
      if (existing) existing.qty = Math.min(99, existing.qty + qty);
      else items.push({ id, qty: Math.min(99, qty) });
      save();
    },
    setQty(id, qty) {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      if (qty <= 0) items = items.filter((i) => i.id !== id);
      else item.qty = Math.min(99, qty);
      save();
    },
    remove(id) {
      items = items.filter((i) => i.id !== id);
      save();
    },
    clear() {
      items = [];
      save();
    },
  };
})();

/* ----------------------------- Product card ---------------------------- */

function productBadge(p) {
  if (p.inStock === false) return '<span class="badge badge--out">Out of stock</span>';
  if (p.badge) return `<span class="badge ${p.badge.toLowerCase() === "sale" ? "badge--sale" : ""}">${esc(p.badge)}</span>`;
  if (p.oldPrice) return '<span class="badge badge--sale">Sale</span>';
  return "";
}

function priceHtml(p) {
  return `${money(p.price)}${p.oldPrice ? `<del>${money(p.oldPrice)}</del>` : ""}`;
}

function productCard(p) {
  const url = productUrl(p);
  const out = p.inStock === false;
  return `
    <article class="product-card reveal">
      <a class="product-card__media" href="${url}" aria-label="${esc(p.name)}">
        ${productBadge(p)}
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" width="400" height="400">
        <div class="product-card__quick"><span class="btn btn--sm">${icon("eye")} View details</span></div>
      </a>
      <div class="product-card__body">
        <div class="product-card__cat">${esc(typeName(p.category, p.type))}</div>
        <h3 class="product-card__name"><a href="${url}">${esc(p.name)}</a></h3>
        <p class="product-card__desc">${esc(p.description)}</p>
        <div class="product-card__foot">
          <div class="price">${priceHtml(p)}</div>
          <button class="add-btn" type="button" data-add="${esc(p.id)}" ${out ? "disabled" : ""}>
            ${icon(out ? "x" : "plus")}<span>${out ? "Sold out" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>`;
}

/* --------------------------- Header & footer --------------------------- */

const NAV = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "shop", label: "Shop", href: "shop.html" },
  { id: "car", label: "Car Accessories", href: "car-accessories.html" },
  { id: "truck", label: "Truck Accessories", href: "truck-accessories.html" },
  { id: "tools", label: "Tools", href: "tools.html" },
  { id: "about", label: "About", href: "about.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

function logoHtml() {
  return `
    <a class="logo" href="index.html" aria-label="${esc(STORE.name)} home">
      <span class="logo__mark">${icon("fuel")}</span>
      <span class="logo__text">
        <span class="logo__name">${esc(STORE.name)}</span>
        <span class="logo__sub">${esc(STORE.subtitle)}</span>
      </span>
    </a>`;
}

function socialHtml() {
  return Object.entries(STORE.social)
    .filter(([, url]) => url)
    .map(([name, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${name}">${icon(name)}</a>`)
    .join("");
}

function renderHeader() {
  const page = document.body.dataset.page;
  const header = `
    <div class="topbar">
      <div class="container">
        <div class="topbar__items">
          <span class="topbar__item">${icon("pin")} ${esc(STORE.address.line1)}, ${esc(STORE.address.line2)}</span>
          <span class="topbar__item hide-tablet">${icon("clock")} ${esc(STORE.hoursNote)}</span>
        </div>
        <div class="topbar__items">
          <a class="topbar__item" href="${telLink()}">${icon("phone")} ${esc(STORE.phone)}</a>
          <a class="topbar__item" href="${waLink()}" target="_blank" rel="noopener">${icon("whatsapp")} WhatsApp</a>
        </div>
      </div>
    </div>
    <header class="site-header">
      <div class="container">
        <button class="icon-btn menu-toggle" type="button" data-open="menu" aria-label="Open menu">${icon("menu")}</button>
        ${logoHtml()}
        <nav class="nav" aria-label="Main">
          <ul class="nav__list">
            ${NAV.map((n) => `<li><a class="nav__link ${n.id === page ? "is-active" : ""}" href="${n.href}">${n.label}</a></li>`).join("")}
          </ul>
        </nav>
        <div class="header-actions">
          <a class="icon-btn hide-mobile" href="shop.html" aria-label="Search products">${icon("search")}</a>
          <button class="icon-btn" type="button" data-open="cart" aria-label="Open cart">
            ${icon("bag")}<span class="cart-count" data-count="0">0</span>
          </button>
        </div>
      </div>
    </header>

    <div class="overlay" data-close></div>

    <aside class="mobile-menu" id="menu" aria-label="Menu">
      <div class="drawer__head">${logoHtml()}<button class="icon-btn" type="button" data-close aria-label="Close menu">${icon("x")}</button></div>
      <ul class="mobile-menu__list">
        ${NAV.map((n) => `<li><a class="${n.id === page ? "is-active" : ""}" href="${n.href}">${n.label}${icon("chevron")}</a></li>`).join("")}
      </ul>
      <div class="mobile-menu__foot">
        <a class="btn btn--whatsapp btn--block" href="${waLink()}" target="_blank" rel="noopener">${icon("whatsapp")} Chat on WhatsApp</a>
        <a class="btn btn--outline btn--block" href="${telLink()}">${icon("phone")} Call ${esc(STORE.phone)}</a>
      </div>
    </aside>

    <aside class="drawer" id="cart" aria-label="Shopping cart">
      <div class="drawer__head">
        <h3>Your cart</h3>
        <button class="icon-btn" type="button" data-close aria-label="Close cart">${icon("x")}</button>
      </div>
      <div class="drawer__body" data-cart-lines></div>
      <div class="drawer__foot" data-cart-foot></div>
    </aside>

    <div class="toast" role="status" aria-live="polite"></div>
    <a class="wa-float" href="${waLink(`Hi ${STORE.name}, I have a question.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>`;

  $("#site-header").innerHTML = header;
}

function renderFooter() {
  const footer = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            ${logoHtml()}
            <p>Your neighborhood gas station and automotive store. Quality accessories, tools and everyday driving essentials at fair prices.</p>
            <div class="social">${socialHtml()}</div>
          </div>
          <div>
            <h4>Shop</h4>
            <ul class="footer-links">
              <li><a href="shop.html">All products</a></li>
              ${CATEGORIES.map((c) => `<li><a href="${c.page}">${esc(c.name)}</a></li>`).join("")}
              <li><a href="checkout.html">Checkout</a></li>
            </ul>
          </div>
          <div>
            <h4>Opening hours</h4>
            <ul class="footer-links footer-hours">
              ${STORE.hours.map((h) => `<li><span>${esc(h.days)}</span><span>${esc(h.time)}</span></li>`).join("")}
            </ul>
            <p class="footer-note">${esc(STORE.hoursNote)}</p>
          </div>
          <div>
            <h4>Visit or contact us</h4>
            <ul class="footer-links footer-contact">
              <li>${icon("pin")}<a href="${mapLink()}" target="_blank" rel="noopener">${esc(STORE.address.line1)}<br>${esc(STORE.address.line2)}</a></li>
              <li>${icon("phone")}<a href="${telLink()}">${esc(STORE.phone)}</a></li>
              <li>${icon("whatsapp")}<a href="${waLink()}" target="_blank" rel="noopener">WhatsApp us</a></li>
              <li>${icon("mail")}<a href="mailto:${esc(STORE.email)}">${esc(STORE.email)}</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${esc(STORE.name)} ${esc(STORE.subtitle)}. All rights reserved.</span>
          <span><a href="about.html">About</a> · <a href="contact.html">Contact</a></span>
        </div>
      </div>
    </footer>`;
  $("#site-footer").innerHTML = footer;
}

/* ----------------------------- Cart drawer ----------------------------- */

function qtyControl(id, qty, small = true) {
  return `
    <div class="qty ${small ? "qty--sm" : ""}">
      <button type="button" data-qty-dec="${esc(id)}" aria-label="Decrease quantity">${icon("minus")}</button>
      <input type="number" min="1" max="99" value="${qty}" data-qty-input="${esc(id)}" aria-label="Quantity">
      <button type="button" data-qty-inc="${esc(id)}" aria-label="Increase quantity">${icon("plus")}</button>
    </div>`;
}

function cartLineHtml(line, editable = true) {
  const p = line.product;
  return `
    <div class="cart-item">
      <a href="${productUrl(p)}"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"></a>
      <div>
        <a class="cart-item__name" href="${productUrl(p)}">${esc(p.name)}</a>
        <div class="cart-item__price">${money(p.price)}${editable ? "" : ` × ${line.qty}`}</div>
        ${editable ? qtyControl(p.id, line.qty) : ""}
      </div>
      <div class="cart-item__side">
        ${editable ? `<button class="remove-btn" type="button" data-remove="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">${icon("trash")}</button>` : "<span></span>"}
        <span class="cart-item__total">${money(line.total)}</span>
      </div>
    </div>`;
}

function freeDeliveryHtml(subtotal) {
  const goal = STORE.freeDeliveryOver;
  if (!goal) return "";
  const pct = Math.min(100, (subtotal / goal) * 100);
  const msg =
    subtotal >= goal
      ? `${icon("check")} You qualify for <strong>free local delivery</strong>.`
      : `Add <strong>${money(goal - subtotal)}</strong> more for free local delivery.`;
  return `<div class="free-delivery">${msg}<div class="progress"><span style="width:${pct}%"></span></div></div>`;
}

function renderCart() {
  const count = Cart.count();
  $$(".cart-count").forEach((el) => {
    el.textContent = count;
    el.dataset.count = count;
  });

  const linesEl = $("[data-cart-lines]");
  const footEl = $("[data-cart-foot]");
  if (!linesEl) return;

  const lines = Cart.lines();
  if (!lines.length) {
    linesEl.innerHTML = `
      <div class="cart-empty">
        ${icon("bag")}
        <h4>Your cart is empty</h4>
        <p>Browse our accessories and tools to get started.</p>
        <a class="btn btn--dark" href="shop.html">Start shopping</a>
      </div>`;
    footEl.innerHTML = "";
    footEl.hidden = true;
    return;
  }

  const subtotal = Cart.subtotal();
  linesEl.innerHTML = lines.map((l) => cartLineHtml(l)).join("");
  footEl.hidden = false;
  footEl.innerHTML = `
    ${freeDeliveryHtml(subtotal)}
    <div class="summary-line summary-line--total"><span>Subtotal (${count} item${count === 1 ? "" : "s"})</span><span>${money(subtotal)}</span></div>
    <a class="btn btn--primary btn--block btn--lg" href="checkout.html">Checkout ${icon("arrow")}</a>
    <a class="btn btn--whatsapp btn--block" href="${waLink(orderSummaryText())}" target="_blank" rel="noopener">${icon("whatsapp")} Order via WhatsApp</a>`;
}

function orderSummaryText() {
  const lines = Cart.lines().map((l) => `• ${l.qty} × ${l.product.name} – ${money(l.total)}`);
  return `Hi ${STORE.name}, I'd like to order:\n${lines.join("\n")}\nSubtotal: ${money(Cart.subtotal())}`;
}

/* ------------------------------- Panels -------------------------------- */

function openPanel(id) {
  closePanels();
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.add("is-open");
  $(".overlay").classList.add("is-open");
  $(".toast").classList.remove("is-visible");
  document.body.classList.add("no-scroll");
}

function closePanels() {
  $$(".drawer.is-open, .mobile-menu.is-open, .filters.is-open").forEach((el) => el.classList.remove("is-open"));
  const overlay = $(".overlay");
  if (overlay) overlay.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
}

/* -------------------------------- Toast -------------------------------- */

let toastTimer;
function toast(message, withCartButton = false) {
  const el = $(".toast");
  if (!el) return;
  el.innerHTML = `${icon("check")}<span>${message}</span>${withCartButton ? '<button type="button" data-open="cart">View cart</button>' : ""}`;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 3000);
}

function bumpCartCount() {
  $$(".cart-count").forEach((el) => {
    el.classList.add("bump");
    setTimeout(() => el.classList.remove("bump"), 250);
  });
}

/* ------------------------------- Reveal -------------------------------- */

const revealObserver =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -40px 0px" }
      )
    : null;

function observeReveals(root = document) {
  $$(".reveal:not(.is-visible)", root).forEach((el) => {
    if (revealObserver) revealObserver.observe(el);
    else el.classList.add("is-visible");
  });
}

/* ---------------------------- Global events ---------------------------- */

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) {
    e.preventDefault();
    const id = add.dataset.add;
    const qtyInput = add.dataset.qtyFrom ? $(add.dataset.qtyFrom) : null;
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
    const product = getProduct(id);
    Cart.add(id, qty);
    bumpCartCount();
    toast(`<strong>${esc(product.name)}</strong> added to cart`, true);
    if (add.classList.contains("add-btn")) {
      add.classList.add("is-added");
      add.innerHTML = `${icon("check")}<span>Added</span>`;
      setTimeout(() => {
        add.classList.remove("is-added");
        add.innerHTML = `${icon("plus")}<span>Add</span>`;
      }, 1400);
    }
    return;
  }

  const opener = e.target.closest("[data-open]");
  if (opener) {
    e.preventDefault();
    openPanel(opener.dataset.open);
    return;
  }

  if (e.target.closest("[data-close]")) {
    closePanels();
    return;
  }

  const inc = e.target.closest("[data-qty-inc]");
  const dec = e.target.closest("[data-qty-dec]");
  if (inc || dec) {
    const id = (inc || dec).dataset[inc ? "qtyInc" : "qtyDec"];
    const line = Cart.lines().find((l) => l.product.id === id);
    if (line) Cart.setQty(id, line.qty + (inc ? 1 : -1));
    return;
  }

  const remove = e.target.closest("[data-remove]");
  if (remove) Cart.remove(remove.dataset.remove);
});

document.addEventListener("change", (e) => {
  const input = e.target.closest("[data-qty-input]");
  if (input) Cart.setQty(input.dataset.qtyInput, Math.max(0, parseInt(input.value, 10) || 0));
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanels();
});

document.addEventListener("cart:change", renderCart);

// Keep the cart in sync if it changes in another tab
window.addEventListener("storage", (e) => {
  if (e.key === "gimco-cart") location.reload();
});

/* --------------------------------- Boot -------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderCart();
  // Page-specific code (js/pages.js) registers itself on window.PAGE_INIT
  const init = window.PAGE_INIT && window.PAGE_INIT[document.body.dataset.page];
  if (init) init();
  observeReveals();
});
