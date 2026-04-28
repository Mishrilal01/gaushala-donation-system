# Quick Reference Guide

## 🚀 Getting Started (5 minutes)

### Windows Users
1. Extract project folder
2. Double-click `start.bat`
3. Two windows open automatically
4. Open http://localhost:5173

### Mac/Linux Users
1. Extract project folder
2. Open terminal in project directory
3. Run: `chmod +x start.sh && ./start.sh`
4. Open http://localhost:5173

## 🔐 Admin Access

- **URL**: http://localhost:5173
- **Click**: "🔐 Admin" button in navigation
- **Password**: `gaushala123`

## 📊 Admin Dashboard Guide

### Pending Tab
- Shows donations awaiting approval
- Yellow background indicates pending status
- Click "✅ Approve" to make donation visible
- Click "❌ Reject" to deny donation
- Shows donor name, amount, date

### All Tab
- Complete history of all donations
- Color-coded status:
  - 🟢 Green: Approved
  - 🔴 Red: Rejected
  - 🟡 Yellow: Pending
- Scrollable list for easy browsing

### Statistics Section
- **Total Amount**: Sum of all approved donations
- **Trees Planted**: Amount ÷ 500
- **Total Donors**: Unique approved donations
- **Progress**: Percentage toward 100 tree goal

## 💳 User Donation Flow

1. **View Stats** → See current progress
2. **See QR Code** → Payment instructions
3. **Make Payment** → Scan UPI QR code
4. **Fill Form** → Enter name, amount
5. **Choose Visibility** → Public or Anonymous
6. **Submit** → Waits for admin approval
7. **Appear on Board** → After approval

## 📁 Key File Locations

| File | Purpose |
|------|---------|
| `server/server.js` | Backend main file |
| `client/src/App.jsx` | Frontend main app |
| `server/models/db.js` | Database setup |
| `database.sqlite` | SQLite database |
| `client/src/components/` | React components |
| `server/controllers/` | Business logic |
| `server/routes/` | API endpoints |

## 🔌 Common API Calls

### Get Statistics
```bash
curl http://localhost:5000/api/donations/stats
```

### Get Recent Donations
```bash
curl http://localhost:5000/api/donations/approved
```

### Submit Donation
```bash
curl -X POST http://localhost:5000/api/donations/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"John","amount":500,"isPublic":true}'
```

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password":"gaushala123"}'
```

## 🐛 Troubleshooting

### Problem: "Port 5000 already in use"
**Solution**: 
- Windows: `netstat -ano | findstr :5000` then close app
- Mac/Linux: `lsof -i :5000` then `kill -9 <PID>`

### Problem: "Cannot connect to API"
**Solution**: 
- Check backend is running on port 5000
- Check CORS URL in server/.env
- Browser console for CORS errors

### Problem: "Database error"
**Solution**:
- Delete `database.sqlite`
- Restart server (creates new database)

### Problem: "Dependencies installation fails"
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🎯 Customization Guide

### Change Admin Password
1. Open `server/controllers/adminController.js`
2. Find: `const ADMIN_PASSWORD = 'gaushala123';`
3. Change to: `const ADMIN_PASSWORD = 'your-password';`
4. Restart server

### Change Tree Cost
1. Open `server/controllers/donationController.js`
2. Find: `const treesPlanted = Math.floor(stats.totalAmount / 500);`
3. Change `500` to desired amount (e.g., 1000)
4. Restart server

### Change Goal Trees
1. All components use `goalTrees: 100`
2. To change, edit the hardcoded value
3. Or fetch from database

### Change Colors
1. Open `client/tailwind.config.js`
2. Modify color palette in `extend.colors`
3. Update component className references

### Change Refresh Intervals
- **Stats**: `useEffect` in `Stats.jsx` (30000ms = 30s)
- **Donations**: `useEffect` in `RecentDonations.jsx` (30000ms)
- **Supporters**: `useEffect` in `TopSupporters.jsx` (60000ms)

## 📈 Production Checklist

- [ ] Change admin password
- [ ] Update FRONTEND_URL in server/.env
- [ ] Enable HTTPS
- [ ] Setup SSL certificate
- [ ] Configure database backup
- [ ] Setup monitoring
- [ ] Test all features
- [ ] Optimize images
- [ ] Test on mobile devices
- [ ] Setup error tracking

## 📚 File Reference

```
Components (client/src/components/)
├── Hero.jsx ..................... Landing section
├── Stats.jsx .................... Dashboard stats
├── DonateSection.jsx ............ QR code display
├── DonationForm.jsx ............ Donation form
├── RecentDonations.jsx ......... Recent donors
├── TopSupporters.jsx .......... Top 3 donors
├── ProofGallery.jsx ........... Proof images
└── Footer.jsx .................. Footer

Controllers (server/controllers/)
├── donationController.js ....... Donation logic
└── adminController.js ......... Admin operations

Routes (server/routes/)
├── donationRoutes.js .......... Public API
└── adminRoutes.js ............ Admin API

Pages (client/src/pages/)
├── Home.jsx ................... Main page
└── Admin.jsx .................. Admin panel
```

## 💡 Quick Tips

1. **Backup Database**: Copy `database.sqlite` before major updates
2. **Test Locally**: Always test changes locally first
3. **Check Console**: Browser console shows API errors
4. **Server Logs**: Terminal shows backend logs
5. **Mobile Test**: Use Chrome DevTools responsive design
6. **Clear Cache**: Browser cache may show old pages

## 🆘 Getting Help

1. Check README.md for detailed documentation
2. Check FEATURES.md for feature list
3. Look at code comments (comprehensive)
4. Check browser console for errors
5. Check terminal output for API errors
6. Review API responses in network tab

---

**Quick Links:**
- Home: http://localhost:5173
- Admin: http://localhost:5173/admin (click button)
- API Docs: http://localhost:5000
- Database: database.sqlite (SQLite)

**Important Passwords:**
- Admin Password: `gaushala123`

Happy coding! 🚀🌳
