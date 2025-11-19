#!/bin/bash

# Create placeholder plushie images for testing
# These are temporary placeholders until real DALL-E plushies are generated

echo "=================================================="
echo "  Creating Placeholder Plushie Images"
echo "=================================================="
echo ""
echo "This creates simple placeholder images so the site works"
echo "before running the actual DALL-E generation."
echo ""

cd "$(dirname "$0")/../public/images/examples" || exit 1

# Count originals
ORIGINALS=$(ls -1 *_original.jpg 2>/dev/null | wc -l)
echo "Found $ORIGINALS original images"
echo ""

if [ "$ORIGINALS" -eq 0 ]; then
  echo "❌ No original images found!"
  echo "   Run: ./scripts/download-example-images.sh"
  exit 1
fi

# Create placeholder plushies by copying and renaming originals
# (This is just for testing - real plushies will be generated with DALL-E)
echo "Creating placeholder plushie images..."
echo ""

COUNT=0
for original in *_original.jpg; do
  plushie="${original/_original.jpg/_plushie.png}"

  if [ -f "$plushie" ]; then
    echo "  ⏭️  Skipping $plushie (already exists)"
  else
    # Convert JPG to PNG and create placeholder
    # In production, these would be actual DALL-E generated plushies
    convert "$original" "$plushie" 2>/dev/null || cp "$original" "$plushie"
    echo "  ✅ Created $plushie (placeholder)"
    COUNT=$((COUNT + 1))
  fi
done

echo ""
echo "=================================================="
echo "  Placeholders Created: $COUNT"
echo "=================================================="
echo ""
echo "⚠️  NOTE: These are placeholder images (copies of originals)"
echo ""
echo "To generate REAL plushie transformations:"
echo "  npm run generate:plushies"
echo ""
echo "Cost: ~\$1.28 for all 32 plushies"
echo ""
