/**
 * Generate Plushie Versions of Example Images using OpenAI GPT-4 Vision + DALL-E 3
 *
 * This script uses a two-step process:
 * 1. GPT-4 Vision analyzes the original photo to create a detailed description
 * 2. DALL-E 3 generates a plushie version based on that description + plushie prompt
 *
 * This ensures the plushies are distinctly different from originals while maintaining
 * subject characteristics.
 *
 * Usage:
 *   npx tsx lib/generate-example-plushies.ts [--category people|pets|kids|groups] [--dry-run] [--force]
 *
 * Options:
 *   --category: Generate only for specific category (default: all)
 *   --dry-run: Show what would be generated without making API calls
 *   --force: Overwrite existing plushie images
 *   --test: Generate only first image of each category for testing
 *
 * Cost: ~$0.045 per image (GPT-4V ~$0.005 + DALL-E 3 $0.04)
 */

import { config } from 'dotenv';
import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

// Configuration
const EXAMPLES_DIR = path.join(process.cwd(), 'public', 'images', 'examples');
const PROMPT_FILE = path.join(EXAMPLES_DIR, 'prompt_real2plushie.txt');
const CATEGORIES = ['people', 'pets', 'kids', 'groups'] as const;
const IMAGES_PER_CATEGORY = 8;
const COST_PER_IMAGE = 0.045; // GPT-4V (~$0.005) + DALL-E 3 ($0.04)

type Category = typeof CATEGORIES[number];

interface ImagePair {
  category: Category;
  number: number;
  originalPath: string;
  plushiePath: string;
  exists: boolean;
}

/**
 * Load the master plushie prompt template
 */
function loadPlushiePromptTemplate(): string {
  try {
    return fs.readFileSync(PROMPT_FILE, 'utf-8');
  } catch (error) {
    console.error(`❌ Error: Could not read prompt file: ${PROMPT_FILE}`);
    process.exit(1);
  }
}

/**
 * Category-specific analysis instructions for GPT-4 Vision
 */
const CATEGORY_ANALYSIS_PROMPTS: Record<Category, string> = {
  people: `Describe this person in detail for creating a plushie toy version. Include:
- Gender presentation and approximate age
- Hair style, color, and texture
- Facial features (eye color, nose shape, mouth expression)
- Clothing style, colors, and patterns
- Body pose and positioning
- Emotional expression
- Background setting and environment
- Any distinctive accessories or features
Be specific about colors, positions, and characteristics.`,

  pets: `Describe this pet in detail for creating a plushie toy version. Include:
- Animal type and breed (if identifiable)
- Fur/feather color, patterns, and texture
- Eye color and expression
- Distinctive markings or features
- Ear position and shape
- Body pose and positioning
- Size and body proportions
- Background setting and environment
- Any accessories (collar, tags, etc.)
Be specific about colors, patterns, and physical characteristics.`,

  kids: `Describe this child in detail for creating a plushie toy version. Include:
- Approximate age
- Hair style, color, and texture
- Facial expression and emotion
- Clothing style, colors, and patterns
- Body pose and positioning
- Any toys or accessories
- Background setting and environment
- Overall mood and character
Be specific about colors, positions, and make it extra cute and whimsical.`,

  groups: `Describe this group in detail for creating plushie toy versions. Include:
For each person/subject:
- Individual characteristics (age, hair, clothing)
- Positioning relative to others
- Facial expressions and interactions
Overall scene:
- Group dynamic and relationships
- Background setting and environment
- Color coordination
- Spatial arrangement
Be specific about how each subject relates to the others.`
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

  const config: any = { apiKey };
  if (orgId) {
    config.organization = orgId;
  }

  return new OpenAI(config);
}

/**
 * Get all image pairs that need processing
 */
function getImagePairs(category?: Category, force: boolean = false, testMode: boolean = false): ImagePair[] {
  const pairs: ImagePair[] = [];
  const categoriesToProcess = category ? [category] : CATEGORIES;

  for (const cat of categoriesToProcess) {
    const limit = testMode ? 1 : IMAGES_PER_CATEGORY;

    for (let i = 1; i <= limit; i++) {
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
 * Step 1: Analyze original image with GPT-4 Vision
 */
async function analyzeOriginalImage(
  openai: OpenAI,
  pair: ImagePair,
  dryRun: boolean
): Promise<string | null> {
  const { category, originalPath } = pair;

  console.log(`   🔍 Step 1: Analyzing original image with GPT-4 Vision...`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would analyze image with GPT-4 Vision`);
    return `[Detailed ${category} description would be generated here]`;
  }

  try {
    // Read and encode image
    const imageBuffer = fs.readFileSync(originalPath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;

    // Analyze with GPT-4 Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: CATEGORY_ANALYSIS_PROMPTS[category],
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const description = response.choices[0]?.message?.content;

    if (!description) {
      throw new Error('No description generated by GPT-4 Vision');
    }

    console.log(`   ✅ Analysis complete (${description.length} chars)`);

    return description;
  } catch (error: any) {
    console.error(`   ❌ Error analyzing image:`, error.message);
    return null;
  }
}

/**
 * Step 2: Generate plushie with DALL-E 3 using description
 */
async function generatePlushieFromDescription(
  openai: OpenAI,
  pair: ImagePair,
  description: string,
  promptTemplate: string,
  dryRun: boolean
): Promise<boolean> {
  const { plushiePath } = pair;

  console.log(`   🎨 Step 2: Generating plushie with DALL-E 3...`);

  if (dryRun) {
    console.log(`   [DRY RUN] Would generate plushie with DALL-E 3`);
    console.log(`   Description: ${description.substring(0, 100)}...`);
    return true;
  }

  try {
    // Truncate description if needed to fit DALL-E's 4000 char limit
    // Template is ~2078 chars, so limit description to 1800 chars for safety
    const truncatedDescription = description.length > 1800
      ? description.substring(0, 1800) + '...'
      : description;

    // Combine description with plushie prompt template
    const fullPrompt = promptTemplate.replace('[SUBJECT_DESCRIPTION]', truncatedDescription);

    // Generate with DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: fullPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'b64_json',
    });

    if (!response.data[0]?.b64_json) {
      throw new Error('No image data received from DALL-E 3');
    }

    // Save the generated image
    const imageData = Buffer.from(response.data[0].b64_json, 'base64');
    fs.writeFileSync(plushiePath, imageData);

    // Get file size
    const stats = fs.statSync(plushiePath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`   ✅ Plushie generated and saved (${sizeKB} KB)`);

    // Show revised prompt if available
    if (response.data[0].revised_prompt) {
      console.log(`   📝 DALL-E revised: ${response.data[0].revised_prompt.substring(0, 150)}...`);
    }

    return true;
  } catch (error: any) {
    console.error(`   ❌ Error generating plushie:`, error.message);

    if (error.status === 400) {
      console.error('   💡 Tip: Content policy violation. Description might need adjustment.');
    } else if (error.status === 429) {
      console.error('   💡 Tip: Rate limit exceeded. Wait a moment and try again.');
    }

    return false;
  }
}

/**
 * Generate plushie using two-step process
 */
async function generatePlushie(
  openai: OpenAI,
  pair: ImagePair,
  promptTemplate: string,
  dryRun: boolean
): Promise<boolean> {
  const { category, number } = pair;
  const filename = `${category}_${number}`;

  console.log(`\n🎨 Processing: ${filename}`);
  console.log(`   Original: ${path.basename(pair.originalPath)}`);
  console.log(`   Output:   ${path.basename(pair.plushiePath)}`);

  // Step 1: Analyze original with GPT-4 Vision
  const description = await analyzeOriginalImage(openai, pair, dryRun);

  if (!description) {
    console.error(`   ❌ Failed to analyze image, skipping`);
    return false;
  }

  // Step 2: Generate plushie with DALL-E 3
  const success = await generatePlushieFromDescription(
    openai,
    pair,
    description,
    promptTemplate,
    dryRun
  );

  if (success) {
    console.log(`   ✅ Complete: ${filename}`);
  }

  return success;
}

/**
 * Main execution function
 */
async function main() {
  console.log('==================================================');
  console.log('  PlushifyMe - Example Plushie Generator v2');
  console.log('  GPT-4 Vision + DALL-E 3');
  console.log('==================================================\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const categoryArg = args.find(arg => arg.startsWith('--category='))?.split('=')[1] as Category | undefined;
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force');
  const testMode = args.includes('--test');

  // Validate category
  if (categoryArg && !CATEGORIES.includes(categoryArg)) {
    console.error(`❌ Error: Invalid category "${categoryArg}"`);
    console.error(`   Valid categories: ${CATEGORIES.join(', ')}`);
    process.exit(1);
  }

  // Load plushie prompt template
  const promptTemplate = loadPlushiePromptTemplate();
  console.log(`✅ Loaded plushie prompt template (${promptTemplate.length} chars)\n`);

  // Initialize OpenAI
  const openai = initializeOpenAI();

  // Get images to process
  const pairs = getImagePairs(categoryArg, force, testMode);

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
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : testMode ? 'TEST (1 per category)' : 'FULL GENERATION'}`);
  console.log(`   Method: GPT-4 Vision analysis → DALL-E 3 generation`);
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

    const success = await generatePlushie(openai, pair, promptTemplate, dryRun);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Rate limiting: wait 2 seconds between requests
    if (i < pairs.length - 1 && !dryRun) {
      console.log('   ⏳ Waiting 2 seconds (rate limiting)...');
      await new Promise(resolve => setTimeout(resolve, 2000));
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
    console.log(`💰 Actual cost: $${(successCount * COST_PER_IMAGE).toFixed(2)}`);
  }
  console.log('');

  if (testMode && successCount > 0) {
    console.log('🧪 TEST MODE COMPLETE');
    console.log('');
    console.log('Next steps:');
    console.log('1. Review test images to verify they look different from originals');
    console.log('2. Check plushie quality and transformation accuracy');
    console.log('3. If satisfied, run full generation:');
    console.log('   npm run generate:plushies -- --force');
    console.log('');
  } else if (successCount > 0) {
    console.log('Next steps:');
    console.log('1. Review generated images: open public/images/examples/');
    console.log('2. Compare originals vs plushies to verify difference');
    console.log('3. Test the homepage: npm run dev');
    console.log('4. Visit: http://localhost:3000/#examples');
    console.log('');
  }

  process.exit(failCount > 0 ? 1 : 0);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

export { generatePlushie, getImagePairs };
