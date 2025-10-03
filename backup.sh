#!/bin/bash

##############################################################################
# AR Logo Video - Backup Script
# Backs up database and uploaded files
##############################################################################

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/arlogovideo"
BACKUP_DIR="/var/backups/arlogovideo"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ar_logo_video"
DB_USER="root"
DB_PASS="RootPass@123"

echo -e "${GREEN}Creating backup...${NC}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

echo -e "${GREEN}[1/3] Backing up database...${NC}"
mysqldump -u ${DB_USER} -p${DB_PASS} ${DB_NAME} > ${BACKUP_DIR}/database_${DATE}.sql
gzip ${BACKUP_DIR}/database_${DATE}.sql

echo -e "${GREEN}[2/3] Backing up uploaded files...${NC}"
if [ -d "${APP_DIR}/uploads" ]; then
    tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz -C ${APP_DIR} uploads
fi

echo -e "${GREEN}[3/3] Backing up configuration files...${NC}"
tar -czf ${BACKUP_DIR}/config_${DATE}.tar.gz -C ${APP_DIR} .env client/.env

echo -e "${GREEN}✅ Backup complete!${NC}"
echo "Backup location: ${BACKUP_DIR}"
ls -lh ${BACKUP_DIR}/*${DATE}*

# Clean old backups (keep last 7 days)
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete
find ${BACKUP_DIR} -name "*.tar.gz" -mtime +7 -delete

echo -e "${YELLOW}Old backups cleaned (kept last 7 days)${NC}"

