#!/bin/bash

# Download example images from Unsplash for PlushifyMe demos
# This script downloads 32 high-quality images (8 per category)

echo "=================================================="
echo "  PlushifyMe Example Image Downloader"
echo "=================================================="
echo ""
echo "Downloading 32 original images from Unsplash..."
echo "Categories: People (8), Pets (8), Kids (8), Groups (8)"
echo ""

cd "$(dirname "$0")/../public/images/examples" || exit 1

# Function to download and save image
download_image() {
  local url="$1"
  local filename="$2"

  echo "Downloading: $filename"
  curl -L -o "$filename" "$url" --silent --show-error

  if [ $? -eq 0 ]; then
    echo "  ✅ Downloaded successfully"
  else
    echo "  ❌ Download failed"
  fi
}

# PEOPLE CATEGORY (8 images)
echo ""
echo "📸 Category: PEOPLE"
echo "-------------------"

download_image "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1024&h=1024&fit=crop&q=80" "people_1_original.jpg"
download_image "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1024&h=1024&fit=crop&q=80" "people_2_original.jpg"
download_image "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1024&h=1024&fit=crop&q=80" "people_3_original.jpg"
download_image "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1024&h=1024&fit=crop&q=80" "people_4_original.jpg"
download_image "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1024&h=1024&fit=crop&q=80" "people_5_original.jpg"
download_image "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1024&h=1024&fit=crop&q=80" "people_6_original.jpg"
download_image "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1024&h=1024&fit=crop&q=80" "people_7_original.jpg"
download_image "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1024&h=1024&fit=crop&q=80" "people_8_original.jpg"

# PETS CATEGORY (8 images)
echo ""
echo "🐕 Category: PETS"
echo "-----------------"

download_image "https://images.unsplash.com/photo-1552053831-71594a27632d?w=1024&h=1024&fit=crop&q=80" "pets_1_original.jpg"
download_image "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1024&h=1024&fit=crop&q=80" "pets_2_original.jpg"
download_image "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1024&h=1024&fit=crop&q=80" "pets_3_original.jpg"
download_image "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1024&h=1024&fit=crop&q=80" "pets_4_original.jpg"
download_image "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1024&h=1024&fit=crop&q=80" "pets_5_original.jpg"
download_image "https://images.unsplash.com/photo-1548681528-6a5c45b66b42?w=1024&h=1024&fit=crop&q=80" "pets_6_original.jpg"
download_image "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1024&h=1024&fit=crop&q=80" "pets_7_original.jpg"
download_image "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=1024&h=1024&fit=crop&q=80" "pets_8_original.jpg"

# KIDS CATEGORY (8 images)
echo ""
echo "👶 Category: KIDS"
echo "-----------------"

download_image "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1024&h=1024&fit=crop&q=80" "kids_1_original.jpg"
download_image "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1024&h=1024&fit=crop&q=80" "kids_2_original.jpg"
download_image "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=1024&h=1024&fit=crop&q=80" "kids_3_original.jpg"
download_image "https://images.unsplash.com/photo-1519340333755-56e9c1d6a393?w=1024&h=1024&fit=crop&q=80" "kids_4_original.jpg"
download_image "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1024&h=1024&fit=crop&q=80" "kids_5_original.jpg"
download_image "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1024&h=1024&fit=crop&q=80" "kids_6_original.jpg"
download_image "https://images.unsplash.com/photo-1560421683-6856ea585c78?w=1024&h=1024&fit=crop&q=80" "kids_7_original.jpg"
download_image "https://images.unsplash.com/photo-1601309417008-c3fdf62d6b58?w=1024&h=1024&fit=crop&q=80" "kids_8_original.jpg"

# GROUPS CATEGORY (8 images)
echo ""
echo "👨‍👩‍👧‍👦 Category: GROUPS"
echo "--------------------"

download_image "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1024&h=1024&fit=crop&q=80" "groups_1_original.jpg"
download_image "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1024&h=1024&fit=crop&q=80" "groups_2_original.jpg"
download_image "https://images.unsplash.com/photo-1519741497674-611481863552?w=1024&h=1024&fit=crop&q=80" "groups_3_original.jpg"
download_image "https://images.unsplash.com/photo-1536766768598-e09213fdcec5?w=1024&h=1024&fit=crop&q=80" "groups_4_original.jpg"
download_image "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1024&h=1024&fit=crop&q=80" "groups_5_original.jpg"
download_image "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1024&h=1024&fit=crop&q=80" "groups_6_original.jpg"
download_image "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1024&h=1024&fit=crop&q=80" "groups_7_original.jpg"
download_image "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1024&h=1024&fit=crop&q=80" "groups_8_original.jpg"

echo ""
echo "=================================================="
echo "  Download Complete!"
echo "=================================================="
echo ""
echo "Downloaded 32 images to: public/images/examples/"
echo ""
echo "Next steps:"
echo "1. Review the images: ls -lh public/images/examples/*_original.jpg"
echo "2. Generate plushie versions: npm run generate:plushies"
echo ""
