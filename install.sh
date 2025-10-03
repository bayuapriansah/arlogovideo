#!/bin/bash

##############################################################################
# AR Logo Video - Complete Installation Script
# Server IP: 103.250.11.230
# Domain: zerobyte.web.id
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_IP="103.250.11.230"
DOMAIN="zerobyte.web.id"
APP_DIR="/var/www/arlogovideo"
DB_NAME="ar_logo_video"
DB_USER="ar_admin"
DB_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin@123"

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║       AR Logo Video - Installation Script               ║"
echo "║       Domain: zerobyte.web.id                           ║"
echo "║       IP: 103.250.11.230                                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
   echo -e "${RED}Please run as root (use sudo)${NC}"
   exit 1
fi

echo -e "${GREEN}[1/10] Updating system packages...${NC}"
add-apt-repository universe -y 2>/dev/null || true
apt update && apt upgrade -y

echo -e "${GREEN}[2/10] Installing required packages...${NC}"
apt install -y curl wget git nginx snapd

echo -e "${GREEN}[3/10] Installing Node.js 18.x...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

echo -e "${GREEN}[4/10] Removing MySQL and Installing MariaDB...${NC}"
# Remove MySQL if installed
apt purge -y mysql-server mysql-client mysql-common mysql-server-core-* mysql-client-core-* 2>/dev/null || true
apt autoremove -y
apt autoclean

# Install MariaDB
apt install -y mariadb-server mariadb-client

# Start MariaDB
systemctl start mariadb
systemctl enable mariadb

# Secure MariaDB installation
echo -e "${GREEN}[5/10] Configuring MariaDB...${NC}"
mysql -e "SET PASSWORD FOR 'root'@'localhost' = PASSWORD('RootPass@123');"
mysql -u root -pRootPass@123 -e "DELETE FROM mysql.user WHERE User='';"
mysql -u root -pRootPass@123 -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -u root -pRootPass@123 -e "DROP DATABASE IF EXISTS test;"
mysql -u root -pRootPass@123 -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -u root -pRootPass@123 -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}[6/10] Creating database and user...${NC}"
mysql -u root -pRootPass@123 << EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}[7/10] Installing PM2 globally...${NC}"
npm install -g pm2

echo -e "${GREEN}[8/10] Cloning and setting up application...${NC}"
# Create app directory
mkdir -p ${APP_DIR}
cd ${APP_DIR}

# Clone repository
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest changes..."
    git pull origin main
else
    git clone https://github.com/bayuapriansah/arlogovideo.git .
fi

echo -e "${GREEN}[9/10] Installing dependencies...${NC}"
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..

echo -e "${GREEN}[10/10] Configuring environment...${NC}"
# Create backend .env
cat > .env << EOF
PORT=5000
DB_HOST=localhost
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=${DB_NAME}
JWT_SECRET=${JWT_SECRET}
ADMIN_DEFAULT_USERNAME=${ADMIN_USERNAME}
ADMIN_DEFAULT_PASSWORD=${ADMIN_PASSWORD}
NODE_ENV=production
EOF

# Create frontend .env
cat > client/.env << EOF
REACT_APP_API_URL=https://${DOMAIN}/api
REACT_APP_BASE_URL=https://${DOMAIN}
EOF

echo -e "${GREEN}Building React frontend...${NC}"
cd client
npm run build
cd ..

echo -e "${GREEN}Setting up Nginx...${NC}"
cat > /etc/nginx/sites-available/arlogovideo << 'EOF'
server {
    listen 80;
    server_name zerobyte.web.id www.zerobyte.web.id;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name zerobyte.web.id www.zerobyte.web.id;

    # SSL Configuration (will be managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/zerobyte.web.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zerobyte.web.id/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory for React build
    root /var/www/arlogovideo/client/build;
    index index.html;

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads directory
    location /uploads {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # File upload size limit
    client_max_body_size 50M;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/arlogovideo /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

echo -e "${GREEN}Installing Certbot via Snap...${NC}"
snap install core
snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

echo -e "${GREEN}Setting up SSL certificate...${NC}"
echo -e "${YELLOW}Note: Make sure your domain zerobyte.web.id points to ${SERVER_IP}${NC}"
read -p "Press Enter to continue with SSL setup (or Ctrl+C to cancel)..."

# Get SSL certificate
certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email bayuapriansah10@gmail.com --redirect

# Reload Nginx
systemctl reload nginx

echo -e "${GREEN}Starting application with PM2...${NC}"
cd ${APP_DIR}
pm2 delete ar-server 2>/dev/null || true
pm2 start backend/server.js --name ar-server
pm2 startup
pm2 save

# Set permissions
chown -R www-data:www-data ${APP_DIR}
chmod -R 755 ${APP_DIR}
mkdir -p ${APP_DIR}/uploads
chown -R www-data:www-data ${APP_DIR}/uploads

# Configure firewall
echo -e "${GREEN}Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║              Installation Complete! 🎉                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${GREEN}=== Access Information ===${NC}"
echo -e "Website: ${BLUE}https://${DOMAIN}${NC}"
echo -e "Admin Panel: ${BLUE}https://${DOMAIN}/admin/login${NC}"
echo -e "API: ${BLUE}https://${DOMAIN}/api/health${NC}"
echo ""
echo -e "${GREEN}=== Admin Credentials ===${NC}"
echo -e "Username: ${YELLOW}${ADMIN_USERNAME}${NC}"
echo -e "Password: ${YELLOW}${ADMIN_PASSWORD}${NC}"
echo -e "${RED}⚠️  CHANGE PASSWORD AFTER FIRST LOGIN!${NC}"
echo ""
echo -e "${GREEN}=== Database Information ===${NC}"
echo -e "MariaDB Root Password: ${YELLOW}RootPass@123${NC}"
echo -e "Database Name: ${YELLOW}${DB_NAME}${NC}"
echo -e "Database User: ${YELLOW}${DB_USER}${NC}"
echo -e "Database Password: ${YELLOW}${DB_PASSWORD}${NC}"
echo ""
echo -e "${GREEN}=== Important Files ===${NC}"
echo -e "App Directory: ${YELLOW}${APP_DIR}${NC}"
echo -e "Backend .env: ${YELLOW}${APP_DIR}/.env${NC}"
echo -e "Frontend .env: ${YELLOW}${APP_DIR}/client/.env${NC}"
echo -e "Nginx Config: ${YELLOW}/etc/nginx/sites-available/arlogovideo${NC}"
echo ""
echo -e "${GREEN}=== Useful Commands ===${NC}"
echo -e "View logs: ${YELLOW}pm2 logs ar-server${NC}"
echo -e "Restart app: ${YELLOW}pm2 restart ar-server${NC}"
echo -e "Stop app: ${YELLOW}pm2 stop ar-server${NC}"
echo -e "Nginx reload: ${YELLOW}systemctl reload nginx${NC}"
echo ""
echo -e "${YELLOW}Save this information in a secure location!${NC}"

# Save credentials to file
cat > ${APP_DIR}/CREDENTIALS.txt << EOF
AR Logo Video - Server Credentials
===================================
Generated: $(date)

Website: https://${DOMAIN}
Admin Panel: https://${DOMAIN}/admin/login

Admin Credentials:
------------------
Username: ${ADMIN_USERNAME}
Password: ${ADMIN_PASSWORD}

Database Information:
--------------------
MariaDB Root Password: RootPass@123
Database Name: ${DB_NAME}
Database User: ${DB_USER}
Database Password: ${DB_PASSWORD}

JWT Secret: ${JWT_SECRET}

IMPORTANT: Change admin password after first login!
This file should be deleted after you've saved the credentials securely.
EOF

chmod 600 ${APP_DIR}/CREDENTIALS.txt

echo -e "${GREEN}Credentials saved to: ${YELLOW}${APP_DIR}/CREDENTIALS.txt${NC}"
echo -e "${RED}Please delete this file after saving credentials!${NC}"

