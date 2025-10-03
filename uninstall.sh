#!/bin/bash

##############################################################################
# AR Logo Video - Uninstall Script
# Removes application and optionally database
##############################################################################

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

APP_DIR="/var/www/arlogovideo"
DB_NAME="ar_logo_video"

echo -e "${RED}"
echo "╔═══════════════════════════════════════════╗"
echo "║   AR Logo Video - Uninstall Script        ║"
echo "╚═══════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}⚠️  WARNING: This will remove the application!${NC}"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Uninstall cancelled"
    exit 0
fi

echo -e "${GREEN}[1/5] Stopping application...${NC}"
pm2 delete ar-server 2>/dev/null || true
pm2 save

echo -e "${GREEN}[2/5] Removing Nginx configuration...${NC}"
rm -f /etc/nginx/sites-enabled/arlogovideo
rm -f /etc/nginx/sites-available/arlogovideo
systemctl reload nginx

echo -e "${GREEN}[3/5] Removing application files...${NC}"
rm -rf ${APP_DIR}

read -p "Remove database? (yes/no): " remove_db
if [ "$remove_db" == "yes" ]; then
    echo -e "${GREEN}[4/5] Removing database...${NC}"
    mysql -u root -pRootPass@123 -e "DROP DATABASE IF EXISTS ${DB_NAME};"
    mysql -u root -pRootPass@123 -e "DROP USER IF EXISTS 'ar_admin'@'localhost';"
else
    echo -e "${YELLOW}[4/5] Skipping database removal${NC}"
fi

echo -e "${GREEN}[5/5] Removing SSL certificates (if any)...${NC}"
certbot delete --cert-name zerobyte.web.id 2>/dev/null || true

echo -e "${GREEN}✅ Uninstall complete!${NC}"
echo ""
echo "The following were NOT removed (manual removal required if desired):"
echo "- Node.js"
echo "- MySQL Server"
echo "- Nginx"
echo "- PM2"

