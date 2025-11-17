// Application Constants

// Pricing Plans
export const PRICING_PLANS = {
  BASIC: {
    name: "Basic",
    credits: 30,
    price: 9.95,
    features: [
      "30 credits",
      "Standard processing",
      "24-hour support",
      "Access to all styles",
    ],
  },
  PRO: {
    name: "Pro",
    credits: 100,
    price: 19.95,
    popular: true,
    features: [
      "100 credits",
      "Priority processing",
      "Email support",
      "Style presets",
      "Advanced editing tools",
    ],
  },
  ELITE: {
    name: "Elite",
    credits: 200,
    price: 29.95,
    features: [
      "200 credits",
      "Ultra-fast processing",
      "Premium support",
      "Advanced styles",
      "Commercial license",
      "Priority queue",
    ],
  },
} as const;

// Plushie Styles
export const PLUSHIE_STYLES = {
  CUTE_FLUFFY: {
    id: "cute-fluffy",
    name: "Cute & Fluffy",
    description: "Soft, cuddly plushie with a kawaii aesthetic",
  },
  REALISTIC: {
    id: "realistic-plush",
    name: "Realistic Plush",
    description: "Detailed and lifelike plushie representation",
  },
  CARTOON: {
    id: "cartoon-style",
    name: "Cartoon Style",
    description: "Fun, animated cartoon-like plushie",
  },
  MINIMALIST: {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, simple design with minimal details",
  },
} as const;

// Image Upload Settings
export const IMAGE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB in bytes
  ACCEPTED_FORMATS: ["image/jpeg", "image/png", "image/webp"],
  ACCEPTED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

// Credits
export const CREDITS = {
  PER_GENERATION: 1,
} as const;

// App Routes
export const ROUTES = {
  HOME: "/",
  PRICING: "/pricing",
  DOCS: "/docs",
  DOCS_GETTING_STARTED: "/docs/getting-started",
  DOCS_HOW_TO_USE: "/docs/how-to-use",
  FAQ: "/faq",
  TERMS: "/terms",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  DASHBOARD: "/dashboard",
  GALLERY: "/gallery",
  CREDITS: "/credits",
  SETTINGS: "/settings",
} as const;

// Site Config
export const SITE_CONFIG = {
  name: "PlushifyMe",
  description:
    "Transform your photos into adorable plushie versions with AI. Upload images of yourself, friends, family, or pets and watch them become cute plushies.",
  url: "https://plushifyme.com",
  ogImage: "https://plushifyme.com/og.jpg",
  links: {
    twitter: "https://twitter.com/plushifyme",
    github: "https://github.com/plushifyme",
  },
} as const;
