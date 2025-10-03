#!/bin/bash

##############################################################################
# AR Logo Video - Update Script
# Updates application from GitHub
##############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/var/www/arlogovideo"

echo -e "${BLUE}Updating AR Logo Video...${NC}"

if [ ! -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Application not found at ${APP_DIR}${NC}"
    exit 1
fi

cd ${APP_DIR}

echo -e "${GREEN}[1/6] Stopping application...${NC}"
pm2 stop ar-server

echo -e "${GREEN}[2/6] Backing up current version...${NC}"
backup_dir="${APP_DIR}_backup_$(date +%Y%m%d_%H%M%S)"
cp -r ${APP_DIR} ${backup_dir}
echo "Backup created at: ${backup_dir}"

echo -e "${GREEN}[3/6] Pulling latest changes...${NC}"
git pull origin main

echo -e "${GREEN}[4/6] Installing dependencies...${NC}"
npm install
cd client && npm install && cd ..

echo -e "${GREEN}[5/6] Building frontend...${NC}"
cd client && npm run build && cd ..

echo -e "${GREEN}[6/6] Restarting application...${NC}"
pm2 restart ar-server
pm2 save

echo -e "${GREEN}✅ Update complete!${NC}"
echo "Application is running with latest version"
echo "Backup saved at: ${backup_dir}"

