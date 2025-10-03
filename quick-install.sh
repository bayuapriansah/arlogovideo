#!/bin/bash

##############################################################################
# AR Logo Video - Quick Installation Script (Without SSL)
# For testing or local deployment
# IP: 103.250.11.230
##############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="103.250.11.230"
DOMAIN="zerobyte.web.id"
APP_DIR="/var/www/arlogovideo"
DB_NAME="ar_logo_video"
DB_USER="ar_admin"
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AR Logo Video - Quick Install         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"

if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

echo -e "${GREEN}[1/8] Installing system packages...${NC}"
apt update
apt install -y curl git nginx mysql-server

echo -e "${GREEN}[2/8] Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo -e "${GREEN}[3/8] Setting up MySQL...${NC}"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootPass@123';"
mysql -u root -pRootPass@123 << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}[4/8] Installing PM2...${NC}"
npm install -g pm2

echo -e "${GREEN}[5/8] Cloning application...${NC}"
mkdir -p ${APP_DIR}
cd ${APP_DIR}
git clone https://github.com/bayuapriansah/arlogovideo.git . || git pull origin main

echo -e "${GREEN}[6/8] Installing dependencies...${NC}"
npm install
cd client && npm install && cd ..

echo -e "${GREEN}[7/8] Configuring application...${NC}"
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=Admin@123
NODE_ENV=production
EOF

cat > client/.env << EOF
REACT_APP_API_URL=http://${SERVER_IP}:5000/api
REACT_APP_BASE_URL=http://${SERVER_IP}:5000
EOF

cd client && npm run build && cd ..

echo -e "${GREEN}[8/8] Starting application...${NC}"
pm2 delete ar-server 2>/dev/null || true
pm2 start backend/server.js --name ar-server
pm2 startup
pm2 save

# Simple nginx config (HTTP only)
cat > /etc/nginx/sites-available/arlogovideo << EOF
server {
    listen 80;
    server_name ${SERVER_IP} ${DOMAIN};

    root ${APP_DIR}/client/build;
    index index.html;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    location /uploads {
        proxy_pass http://localhost:5000;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    client_max_body_size 50M;
}
EOF

ln -sf /etc/nginx/sites-available/arlogovideo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

mkdir -p ${APP_DIR}/uploads
chown -R www-data:www-data ${APP_DIR}

echo -e "${GREEN}✅ Installation Complete!${NC}"
echo ""
echo -e "Access: ${BLUE}http://${SERVER_IP}${NC}"
echo -e "Admin: ${BLUE}http://${SERVER_IP}/admin/login${NC}"
echo -e "Username: ${YELLOW}admin${NC}"
echo -e "Password: ${YELLOW}Admin@123${NC}"
echo ""
echo -e "MySQL Root Password: ${YELLOW}RootPass@123${NC}"
echo -e "DB Password: ${YELLOW}${DB_PASSWORD}${NC}"

