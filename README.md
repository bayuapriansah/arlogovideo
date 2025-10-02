# AR Logo Video - Augmented Reality Website

A full-stack web application that enables users to scan printed images with their mobile devices to unlock interactive AR video content.

## 🎯 Features

### Client Interface
- 📱 **Mobile-Optimized Landing Page** - Beautiful, responsive design
- 🎥 **AR Experience** - Scan images to play videos in augmented reality
- 📲 **Device Detection** - Automatically detects device capabilities
- 🖨️ **Printable Images** - Works with any standard printer
- ✅ **Cross-Platform** - Supports iOS and Android devices

### Admin Interface
- 🔐 **Secure Login** - JWT-based authentication
- 📊 **Dashboard** - Manage all AR targets in one place
- ⬆️ **File Upload** - Upload images and videos with progress tracking
- ✏️ **CRUD Operations** - Create, Read, Update, Delete AR targets
- 📱 **Responsive Design** - Works on mobile and desktop

### Technical Features
- 🎯 **Image Recognition** - Advanced AR tracking
- 🗄️ **MySQL Database** - Stores image-video relationships
- 🔄 **Real-time Updates** - Instant synchronization
- 🚀 **RESTful API** - Clean, documented endpoints
- 🔒 **Secure** - Protected routes and file uploads

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd arlogovideo
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Set Up MySQL Database
```bash
mysql -u root -p
CREATE DATABASE ar_logo_video;
EXIT;
```

### 5. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` with your settings:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ar_logo_video
JWT_SECRET=your_jwt_secret_key_change_this_in_production
ADMIN_DEFAULT_USERNAME=admin
ADMIN_DEFAULT_PASSWORD=admin123
```

### 6. Start the Application

**Development Mode (Both Backend and Frontend):**
```bash
npm run dev:all
```

**Or run separately:**

Backend:
```bash
npm run dev
```

Frontend (in another terminal):
```bash
npm run client
```

**Production Mode:**
```bash
# Build frontend
cd client
npm run build
cd ..

# Start backend
npm start
```

## 🌐 Access the Application

- **Client Interface**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api

### Default Admin Credentials
- **Username**: admin
- **Password**: admin123

⚠️ **Important**: Change the default password after first login!

## 📱 Usage

### For End Users (Client)

1. **Visit the Landing Page**
   - Open the website on your mobile device
   - Read about how AR works

2. **Start AR Experience**
   - Click "Start AR Experience"
   - Allow camera permissions
   - Point camera at a printed AR image
   - Tap the image button when you see the target
   - Watch the video appear!

3. **Print AR Images**
   - Admin uploads images that can be printed
   - Print on regular paper (A4/Letter)
   - Use the printed image for AR scanning

### For Administrators

1. **Login**
   - Navigate to `/admin/login`
   - Enter credentials

2. **Add AR Target**
   - Click "Add New Target"
   - Enter name and description
   - Upload an image (JPG, PNG)
   - Upload a video (MP4, WebM)
   - Click "Create Target"

3. **Manage Targets**
   - View all AR targets
   - Edit existing targets
   - Delete targets
   - Preview images and videos

## 📂 Project Structure

```
arlogovideo/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── routes/
│   │   ├── auth.js            # Auth routes (login, verify)
│   │   └── targets.js         # AR targets CRUD routes
│   └── server.js              # Express server
├── client/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── admin/         # Admin components
│       │   │   ├── AdminLogin.js
│       │   │   ├── AdminDashboard.js
│       │   │   └── ProtectedRoute.js
│       │   └── client/        # Client components
│       │       ├── LandingPage.js
│       │       └── ARView.js
│       ├── utils/
│       │   └── deviceDetection.js
│       ├── App.js
│       ├── config.js
│       └── index.js
├── uploads/                   # Uploaded files (created automatically)
├── .env                       # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### AR Targets
- `GET /api/targets` - Get all active targets (public)
- `GET /api/targets/:id` - Get single target (public)
- `POST /api/targets` - Create new target (admin only)
- `PUT /api/targets/:id` - Update target (admin only)
- `DELETE /api/targets/:id` - Delete target (admin only)

### Health Check
- `GET /api/health` - Server health status

## 🎨 Supported File Formats

### Images (AR Targets)
- JPEG (.jpg, .jpeg)
- PNG (.png)

### Videos
- MP4 (.mp4)
- WebM (.webm)
- MOV (.mov)

**File Size Limit**: 50MB per file

## 📱 Device Compatibility

### Mobile Browsers
- ✅ iOS Safari (iOS 11+)
- ✅ Chrome for Android
- ✅ Samsung Internet
- ✅ Firefox Mobile

### Desktop Browsers
- Desktop can view the landing page
- AR feature requires mobile/tablet device

## 🔧 Troubleshooting

### Camera Not Working
- Ensure camera permissions are granted
- Use HTTPS in production (required for camera access)
- Check if device supports camera API

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### Upload Failed
- Check file size (max 50MB)
- Verify file format is supported
- Ensure uploads folder has write permissions

### AR Not Detecting Images
- Ensure good lighting
- Hold device steady
- Image should be clearly visible
- Use high-quality prints

## 🔒 Security Notes

1. **Change Default Credentials** - Update admin password immediately
2. **Use Strong JWT Secret** - Generate a secure random string
3. **HTTPS in Production** - Required for camera access
4. **Input Validation** - All inputs are sanitized
5. **File Upload Security** - Limited file types and sizes

## 🚀 Deployment

### Production Checklist
- [ ] Change admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure HTTPS
- [ ] Set up database backups
- [ ] Configure CORS properly
- [ ] Build React app (`npm run build`)
- [ ] Set NODE_ENV=production
- [ ] Use process manager (PM2)

### Example with PM2
```bash
npm install -g pm2
pm2 start backend/server.js --name "ar-server"
pm2 startup
pm2 save
```

## 📄 License

ISC License

## 👨‍💻 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors

## 🎉 Acknowledgments

- AR functionality designed for mobile-first experience
- Built with React, Node.js, Express, and MySQL
- Responsive design for all screen sizes

---

**Made with ❤️ for AR enthusiasts**

