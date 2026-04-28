# 🎯 QUICK REFERENCE - Transparency Upgrade

## What Changed?

### ✨ NEW for Users:
1. **💸 Total Money Used** - See expenses on dashboard
2. **🧾 Remaining Balance** - Know money left (red if negative)
3. **🧾 Fund Usage Section** - Full transparency of where money went

### ✨ NEW for Admin:
1. **Expenses Tab** - Add/view/delete expenses
2. **Trees Tab** - Update tree count manually
3. **Better Stats** - See money used vs donated vs remaining

---

## 🚀 QUICK START

```bash
# Terminal 1 - Backend
cd server
npm install
npm start
# ✅ Runs on http://localhost:5000

# Terminal 2 - Frontend
cd client
npm install
npm run dev
# ✅ Runs on http://localhost:5173
```

**Then:** Open http://localhost:5173 in browser

---

## 🔐 Admin Login

- **URL:** http://localhost:5173/admin
- **Password:** gaushala123
- **Go to:**
  - "💸 Expenses" → Add/manage expenses
  - "🌳 Trees" → Update tree count

---

## 📊 Dashboard Cards (New/Updated)

| Card | Shows | Color | New? |
|------|-------|-------|------|
| 💰 Total Donated | Sum of approved donations | Green | ✅ |
| 💸 Total Used | Sum of all expenses | Orange | ✨ NEW |
| 🧾 Remaining | Donated - Used | Blue/Red | ✨ NEW |
| 🌳 Trees | Admin-set tree count | Green | Updated |
| 👥 Donors | Count of unique donors | Blue | ✅ |
| 🎯 Goal | Target trees (100) | Yellow | ✅ |

---

## 🧾 Fund Usage Page (NEW)

- Shows between "Top Supporters" and "Proof Gallery"
- Lists all expenses with details
- Each expense shows: Title, Amount, Date, Description
- Shows total expenses
- Transparency message in English & Hindi

---

## 🗄️ Database

**New Tables:**
- `expenses` - For storing expense records
- `configuration` - For storing settings like total trees

**Existing Tables:**
- `donations` - Unchanged
- `gallery_images` - Unchanged

---

## 📱 Mobile Responsive

All new features are mobile-friendly:
- ✅ Expense form works on mobile
- ✅ Fund usage section is responsive
- ✅ Remaining balance card adapts to screen size
- ✅ Admin dashboard tabs wrap on small screens

---

## 🎨 UI Consistency

No design changes - everything matches existing style:
- ✅ Same colors (green, blue, orange, yellow)
- ✅ Same card design and borders
- ✅ Same typography
- ✅ Same spacing and layout
- ✅ Hindi + English text everywhere

---

## 🔴 RED FLAG Features

**When Remaining Balance is RED:**
- Amount shown in red
- Shows: "अभी खर्च दान से अधिक है, अतिरिक्त सहायता की आवश्यकता है"
- Means: "Expenses exceed donations, additional support needed"
- Encourages more donations

---

## 🌳 Manual Tree Count

**Old:** Trees calculated as `donation_amount / 500`
**New:** Admin sets exact number of trees planted

**Why?** More accurate - actual trees planted may differ from calculated

---

## ⚡ Key Endpoints (API)

```
USER FACING:
GET /api/donations/stats
GET /api/expenses/all
GET /api/donations/approved
GET /api/donations/top-supporters

ADMIN ONLY:
POST /api/expenses/add (auth required)
DELETE /api/expenses/delete (auth required)
POST /api/admin/update-trees (auth required)
GET /api/admin/total-trees (auth required)
```

---

## 📋 Files Changed/Created

**NEW:**
- server/controllers/expenseController.js
- server/routes/expenseRoutes.js
- client/src/components/ExpenseForm.jsx
- client/src/components/FundUsage.jsx
- UPGRADE_GUIDE.md (this doc)

**MODIFIED:**
- server/models/db.js (added tables)
- server/server.js (added routes)
- server/controllers/donationController.js (updated getStats)
- server/controllers/adminController.js (added tree methods)
- server/routes/adminRoutes.js (added tree routes)
- client/src/services/api.js (added expense methods)
- client/src/components/Stats.jsx (added cards)
- client/src/pages/Admin.jsx (added tabs and forms)
- client/src/pages/Home.jsx (added FundUsage)

---

## ✅ Testing

```
☐ Server starts (npm start in server/)
☐ Frontend starts (npm run dev in client/)
☐ Can access http://localhost:5173
☐ Stats show new cards
☐ Can login as admin (password: gaushala123)
☐ Can add expense in admin
☐ Can update tree count
☐ Fund usage shows on homepage
☐ Works on mobile
☐ Remaining balance shows red when negative
```

---

## 🆘 Common Issues

**Port 5000 already in use:**
- Kill process: `taskkill /F /IM node.exe` (Windows)
- Or use different port in .env: `PORT=5001`

**Database error:**
- Delete `database.sqlite` and restart server
- Server recreates it automatically

**Expenses not showing:**
- Make sure you added expenses as admin
- Check browser console for API errors

**Trees not updating:**
- Ensure you're logged in as admin
- Check admin token is saved in localStorage

---

## 📞 Debugging

Check these in order:
1. Browser console (F12) for frontend errors
2. Server terminal for backend logs
3. Network tab to see API calls
4. Database.sqlite file exists in root
5. Ports 5000 and 5173 are free

---

## 🎓 Understanding the Flow

```
User donates money
    ↓
Admin approves donation
    ↓
Money appears in "Total Donated"
    ↓
Admin adds expense
    ↓
Expense appears in "Fund Usage"
    ↓
"Total Used" increases
    ↓
"Remaining" = Donated - Used
    ↓
If Remaining < 0 → Shows RED + Hindi message
    ↓
Users see transparency
```

---

## 📚 Learn More

See full `UPGRADE_GUIDE.md` for:
- Detailed feature explanations
- Database schema
- API documentation
- New files created
- Production recommendations

---

**Ready to use! 🚀**
