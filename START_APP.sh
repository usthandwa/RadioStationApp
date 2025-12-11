#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║        AWR SID Media - App Startup Script                 ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists yarn && ! command_exists npm; then
    echo -e "${RED}❌ Neither yarn nor npm found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites checked${NC}"
echo ""

# Ask user how they want to run the app
echo -e "${YELLOW}How would you like to run the app?${NC}"
echo ""
echo "1) Expo Go (fastest, no build needed)"
echo "2) iOS Simulator (requires build)"
echo "3) Android Emulator (requires build)"
echo "4) Just start Metro bundler"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${GREEN}Starting with Expo Go...${NC}"
        echo ""
        echo "📱 Steps:"
        echo "1. Install 'Expo Go' app on your phone"
        echo "2. Scan the QR code that appears"
        echo "3. App will load on your phone"
        echo ""
        npx expo start --go
        ;;
    2)
        echo ""
        echo -e "${GREEN}Building for iOS Simulator...${NC}"
        echo ""
        echo "⏳ This may take 5-10 minutes on first build..."
        echo ""

        # Check if pods are installed
        if [ ! -d "ios/Pods" ]; then
            echo "Installing iOS dependencies..."
            cd ios && export LANG=en_US.UTF-8 && pod install && cd ..
        fi

        npx expo run:ios
        ;;
    3)
        echo ""
        echo -e "${GREEN}Building for Android Emulator...${NC}"
        echo ""
        echo "⏳ This may take 5-10 minutes on first build..."
        echo ""
        npx expo run:android
        ;;
    4)
        echo ""
        echo -e "${GREEN}Starting Metro bundler...${NC}"
        echo ""
        echo "Press 'i' for iOS, 'a' for Android, or scan QR with Expo Go"
        echo ""
        npx expo start --clear
        ;;
    *)
        echo ""
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac
