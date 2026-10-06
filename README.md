# GIMCO Auto & Fuel — Website

A clean, fast, mobile-friendly online shop for a gas station and automotive
accessories store. It's plain HTML, CSS and JavaScript: no build step, no database,
no monthly platform fees. Upload the folder to any web host (GitHub Pages, Netlify,
your hosting provider…) and it works.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Shop (search, filters, sorting) | `shop.html` |
| Car Accessories | `car-accessories.html` |
| Truck Accessories | `truck-accessories.html` |
| Tools | `tools.html` |
| Product details | `product.html?id=…` (one page for every product) |
| Checkout / order form | `checkout.html` |
| About | `about.html` |
| Contact | `contact.html` |

## Editing your store (the only 2 files you normally need)

### 1. Business details — `js/config.js`
Name, phone, **WhatsApp number**, email, address, opening hours, social media links,
free-delivery threshold and the large photos (homepage hero, category banners,
About page). Changes appear everywhere on the site automatically.

> ⚠️ The phone, WhatsApp number, email and address are placeholders. Replace them
> before going live, because orders are sent to the WhatsApp number and email in this file.

### 2. Products & prices — `js/products.js`
Every product is one block like this:

```js
{
  id: "dual-usb-c-car-charger",     // unique, lowercase, no spaces
  name: "Dual USB-C Fast Car Charger 48W",
  price: 18.99,
  oldPrice: 24.99,                  // optional: shows a crossed-out "was" price
  category: "car",                  // "car", "truck" or "tools"
  type: "car-chargers",             // a type id listed at the top of the file
  image: "images/products/car-charger.svg",
  description: "Short line shown on the product card.",
  details: "Longer text shown on the product page.",
  features: ["2× USB-C", "Works with 12V & 24V"],
  featured: true,                   // optional: show on the homepage
  added: "2026-09-10",              // used by the "Newest" sort
  inStock: true,                    // false = "Out of stock"
  badge: "New",                     // optional: "New", "Sale", "Best seller"…
},
```

- **Change a price:** edit `price`.
- **Remove a product:** delete its `{ … },` block.
- **Add a product:** copy a block, paste it below, and change the `id` and details.
- **New product type:** add it to the `types` list of its category at the top of
  the file. It automatically appears in the filters and on the category page.

### Product photos
The catalog ships with matching studio-style illustrations so it looks finished
from day one. To use real photos, copy them into `images/products/`
(square photos about 800×800 px work best) and point `image` at them, e.g.
`image: "images/products/my-charger.jpg"`. You can also use a full web address.

## How ordering works
1. Customers add products to the cart (it's saved in their browser).
2. On checkout they enter name, phone, pickup or delivery, and notes.
3. The order is sent to your **WhatsApp** (or **email**) as a ready-made message
   with the items, quantities, total and customer details.
4. You confirm by WhatsApp or phone; payment is in store or on delivery.

No payment is taken online. If you later want card payments, a service such as
Stripe Payment Links or Shopify Buy Button can be added to the checkout page.

## Preview locally
Open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design
Colors, spacing and corner rounding are defined at the top of `css/styles.css`
(`--red`, `--black`, `--radius`, …). Change `--red` to re-brand the accent color.
