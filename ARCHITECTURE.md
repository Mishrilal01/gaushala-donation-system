# 🏗️ SYSTEM ARCHITECTURE GUIDE

Visual representation of how the Gaushala Donation System is structured.

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER'S BROWSER                              │
│                   (http://localhost:5173)                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              REACT FRONTEND (Vite)                       │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │           App.jsx (Main Router)                     │ │  │
│  │  │  ├── Home Page (/)                                  │ │  │
│  │  │  │   ├── Hero Component                             │ │  │
│  │  │  │   ├── Stats Component (auto-refresh 30s)        │ │  │
│  │  │  │   ├── DonateSection Component                    │ │  │
│  │  │  │   ├── DonationForm Component                     │ │  │
│  │  │  │   ├── RecentDonations Component (auto-refresh)  │ │  │
│  │  │  │   ├── TopSupporters Component (auto-refresh)    │ │  │
│  │  │  │   ├── ProofGallery Component                     │ │  │
│  │  │  │   └── Footer Component                           │ │  │
│  │  │  │                                                   │ │  │
│  │  │  └── Admin Page (/admin)                            │ │  │
│  │  │      ├── Login Screen                               │ │  │
│  │  │      └── Dashboard (with token auth)                │ │  │
│  │  │          ├── Pending Donations Tab                  │ │  │
│  │  │          ├── All Donations Tab                      │ │  │
│  │  │          └── Statistics Summary                     │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │        services/api.js (API Layer)                 │ │  │
│  │  │                                                     │ │  │
│  │  │  ├── donationAPI                                   │ │  │
│  │  │  │   ├── submitDonation()                          │ │  │
│  │  │  │   ├── getApprovedDonations()                    │ │  │
│  │  │  │   ├── getStats()                                │ │  │
│  │  │  │   └── getTopSupporters()                        │ │  │
│  │  │  │                                                 │ │  │
│  │  │  └── adminAPI                                      │ │  │
│  │  │      ├── login()                                   │ │  │
│  │  │      ├── getPendingDonations()                     │ │  │
│  │  │      ├── getAllDonations()                         │ │  │
│  │  │      ├── approveDonation()                         │ │  │
│  │  │      └── rejectDonation()                          │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  │                                                           │  │
│  │               HTTP (CORS Enabled)                        │  │
│  │                    ↓                                     │  │
└──────────────────────────────────────────────────────────────────┘
           ↓↓↓ JSON Requests/Responses ↓↓↓
┌─────────────────────────────────────────────────────────────────┐
│                 EXPRESS BACKEND                                  │
│            (Node.js - http://localhost:5000)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           server.js (Main Server)                       │  │
│  │                                                           │  │
│  │  ├── CORS Configuration                                 │  │
│  │  ├── JSON Parsing Middleware                            │  │
│  │  ├── Static Files (/uploads)                            │  │
│  │  │                                                       │  │
│  │  ├── Routes Registration:                               │  │
│  │  │   ├── /api/donations (donationRoutes)               │  │
│  │  │   │   ├── POST /submit                              │  │
│  │  │   │   ├── GET /approved                             │  │
│  │  │   │   ├── GET /stats                                │  │
│  │  │   │   └── GET /top-supporters                       │  │
│  │  │   │                                                  │  │
│  │  │   └── /api/admin (adminRoutes)                      │  │
│  │  │       ├── POST /login                               │  │
│  │  │       ├── GET /pending  (auth)                      │  │
│  │  │       ├── GET /all-donations (auth)                 │  │
│  │  │       ├── POST /approve (auth)                      │  │
│  │  │       ├── POST /reject (auth)                       │  │
│  │  │       ├── POST /upload-image (auth)                 │  │
│  │  │       ├── GET /gallery (auth)                       │  │
│  │  │       └── PUT /update-donation (auth)               │  │
│  │  │                                                      │  │
│  │  └── Error Handlers & 404                              │  │
│  │                                                           │  │
│  │                    ↓                                     │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │   controllers/ (Business Logic)                 │   │  │
│  │  │                                                  │   │  │
│  │  │   ├── donationController.js                     │   │  │
│  │  │   │   ├── submitDonation()                      │   │  │
│  │  │   │   ├── getApprovedDonations()                │   │  │
│  │  │   │   ├── getStats()                            │   │  │
│  │  │   │   └── getTopSupporters()                    │   │  │
│  │  │   │                                              │   │  │
│  │  │   └── adminController.js                        │   │  │
│  │  │       ├── login()                               │   │  │
│  │  │       ├── verifyAdmin() [middleware]            │   │  │
│  │  │       ├── getPendingDonations()                 │   │  │
│  │  │       ├── getAllDonations()                     │   │  │
│  │  │       ├── approveDonation()                     │   │  │
│  │  │       ├── rejectDonation()                      │   │  │
│  │  │       └── ... more functions                    │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  │                    ↓                                     │  │
│  │                                                           │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │   models/ (Database Layer)                      │   │  │
│  │  │                                                  │   │  │
│  │  │   ├── db.js                                     │   │  │
│  │  │   │   ├── SQLite Connection                     │   │  │
│  │  │   │   ├── Table Creation                        │   │  │
│  │  │   │   │   ├── donations                         │   │  │
│  │  │   │   │   └── gallery_images                    │   │  │
│  │  │   │   │                                          │   │  │
│  │  │   │   └── Promise Wrappers                      │   │  │
│  │  │   │       ├── getAsync()                        │   │  │
│  │  │   │       ├── allAsync()                        │   │  │
│  │  │   │       └── runAsync()                        │   │  │
│  │  │   └──────────────────────────────────────────   │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
             ↓↓↓ SQL Queries ↓↓↓
┌─────────────────────────────────────────────────────────────────┐
│                      SQLite DATABASE                             │
│                    (database.sqlite)                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              donations TABLE                            │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ id | name | amount | screenshot | is_public | status   │  │
│  │ 1  | John | 500    | NULL       | 1         | approved │  │
│  │ 2  | Jane | 1000   | path.jpg   | 0         | pending  │  │
│  │ 3  | ...                                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          gallery_images TABLE                           │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ id | filename | caption | uploaded_at                   │  │
│  │ 1  | image1   | Trees.. | 2024-01-16 12:00:00          │  │
│  │ 2  | image2   | Green.. | 2024-01-16 13:00:00          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Donation Submission Flow

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: User fills donation form                          │
│                                                             │
│  DonationForm.jsx                                          │
│  ├── name: "John"                                          │
│  ├── amount: 500                                           │
│  └── isPublic: true                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
                 [Validation]
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ API CALL: donationAPI.submitDonation()                      │
│                                                             │
│  POST /api/donations/submit                                │
│  {                                                          │
│    "name": "John",                                         │
│    "amount": 500,                                          │
│    "isPublic": true                                        │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ BACKEND: Route handler                                      │
│                                                             │
│  router.post('/submit', donationController.submitDonation) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ CONTROLLER: Business logic                                  │
│                                                             │
│  1. Validate input                                         │
│  2. Prepare data                                           │
│  3. Call database                                          │
│  4. Return response                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ DATABASE: Store donation                                    │
│                                                             │
│  INSERT INTO donations                                     │
│    (name, amount, is_public, status)                       │
│  VALUES ('John', 500, 1, 'pending')                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
            [Success Response]
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Display success message                           │
│                                                             │
│  "धन्यवाद! आपका दान प्रस्तुत किया गया है।"                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Admin Approval Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ ADMIN: Login Screen                                         │
│                                                             │
│  Password: gaushala123                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
      POST /api/admin/login → [Verification]
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ TOKEN RECEIVED & STORED                                     │
│                                                             │
│  localStorage.adminToken = "YWRtaW46..."                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ ADMIN DASHBOARD: View Pending Donations                     │
│                                                             │
│  GET /api/admin/pending                                    │
│  Header: Authorization: Bearer {token}                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
         [Display pending donations list]
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ ADMIN ACTION: Click "Approve"                              │
│                                                             │
│  POST /api/admin/approve                                   │
│  {                                                          │
│    "donationId": 5                                         │
│  }                                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ DATABASE: Update Status                                     │
│                                                             │
│  UPDATE donations                                          │
│  SET status = 'approved'                                   │
│  WHERE id = 5                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ STATISTICS AUTO-UPDATE                                      │
│                                                             │
│  Users' Stats Dashboard:                                   │
│  ├── Total Amount +500                                     │
│  ├── Trees +1                                              │
│  ├── Donors count updated                                  │
│  └── Progress bar updates (every 30s auto-refresh)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────────┐
│ PUBLIC VIEW: Donation Appears                              │
│                                                             │
│  Recent Donations List:                                    │
│  ├── "John" - ₹500 - 1 Tree 🌳                           │
│  ├── Updated 30 seconds after approval                     │
│  └── Visible on home page                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### 3. Statistics Calculation Flow

```
USER VIEWS STATS PAGE
        ↓
Stats.jsx calls useEffect
        ↓
API Call: GET /api/donations/stats
        ↓
donationController.getStats()
        ↓
Database Queries:
│
├─ SELECT SUM(amount)
│  FROM donations WHERE status='approved'
│  → totalAmount = ₹5500
│
├─ COUNT DISTINCT donors
│  → totalDonors = 3
│
└─ CALCULATE:
   └─ Trees = floor(5500 / 500) = 11
   └─ Progress = (11 / 100) * 100 = 11%
        ↓
Return Response:
{
  "totalAmount": 5500,
  "treesPlanted": 11,
  "totalDonors": 3,
  "goalTrees": 100,
  "progressPercentage": 11
}
        ↓
Frontend Displays:
├─ 💰 ₹5500 Total Donated
├─ 🌳 11 Trees Planted
├─ 👥 3 Total Donors
└─ Progress Bar: 11% ▓░░░░░░░░░

Auto-Refreshes Every 30 Seconds
        ↓
Real-Time Updates for Users
```

---

## 🗂️ Component Hierarchy

```
App (Router)
│
├─ Navigation Bar
│  └─ Home/Admin Switch
│
├─ Home Page (/)
│  ├─ Hero
│  │  └─ 🎯 Mission Statement
│  ├─ Stats
│  │  └─ 📊 Real-time statistics
│  ├─ DonateSection
│  │  └─ 💳 QR Code & amounts
│  ├─ DonationForm
│  │  └─ 📝 Form submission
│  ├─ RecentDonations
│  │  └─ 🕐 Recent donors list
│  ├─ TopSupporters
│  │  └─ 🏆 Top 3 donors
│  ├─ ProofGallery
│  │  └─ 📸 Plantation images
│  └─ Footer
│     └─ 📄 Contact info
│
└─ Admin Page (/admin)
   ├─ Login Section
   │  └─ 🔐 Password input
   └─ Dashboard (if logged in)
      ├─ Statistics Summary
      │  └─ 📈 Current stats
      ├─ Pending Donations Tab
      │  └─ ⏳ Awaiting approval
      └─ All Donations Tab
         └─ 📋 Complete history
```

---

## 🔗 Inter-Component Communication

```
Components Using API Service:

┌──────────────┬────────────────────────────────────────┐
│ Component    │ API Calls                              │
├──────────────┼────────────────────────────────────────┤
│ Stats        │ GET /api/donations/stats (30s refresh) │
│ DonationForm │ POST /api/donations/submit             │
│ RecentDons   │ GET /api/donations/approved (30s)      │
│ TopSupport   │ GET /api/donations/top-supporters (60s)│
│ Admin        │ POST /api/admin/login                  │
│              │ GET /api/admin/pending                 │
│              │ GET /api/admin/all-donations           │
│              │ POST /api/admin/approve                │
│              │ POST /api/admin/reject                 │
└──────────────┴────────────────────────────────────────┘
```

---

## 💾 Data Persistence Flow

```
User Submission
       ↓
Frontend Validation
       ↓
API Request (HTTP)
       ↓
Backend Processing
       ↓
Database Storage
       ↓
Response to Frontend
       ↓
User Sees Confirmation
       ↓
Data Persists in SQLite
       ↓
Admin Views/Approves
       ↓
Status Updated in DB
       ↓
Public Can See via API
```

---

## 🔐 Authentication Flow

```
Admin Login:
1. User enters password on Admin page
2. Frontend sends: POST /api/admin/login {password}
3. Backend verifies against hardcoded password
4. Returns token if valid
5. Frontend stores token in localStorage
6. Token added to Authorization header for protected requests
7. Backend middleware verifies token
8. Admin panel displays dashboard

Protected Routes:
├─ GET /api/admin/pending
├─ POST /api/admin/approve
├─ POST /api/admin/reject
├─ GET /api/admin/all-donations
├─ POST /api/admin/upload-image
├─ GET /api/admin/gallery
└─ PUT /api/admin/update-donation

All require: Authorization: Bearer {token}
```

---

## 📈 Scalability Notes

Current Architecture Can Easily Scale To:

```
Horizontal Scaling:
├─ Add load balancer (nginx)
├─ Run multiple Express instances
├─ Use connection pooling
└─ Add caching layer (Redis)

Vertical Scaling:
├─ Migrate to PostgreSQL
├─ Add database indexing
├─ Implement query optimization
└─ Add monitoring/alerting

Advanced Features:
├─ Message queues (RabbitMQ)
├─ WebSocket for real-time updates
├─ Caching layer (Redis)
├─ CDN for static files
└─ Email/SMS notifications
```

---

## 🎯 Performance Optimization Points

```
Frontend:
├─ Code splitting (Vite does this)
├─ Lazy load components
├─ Image optimization
├─ Cache API responses
└─ Reduce bundle size

Backend:
├─ Database query optimization (indexing)
├─ Connection pooling
├─ Request compression (gzip)
├─ Rate limiting
└─ Caching responses

Database:
├─ Add indexes on frequently queried columns
├─ Archive old data
├─ Optimize queries
└─ Regular maintenance
```

---

**This architecture is designed to be:**
- ✅ Simple to understand
- ✅ Easy to maintain
- ✅ Scalable when needed
- ✅ Production-ready
- ✅ Developer-friendly

All components are loosely coupled and highly cohesive, making it easy to add new features or make modifications!
