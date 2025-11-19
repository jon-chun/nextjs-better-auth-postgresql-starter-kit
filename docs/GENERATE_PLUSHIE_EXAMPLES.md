# Generate Plushie Example Images

**Last Updated:** November 19, 2025

This guide explains how to generate high-quality plushie transformation examples for the PlushifyMe homepage using OpenAI DALL-E 3.

---

## Overview

The homepage "See the Magic in Action" section displays before/after comparisons of photos transformed into plushies. Instead of using placeholder images, we use real AI-generated plushie versions stored locally in the repository.

### What's Included

- **32 Original Photos**: Downloaded from Unsplash (8 per category)
- **32 Plushie Versions**: Generated using DALL-E 3 (created by you)
- **Categories**: People, Pets, Kids, Groups

---

## Prerequisites

### 1. OpenAI API Access

You need an active OpenAI API key with DALL-E 3 access:

```bash
# Check your .env file has:
OPENAI_API_KEY=sk-proj-...
OPENAI_ORG_ID=org-...  # Optional but recommended
```

**Get API Key**: https://platform.openai.com/api-keys

### 2. Sufficient Credits

**Cost Estimate:**
- Standard Quality (1024×1024): ~$0.04 per image
- **Total Cost**: 32 images × $0.04 = **~$1.28**

**Check Balance**: https://platform.openai.com/account/billing

---

## Quick Start

### Step 1: Download Original Images (Already Done)

The original images have been downloaded from Unsplash:

```bash
# Verify downloads (should show 32 images)
ls -lh public/images/examples/*_original.jpg | wc -l

# View file sizes
du -sh public/images/examples/
```

### Step 2: Preview Generation (Dry Run)

Test what will be generated without using API credits:

```bash
npm run generate:plushies:dry-run
```

This shows:
- Which images will be processed
- Cost estimate
- Prompts that will be used
- No actual API calls made

### Step 3: Generate Plushies

**Option A: Generate All (Recommended)**

```bash
npm run generate:plushies
```

This will:
1. Show cost estimate (~$1.28)
2. Wait 5 seconds for you to cancel (Ctrl+C)
3. Generate all 32 plushie versions
4. Save as `{category}_{number}_plushie.png`
5. Take ~3-5 minutes total

**Option B: Generate by Category**

```bash
# Generate only people
npm run generate:plushies -- --category=people

# Generate only pets
npm run generate:plushies -- --category=pets

# Generate only kids
npm run generate:plushies -- --category=kids

# Generate only groups
npm run generate:plushies -- --category=groups
```

**Option C: Text-Only Mode (Fallback)**

If image-based generation has issues:

```bash
npm run generate:plushies:text-only
```

---

## Command Reference

### Basic Commands

```bash
# Generate all plushies
npm run generate:plushies

# Dry run (no API calls, no cost)
npm run generate:plushies:dry-run

# Generate specific category
npm run generate:plushies -- --category=people

# Force regenerate existing plushies
npm run generate:plushies -- --force

# Text-only generation (fallback method)
npm run generate:plushies:text-only
```

### Advanced Usage

```bash
# Combine flags
npm run generate:plushies -- --category=pets --force

# Dry run for specific category
npm run generate:plushies:dry-run -- --category=kids

# Direct TypeScript execution
npx tsx lib/generate-example-plushies.ts --help
```

---

## Generated Prompts

The script uses high-quality, category-specific prompts to ensure realistic plushie transformations:

### People Category

```
Transform this person into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the person's key features (hair style/color, clothing style, pose, expression)
- Have a soft, cuddly appearance with visible fabric texture
- Show realistic plushie details: stitching, button eyes or embroidered features, fabric folds
- Use warm, friendly colors typical of premium stuffed toys
- Preserve the original composition and background context
- Look like a professionally crafted character plushie you'd find in a boutique toy store
Style: Photorealistic plushie toy, studio photography quality, soft lighting
```

### Pets Category

```
Transform this pet into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the pet's breed characteristics, coloring, and distinctive features
- Have ultra-soft, fluffy fabric texture (appropriate for the animal type)
- Show realistic plushie details: embroidered nose/eyes, visible stitching, fabric paws
- Capture the pet's personality and pose from the original photo
- Use natural fur colors rendered in plush fabric
- Look like a premium, collectible stuffed animal
Style: Photorealistic plushie toy, professional product photography, soft studio lighting
```

### Kids Category

```
Transform this child into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the child's key features (hair, clothing, expression, pose)
- Have an extra cute, huggable appearance with soft fabric texture
- Show whimsical plushie details: button or embroidered eyes, rosy cheeks, fabric clothing
- Use bright, cheerful colors typical of children's plush toys
- Capture the innocent, joyful spirit of childhood in plushie form
- Look like a premium character plushie from a high-end toy brand
Style: Photorealistic plushie toy, kawaii aesthetic, professional studio photography, warm lighting
```

### Groups Category

```
Transform this group of people into adorable, high-quality plushie toy versions.
The plushies should:
- Maintain each person's distinctive features and relative positions
- Show individual characteristics while maintaining visual harmony
- Have soft, cuddly appearances with visible fabric textures
- Display realistic plushie details: stitching, embroidered features, fabric clothing
- Preserve the group dynamic and interactions from the original photo
- Use coordinated colors that work well together as a set
- Look like a premium collectible plushie set
Style: Photorealistic plushie toys, professional product photography, studio quality, cohesive lighting
```

---

## File Structure

```
public/images/examples/
├── people_1_original.jpg  →  people_1_plushie.png
├── people_2_original.jpg  →  people_2_plushie.png
├── ...
├── pets_1_original.jpg    →  pets_1_plushie.png
├── pets_2_original.jpg    →  pets_2_plushie.png
├── ...
├── kids_1_original.jpg    →  kids_1_plushie.png
├── kids_2_original.jpg    →  kids_2_plushie.png
├── ...
├── groups_1_original.jpg  →  groups_1_plushie.png
└── groups_2_original.jpg  →  groups_2_plushie.png
```

---

## Troubleshooting

### Issue 1: "OPENAI_API_KEY not found"

**Solution:**
```bash
# Check .env file
cat .env | grep OPENAI_API_KEY

# If missing, add:
echo "OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE" >> .env
```

### Issue 2: "Rate limit exceeded (429)"

**Solution:**
- Wait 60 seconds and try again
- Check usage limits: https://platform.openai.com/account/limits
- Add payment method if on free tier

### Issue 3: "Content policy violation (400)"

**Solution:**
- The original image might violate OpenAI's content policy
- Try a different image for that slot
- Use `--category` flag to skip and process other categories

### Issue 4: Generation is slow

**Expected Timing:**
- ~10-15 seconds per image
- 32 images = ~8-10 minutes total
- Script includes 1-second delays for rate limiting

**Tips:**
- Run overnight if generating all 32
- Use `--category` to process in batches
- Text-only mode is slightly faster

### Issue 5: Images look wrong

**Solutions:**
1. Regenerate specific images:
   ```bash
   # Delete the bad plushie
   rm public/images/examples/people_3_plushie.png

   # Regenerate just that category
   npm run generate:plushies -- --category=people
   ```

2. Try text-only mode for more creative freedom:
   ```bash
   npm run generate:plushies:text-only -- --category=people
   ```

---

## MacOS CLI Commands

### Complete Workflow

```bash
# 1. Download originals (if not already done)
chmod +x scripts/download-example-images.sh
./scripts/download-example-images.sh

# 2. Verify downloads
ls -lh public/images/examples/*_original.jpg

# 3. Test generation (no cost)
npm run generate:plushies:dry-run

# 4. Generate plushies (uses API credits)
npm run generate:plushies

# 5. Verify generation
ls -lh public/images/examples/*_plushie.png

# 6. View total size
du -sh public/images/examples/

# 7. Test on homepage
npm run dev
# Open: http://localhost:3000/#examples
```

### Selective Generation

```bash
# Generate one category at a time
npm run generate:plushies -- --category=people
npm run generate:plushies -- --category=pets
npm run generate:plushies -- --category=kids
npm run generate:plushies -- --category=groups

# Regenerate specific category
rm public/images/examples/pets_*_plushie.png
npm run generate:plushies -- --category=pets --force
```

### Cleanup

```bash
# Remove all plushie images (keeps originals)
rm public/images/examples/*_plushie.png

# Remove all example images
rm public/images/examples/*.jpg
rm public/images/examples/*.png

# Re-download originals
./scripts/download-example-images.sh
```

---

## Cost Breakdown

| Item | Quantity | Unit Cost | Total |
|------|----------|-----------|-------|
| Original images (Unsplash) | 32 | Free | $0.00 |
| DALL-E 3 generations | 32 | $0.04 | $1.28 |
| **Total** | | | **$1.28** |

**One-time cost** - These images will be committed to the repository and never need regeneration (unless you want different examples).

---

## Expected Output

When generation completes successfully:

```
==================================================
  PlushifyMe - Example Plushie Generator
  Powered by OpenAI DALL-E 3
==================================================

📊 Generation Summary:
   Images to process: 32
   Estimated cost: $1.28 (32 × $0.04)
   Mode: IMAGE-BASED

⚠️  This will use OpenAI API credits.
   Press Ctrl+C within 5 seconds to cancel...

[1/32]
🎨 Processing: people_1
   Original: people_1_original.jpg
   Output:   people_1_plushie.png
   📤 Uploading to OpenAI...
   ✅ Generated successfully
   💾 Saving to people_1_plushie.png...
   ✅ Saved successfully (234.5 KB)
   ⏳ Waiting 1 second (rate limiting)...

[2/32]
...

==================================================
  Generation Complete!
==================================================

✅ Successful: 32
💰 Estimated cost: $1.28

Next steps:
1. Review generated images: ls -lh public/images/examples/*_plushie.png
2. Update your application to use local images
3. Test the homepage: npm run dev
```

---

## Next Steps

After generating plushies:

1. **Review Images**: Check each plushie visually
2. **Update Mock Data**: Use local paths in `lib/mock-data.ts`
3. **Test Homepage**: Verify slider works correctly
4. **Commit to Git**: Add images to repository
5. **Update Documentation**: Mark task as complete

See: [Update Mock Data Guide](#updating-mock-data)

---

## Updating Mock Data

After generating plushies, update `lib/mock-data.ts`:

```typescript
// Replace Unsplash URLs with local paths
export const mockBeforeAfterPairs: BeforeAfterPair[] = [
  {
    id: "example_1",
    before: "/images/examples/people_1_original.jpg",
    after: "/images/examples/people_1_plushie.png",
    category: "people",
    title: "Professional Portrait",
  },
  // ... repeat for all 32 pairs
];
```

---

## Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review OpenAI API docs: https://platform.openai.com/docs
3. See main project docs: `./docs/README.md`

---

**Last Updated:** November 19, 2025
**Script Location:** `lib/generate-example-plushies.ts`
**Examples Directory:** `public/images/examples/`
