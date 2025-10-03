# Automatic AR Marker Compilation Setup

## 🎯 Goal
Automatically compile uploaded images into AR markers when admin uploads them.

## 📦 Required Packages

On your server, run:

```bash
cd /var/www/arlogovideo

# Install required packages
sudo npm install canvas --save

# Restart backend
sudo pm2 restart ar-server
```

## 🔧 How It Works

### When Admin Uploads Image:
1. Image saved to `/uploads/`
2. **Auto-compilation triggers**
3. Marker file created at `/uploads/markers/target_X.mind`
4. Combined markers file updated at `/uploads/markers/targets.mind`

### When User Opens AR:
1. App loads `/uploads/markers/targets.mind`
2. MindAR uses this to detect printed images
3. Video plays automatically when marker detected!

## ⚠️ Important: MindAR Web Compiler

The current implementation creates placeholder marker files. For REAL marker tracking, you need to:

### Option 1: Manual Compilation (Current)
1. Admin uploads image via website
2. Admin goes to: https://hiukim.github.io/mind-ar-js-doc/tools/compile
3. Uploads the SAME image
4. Downloads the `.mind` file
5. Replaces `/var/www/arlogovideo/uploads/markers/targets.mind` with downloaded file

### Option 2: Integrate MindAR Compiler API (Advanced)
Create a Node.js script that:
1. Extracts feature points from uploaded image
2. Generates proper `.mind` file format
3. This requires deep integration with MindAR's compiler logic

### Option 3: Use MindAR Compiler Service (Recommended)
Create a microservice that:
1. Receives uploaded image
2. Uses MindAR compiler library
3. Returns compiled `.mind` file
4. Automatically triggered on upload

## 🚀 Quick Start (Manual for Now)

1. **Upload image via admin panel**
2. **Download the uploaded image**
3. **Go to**: https://hiukim.github.io/mind-ar-js-doc/tools/compile
4. **Upload the image and compile**
5. **Download the `.mind` file**
6. **Upload to server**:
```bash
# On your local machine
scp targets.mind ubuntu@103.250.11.230:/var/www/arlogovideo/uploads/markers/

# On server
sudo chown www-data:www-data /var/www/arlogovideo/uploads/markers/targets.mind
```

7. **Test AR** - Should now detect the printed image!

## 🔮 Future Enhancement

I can create a webhook or serverless function that:
- Receives image upload event
- Calls MindAR compiler API
- Stores compiled marker
- All automatic!

Would you like me to implement this?

## 📝 Current Status

✅ Auto-compilation structure ready  
✅ Marker storage system ready  
⚠️ Manual compilation step needed (for now)  
🔜 Can integrate full auto-compilation with additional setup

