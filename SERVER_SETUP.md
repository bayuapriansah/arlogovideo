# 🖥️ Server Setup Instructions

## Quick Start - Deploy to zerobyte.web.id

### Prerequisites
✅ Ubuntu Server 20.04/22.04  
✅ Root access via SSH  
✅ Domain DNS configured: zerobyte.web.id → 103.250.11.230  

---

## 🚀 One-Command Deployment

```bash
# 1. SSH into your server
ssh root@103.250.11.230

# 2. Download and run installation script
wget https://raw.githubusercontent.com/bayuapriansah/arlogovideo/main/install.sh && chmod +x install.sh && sudo ./install.sh
```

**That's it!** ✨

The script will automatically:
- Install all dependencies
- Configure MySQL database
- Set up Nginx + SSL
- Deploy the application
- Start with PM2

**Time:** ~10-15 minutes

---

## 📋 What Gets Installed

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18.x | Backend runtime |
| MySQL | Latest | Database |
| Nginx | Latest | Web server |
| PM2 | Latest | Process manager |
| Certbot | Latest | SSL certificates |

---

## 🔑 Access Information

After installation completes:

### Website
- **URL:** https://zerobyte.web.id
- **Admin:** https://zerobyte.web.id/admin/login

### Default Credentials
- **Username:** admin
- **Password:** Admin@123
- ⚠️ **Change immediately after first login!**

### Database
- **Name:** ar_logo_video
- **User:** ar_admin
- **Password:** (auto-generated, shown in terminal)
- **Root Password:** RootPass@123

---

## 🛠️ Management Scripts

All scripts are available in the repository:

### 1. Full Installation
```bash
sudo bash install.sh
```
Complete production setup with SSL

### 2. Quick Install (Testing)
```bash
sudo bash quick-install.sh
```
Fast HTTP-only installation

### 3. Update Application
```bash
sudo bash update.sh
```
Pull latest changes from GitHub

### 4. Create Backup
```bash
sudo bash backup.sh
```
Backup database and files

### 5. Management Menu
```bash
sudo bash manage.sh
```
Interactive management interface

### 6. Uninstall
```bash
sudo bash uninstall.sh
```
Remove application completely

---

## 📱 Using the Application

### For Admins:
1. Login at https://zerobyte.web.id/admin/login
2. Upload images and videos
3. Create AR targets
4. Manage content

### For Users:
1. Visit https://zerobyte.web.id
2. Click "Start AR Experience" on mobile
3. Point camera at printed AR image
4. Tap image button to play video

---

## 🔧 Useful Commands

### Check Application Status
```bash
pm2 status
pm2 logs ar-server
```

### Restart Application
```bash
pm2 restart ar-server
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

### View Logs
```bash
# Application logs
pm2 logs ar-server

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Access
```bash
mysql -u ar_admin -p ar_logo_video
```

---

## 🔐 Security Notes

### After Installation:
1. ✅ Change admin password
2. ✅ Save credentials securely
3. ✅ Delete CREDENTIALS.txt file
4. ✅ Configure firewall (done automatically)
5. ✅ Set up regular backups

### Firewall Rules (Auto-configured):
- Port 22 (SSH) ✅
- Port 80 (HTTP) ✅
- Port 443 (HTTPS) ✅

---

## 📊 Monitoring

### Check Server Resources
```bash
# CPU and Memory
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

### Application Health
```bash
curl https://zerobyte.web.id/api/health
```

---

## 🔄 Backup & Restore

### Create Backup
```bash
sudo bash backup.sh
```
Backups saved to: `/var/backups/arlogovideo/`

### Restore Database
```bash
cd /var/backups/arlogovideo
gunzip < database_YYYYMMDD_HHMMSS.sql.gz | mysql -u root -pRootPass@123 ar_logo_video
```

### Restore Files
```bash
cd /var/backups/arlogovideo
tar -xzf uploads_YYYYMMDD_HHMMSS.tar.gz -C /var/www/arlogovideo/
```

---

## 🐛 Troubleshooting

### Application not starting?
```bash
pm2 logs ar-server
pm2 restart ar-server
```

### Nginx error?
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### Database connection failed?
```bash
sudo systemctl status mysql
sudo systemctl restart mysql
```

### SSL certificate issues?
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

---

## 📁 Important Locations

| Item | Location |
|------|----------|
| Application | `/var/www/arlogovideo` |
| Backups | `/var/backups/arlogovideo` |
| Nginx Config | `/etc/nginx/sites-available/arlogovideo` |
| SSL Certs | `/etc/letsencrypt/live/zerobyte.web.id` |
| PM2 Logs | `/root/.pm2/logs/` |
| Credentials | `/var/www/arlogovideo/CREDENTIALS.txt` |

---

## 🎯 Quick Checklist

Before going live:

- [ ] DNS configured (zerobyte.web.id → 103.250.11.230)
- [ ] Installation completed successfully
- [ ] SSL certificate active
- [ ] Application accessible via HTTPS
- [ ] Admin login working
- [ ] Admin password changed
- [ ] Test AR on mobile device
- [ ] Backup script tested
- [ ] Firewall configured
- [ ] Monitoring set up

---

## 🌐 Live URLs

- **Main Site:** https://zerobyte.web.id
- **Admin Panel:** https://zerobyte.web.id/admin/login
- **API Health:** https://zerobyte.web.id/api/health
- **API Docs:** https://zerobyte.web.id/api

---

## 📞 Support

### View All Documentation
- README.md - Project overview
- DEPLOYMENT_GUIDE.md - Detailed deployment guide
- QUICK_START.md - Quick start guide
- SETUP_GUIDE.md - Setup instructions

### Check Status
```bash
sudo bash manage.sh
# Select option 5: Check Status
```

---

**Server:** 103.250.11.230  
**Domain:** zerobyte.web.id  
**Repository:** https://github.com/bayuapriansah/arlogovideo

🎉 **Your AR Logo Video platform is ready to use!**

