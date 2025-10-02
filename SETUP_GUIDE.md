# Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 2. Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE ar_logo_video;

# Exit MySQL
EXIT;
```

### 3. Configure Environment

```bash
# Create .env file
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=ar_logo_video
JWT_SECRET=change_this_to_random_secure_string
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=admin123
```

### 4. Start Development Servers

Option A - Run both servers together:
```bash
npm run dev:all
```

Option B - Run separately:
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### 5. Access the Application

- **Client**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api

### 6. First Login

- Username: `admin`
- Password: `admin123`

**Important**: Change this password after first login!

## Testing the AR Feature

1. Login to admin panel
2. Upload an image and video
3. Download/print the image
4. Open the website on your mobile phone
5. Click "Start AR Experience"
6. Point camera at the printed image
7. Tap the image button
8. Watch the video play!

## Common Issues

### "Cannot connect to database"
- Make sure MySQL is running
- Check credentials in `.env`
- Ensure database exists

### "Port 5000 already in use"
- Change PORT in `.env`
- Or kill the process using port 5000

### "Camera not working"
- Allow camera permissions in browser
- Use HTTPS for production (HTTP works on localhost)
- Check if device has a camera

### "Module not found"
- Run `npm install` in root directory
- Run `npm install` in client directory

## Production Deployment

### 1. Build Frontend
```bash
cd client
npm run build
cd ..
```

### 2. Set Environment to Production
```env
NODE_ENV=production
```

### 3. Start Server
```bash
npm start
```

### 4. Optional: Use PM2
```bash
npm install -g pm2
pm2 start backend/server.js --name ar-server
pm2 startup
pm2 save
```

## Need Help?

Check the main README.md for detailed documentation.

