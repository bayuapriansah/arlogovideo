# Installation Checklist

Use this checklist to ensure proper setup:

## Prerequisites
- [ ] Node.js installed (v14+)
- [ ] MySQL installed and running
- [ ] npm or yarn installed

## Backend Setup
- [ ] Run `npm install` in root directory
- [ ] Create `.env` file with database credentials
- [ ] MySQL database created (`ar_logo_video`)
- [ ] Test backend: `npm run dev`
- [ ] Backend running on http://localhost:5000

## Frontend Setup
- [ ] Run `npm install` in `client/` directory
- [ ] Create `client/.env` with API URLs
- [ ] Test frontend: `cd client && npm start`
- [ ] Frontend running on http://localhost:3000

## Database
- [ ] MySQL service is running
- [ ] Database `ar_logo_video` exists
- [ ] Tables auto-created on first run
- [ ] Default admin user created

## Configuration Files
- [ ] `.env` in root (backend config)
- [ ] `client/.env` (frontend config)
- [ ] JWT_SECRET set to secure random string
- [ ] DB credentials correct

## Testing
- [ ] Backend health check: http://localhost:5000/api/health
- [ ] Frontend loads: http://localhost:3000
- [ ] Admin login works: http://localhost:3000/admin/login
- [ ] Can create new AR target
- [ ] Can upload image and video
- [ ] AR view accessible on mobile
- [ ] Camera permission works
- [ ] Video plays when target selected

## Production Ready
- [ ] Changed default admin password
- [ ] Set strong JWT_SECRET
- [ ] Configured HTTPS
- [ ] Built frontend: `cd client && npm run build`
- [ ] Environment set to production
- [ ] Database backups configured
- [ ] Process manager configured (PM2)
- [ ] CORS properly configured
- [ ] File upload limits set
- [ ] Error logging configured

## Security Checklist
- [ ] Admin password changed from default
- [ ] JWT_SECRET is strong and unique
- [ ] HTTPS enabled (production)
- [ ] Database user has limited permissions
- [ ] File upload directory has proper permissions
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled (optional)
- [ ] SQL injection prevented (using prepared statements)
- [ ] XSS protection enabled
- [ ] File type validation working

## Mobile Testing
- [ ] Tested on iOS Safari
- [ ] Tested on Android Chrome
- [ ] Camera permissions work
- [ ] AR experience smooth
- [ ] Video playback works
- [ ] Responsive design verified
- [ ] Touch interactions work
- [ ] Portrait and landscape tested

## Final Verification
- [ ] All pages load without errors
- [ ] Console has no errors
- [ ] Images upload successfully
- [ ] Videos upload successfully
- [ ] AR targets display correctly
- [ ] Mobile device detection works
- [ ] Desktop warning appears
- [ ] Logout works properly
- [ ] Protected routes secured
- [ ] Public routes accessible

## Documentation Review
- [ ] README.md reviewed
- [ ] SETUP_GUIDE.md reviewed
- [ ] QUICK_START.md reviewed
- [ ] API endpoints documented
- [ ] Environment variables documented

## Performance
- [ ] Image file sizes optimized
- [ ] Video file sizes reasonable
- [ ] Page load time acceptable
- [ ] API response time good
- [ ] Database queries optimized
- [ ] No memory leaks

## Backup & Recovery
- [ ] Database backup strategy in place
- [ ] File upload backup configured
- [ ] Recovery procedure documented
- [ ] Rollback plan exists

---

## Status: Ready for Production ✅

Once all items are checked, your AR Logo Video website is ready!

**Last Updated:** $(date)

