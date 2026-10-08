/* ==========================================================================
   Page-specific behaviour. Each page's <body data-page="..."> picks one of
   the functions below.
   ========================================================================== */

window.PAGE_INIT = {};

/* Fill elements marked with data-bind="..." using values from js/config.js */
function bindStoreInfo(root = document) {
  const address = `${esc(STORE.address.line1)}<br>${esc(STORE.address.line2)}`;
  const hours = `<table class="hours-table">${STORE.hours
    .map((h) => `<tr><td>${esc(h.days)}</td><td>${esc(h.time)}</td></tr>`)
    .join("")}</table>`;

  const binders = {
    name: (el) => (el.textContent = `${STORE.name} ${STORE.subtitle}`),
    phone: (el) => (el.textContent = STORE.phone),
    email: (el) => (el.textContent = STORE.email),
    address: (el) => (el.innerHTML = address),
    hours: (el) => (el.innerHTML = hours),
    "hours-note": (el) => (el.textContent = STORE.hoursNote),
    tel: (el) => (el.href = telLink()),
    whatsapp: (el) => (el.href = waLink(el.dataset.message || `Hi ${STORE.name}, I have a question.`)),
    mailto: (el) => (el.href = `mailto:${STORE.email}`),
    maplink: (el) => (el.href = mapLink()),
    map: (el) =>
      (el.innerHTML = `<iframe src="${mapEmbedUrl()}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map to ${esc(STORE.name)}"></iframe>`),
    src: (el) => {
      const src = STORE.images[el.dataset.image];
      if (src) el.src = src;
      else el.closest("figure")?.remove();
    },
    bg: (el) => {
      const src = STORE.images[el.dataset.image];
      if (src) el.style.backgroundImage = `url("${src}")`;
    },
  };

  $$("[data-bind]", root).forEach((el) => {
    el.dataset.bind.split(" ").forEach((key) => binders[key] && binders[key](el));
  });
}

document.addEventListener("DOMContentLoaded", () => bindStoreInfo(), { once: true });

/* ---------------------------------------------------------------- Home -- */

PAGE_INIT.home = () => {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  $("#featured-grid").innerHTML = featured.map(productCard).join("");

  $("#category-grid").innerHTML = CATEGORIES.map(
    (c) => `
      <a class="cat-card reveal" href="${c.page}">
        <div class="cat-card__img" style="background-image:url('${esc(STORE.images[c.id] || "")}')"></div>
        <span class="cat-card__icon">${icon(CATEGORY_ICONS[c.id] || "package")}</span>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.description)}</p>
        <div class="cat-card__tags">${c.types.map((t) => `<span>${esc(t.name)}</span>`).join("")}</div>
        <span class="cat-card__cta">Shop ${esc(c.name.toLowerCase())} ${icon("arrow")}</span>
      </a>`
  ).join("");

  $("#product-total").textContent = `${PRODUCTS.length}+`;
};

/* ---------------------------------------------------------------- Shop -- */

PAGE_INIT.shop = () => {
  const params = new URLSearchParams(location.search);
  const state = {
    q: params.get("q") || "",
    category: params.get("category") || "",
    types: new Set((params.get("type") || "").split(",").filter(Boolean)),
    brands: new Set((params.get("brand") || "").split(",").filter(Boolean)),
    min: params.get("min") || "",
    max: params.get("max") || "",
    sort: params.get("sort") || "featured",
  };

  const searchInput = $("#search");
  const sortSelect = $("#sort");
  const minInput = $("#price-min");
  const maxInput = $("#price-max");
  const grid = $("#shop-grid");

  searchInput.value = state.q;
  sortSelect.value = state.sort;
  minInput.value = state.min;
  maxInput.value = state.max;

  const PRICE_PRESETS = [
    { label: "Any price", min: "", max: "" },
    { label: "Under $15", min: "", max: "15" },
    { label: "$15 – $30", min: "15", max: "30" },
    { label: "$30 – $60", min: "30", max: "60" },
    { label: "$60 & up", min: "60", max: "" },
  ];

  function renderCategoryFilter() {
    const counts = (id) => PRODUCTS.filter((p) => !id || p.category === id).length;
    $("#filter-category").innerHTML = [{ id: "", name: "All products" }, ...CATEGORIES]
      .map(
        (c) => `
        <label class="filter-option">
          <input type="radio" name="category" value="${c.id}" ${state.category === c.id ? "checked" : ""}>
          ${esc(c.name)}<span class="count">${counts(c.id)}</span>
        </label>`
      )
      .join("");
  }

  function renderTypeFilter() {
    const cats = state.category ? [getCategory(state.category)] : CATEGORIES;
    $("#filter-type").innerHTML = cats
      .flatMap((c) => c.types.map((t) => ({ ...t, category: c.id })))
      .map((t) => {
        const count = PRODUCTS.filter((p) => p.category === t.category && p.type === t.id).length;
        return `
          <label class="filter-option">
            <input type="checkbox" value="${t.id}" ${state.types.has(t.id) ? "checked" : ""}>
            ${esc(t.name)}<span class="count">${count}</span>
          </label>`;
      })
      .join("");
  }

  // Car brand filter (floor mats, oil filters...). Only shows brands present in the current selection.
  function renderBrandFilter() {
    const counts = {};
    PRODUCTS.forEach((p) => {
      if (!p.brand) return;
      if (state.category && p.category !== state.category) return;
      if (state.types.size && !state.types.has(p.type)) return;
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    const brands = Object.keys(counts).sort((a, b) => (a === "Universal") - (b === "Universal") || a.localeCompare(b));
    $("#filter-brand-group").hidden = !brands.length;
    $("#filter-brand").innerHTML = brands
      .map(
        (b) => `
        <label class="filter-option">
          <input type="checkbox" value="${esc(b)}" ${state.brands.has(b) ? "checked" : ""}>
          ${esc(b)}<span class="count">${counts[b]}</span>
        </label>`
      )
      .join("");
  }

  function renderPricePresets() {
    $("#filter-price").innerHTML = PRICE_PRESETS.map(
      (p, i) => `
        <label class="filter-option">
          <input type="radio" name="price" value="${i}" ${state.min === p.min && state.max === p.max ? "checked" : ""}>
          ${p.label}
        </label>`
    ).join("");
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    const min = parseFloat(state.min);
    const max = parseFloat(state.max);
    const list = PRODUCTS.filter((p) => {
      if (state.category && p.category !== state.category) return false;
      if (state.types.size && !state.types.has(p.type)) return false;
      if (state.brands.size && !state.brands.has(p.brand)) return false;
      if ((!isNaN(min) || !isNaN(max)) && !p.price) return false;
      if (!isNaN(min) && p.price < min) return false;
      if (!isNaN(max) && p.price > max) return false;
      if (q) {
        const cat = getCategory(p.category);
        const haystack = [p.name, p.brand, p.description, typeName(p.category, p.type), cat ? cat.name : ""]
          .join(" ")
          .toLowerCase();
        if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      return true;
    });

    const sorters = {
      featured: (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0),
      newest: (a, b) => (b.added || "").localeCompare(a.added || ""),
      // products without a price go last
      "price-asc": (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      "price-desc": (a, b) => (b.price ?? -1) - (a.price ?? -1),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return list.sort(sorters[state.sort] || sorters.featured);
  }

  function activeChips() {
    const chips = [];
    if (state.q) chips.push({ key: "q", label: `“${state.q}”` });
    if (state.category) chips.push({ key: "category", label: getCategory(state.category).name });
    state.types.forEach((t) => {
      const cat = CATEGORIES.find((c) => c.types.some((x) => x.id === t));
      if (cat) chips.push({ key: `type:${t}`, label: typeName(cat.id, t) });
    });
    state.brands.forEach((b) => chips.push({ key: `brand:${b}`, label: b }));
    if (state.min || state.max) {
      const label = state.min && state.max ? `$${state.min} – $${state.max}` : state.min ? `$${state.min}+` : `Up to $${state.max}`;
      chips.push({ key: "price", label });
    }
    return chips;
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.category) p.set("category", state.category);
    if (state.types.size) p.set("type", [...state.types].join(","));
    if (state.brands.size) p.set("brand", [...state.brands].join(","));
    if (state.min) p.set("min", state.min);
    if (state.max) p.set("max", state.max);
    if (state.sort !== "featured") p.set("sort", state.sort);
    const qs = p.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function render() {
    const list = filtered();
    const chips = activeChips();
    $("#results-count").textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    $("#active-chips").innerHTML =
      chips.map((c) => `<button class="chip" type="button" data-chip="${esc(c.key)}">${esc(c.label)} ${icon("x")}</button>`).join("") +
      (chips.length > 1 ? `<button class="chip" type="button" data-chip="all">Clear all</button>` : "");

    const cat = state.category && getCategory(state.category);
    $("#shop-title").textContent = cat ? cat.name : "Shop all products";
    $("#shop-subtitle").textContent = cat ? cat.description : "Accessories, tools and essentials for every car and truck.";
    $("#filter-count").textContent = chips.length ? `(${chips.length})` : "";

    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<div class="empty" style="grid-column:1/-1">
          ${icon("search")}
          <h3>No products found</h3>
          <p>Try a different search or clear your filters. Can't find what you need? Ask us — we can often order it in.</p>
          <div class="hero__actions" style="justify-content:center">
            <button class="btn btn--dark" type="button" data-chip="all">Clear filters</button>
            <a class="btn btn--whatsapp" href="${waLink(`Hi ${STORE.name}, do you have ${state.q || "a product"} in stock?`)}" target="_blank" rel="noopener">${icon("whatsapp")} Ask us</a>
          </div>
        </div>`;
    observeReveals(grid);
    syncUrl();
  }

  function refreshAll() {
    renderCategoryFilter();
    renderTypeFilter();
    renderBrandFilter();
    renderPricePresets();
    minInput.value = state.min;
    maxInput.value = state.max;
    searchInput.value = state.q;
    render();
  }

  let searchTimer;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.q = searchInput.value;
      render();
    }, 150);
  });
  $("#search-form").addEventListener("submit", (e) => e.preventDefault());

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });

  $("#filters").addEventListener("change", (e) => {
    const input = e.target;
    if (input.name === "category") {
      state.category = input.value;
      // keep only types that belong to the chosen category
      const cat = getCategory(state.category);
      if (cat) state.types = new Set([...state.types].filter((t) => cat.types.some((x) => x.id === t)));
      renderTypeFilter();
      renderBrandFilter();
    } else if (input.name === "price") {
      const preset = PRICE_PRESETS[+input.value];
      state.min = preset.min;
      state.max = preset.max;
      minInput.value = state.min;
      maxInput.value = state.max;
    } else if (input.closest("#filter-type")) {
      input.checked ? state.types.add(input.value) : state.types.delete(input.value);
      renderBrandFilter();
    } else if (input.closest("#filter-brand")) {
      input.checked ? state.brands.add(input.value) : state.brands.delete(input.value);
    } else if (input === minInput || input === maxInput) {
      state.min = minInput.value;
      state.max = maxInput.value;
      renderPricePresets();
    }
    render();
  });

  document.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-chip]");
    if (!chip) return;
    const key = chip.dataset.chip;
    if (key === "all") {
      Object.assign(state, { q: "", category: "", min: "", max: "" });
      state.types.clear();
      state.brands.clear();
    } else if (key === "q") state.q = "";
    else if (key === "category") state.category = "";
    else if (key === "price") state.min = state.max = "";
    else if (key.startsWith("type:")) state.types.delete(key.slice(5));
    else if (key.startsWith("brand:")) state.brands.delete(key.slice(6));
    refreshAll();
  });

  $("#filter-toggle").addEventListener("click", () => openPanel("filters"));

  refreshAll();
};

/* ------------------------------------------------------ Category pages -- */

function initCategoryPage() {
  const cat = getCategory(document.body.dataset.page);
  const products = PRODUCTS.filter((p) => p.category === cat.id);

  $("#subnav-chips").innerHTML = cat.types
    .map((t) => `<a class="chip chip--link" href="#${t.id}">${esc(t.name)}</a>`)
    .join("");

  $("#type-sections").innerHTML = cat.types
    .map((t) => {
      const items = products.filter((p) => p.type === t.id);
      const brands = [...new Set(items.map((p) => p.brand).filter(Boolean))].sort(
        (a, b) => (a === "Universal") - (b === "Universal") || a.localeCompare(b)
      );
      const brandChips =
        brands.length > 1
          ? `<div class="chips brand-chips" data-section="${t.id}">
              <button class="chip is-active" type="button" data-brand="">All brands</button>
              ${brands.map((b) => `<button class="chip" type="button" data-brand="${esc(b)}">${esc(b)}</button>`).join("")}
            </div>`
          : "";
      return `
        <section class="type-section" id="${t.id}">
          <div class="type-section__head">
            <h2>${esc(t.name)} <span>${items.length}</span></h2>
            <a class="link-arrow" href="shop.html?category=${cat.id}&type=${t.id}">View in shop ${icon("arrow")}</a>
          </div>
          ${brandChips}
          ${
            items.length
              ? `<div class="product-grid product-grid--4" data-grid="${t.id}">${items.map(productCard).join("")}</div>`
              : `<div class="empty"><p>New ${esc(t.name.toLowerCase())} arriving soon. <a class="link-arrow" href="${waLink(`Hi ${STORE.name}, I'm looking for ${t.name.toLowerCase()}.`)}" target="_blank" rel="noopener">Ask us on WhatsApp</a></p></div>`
          }
        </section>`;
    })
    .join("");

  // Brand chips: filter a section (e.g. floor mats) by car brand
  $("#type-sections").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-brand]");
    if (!chip) return;
    const wrap = chip.closest(".brand-chips");
    const type = wrap.dataset.section;
    $$(".chip", wrap).forEach((c) => c.classList.toggle("is-active", c === chip));
    const items = products.filter((p) => p.type === type && (!chip.dataset.brand || p.brand === chip.dataset.brand));
    const grid = $(`[data-grid="${type}"]`);
    grid.innerHTML = items.map(productCard).join("");
    observeReveals(grid);
  });

  // Highlight the chip of the section currently on screen
  const chips = $$("#subnav-chips .chip");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          chips.forEach((c) => c.classList.toggle("is-active", c.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    $$(".type-section").forEach((s) => spy.observe(s));
  }
}

PAGE_INIT.car = initCategoryPage;
PAGE_INIT.truck = initCategoryPage;
PAGE_INIT.tools = initCategoryPage;

/* ------------------------------------------------------ Product detail -- */

PAGE_INIT.product = () => {
  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);
  const root = $("#product-root");

  if (!p) {
    root.innerHTML = `
      <div class="success">
        <div class="success__icon" style="background:var(--gray-100);color:var(--gray-500)">${icon("search")}</div>
        <h1>Product not found</h1>
        <p>This product may have been removed or the link is incorrect.</p>
        <a class="btn btn--primary" href="shop.html">Browse the shop</a>
      </div>`;
    return;
  }

  const cat = getCategory(p.category) || { name: "Shop", page: "shop.html" };
  const out = p.inStock === false;
  const priced = Boolean(p.price);
  const thumbs =
    p.images.length > 1
      ? `<div class="thumbs">${p.images
          .map((src, i) => `<button type="button" class="thumb ${i ? "" : "is-active"}" data-img="${esc(src)}"><img src="${esc(src)}" alt=""></button>`)
          .join("")}</div>`
      : "";
  document.title = `${p.name} | ${STORE.name} ${STORE.subtitle}`;

  root.innerHTML = `
    <nav class="breadcrumb breadcrumb--light" style="padding-top:28px" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span>/</span>
      <a href="${cat.page}">${esc(cat.name)}</a><span>/</span>
      <a href="${cat.page}#${p.type}">${esc(typeName(p.category, p.type))}</a>
    </nav>
    <div class="product-detail">
      <div class="gallery-col">
        <div class="product-gallery">
          ${productBadge(p)}
          <img id="main-img" src="${esc(p.image)}" alt="${esc(p.name)}" width="800" height="800">
        </div>
        ${thumbs}
      </div>
      <div class="product-info">
        <div class="product-card__cat">${esc(cat.name)} · ${esc(typeName(p.category, p.type))}${p.brand ? ` · ${esc(p.brand)}` : ""}</div>
        <h1>${esc(p.name)}</h1>
        <div class="price">${priceHtml(p)}</div>
        <div class="stock ${out ? "stock--out" : ""}">${out ? "Out of stock — ask us about availability" : "In stock · Ready for pickup today"}</div>
        <p class="lead">${esc(p.description)}</p>
        ${p.details ? `<p>${esc(p.details)}</p>` : ""}
        ${
          p.features && p.features.length
            ? `<ul class="feature-list">${p.features.map((f) => `<li>${icon("check")}${esc(f)}</li>`).join("")}</ul>`
            : ""
        }
        ${
          priced
            ? ""
            : `<div class="notice" style="margin:0 0 20px">${icon("info")}<span>Message or call us for the current price and availability.</span></div>`
        }
        <div class="buy-row" ${priced && !out ? "" : "hidden"}>
          <div class="qty">
            <button type="button" data-step="-1" aria-label="Decrease quantity">${icon("minus")}</button>
            <input id="detail-qty" type="number" min="1" max="99" value="1" aria-label="Quantity">
            <button type="button" data-step="1" aria-label="Increase quantity">${icon("plus")}</button>
          </div>
          <button class="btn btn--primary btn--lg" type="button" data-add="${esc(p.id)}" data-qty-from="#detail-qty" ${out ? "disabled" : ""}>
            ${icon("bag")} ${out ? "Out of stock" : "Add to cart"}
          </button>
        </div>
        <div class="contact-row">
          <a class="btn btn--whatsapp" href="${priced ? waLink(`Hi ${STORE.name}, I'm interested in: ${p.name} (${money(p.price)}). Is it available?`) : askPriceLink(p)}" target="_blank" rel="noopener">${icon("whatsapp")} ${priced ? "Ask on WhatsApp" : "Ask price on WhatsApp"}</a>
          <a class="btn btn--outline" href="${telLink()}">${icon("phone")} Call the shop</a>
        </div>
        <div class="assurances">
          <div>${icon("store")} Pick up in store — usually ready within the hour</div>
          <div>${icon("truck")} Local delivery available${STORE.freeDeliveryOver ? ` · free over ${money(STORE.freeDeliveryOver)}` : " (delivery fee applies)"}</div>
          <div>${icon("shield")} No returns</div>
        </div>
      </div>
    </div>`;

  root.addEventListener("click", (e) => {
    const thumb = e.target.closest("[data-img]");
    if (thumb) {
      $("#main-img").src = thumb.dataset.img;
      $$(".thumb", root).forEach((t) => t.classList.toggle("is-active", t === thumb));
      return;
    }
    const step = e.target.closest("[data-step]");
    if (!step) return;
    const input = $("#detail-qty");
    input.value = Math.min(99, Math.max(1, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
  });

  const related = PRODUCTS.filter((x) => x.id !== p.id && x.category === p.category)
    .sort((a, b) => (b.type === p.type) - (a.type === p.type))
    .slice(0, 4);
  $("#related-grid").innerHTML = related.map(productCard).join("");
  $("#related-link").href = cat.page;
};

/* ------------------------------------------------------------ Checkout -- */

PAGE_INIT.checkout = () => {
  const form = $("#checkout-form");
  const summary = $("#order-summary");
  const addressField = $("#address-field");

  function renderSummary() {
    const lines = Cart.lines();
    if (!lines.length && !form.dataset.sent) {
      $("#checkout-root").innerHTML = `
        <div class="success">
          <div class="success__icon" style="background:var(--gray-100);color:var(--gray-500)">${icon("bag")}</div>
          <h1>Your cart is empty</h1>
          <p>Add a few products and come back here to place your order.</p>
          <a class="btn btn--primary" href="shop.html">Browse the shop</a>
        </div>`;
      return;
    }
    const subtotal = Cart.subtotal();
    const delivery = form.elements.fulfillment.value === "delivery";
    const free = STORE.freeDeliveryOver && subtotal >= STORE.freeDeliveryOver;
    summary.innerHTML = `
      <h3>Order summary</h3>
      ${lines.map((l) => cartLineHtml(l, false)).join("")}
      <div class="order-summary__lines">
        <div class="summary-line"><span>Subtotal</span><span>${money(subtotal)}</span></div>
        <div class="summary-line"><span>${delivery ? "Delivery" : "Store pickup"}</span><span>${!delivery ? "Free" : free ? "Free" : "Confirmed by phone"}</span></div>
        <div class="summary-line summary-line--total"><span>Total${delivery && !free ? " (+ delivery)" : ""}</span><span>${money(subtotal)}</span></div>
      </div>
      ${delivery ? `<div style="margin-top:14px">${freeDeliveryHtml(subtotal)}</div>` : ""}
      <a class="link-arrow" style="margin-top:16px" href="#" data-open="cart">Edit cart ${icon("arrow")}</a>`;
  }

  function toggleAddress() {
    const delivery = form.elements.fulfillment.value === "delivery";
    addressField.hidden = !delivery;
    form.elements.address.required = delivery;
    renderSummary();
  }

  function validate() {
    let ok = true;
    $$(".field", form).forEach((field) => {
      const input = $("input, textarea, select", field);
      if (!input || field.hidden) return;
      let valid = input.checkValidity();
      if (input.name === "phone") valid = valid && input.value.replace(/\D/g, "").length >= 7;
      field.classList.toggle("has-error", !valid);
      if (!valid && ok) {
        input.focus();
        ok = false;
      }
    });
    return ok;
  }

  function buildMessage(orderId) {
    const f = form.elements;
    const lines = Cart.lines().map((l) => `• ${l.qty} × ${l.product.name} – ${money(l.total)}`);
    const delivery = f.fulfillment.value === "delivery";
    return [
      `NEW ORDER ${orderId} – ${STORE.name} ${STORE.subtitle}`,
      "",
      ...lines,
      "",
      `Subtotal: ${money(Cart.subtotal())}`,
      "",
      `Name: ${f.name.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      f.email.value.trim() ? `Email: ${f.email.value.trim()}` : null,
      delivery ? `Delivery to: ${f.address.value.trim()}` : "Store pickup",
      `Payment: ${f.payment.value}`,
      `Preferred contact: ${f.contact.value}`,
      f.notes.value.trim() ? `Notes: ${f.notes.value.trim()}` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");
  }

  function send(channel) {
    if (!validate()) return;
    const orderId = "#G" + Date.now().toString().slice(-6);
    const message = buildMessage(orderId);
    if (channel === "whatsapp") {
      window.open(waLink(message), "_blank", "noopener");
    } else {
      location.href = `mailto:${STORE.email}?subject=${encodeURIComponent(`Order ${orderId}`)}&body=${encodeURIComponent(message)}`;
    }
    form.dataset.sent = "1";
    const name = form.elements.name.value.trim().split(" ")[0];
    Cart.clear();
    $("#checkout-root").innerHTML = `
      <div class="success">
        <div class="success__icon">${icon("check")}</div>
        <h1>Thank you${name ? `, ${esc(name)}` : ""}!</h1>
        <p>Your order <strong>${orderId}</strong> has been prepared and ${channel === "whatsapp" ? "opened in WhatsApp" : "opened in your email app"}. Just press <strong>send</strong> there, and we'll confirm availability and total as soon as possible.</p>
        <p style="color:var(--gray-500)">Didn't open? Call us on <a href="${telLink()}"><strong>${esc(STORE.phone)}</strong></a> and mention your order number.</p>
        <div class="hero__actions" style="justify-content:center;margin-top:24px">
          <a class="btn btn--dark" href="shop.html">Continue shopping</a>
          <a class="btn btn--outline" href="index.html">Back to home</a>
        </div>
      </div>`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "fulfillment") toggleAddress();
    const field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) validate();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(e.submitter && e.submitter.value === "email" ? "email" : "whatsapp");
  });

  document.addEventListener("cart:change", () => {
    if (!form.dataset.sent) renderSummary();
  });

  toggleAddress();
};

/* ------------------------------------------------------------- Contact -- */

PAGE_INIT.contact = () => {
  const form = $("#contact-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const f = form.elements;
    const text = `Hi ${STORE.name}, my name is ${f.name.value.trim()} (${f.phone.value.trim()}).\n\n${f.message.value.trim()}`;
    if (e.submitter && e.submitter.value === "email") {
      location.href = `mailto:${STORE.email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(text)}`;
    } else {
      window.open(waLink(text), "_blank", "noopener");
    }
    toast("Message ready — just press send");
    form.reset();
  });
};
