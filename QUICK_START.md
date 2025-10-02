# 🚀 Quick Start Guide

## Prerequisites
- Node.js installed
- MySQL installed and running

## Installation (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2️⃣ Setup Database
```bash
mysql -u root -p
```
Then in MySQL:
```sql
CREATE DATABASE ar_logo_video;
EXIT;
```

### 3️⃣ Configure Settings
Create `.env` file in root directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ar_logo_video
JWT_SECRET=your_secret_key_here
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=admin123
```

Create `client/.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:5000
```

### 4️⃣ Start Application
```bash
npm run dev:all
```

### 5️⃣ Open Browser
- Client: http://localhost:3000
- Admin: http://localhost:3000/admin/login

### 6️⃣ Login as Admin
- Username: `admin`
- Password: `admin123`

## 🎯 First AR Target

1. Login to admin panel
2. Click "Add New Target"
3. Enter name: "Test Logo"
4. Upload an image (your logo)
5. Upload a video
6. Click "Create Target"
7. Print the image
8. Open site on mobile
9. Click "Start AR Experience"
10. Point camera at printed image
11. Tap the image button
12. Enjoy! 🎉

## 📱 Mobile Testing

For local testing on mobile:
1. Find your computer's IP address
2. Update client/.env:
   ```env
   REACT_APP_API_URL=http://YOUR_IP:5000/api
   REACT_APP_BASE_URL=http://YOUR_IP:5000
   ```
3. Restart the servers
4. On mobile, visit: http://YOUR_IP:3000

## ⚠️ Important Notes

- ✅ Works on localhost with HTTP
- 🔒 Production needs HTTPS for camera
- 📱 AR works best on mobile devices
- 🖨️ Print images in good quality
- 💡 Good lighting helps AR detection

## 🆘 Common Issues

**Database connection error?**
- Check MySQL is running
- Verify DB_PASSWORD in .env

**Port already in use?**
- Change PORT in .env
- Or stop the service using that port

**Camera not working?**
- Allow camera permissions
- Use mobile device
- Check browser compatibility

## 🎉 You're Ready!

Your AR website is now running!

For detailed documentation, see README.md

