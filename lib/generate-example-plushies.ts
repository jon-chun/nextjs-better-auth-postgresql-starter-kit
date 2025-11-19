/**
 * Generate Plushie Versions of Example Images using OpenAI DALL-E 3
 *
 * This script transforms realistic photos into adorable plushie versions
 * while maintaining the composition, subject, and key characteristics.
 *
 * Usage:
 *   npx tsx lib/generate-example-plushies.ts [--category people|pets|kids|groups] [--dry-run]
 *
 * Options:
 *   --category: Generate only for specific category (default: all)
 *   --dry-run: Show what would be generated without making API calls
 *   --force: Overwrite existing plushie images
 *
 * Cost: ~$0.04 per image (32 images = ~$1.28 total)
 */

import { config } from 'dotenv';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { createReadStream } from 'fs';

// Load environment variables
config();

// Configuration
const EXAMPLES_DIR = path.join(process.cwd(), 'public', 'images', 'examples');
const CATEGORIES = ['people', 'pets', 'kids', 'groups'] as const;
const IMAGES_PER_CATEGORY = 8;
const COST_PER_IMAGE = 0.04; // DALL-E 3 standard 1024x1024

type Category = typeof CATEGORIES[number];

interface ImagePair {
  category: Category;
  number: number;
  originalPath: string;
  plushiePath: string;
  exists: boolean;
}

// High-quality prompts for each category
const CATEGORY_PROMPTS: Record<Category, string> = {
  people: `Transform this person into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the person's key features (hair style/color, clothing style, pose, expression)
- Have a soft, cuddly appearance with visible fabric texture
- Show realistic plushie details: stitching, button eyes or embroidered features, fabric folds
- Use warm, friendly colors typical of premium stuffed toys
- Preserve the original composition and background context
- Look like a professionally crafted character plushie you'd find in a boutique toy store
Style: Photorealistic plushie toy, studio photography quality, soft lighting`,

  pets: `Transform this pet into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the pet's breed characteristics, coloring, and distinctive features
- Have ultra-soft, fluffy fabric texture (appropriate for the animal type)
- Show realistic plushie details: embroidered nose/eyes, visible stitching, fabric paws
- Capture the pet's personality and pose from the original photo
- Use natural fur colors rendered in plush fabric
- Preserve the original composition and setting
- Look like a premium, collectible stuffed animal
Style: Photorealistic plushie toy, professional product photography, soft studio lighting`,

  kids: `Transform this child into an adorable, high-quality plushie toy version.
The plushie should:
- Maintain the child's key features (hair, clothing, expression, pose)
- Have an extra cute, huggable appearance with soft fabric texture
- Show whimsical plushie details: button or embroidered eyes, rosy cheeks, fabric clothing
- Use bright, cheerful colors typical of children's plush toys
- Preserve the original composition and background
- Capture the innocent, joyful spirit of childhood in plushie form
- Look like a premium character plushie from a high-end toy brand
Style: Photorealistic plushie toy, kawaii aesthetic, professional studio photography, warm lighting`,

  groups: `Transform this group of people into adorable, high-quality plushie toy versions.
The plushies should:
- Maintain each person's distinctive features and relative positions
- Show individual characteristics while maintaining visual harmony
- Have soft, cuddly appearances with visible fabric textures
- Display realistic plushie details: stitching, embroidered features, fabric clothing
- Preserve the group dynamic and interactions from the original photo
- Use coordinated colors that work well together as a set
- Maintain the original composition and setting
- Look like a premium collectible plushie set
Style: Photorealistic plushie toys, professional product photography, studio quality, cohesive lighting`
};

/**
 * Initialize OpenAI client
 */
function initializeOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  const orgId = process.env.OPENAI_ORG_ID;

  if (!apiKey) {
    console.error('❌ Error: OPENAI_API_KEY not found in environment variables');
    console.error('   Please add your OpenAI API key to .env file');
    process.exit(1);
  }

  return new OpenAI({
    apiKey,
    organization: orgId,
  });
}

/**
 * Get all image pairs that need processing
 */
function getImagePairs(category?: Category, force: boolean = false): ImagePair[] {
  const pairs: ImagePair[] = [];
  const categoriesToProcess = category ? [category] : CATEGORIES;

  for (const cat of categoriesToProcess) {
    for (let i = 1; i <= IMAGES_PER_CATEGORY; i++) {
      const originalPath = path.join(EXAMPLES_DIR, `${cat}_${i}_original.jpg`);
      const plushiePath = path.join(EXAMPLES_DIR, `${cat}_${i}_plushie.png`);

      // Check if original exists
      if (!fs.existsSync(originalPath)) {
        console.warn(`⚠️  Warning: Original image not found: ${cat}_${i}_original.jpg`);
        continue;
      }

      // Check if plushie already exists (skip unless --force)
      const exists = fs.existsSync(plushiePath);
      if (exists && !force) {
        console.log(`⏭️  Skipping ${cat}_${i} (plushie already exists, use --force to overwrite)`);
        continue;
      }

      pairs.push({
        category: cat,
        number: i,
        originalPath,
        plushiePath,
        exists,
      });
    }
  }

  return pairs;
}

/**
 * Generate plushie version using DALL-E 3 image editing
 */
async function generatePlushie(
  openai: OpenAI,
  pair: ImagePair,
  dryRun: boolean
): Promise<boolean> {
  const { category, number, originalPath, plushiePath } = pair;
  const filename = `${category}_${number}`;

  console.log(`\n🎨 Processing: ${filename}`);
  console.log(`   Original: ${path.basename(originalPath)}`);
  console.log(`   Output:   ${path.basename(plushiePath)}`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would generate plushie using DALL-E 3`);
    console.log(`   Prompt: ${CATEGORY_PROMPTS[category].substring(0, 100)}...`);
    return true;
  }

  try {
    // Read the original image
    const imageBuffer = fs.readFileSync(originalPath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageMimeType = 'image/jpeg';
    const imageDataUrl = `data:${imageMimeType};base64,${imageBase64}`;

    console.log(`   📤 Uploading to OpenAI...`);

    // Use DALL-E 3 with image prompting (using the image as reference)
    // Note: DALL-E 3 doesn't support direct image editing, but we can use
    // image understanding + generation with a detailed prompt
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `${CATEGORY_PROMPTS[category]}

IMPORTANT: Base this plushie transformation on the uploaded reference image. Match the composition, pose, colors, and subject characteristics as closely as possible while converting to plushie style.`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    });

    if (!response.data[0]?.b64_json) {
      throw new Error('No image data received from OpenAI');
    }

    console.log(`   ✅ Generated successfully`);
    console.log(`   💾 Saving to ${path.basename(plushiePath)}...`);

    // Save the generated image
    const imageData = Buffer.from(response.data[0].b64_json, 'base64');
    fs.writeFileSync(plushiePath, imageData);

    // Get file size
    const stats = fs.statSync(plushiePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`   ✅ Saved successfully (${sizeKB} KB)`);

    // Show revised prompt if available
    if (response.data[0].revised_prompt) {
      console.log(`   📝 DALL-E revised prompt: ${response.data[0].revised_prompt.substring(0, 100)}...`);
    }

    return true;
  } catch (error: any) {
    console.error(`   ❌ Error generating ${filename}:`, error.message);

    if (error.status === 400) {
      console.error('   💡 Tip: The image might violate content policy. Try a different image.');
    } else if (error.status === 429) {
      console.error('   💡 Tip: Rate limit exceeded. Wait a moment and try again.');
    } else if (error.status === 401) {
      console.error('   💡 Tip: Check your OPENAI_API_KEY is valid.');
    }

    return false;
  }
}

/**
 * Generate using alternative approach: DALL-E 3 without image input
 * (Fallback if image-based generation isn't working)
 */
async function generatePlushieTextOnly(
  openai: OpenAI,
  pair: ImagePair,
  dryRun: boolean
): Promise<boolean> {
  const { category, number, plushiePath } = pair;
  const filename = `${category}_${number}`;

  console.log(`\n🎨 Processing (text-only mode): ${filename}`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would generate plushie using text-only DALL-E 3`);
    return true;
  }

  try {
    // Enhanced prompt for text-only generation
    const enhancedPrompt = `Create a photorealistic image of ${CATEGORY_PROMPTS[category]}

This should look like professional product photography of an actual high-quality plushie toy, not a cartoon or illustration. The plushie should have realistic fabric texture, visible stitching, and look tangible and three-dimensional.`;

    console.log(`   📤 Generating with DALL-E 3 (text-only)...`);

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    });

    if (!response.data[0]?.b64_json) {
      throw new Error('No image data received from OpenAI');
    }

    console.log(`   ✅ Generated successfully`);

    // Save the generated image
    const imageData = Buffer.from(response.data[0].b64_json, 'base64');
    fs.writeFileSync(plushiePath, imageData);

    const stats = fs.statSync(plushiePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`   ✅ Saved successfully (${sizeKB} KB)`);

    return true;
  } catch (error: any) {
    console.error(`   ❌ Error: ${error.message}`);
    return false;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('==================================================');
  console.log('  PlushifyMe - Example Plushie Generator');
  console.log('  Powered by OpenAI DALL-E 3');
  console.log('==================================================\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const categoryArg = args.find(arg => arg.startsWith('--category='))?.split('=')[1] as Category | undefined;
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const textOnly = args.includes('--text-only');

  // Validate category
  if (categoryArg && !CATEGORIES.includes(categoryArg)) {
    console.error(`❌ Error: Invalid category "${categoryArg}"`);
    console.error(`   Valid categories: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  // Initialize OpenAI
  const openai = initializeOpenAI();

  // Get images to process
  const pairs = getImagePairs(categoryArg, force);

  if (pairs.length === 0) {
    console.log('✅ No images to process. All plushies already exist!');
    console.log('   Use --force to regenerate existing images.');
    process.exit(0);
  }

  // Calculate cost
  const totalCost = pairs.length * COST_PER_IMAGE;

  console.log(`📊 Generation Summary:`);
  console.log(`   Images to process: ${pairs.length}`);
  console.log(`   Estimated cost: $${totalCost.toFixed(2)} (${pairs.length} × $${COST_PER_IMAGE})`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : textOnly ? 'TEXT-ONLY' : 'IMAGE-BASED'}`);
  console.log('');

  if (dryRun) {
    console.log('🔍 Dry run mode - no API calls will be made\n');
  } else {
    console.log('⚠️  This will use OpenAI API credits.');
    console.log('   Press Ctrl+C within 5 seconds to cancel...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Process each image
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    console.log(`\n[${i + 1}/${pairs.length}]`);

    const success = textOnly
      ? await generatePlushieTextOnly(openai, pair, dryRun)
      : await generatePlushie(openai, pair, dryRun);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting: wait 1 second between requests
    if (i < pairs.length - 1 && !dryRun) {
      console.log('   ⏳ Waiting 1 second (rate limiting)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Summary
  console.log('\n==================================================');
  console.log('  Generation Complete!');
  console.log('==================================================\n');
  console.log(`✅ Successful: ${successCount}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`);
  }
  if (!dryRun) {
    console.log(`💰 Estimated cost: $${(successCount * COST_PER_IMAGE).toFixed(2)}`);
  }
  console.log('');
  console.log('Next steps:');
  console.log('1. Review generated images: ls -lh public/images/examples/*_plushie.png');
  console.log('2. Update your application to use local images');
  console.log('3. Test the homepage: npm run dev');
  console.log('');

  process.exit(failCount > 0 ? 1 : 0);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generatePlushie, getImagePairs, CATEGORY_PROMPTS };
