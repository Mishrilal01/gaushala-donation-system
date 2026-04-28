# 🧪 TESTING GUIDE

Complete guide to testing all features of the Gaushala Donation System.

---

## ✅ Pre-Testing Checklist

- [ ] Both servers running (backend on 5000, frontend on 5173)
- [ ] Database created (database.sqlite)
- [ ] No console errors
- [ ] Admin password: `gaushala123`
- [ ] Browser: Chrome, Firefox, Safari, or Edge
- [ ] Mobile device for responsive testing (optional)

---

## 🏠 HOME PAGE TESTING

### 1. Hero Section Test

**Expected Behavior:**
- [ ] Page loads with logo "🌱 Gaushala Donation"
- [ ] Hero section displays with cow emoji 🐄
- [ ] Mission title visible: "100+ पेड़ लगाने का संकल्प 🌱"
- [ ] Tagline visible: "एक पेड़ कई ज़िंदगियों को राहत देता है"
- [ ] All text readable on mobile

**Test Steps:**
1. Open http://localhost:5173
2. Scroll to top
3. Check all elements visible
4. Test on mobile (DevTools → responsive)

---

### 2. Statistics Dashboard Test

**Expected Behavior:**
- [ ] Shows 4 stat cards (Amount, Trees, Donors, Goal)
- [ ] Progress bar visible
- [ ] All values start at 0 (if new database)
- [ ] "No donations yet" message if empty
- [ ] Auto-refreshes every 30 seconds

**Test Steps:**
1. Look at stats section
2. Note current values
3. Wait 30 seconds
4. Stats should refresh (or show same if no changes)
5. Test on mobile (responsive layout)

**Test with Donations:**
1. Submit 2 donations (₹500, ₹1000)
2. Approve both via admin panel
3. Check stats update automatically
4. Verify: Trees = (Amount / 500)

---

### 3. Donate Section Test

**Expected Behavior:**
- [ ] QR code placeholder visible
- [ ] Amount suggestions visible (₹500, ₹1000, etc.)
- [ ] Instructions in Hindi & English
- [ ] Buttons clickable
- [ ] Mobile-friendly layout

**Test Steps:**
1. Scroll to donate section
2. See QR code
3. Click amount buttons
4. Verify no errors in console

---

### 4. Donation Form Test

**Expected Behavior:**
- [ ] Form appears below donate section
- [ ] Name input field
- [ ] Amount input field
- [ ] Privacy checkbox
- [ ] Submit button (large, green)
- [ ] Form clears after submission

**Test Submission (Valid):**

```
1. Name: "Test Donor"
2. Amount: 500
3. Privacy: Checked
4. Click Submit
```

**Expected Result:**
- [ ] Success message appears
- [ ] Form resets
- [ ] Database records donation with status "pending"
- [ ] No errors in console

**Test Validation:**

```
Test 1 - Missing Name:
1. Leave name empty
2. Amount: 500
3. Click Submit
→ Error: "कृपया नाम दर्ज करें"

Test 2 - Missing Amount:
1. Name: "Test"
2. Leave amount empty
3. Click Submit
→ Error: "कृपया सही राशि दर्ज करें"

Test 3 - Zero Amount:
1. Name: "Test"
2. Amount: 0
3. Click Submit
→ Error message

Test 4 - Negative Amount:
1. Name: "Test"
2. Amount: -100
3. Click Submit
→ Error message
```

**Privacy Checkbox Test:**
- [ ] Unchecked: Donation shows as "Anonymous"
- [ ] Checked: Donation shows donor name

---

### 5. Recent Donations List Test

**Expected Behavior:**
- [ ] Lists approved donations (max 50)
- [ ] Shows: Name/Anonymous, Amount, Date
- [ ] Shows trees contributed
- [ ] Auto-updates every 30 seconds
- [ ] Sorted newest first
- [ ] Mobile responsive

**Test Steps:**
1. Submit donation 1 → "Test User 1" - ₹500
2. Approve via admin
3. Check appears in list
4. Submit donation 2 → "Anonymous" - ₹1000 (unchecked privacy)
5. Approve via admin
6. Both appear in list
7. Wait 30s → auto-refresh
8. Test mobile layout

---

### 6. Top Supporters Test

**Expected Behavior:**
- [ ] Shows top 3 donors (public only)
- [ ] Medal badges (🥇🥈🥉)
- [ ] Total amount contributed
- [ ] Donation count
- [ ] Trees contributed
- [ ] Anonymous donors not included

**Test Steps:**
1. Submit 3+ donations with different names
2. All checked "Show my name"
3. Approve all via admin
4. Check Top Supporters:
   - [ ] Highest donor shows 🥇
   - [ ] Second highest shows 🥈
   - [ ] Third shows 🥉
   - [ ] Correct amounts shown
   - [ ] Anonymous users not here

---

### 7. Proof Gallery Test

**Expected Behavior:**
- [ ] 6 image placeholders with emojis
- [ ] Captions in Hindi/English
- [ ] Mobile responsive grid
- [ ] Hover effects
- [ ] Impact stats visible

**Test Steps:**
1. Scroll to gallery
2. Verify 6 items visible
3. Check captions readable
4. Hover over items (desktop) → scale effect
5. Test on mobile → scrollable horizontal

---

### 8. Footer Test

**Expected Behavior:**
- [ ] All links clickable
- [ ] Contact info visible
- [ ] Social media links present
- [ ] Copyright year correct
- [ ] Mobile responsive

**Test Steps:**
1. Scroll to footer
2. Check all elements visible
3. Click links (should not error)
4. Verify layout on mobile

---

## 🔐 ADMIN PANEL TESTING

### 1. Admin Login Test

**Expected Behavior:**
- [ ] Login button visible in navigation
- [ ] Click takes to login form
- [ ] Form has password field
- [ ] Submit button works

**Test Password Validation:**

```
Test 1 - Correct Password:
1. Enter: gaushala123
2. Click Login
→ Success → Dashboard opens

Test 2 - Wrong Password:
1. Enter: wrong123
2. Click Login
→ Error: "Invalid password"

Test 3 - Empty Password:
1. Leave empty
2. Click Login
→ Error: "कृपया पासवर्ड दर्ज करें"
```

**Test Token Storage:**
- [ ] After login, token stored in localStorage
- [ ] Refresh page → still logged in
- [ ] Close admin panel and reopen → stays logged in
- [ ] Logout → localStorage cleared

---

### 2. Pending Donations Test

**Expected Behavior:**
- [ ] Shows all pending donations
- [ ] Yellow background for pending
- [ ] Shows: Name, Amount, Date, Approve button, Reject button
- [ ] Approve/Reject buttons work

**Test Workflow:**

```
1. Submit donation via home page
   - Name: "Admin Test"
   - Amount: 2000
   - Privacy: Checked

2. Go to Admin → Pending Tab
   - Should see donation listed
   - Yellow background
   - Shows: Admin Test, ₹2000

3. Click "✅ Approve"
   - Success message appears
   - Disappears from Pending tab
   - Appears in All tab with "approved" status
   - Appears in Recent Donations on home
   - Stats update (+2000 amount, +4 trees)

4. Submit another donation
5. Click "❌ Reject"
   - Appears in All tab with "rejected" status
   - NOT in Recent Donations
   - NOT in stats
```

---

### 3. All Donations Tab Test

**Expected Behavior:**
- [ ] Shows all donations (pending, approved, rejected)
- [ ] Color-coded status badges
- [ ] Scrollable list (if many)
- [ ] Shows date & amount

**Status Colors:**
- [ ] 🟢 Green background → Approved
- [ ] 🔴 Red background → Rejected
- [ ] 🟡 Yellow background → Pending

**Test Steps:**
1. Create 3 donations:
   - D1 (Approved)
   - D2 (Rejected)
   - D3 (Pending)
2. Go to All Donations tab
3. Verify all 3 visible with correct badges
4. Verify correct colors
5. Scroll if many items

---

### 4. Statistics Summary Test

**Expected Behavior:**
- [ ] Shows in admin dashboard header
- [ ] 4 cards visible: Amount, Trees, Donors, Progress
- [ ] Updates when donations approved

**Test Steps:**
1. Check stats at top
2. Note current values
3. Approve a new donation (₹500)
4. Stats should update:
   - Amount +500
   - Trees +1
   - Donors +1 (if new donor)
   - Progress increases

---

### 5. Donation Amount Update Test

**Expected Behavior:**
- [ ] Admin can edit donation amounts
- [ ] Stats recalculate automatically
- [ ] Works only for admin

**Test Steps:**
1. Find an approved donation (₹500)
2. Edit amount to ₹1000
3. Stats should update:
   - Amount increases by 500
   - Trees increase
   - Progress increases

*(This feature needs UI implementation if not yet added)*

---

### 6. Logout Test

**Expected Behavior:**
- [ ] Logout button visible
- [ ] Click logout
- [ ] Redirects to login
- [ ] Token cleared from localStorage
- [ ] All data cleared

**Test Steps:**
1. In admin panel, click "Logout"
2. Redirected to login form
3. Check console → localStorage cleared
4. Refresh page → back at login (not in dashboard)

---

## 📱 MOBILE RESPONSIVE TESTING

### Screen Sizes to Test
- [ ] iPhone SE (375px)
- [ ] iPhone 12 (390px)
- [ ] iPhone 14 Pro (393px)
- [ ] Pixel 5 (393px)
- [ ] Tablet (768px)
- [ ] iPad (1024px)

### Home Page Mobile Tests

```
Test 1 - Hero Section
- [ ] Cow emoji visible and large
- [ ] Text readable (font size good)
- [ ] No horizontal scroll
- [ ] Tagline visible

Test 2 - Stats Cards
- [ ] 2x2 grid on mobile (not 4 columns)
- [ ] Cards touch-friendly size
- [ ] Numbers visible
- [ ] Progress bar visible

Test 3 - Form
- [ ] Input fields full width
- [ ] Labels visible
- [ ] Checkbox easy to tap
- [ ] Submit button large (50px+)
- [ ] Success message visible

Test 4 - Lists
- [ ] Recent donations list scrolls
- [ ] Cards are wide enough
- [ ] Text readable
- [ ] No cutoff

Test 5 - Footer
- [ ] All links visible
- [ ] Text readable
- [ ] No layout breaks
```

### Admin Panel Mobile Tests

```
Test 1 - Login
- [ ] Form centered
- [ ] Password field visible
- [ ] Button full width
- [ ] Readable text

Test 2 - Dashboard
- [ ] Tabs clickable (easy tap targets)
- [ ] Donation cards readable
- [ ] Buttons not cramped
- [ ] Scrollable list
- [ ] No horizontal scroll

Test 3 - Buttons
- [ ] Approve button 44px minimum
- [ ] Reject button 44px minimum
- [ ] Easy to tap without mistakes
```

---

## 🔄 REAL-TIME UPDATE TESTING

### Auto-Refresh Test (30 seconds)

```
Test 1 - Stats Auto-Refresh
1. Open home page in 2 browser windows
2. Submit & approve donation in window 1
3. In window 2, note stats at time 00:00
4. Wait until time 00:30 (30 seconds)
5. Stats in window 2 should auto-update
6. Numbers match window 1

Test 2 - Recent Donations Auto-Refresh
1. Open home in window 1
2. Open admin in window 2
3. Submit donation in window 2
4. Approve in admin
5. In window 1, donations list auto-updates in 30s
6. New donation appears

Test 3 - Top Supporters Auto-Refresh
1. Open home page
2. Note Top Supporters list
3. Submit & approve 2+ new donations
4. After 60 seconds, Top Supporters updates
5. New donor may appear
```

---

## 🐛 ERROR HANDLING TESTING

### Network Error Tests

```
Test 1 - Backend Down
1. Stop server (Ctrl+C in terminal)
2. Try to submit donation
3. Should show error message
4. Not break page

Test 2 - Slow Network
1. Open DevTools → Network
2. Set to "Slow 3G"
3. Submit donation
4. Should complete (just slower)
5. No timeout errors

Test 3 - API Error
1. Try invalid data
2. Should show backend error message
3. User-friendly error (not technical)
```

### Form Validation Tests

```
All tested above in "Donation Form Test" section
```

---

## 📊 DATA PERSISTENCE TESTING

### Database Test

```
Test 1 - Data Survives Page Refresh
1. Submit & approve donation
2. Refresh page (Ctrl+R)
3. Donation still visible
4. Stats still show

Test 2 - Data Survives Server Restart
1. Submit & approve donation
2. Stop server (Ctrl+C)
3. Restart server (npm run dev)
4. Open home page
5. Donation still there
6. Stats still correct

Test 3 - Database File
1. Check database.sqlite exists
2. Size increases with donations
3. Backup works (copy file)
4. Restore from backup
5. Data recovers
```

---

## 🎨 UI/UX TESTING

### Color Test
- [ ] Green primary color appears correctly
- [ ] White background clean
- [ ] Yellow accents visible
- [ ] Good contrast (readable text)
- [ ] No bleeding colors on mobile

### Font Test
- [ ] All fonts readable
- [ ] Sizes scale properly
- [ ] Hindi text clear
- [ ] English text clear
- [ ] Good on mobile

### Layout Test
- [ ] No horizontal scroll on desktop
- [ ] No horizontal scroll on mobile
- [ ] Proper spacing
- [ ] Cards aligned
- [ ] Lists clean

### Interaction Test
- [ ] Buttons have hover effect
- [ ] Form fields have focus state
- [ ] Cards are interactive
- [ ] Links work
- [ ] No broken elements

---

## 🔒 SECURITY TESTING

```
Test 1 - Admin Panel
- [ ] Cannot access dashboard without login
- [ ] Token required for admin endpoints
- [ ] Wrong password rejected
- [ ] Token expires/logouts work

Test 2 - Private Data
- [ ] Private donations don't show name
- [ ] Only approved shown publicly
- [ ] Rejected donations hidden
- [ ] No data leaks in console

Test 3 - Input Validation
- [ ] XSS attempts blocked
- [ ] SQL injection impossible (prepared statements)
- [ ] No error messages leak info
- [ ] Sensitive data not logged
```

---

## 🎯 ACCEPTANCE CRITERIA CHECKLIST

### Must Have (Critical)
- [ ] Home page loads
- [ ] Donations can be submitted
- [ ] Admin can login
- [ ] Admin can approve/reject
- [ ] Stats display correctly
- [ ] Mobile works

### Should Have (Important)
- [ ] Auto-refresh works
- [ ] Validation messages clear
- [ ] Forms are responsive
- [ ] Errors handled gracefully
- [ ] Hindi/English both work

### Nice to Have (Optional)
- [ ] Smooth animations
- [ ] Gallery images load
- [ ] Buttons have hover effects
- [ ] Responsive footer
- [ ] Professional design

---

## 📝 Test Report Template

```
Test Date: _______________
Tester: ___________________
Environment: Desktop/Mobile/Tablet
Browser: ___________________

Feature: ___________________

Test Case 1:
Status: PASS / FAIL
Notes: _____________________

Test Case 2:
Status: PASS / FAIL
Notes: _____________________

Issues Found:
1. _________________________
2. _________________________

Recommendations:
1. _________________________
2. _________________________

Sign Off: __________________ Date: _________
```

---

## 🚀 Production Testing Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] No console warnings
- [ ] Database backup taken
- [ ] Admin password changed
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Performance tested (load testing)
- [ ] Security audit done
- [ ] Backup/recovery tested
- [ ] Monitoring set up

---

## 📞 Issue Reporting Template

When you find an issue:

```
Title: [Component] Brief description

Environment:
- Browser: Chrome/Firefox/Safari
- OS: Windows/Mac/Linux
- Screen: Mobile/Desktop/Tablet

Steps to Reproduce:
1. ...
2. ...
3. ...

Expected Result:
...

Actual Result:
...

Screenshots/Logs:
[Attach if applicable]

Severity: Critical/High/Medium/Low
```

---

## ✅ Testing Best Practices

1. **Test in isolation** - One feature at a time
2. **Clear data** - Start fresh when possible
3. **Document** - Write what you tested
4. **Cross-browser** - Test multiple browsers
5. **Mobile-first** - Always test mobile
6. **Error cases** - Test what breaks
7. **Performance** - Check speed
8. **Security** - Try to break it
9. **Accessibility** - Can others use it?
10. **User flow** - Test real usage patterns

---

**Happy Testing! 🧪✨**

Report any issues you find to improve the system.
