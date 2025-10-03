#!/bin/bash

##############################################################################
# AR Logo Video - Management Script
# Easy commands to manage the application
##############################################################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/arlogovideo"

show_menu() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════╗"
    echo "║   AR Logo Video - Management Menu    ║"
    echo "╚═══════════════════════════════════════╝"
    echo -e "${NC}"
    echo "1) Start Application"
    echo "2) Stop Application"
    echo "3) Restart Application"
    echo "4) View Logs"
    echo "5) Check Status"
    echo "6) Update Application"
    echo "7) Backup Database"
    echo "8) View Credentials"
    echo "9) Nginx Reload"
    echo "10) Clean Logs"
    echo "0) Exit"
    echo ""
}

start_app() {
    echo -e "${GREEN}Starting application...${NC}"
    pm2 start ar-server
    pm2 save
}

stop_app() {
    echo -e "${YELLOW}Stopping application...${NC}"
    pm2 stop ar-server
}

restart_app() {
    echo -e "${GREEN}Restarting application...${NC}"
    pm2 restart ar-server
    pm2 save
}

view_logs() {
    echo -e "${GREEN}Viewing logs (Ctrl+C to exit)...${NC}"
    pm2 logs ar-server
}

check_status() {
    echo -e "${GREEN}Application Status:${NC}"
    pm2 status ar-server
    echo ""
    echo -e "${GREEN}Nginx Status:${NC}"
    systemctl status nginx --no-pager
    echo ""
    echo -e "${GREEN}MySQL Status:${NC}"
    systemctl status mysql --no-pager
}

update_app() {
    echo -e "${GREEN}Updating application...${NC}"
    bash ${APP_DIR}/../update.sh
}

backup_db() {
    echo -e "${GREEN}Creating backup...${NC}"
    bash ${APP_DIR}/../backup.sh
}

view_credentials() {
    if [ -f "${APP_DIR}/CREDENTIALS.txt" ]; then
        cat ${APP_DIR}/CREDENTIALS.txt
    else
        echo -e "${YELLOW}Credentials file not found${NC}"
        echo "Check ${APP_DIR}/.env for configuration"
    fi
}

reload_nginx() {
    echo -e "${GREEN}Reloading Nginx...${NC}"
    nginx -t && systemctl reload nginx
}

clean_logs() {
    echo -e "${GREEN}Cleaning PM2 logs...${NC}"
    pm2 flush
    echo -e "${GREEN}Logs cleaned${NC}"
}

while true; do
    show_menu
    read -p "Select option: " choice
    echo ""
    
    case $choice in
        1) start_app ;;
        2) stop_app ;;
        3) restart_app ;;
        4) view_logs ;;
        5) check_status ;;
        6) update_app ;;
        7) backup_db ;;
        8) view_credentials ;;
        9) reload_nginx ;;
        10) clean_logs ;;
        0) echo -e "${GREEN}Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done

