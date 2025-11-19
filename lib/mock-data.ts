/**
 * Mock data for UI development (Phase 1)
 * This data simulates backend responses and will be replaced in Phase 2
 */

// Mock User Data
export const mockUser = {
  id: "user_123",
  email: "demo@plushifyme.com",
  name: "Demo User",
  avatar: null,
  credits: 85,
  createdAt: new Date("2024-01-15"),
};

// Mock Gallery Items
export interface GalleryItem {
  id: string;
  originalImage: string;
  generatedImage: string;
  style: string;
  createdAt: Date;
  prompt?: string;
}

export const mockGalleryItems: GalleryItem[] = [
  {
    id: "img_1",
    originalImage: "/images/gallery/original-1.jpg",
    generatedImage: "/images/gallery/plushie-1.jpg",
    style: "cute-fluffy",
    createdAt: new Date("2024-11-15T10:30:00"),
    prompt: "Person in casual outfit",
  },
  {
    id: "img_2",
    originalImage: "/images/gallery/original-2.jpg",
    generatedImage: "/images/gallery/plushie-2.jpg",
    style: "realistic-plush",
    createdAt: new Date("2024-11-14T15:20:00"),
    prompt: "Golden retriever dog",
  },
  {
    id: "img_3",
    originalImage: "/images/gallery/original-3.jpg",
    generatedImage: "/images/gallery/plushie-3.jpg",
    style: "cartoon-style",
    createdAt: new Date("2024-11-14T09:15:00"),
    prompt: "Young child smiling",
  },
  {
    id: "img_4",
    originalImage: "/images/gallery/original-4.jpg",
    generatedImage: "/images/gallery/plushie-4.jpg",
    style: "minimalist",
    createdAt: new Date("2024-11-13T14:45:00"),
    prompt: "Cat portrait",
  },
  {
    id: "img_5",
    originalImage: "/images/gallery/original-5.jpg",
    generatedImage: "/images/gallery/plushie-5.jpg",
    style: "cute-fluffy",
    createdAt: new Date("2024-11-12T11:00:00"),
    prompt: "Family photo",
  },
  {
    id: "img_6",
    originalImage: "/images/gallery/original-6.jpg",
    generatedImage: "/images/gallery/plushie-6.jpg",
    style: "realistic-plush",
    createdAt: new Date("2024-11-11T16:30:00"),
    prompt: "Best friends",
  },
  {
    id: "img_7",
    originalImage: "/images/gallery/original-7.jpg",
    generatedImage: "/images/gallery/plushie-7.jpg",
    style: "cartoon-style",
    createdAt: new Date("2024-11-10T13:20:00"),
    prompt: "Graduation photo",
  },
  {
    id: "img_8",
    originalImage: "/images/gallery/original-8.jpg",
    generatedImage: "/images/gallery/plushie-8.jpg",
    style: "cute-fluffy",
    createdAt: new Date("2024-11-09T10:10:00"),
    prompt: "Baby portrait",
  },
  {
    id: "img_9",
    originalImage: "/images/gallery/original-9.jpg",
    generatedImage: "/images/gallery/plushie-9.jpg",
    style: "minimalist",
    createdAt: new Date("2024-11-08T15:45:00"),
    prompt: "Couple selfie",
  },
  {
    id: "img_10",
    originalImage: "/images/gallery/original-10.jpg",
    generatedImage: "/images/gallery/plushie-10.jpg",
    style: "realistic-plush",
    createdAt: new Date("2024-11-07T12:25:00"),
    prompt: "Wedding photo",
  },
];

// Before/After Example Pairs for Landing Page
export interface BeforeAfterPair {
  id: string;
  before: string;
  after: string;
  category: "people" | "pets" | "groups" | "kids";
  title: string;
}

export const mockBeforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "example_1",
    before: "/images/examples/before-person-1.jpg",
    after: "/images/examples/after-person-1.jpg",
    category: "people",
    title: "Professional Portrait",
  },
  {
    id: "example_2",
    before: "/images/examples/before-pet-1.jpg",
    after: "/images/examples/after-pet-1.jpg",
    category: "pets",
    title: "Adorable Golden Retriever",
  },
  {
    id: "example_3",
    before: "/images/examples/before-kid-1.jpg",
    after: "/images/examples/after-kid-1.jpg",
    category: "kids",
    title: "Smiling Child",
  },
  {
    id: "example_4",
    before: "/images/examples/before-group-1.jpg",
    after: "/images/examples/after-group-1.jpg",
    category: "groups",
    title: "Best Friends",
  },
  {
    id: "example_5",
    before: "/images/examples/before-person-2.jpg",
    after: "/images/examples/after-person-2.jpg",
    category: "people",
    title: "Casual Portrait",
  },
  {
    id: "example_6",
    before: "/images/examples/before-pet-2.jpg",
    after: "/images/examples/after-pet-2.jpg",
    category: "pets",
    title: "Fluffy Cat",
  },
  {
    id: "example_7",
    before: "/images/examples/before-kid-2.jpg",
    after: "/images/examples/after-kid-2.jpg",
    category: "kids",
    title: "Baby Portrait",
  },
  {
    id: "example_8",
    before: "/images/examples/before-group-2.jpg",
    after: "/images/examples/after-group-2.jpg",
    category: "groups",
    title: "Family Photo",
  },
];

// FAQ Data
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "credits" | "technical" | "privacy";
}

export const mockFAQData: FAQItem[] = [
  // General Questions
  {
    id: "faq_1",
    question: "What is PlushifyMe?",
    answer:
      "PlushifyMe is an AI-powered service that transforms your photos into adorable plushie versions. Simply upload a photo of yourself, a friend, family member, or pet, and our AI will create a cute plushie-style image.",
    category: "general",
  },
  {
    id: "faq_2",
    question: "How does it work?",
    answer:
      "Our advanced AI analyzes your uploaded photo and applies artistic transformations to create a plushie-style version. The process typically takes 3-5 seconds and produces a high-quality, downloadable image.",
    category: "general",
  },
  {
    id: "faq_3",
    question: "What images work best?",
    answer:
      "For best results, use clear, well-lit photos with the subject facing the camera. Close-up portraits work particularly well. Avoid blurry images or photos with busy backgrounds.",
    category: "general",
  },
  {
    id: "faq_4",
    question: "Can I use photos of multiple people?",
    answer:
      "Yes! Our AI can handle group photos and will transform each person into a plushie. However, for the best quality, we recommend photos with 1-3 people.",
    category: "general",
  },
  {
    id: "faq_5",
    question: "Is there a mobile app?",
    answer:
      "Currently, PlushifyMe is a web application that works on any device with a browser. A dedicated mobile app is planned for future release.",
    category: "general",
  },

  // Credits & Pricing
  {
    id: "faq_6",
    question: "What are credits?",
    answer:
      "Credits are the currency used to generate plushie images. Each image generation costs 1 credit. You can purchase credits in different packages based on your needs.",
    category: "credits",
  },
  {
    id: "faq_7",
    question: "How much does each generation cost?",
    answer:
      "Each plushie generation costs 1 credit. Our pricing packages offer credits at different rates: Basic (30 credits for $9.95), Pro (100 credits for $19.95), and Elite (200 credits for $29.95).",
    category: "credits",
  },
  {
    id: "faq_8",
    question: "Do credits expire?",
    answer:
      "No, your credits never expire! You can use them whenever you want, at your own pace.",
    category: "credits",
  },
  {
    id: "faq_9",
    question: "Can I get a refund?",
    answer:
      "We offer refunds within 14 days of purchase if you haven't used any credits. Once credits are used, they cannot be refunded. Please see our refund policy for details.",
    category: "credits",
  },
  {
    id: "faq_10",
    question: "Can I upgrade or downgrade my plan?",
    answer:
      "You can purchase additional credit packages at any time. All credits are added to your account balance and can be used whenever you need them.",
    category: "credits",
  },
  {
    id: "faq_11",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover) and digital payment methods through our secure payment processor, Stripe.",
    category: "credits",
  },

  // Technical Questions
  {
    id: "faq_12",
    question: "What file formats are supported?",
    answer:
      "We support JPEG, PNG, and WebP image formats. These are the most common formats and work well with our AI processing.",
    category: "technical",
  },
  {
    id: "faq_13",
    question: "What's the maximum file size?",
    answer:
      "The maximum file size is 10MB. Most phone photos and standard images fall well within this limit.",
    category: "technical",
  },
  {
    id: "faq_14",
    question: "How long does generation take?",
    answer:
      "Most generations complete in 3-5 seconds. During peak times, it may take up to 10 seconds. Pro and Elite plan users get priority processing for faster results.",
    category: "technical",
  },
  {
    id: "faq_15",
    question: "What resolution are the generated images?",
    answer:
      "Generated plushie images are high-quality and suitable for sharing on social media, printing, or use as profile pictures. The exact resolution depends on your original image quality.",
    category: "technical",
  },
  {
    id: "faq_16",
    question: "Can I edit the generated plushie?",
    answer:
      "Currently, you can choose from different plushie styles before generation. Advanced editing features are planned for future updates.",
    category: "technical",
  },

  // Privacy & Security
  {
    id: "faq_17",
    question: "Is my data safe?",
    answer:
      "Yes! We use industry-standard encryption and security practices to protect your data. All images are transmitted securely over HTTPS.",
    category: "privacy",
  },
  {
    id: "faq_18",
    question: "Do you store my images?",
    answer:
      "We store your generated plushie images in your private gallery for easy access. Original photos are only stored temporarily during processing and can be deleted at any time.",
    category: "privacy",
  },
  {
    id: "faq_19",
    question: "Can I delete my images?",
    answer:
      "Yes! You have full control over your images and can delete them from your gallery at any time. Once deleted, they are permanently removed from our servers.",
    category: "privacy",
  },
  {
    id: "faq_20",
    question: "Who can see my generated images?",
    answer:
      "Your images are completely private by default. Only you can see them in your gallery. We never share your images with third parties or use them for marketing without your explicit permission.",
    category: "privacy",
  },
  {
    id: "faq_21",
    question: "Do you use my images for AI training?",
    answer:
      "No, we do not use your uploaded images or generated plushies for AI training or model improvement. Your images are for your personal use only.",
    category: "privacy",
  },
];

// Credit Usage History (for Credits page)
export interface CreditTransaction {
  id: string;
  type: "purchase" | "generation";
  credits: number;
  description: string;
  date: Date;
}

export const mockCreditHistory: CreditTransaction[] = [
  {
    id: "tx_1",
    type: "generation",
    credits: -1,
    description: "Generated plushie image",
    date: new Date("2024-11-15T10:30:00"),
  },
  {
    id: "tx_2",
    type: "generation",
    credits: -1,
    description: "Generated plushie image",
    date: new Date("2024-11-14T15:20:00"),
  },
  {
    id: "tx_3",
    type: "purchase",
    credits: 100,
    description: "Purchased Pro Plan",
    date: new Date("2024-11-10T12:00:00"),
  },
  {
    id: "tx_4",
    type: "generation",
    credits: -1,
    description: "Generated plushie image",
    date: new Date("2024-11-09T10:10:00"),
  },
  {
    id: "tx_5",
    type: "generation",
    credits: -1,
    description: "Generated plushie image",
    date: new Date("2024-11-08T15:45:00"),
  },
];
