# Image Assets

This directory contains all static image assets for the PlushifyMe application.

## Directory Structure

### `/gallery/`

Contains mock plushie-generated images for the user gallery (UI only).

- `original-{n}.jpg` - Original uploaded photos
- `plushie-{n}.jpg` - Generated plushie versions

**Required:** 10 image pairs for mock gallery

### `/examples/`

Contains before/after example pairs for the landing page showcase.

- `before-{category}-{n}.jpg` - Original photos
- `after-{category}-{n}.jpg` - Plushie transformations

**Categories:** people, pets, kids, groups
**Required:** 8 example pairs (2 per category)

### `/styles/`

Contains preview thumbnails for different plushie styles.

- `cute-fluffy.jpg` - Cute & Fluffy style preview
- `realistic-plush.jpg` - Realistic Plush style preview
- `cartoon-style.jpg` - Cartoon Style style preview
- `minimalist.jpg` - Minimalist style preview

**Required:** 4 style preview images

### `/logo/`

Contains logo and branding assets.

- `logo.svg` - Main PlushifyMe logo
- `logo-dark.svg` - Dark mode logo (optional)
- `favicon.ico` - Browser favicon
- `og-image.jpg` - Open Graph image for social sharing

## Image Specifications

### Gallery & Examples

- **Format:** JPG or WebP
- **Dimensions:** Minimum 800x800px (square aspect ratio preferred)
- **File Size:** Under 500KB per image
- **Quality:** High quality, well-lit photos

### Style Previews

- **Format:** JPG or WebP
- **Dimensions:** 400x400px
- **File Size:** Under 200KB
- **Content:** Clear example of each plushie style

### Logo

- **Format:** SVG (scalable)
- **Colors:** Should work on light and dark backgrounds
- **Size:** Optimized SVG (under 50KB)

### Favicon

- **Format:** ICO or SVG
- **Sizes:** 16x16, 32x32, 48x48

### OG Image

- **Format:** JPG or PNG
- **Dimensions:** 1200x630px (Facebook/Twitter standard)
- **File Size:** Under 1MB
- **Content:** Branded image with text about PlushifyMe

## Placeholder Images

During Phase 1 development, you can use:

- **Placeholder services:** https://placehold.co/ or https://picsum.photos/
- **AI-generated images:** DALL-E, Midjourney, or similar
- **Stock photos:** Unsplash, Pexels (ensure commercial use is allowed)

## Phase 2 Considerations

In Phase 2, real user-uploaded images will be stored in cloud storage (S3/Cloudflare R2) rather than the public directory. These placeholder images are only for UI development and demonstration purposes.
