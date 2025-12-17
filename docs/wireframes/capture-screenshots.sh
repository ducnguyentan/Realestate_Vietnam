#!/bin/bash
# Capture all wireframe screenshots

SCRIPT_DIR="$HOME/.claude/skills/chrome-devtools/scripts"
OUTPUT_DIR="$HOME/Realestate_Vietnam/Realestate_Vietnam/docs/wireframes/screenshots"
BASE_URL="http://localhost:3001"

# Mobile viewport (375x667)
echo "Capturing mobile screenshots..."
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/index.html" --output "$OUTPUT_DIR/index-mobile.png" --viewport "375x667" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/listings.html" --output "$OUTPUT_DIR/listings-mobile.png" --viewport "375x667" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/property-detail.html" --output "$OUTPUT_DIR/property-detail-mobile.png" --viewport "375x667" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/seller-dashboard.html" --output "$OUTPUT_DIR/seller-dashboard-mobile.png" --viewport "375x667" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/create-listing.html" --output "$OUTPUT_DIR/create-listing-mobile.png" --viewport "375x667" --full-page true

# Tablet viewport (768x1024)
echo "Capturing tablet screenshots..."
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/index.html" --output "$OUTPUT_DIR/index-tablet.png" --viewport "768x1024" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/listings.html" --output "$OUTPUT_DIR/listings-tablet.png" --viewport "768x1024" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/property-detail.html" --output "$OUTPUT_DIR/property-detail-tablet.png" --viewport "768x1024" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/seller-dashboard.html" --output "$OUTPUT_DIR/seller-dashboard-tablet.png" --viewport "768x1024" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/create-listing.html" --output "$OUTPUT_DIR/create-listing-tablet.png" --viewport "768x1024" --full-page true

# Desktop viewport (1440x900)
echo "Capturing desktop screenshots..."
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/index.html" --output "$OUTPUT_DIR/index-desktop.png" --viewport "1440x900" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/listings.html" --output "$OUTPUT_DIR/listings-desktop.png" --viewport "1440x900" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/property-detail.html" --output "$OUTPUT_DIR/property-detail-desktop.png" --viewport "1440x900" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/seller-dashboard.html" --output "$OUTPUT_DIR/seller-dashboard-desktop.png" --viewport "1440x900" --full-page true
cd "$SCRIPT_DIR" && node screenshot.js --url "$BASE_URL/create-listing.html" --output "$OUTPUT_DIR/create-listing-desktop.png" --viewport "1440x900" --full-page true

echo "✓ All screenshots captured successfully!"
