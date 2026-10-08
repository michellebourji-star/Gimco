/* ==========================================================================
   STORE SETTINGS
   --------------------------------------------------------------------------
   Edit the values below to change your business details everywhere on the
   website (header, footer, contact page, checkout, WhatsApp links...).
   ========================================================================== */

const STORE = {
  name: "GIMCO",
  subtitle: "Petroleum",
  tagline: "Gas station · Car & truck accessories · Tools",

  // Phone number as it should be DISPLAYED on the site
  phone: "+961 71 921 027",
  // Phone number used for "tap to call" links (digits only, with country code)
  phoneLink: "+96171921027",
  // WhatsApp number: digits only, with country code, no "+" or spaces
  whatsapp: "96171921027",
  email: "Gimco_Petroliom@hotmail.com",

  address: {
    line1: "Sfayla",
    line2: "Lebanon",
  },
  // Text used to search Google Maps for the map on the homepage/contact page
  // (can also be exact coordinates, e.g. "33.8512, 35.6431")
  mapQuery: "Gimco Petroleum, Sfayla, Lebanon",
  // Your Google Maps link, used by "Get directions" and the address links
  mapUrl: "https://maps.app.goo.gl/5kg9iABxA772QjGe7",

  hours: [{ days: "Every day", time: "6:00 AM – 9:00 PM" }],
  hoursNote: "Open 7 days a week",

  // Leave a link empty ("") to hide that icon
  social: {
    facebook: "",
    instagram: "https://www.instagram.com/gimco.petroleum",
    tiktok: "https://www.tiktok.com/@gimcopetroleum",
    youtube: "",
  },

  currencySymbol: "$",
  // Orders at or above this amount get free local delivery (0 = delivery is never free)
  freeDeliveryOver: 0,

  // Large photos used around the site. Replace with your own photos, e.g.
  // "images/hero.jpg" after copying the file into the images folder.
  images: {
    hero: "images/station-front.jpg",
    car: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
    truck: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    tools: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1200&q=80",
    outdoor: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1200&q=80",
    about: "images/station-front.jpg",
  },
};
