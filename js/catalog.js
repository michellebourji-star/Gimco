/* ==========================================================================
   CATEGORIES + PRODUCT LOADER
   --------------------------------------------------------------------------
   Products, names and prices live in the spreadsheet  products.csv  (in the
   main folder). Open it with Excel or Google Sheets, edit, and save it again
   as CSV. See README.md for details.

   This file only lists the shop's departments ("category") and the groups
   inside them ("type"). The "category" and "type" columns in products.csv
   must use the ids below.
   ========================================================================== */

const CATEGORIES = [
  {
    id: "car",
    name: "Car Accessories",
    page: "car-accessories.html",
    description: "Floor mats, oil filters, car care, lights and everyday essentials for every car.",
    types: [
      { id: "floor-mats", name: "Floor Mats" },
      { id: "oil-filters", name: "Oil Filters" },
      { id: "cleaning", name: "Washing & Cleaning" },
      { id: "chemicals", name: "Polishes & Car Care" },
      { id: "air-fresheners", name: "Air Fresheners" },
      { id: "car-lights", name: "Car Lights" },
      { id: "interior", name: "Interior Accessories" },
      { id: "phone-holders", name: "Phone Holders" },
      { id: "emergency", name: "Emergency Equipment" },
      { id: "parts", name: "Parts & Spares" },
    ],
  },
  {
    id: "truck",
    name: "Truck Accessories",
    page: "truck-accessories.html",
    description: "LED lights, heavy-duty filters and tie-down gear for work trucks and trailers.",
    types: [
      { id: "truck-lights", name: "Truck Lights" },
      { id: "truck-filters", name: "Truck Filters" },
      { id: "tie-downs", name: "Tie-Down Equipment" },
    ],
  },
  {
    id: "tools",
    name: "Tools",
    page: "tools.html",
    description: "Hand tools, air tools, tire tools and maintenance equipment for the garage and the road.",
    types: [
      { id: "hand-tools", name: "Hand Tools & Screwdrivers" },
      { id: "wrenches", name: "Wrenches & Socket Sets" },
      { id: "pliers", name: "Pliers" },
      { id: "tire-tools", name: "Tire Tools" },
      { id: "maintenance", name: "Car Maintenance Tools" },
      { id: "air-tools", name: "Air Tools" },
      { id: "power-tools", name: "Vacuums & Power Tools" },
      { id: "work-lights", name: "Work Lights" },
      { id: "hardware", name: "Hardware" },
    ],
  },
  {
    id: "outdoor",
    name: "Camping & Outdoor",
    page: "camping-outdoor.html",
    description: "Stoves, lanterns, tents and gear for road trips and the outdoors.",
    types: [{ id: "camping", name: "Camping & Outdoor" }],
  },
];

/* Filled from products.csv when the page loads. */
let PRODUCTS = [];

// Minimal CSV parser: handles quoted fields, commas/new lines inside quotes and
// "" escapes. Accepts comma or semicolon separators (Excel in some regions).
function parseCSV(text) {
  text = text.replace(/^﻿/, "");
  const firstLine = text.slice(0, text.indexOf("\n"));
  const sep = firstLine.split(";").length > firstLine.split(",").length ? ";" : ",";
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const header = rows.shift().map((h) => h.trim().toLowerCase());
  return rows
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || "").trim()])));
}

function toPrice(value) {
  const n = parseFloat(String(value).replace(/[^0-9.,]/g, "").replace(",", "."));
  return isNaN(n) || n <= 0 ? null : n;
}

const yes = (v) => /^(yes|y|true|1|x)$/i.test(String(v).trim());

async function loadProducts() {
  const res = await fetch("products.csv", { cache: "no-cache" });
  if (!res.ok) throw new Error(`products.csv: HTTP ${res.status}`);
  const rows = parseCSV(await res.text());
  PRODUCTS = rows
    .filter((r) => r.id && r.name)
    .map((r) => ({
      id: r.id,
      name: r.name,
      price: toPrice(r.price),
      oldPrice: toPrice(r.old_price),
      category: r.category,
      type: r.type,
      brand: r.brand || "",
      description: r.description || "",
      details: r.details || "",
      inStock: r.in_stock === "" ? true : yes(r.in_stock),
      featured: yes(r.featured),
      badge: r.badge || "",
      added: r.added || "",
      image: r.image || "",
      images: [r.image, ...(r.more_images || "").split(/\s+/)].filter(Boolean),
    }));
}
