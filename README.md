# GIMCO Petroleum — Website

A clean, fast, mobile-friendly online shop for a gas station and automotive
accessories store. It's plain HTML, CSS and JavaScript: no build step, no database,
no monthly platform fees. Upload the folder to any web host (GitHub Pages, Netlify,
your hosting provider…) and it works.

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Shop (search, filters, car-brand filter, sorting) | `shop.html` |
| Car Accessories | `car-accessories.html` |
| Truck Accessories | `truck-accessories.html` |
| Tools | `tools.html` |
| Camping & Outdoor | `camping-outdoor.html` |
| Product details | `product.html?id=…` (one page for every product) |
| Checkout / order form | `checkout.html` |
| About | `about.html` |
| Contact | `contact.html` |

## Editing your products and prices: `products.csv`

All 251 products are in **`products.csv`**, a spreadsheet with one row per product.
Open it in **Excel** or **Google Sheets**, make your changes, and save it again as
**CSV** (in Excel: *File → Save As → CSV UTF-8*). Upload the saved file to replace the old one.

| Column | What it does |
| --- | --- |
| `id` | Unique code for the product, used in its web address. **Don't change it** once the site is live. |
| `name` | Product name shown on the site. |
| `price` | Price, e.g. `12.50`. **Leave empty** to show "Price on request" with an "Ask price" WhatsApp button instead of "Add to cart". |
| `old_price` | Optional original price; shows it crossed out with a "Sale" badge. |
| `category` | `car`, `truck`, `tools` or `outdoor`. |
| `type` | The section inside the category, e.g. `floor-mats`, `oil-filters`, `truck-lights`. The full list is in `js/catalog.js`. |
| `brand` | Car brand (floor mats and filters). Powers the "Car brand" filter. |
| `description` | Short text shown on the product card and page. |
| `details` | Optional longer text for the product page. |
| `in_stock` | `yes` or `no`. |
| `featured` | `yes` to show on the homepage (8 are shown). |
| `badge` | Optional label such as `New`, `Sale` or `Best seller`. |
| `added` | Date (YYYY-MM-DD) used by the "Newest" sort. |
| `image` | Main photo, e.g. `images/products/getsun-car-wax.jpg`. |
| `more_images` | Extra photos for the product page, separated by spaces. |

- **Change a price or name:** edit that cell.
- **Remove a product:** delete its row.
- **Add a product:** add a row with a new unique `id`, and copy its photo into `images/products/`.

## Business details: `js/config.js`
Name, phone, **WhatsApp number**, email, address, opening hours, social media links,
free-delivery threshold and the large banner photos. Changes appear everywhere on the site.

> ⚠️ The phone, WhatsApp number, email and address are placeholders. Replace them
> before going live, because orders are sent to the WhatsApp number and email in this file.

## Product photos
Your 273 photos were converted to clean, square JPGs in `images/products/`.
Where the same product was photographed more than once, the extra photos appear as
thumbnails on its product page. `tools/import_photos.py` converts new photos the same way.

## How ordering works
1. Customers add products to the cart (it's saved in their browser).
2. On checkout they enter name, phone, pickup or delivery, and notes.
3. The order is sent to your **WhatsApp** (or **email**) as a ready-made message
   with the items, quantities, total and customer details.
4. You confirm by WhatsApp or phone; payment is in store or on delivery.

No payment is taken online. If you later want card payments, a service such as
Stripe Payment Links or Shopify Buy Button can be added to the checkout page.

## Preview locally
The product list loads from `products.csv`, which browsers only allow when the site
is served from a web host or a local server (not by double-clicking `index.html`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Design
Colors, spacing and corner rounding are defined at the top of `css/styles.css`
(`--red`, `--black`, `--radius`, …). Change `--red` to re-brand the accent color.
