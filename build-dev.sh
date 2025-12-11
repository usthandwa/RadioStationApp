#!/bin/bash

# Build Development Build Script
# Creates custom development build with all native features

set -e

echo "🚀 Building Development Build"
echo "=============================="
echo ""

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to build for platform
build_platform() {
    local platform=$1
    echo -e "${BLUE}Building for $platform...${NC}"
    npx eas-cli build --profile development --platform "$platform"
}

# Check if platform argument provided
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}Usage: ./build-dev.sh [ios|android|all]${NC}"
    echo ""
    echo "Examples:"
    echo "  ./build-dev.sh ios       # Build for iOS only"
    echo "  ./build-dev.sh android   # Build for Android only"
    echo "  ./build-dev.sh all       # Build for both platforms"
    exit 1
fi

PLATFORM=$1

case $PLATFORM in
    ios)
        echo -e "${GREEN}Building iOS development build...${NC}"
        echo ""
        build_platform "ios"
        ;;
    android)
        echo -e "${GREEN}Building Android development build...${NC}"
        echo ""
        build_platform "android"
        ;;
    all)
        echo -e "${GREEN}Building for both iOS and Android...${NC}"
        echo ""
        build_platform "all"
        ;;
    *)
        echo -e "${YELLOW}Invalid platform: $PLATFORM${NC}"
        echo "Please use: ios, android, or all"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Build command executed!${NC}"
echo ""
echo "Next steps:"
echo "1. Wait for build to complete (check EAS dashboard)"
echo "2. Download and install on your device"
echo "3. Run: ./start-cms-server.sh"
echo "4. Run: npx expo start --dev-client"
echo "5. Open dev build app and scan QR code"
echo ""
echo "See DEVELOPMENT_BUILD_GUIDE.md for detailed instructions."
