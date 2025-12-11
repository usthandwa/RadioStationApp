#!/bin/bash

# Start Development Environment
# Starts both CMS server and Expo dev server

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Starting Development Environment"
echo "===================================="
echo ""

# Check if CMS server is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  CMS server already running on port 3001${NC}"
else
    echo -e "${BLUE}Starting CMS API server...${NC}"
    cd cms-server
    if [ ! -d "node_modules" ]; then
        echo "Installing CMS server dependencies..."
        yarn install
    fi
    yarn dev > ../cms-server.log 2>&1 &
    CMS_PID=$!
    cd ..
    sleep 2

    # Check if CMS server started successfully
    if curl -s http://192.168.0.188:3001/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ CMS API server running at http://192.168.0.188:3001${NC}"
    else
        echo -e "${RED}❌ Failed to start CMS server${NC}"
        exit 1
    fi
fi

echo ""

# Check if Expo is already running
if lsof -Pi :8081 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Expo already running on port 8081${NC}"
    echo -e "${YELLOW}   Killing existing instance...${NC}"
    lsof -ti:8081 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo -e "${BLUE}Starting Expo development server...${NC}"
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Development environment is ready! 🎉${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Services:"
echo -e "  ${BLUE}CMS API:${NC}    http://192.168.0.188:3001"
echo -e "  ${BLUE}Expo Metro:${NC} http://192.168.0.188:8081"
echo ""
echo "Next steps:"
echo "  1. Open your development build app on device"
echo "  2. Scan the QR code below"
echo "  3. Start developing!"
echo ""
echo -e "${YELLOW}CMS server logs: tail -f cms-server.log${NC}"
echo ""
echo "────────────────────────────────────────"
echo ""

# Start Expo in foreground
npx expo start --dev-client
