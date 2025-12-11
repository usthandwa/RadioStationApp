#!/bin/bash

# Production Deployment Script
# Builds and submits AWR SID Media to App Store and Google Play

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AWR SID Media Deployment Script     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if production API URL is set
echo -e "${YELLOW}⚠️  Checking configuration...${NC}"
API_URL=$(grep -o '"apiUrl": "[^"]*"' app.json | cut -d'"' -f4)

if [[ $API_URL == *"192.168"* ]] || [[ $API_URL == *"localhost"* ]]; then
    echo -e "${RED}❌ ERROR: API URL is still set to local development!${NC}"
    echo -e "${RED}   Current: $API_URL${NC}"
    echo ""
    echo -e "${YELLOW}Please update app.json with your production API URL:${NC}"
    echo -e "   \"apiUrl\": \"https://api.yourdomain.com/api\""
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ API URL configured: $API_URL${NC}"
echo ""

# Get app version
APP_VERSION=$(grep -o '"version": "[^"]*"' app.json | head -1 | cut -d'"' -f4)
echo -e "${BLUE}App Version: $APP_VERSION${NC}"
echo ""

# Menu
echo "Select deployment option:"
echo "  1) Build iOS only"
echo "  2) Build Android only"
echo "  3) Build both platforms"
echo "  4) Submit iOS to App Store (requires existing build)"
echo "  5) Submit Android to Play Store (requires existing build)"
echo "  6) Full deployment (build + submit both)"
echo "  7) Exit"
echo ""
read -p "Enter choice [1-7]: " choice

case $choice in
    1)
        echo -e "${GREEN}Building iOS app...${NC}"
        npx eas-cli build --platform ios --profile production
        ;;
    2)
        echo -e "${GREEN}Building Android app...${NC}"
        npx eas-cli build --platform android --profile production
        ;;
    3)
        echo -e "${GREEN}Building both platforms...${NC}"
        npx eas-cli build --platform all --profile production
        ;;
    4)
        echo -e "${GREEN}Submitting iOS to App Store...${NC}"
        npx eas-cli submit --platform ios --latest
        ;;
    5)
        echo -e "${GREEN}Submitting Android to Play Store...${NC}"
        npx eas-cli submit --platform android --latest
        ;;
    6)
        echo -e "${GREEN}Starting full deployment...${NC}"
        echo ""
        echo -e "${BLUE}Step 1/3: Building apps...${NC}"
        npx eas-cli build --platform all --profile production

        echo ""
        echo -e "${YELLOW}Waiting for builds to complete...${NC}"
        echo -e "${YELLOW}This may take 15-20 minutes. You can:${NC}"
        echo -e "${YELLOW}  - Check progress: https://expo.dev/accounts/szama/projects/awrsidmedia/builds${NC}"
        echo -e "${YELLOW}  - Or wait here (press Ctrl+C to exit)${NC}"
        echo ""

        read -p "Press Enter when builds are complete to continue with submission..."

        echo ""
        echo -e "${BLUE}Step 2/3: Submitting iOS...${NC}"
        npx eas-cli submit --platform ios --latest

        echo ""
        echo -e "${BLUE}Step 3/3: Submitting Android...${NC}"
        npx eas-cli submit --platform android --latest

        echo ""
        echo -e "${GREEN}✅ Full deployment complete!${NC}"
        ;;
    7)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}   Deployment process initiated! 🚀${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo "  1. Monitor builds: https://expo.dev/accounts/szama/projects/awrsidmedia/builds"
echo "  2. Configure store listings (if first time)"
echo "  3. Wait for store review (24-48 hours typically)"
echo "  4. Respond to any review feedback"
echo ""
echo "For detailed guide, see: DEPLOYMENT_GUIDE.md"
