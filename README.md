# Gaushala Tree Donation Transparency System 🌱

A complete web application for managing transparent tree donations and supporting cow care initiatives. Built with React, Node.js, Express, and SQLite.

## 🎯 Features

- **Transparent Donations**: Track where money goes with real-time statistics
- **Mobile-First Design**: Optimized for rural/village users with simple UI
- **Bilingual Support**: Hindi + English mix for better accessibility
- **Admin Panel**: Simple authentication and donation approval system
- **Real-Time Stats**: Live updates on donations, trees planted, and donor count
- **QR-Based Payments**: Simple UPI payment via QR code
- **Proof Gallery**: Display images of plantation activities
- **Anonymous Donations**: Option to donate anonymously
- **Top Supporters**: Recognition for public donors

## 📦 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite (lightweight, no setup needed)
- **Styling**: Tailwind CSS (mobile-first)

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation & Setup

#### 1. Clone/Download the Project

```bash
cd gaushala-donation-system
```

#### 2. Setup Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server (runs on port 5000)
npm run dev
# OR for production
npm start
```

The server will initialize SQLite database automatically.

**Server Output:**
```
╔════════════════════════════════════════╗
║   Gaushala Donation System Running    ║
║   Server: http://localhost:5000        ║
║   Frontend: http://localhost:5173      ║
╚════════════════════════════════════════╝
```

#### 3. Setup Frontend

```bash
# In a new terminal, navigate to client directory
cd client

# Install dependencies
npm install

# Start development server (runs on port 5173)
npm run dev
```

#### 4. Access the Application

- **Home**: http://localhost:5173
- **Admin Panel**: http://localhost:5173 → Click "🔐 Admin" button
  - Default Password: `gaushala123`

## 📁 Project Structure

```
gaushala-donation-system/
├── client/                          # React Frontend
│   ├── public/
│   │   └── index.html              # Main HTML
│   ├── src/
│   │   ├── components/             # Reusable Components
│   │   │   ├── Hero.jsx            # Landing section
│   │   │   ├── Stats.jsx           # Dashboard statistics
│   │   │   ├── DonateSection.jsx   # QR code display
│   │   │   ├── DonationForm.jsx    # Donation submission
│   │   │   ├── RecentDonations.jsx # Recent donors list
│   │   │   ├── TopSupporters.jsx   # Top 3 donors
│   │   │   ├── ProofGallery.jsx    # Plantation images
│   │   │   └── Footer.jsx          # Footer
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Main home page
│   │   │   └── Admin.jsx           # Admin dashboard
│   │   ├── services/
│   │   │   └── api.js              # API communication
│   │   ├── App.jsx                 # Main app component
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                          # Node.js Backend
│   ├── controllers/
│   │   ├── donationController.js   # Donation business logic
│   │   └── adminController.js      # Admin operations
│   ├── models/
│   │   └── db.js                   # Database setup
│   ├── routes/
│   │   ├── donationRoutes.js       # Public API routes
│   │   └── adminRoutes.js          # Admin API routes
│   ├── uploads/                    # Uploaded files storage
│   ├── server.js                   # Main server file
│   ├── package.json
│   └── .env
│
├── database.sqlite                  # SQLite database (created automatically)
└── README.md                        # This file
```

## 🗄️ Database Schema

### Donations Table

```sql
CREATE TABLE donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  screenshot TEXT,
  is_public BOOLEAN DEFAULT 1,
  status TEXT DEFAULT 'pending',  -- pending, approved, rejected
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Gallery Images Table

```sql
CREATE TABLE gallery_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  caption TEXT,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints

### Public Endpoints

#### Submit Donation
```
POST /api/donations/submit
Body: {
  name: string,
  amount: number,
  isPublic: boolean
}
```

#### Get Approved Donations
```
GET /api/donations/approved
Response: {
  success: boolean,
  data: [{ name, amount, date, is_public }]
}
```

#### Get Statistics
```
GET /api/donations/stats
Response: {
  success: boolean,
  data: {
    totalAmount: number,
    treesPlanted: number,
    totalDonors: number,
    goalTrees: number,
    progressPercentage: number
  }
}
```

#### Get Top Supporters
```
GET /api/donations/top-supporters
Response: {
  success: boolean,
  data: [{ name, totalAmount, donationCount }]
}
```

### Admin Endpoints (Require Authentication)

#### Admin Login
```
POST /api/admin/login
Body: { password: string }
Response: { success: boolean, token: string }
```

#### Get Pending Donations
```
GET /api/admin/pending
Headers: { Authorization: "Bearer {token}" }
```

#### Approve Donation
```
POST /api/admin/approve
Headers: { Authorization: "Bearer {token}" }
Body: { donationId: number }
```

#### Reject Donation
```
POST /api/admin/reject
Headers: { Authorization: "Bearer {token}" }
Body: { donationId: number }
```

#### Get Gallery Images
```
GET /api/admin/gallery
Headers: { Authorization: "Bearer {token}" }
```

## 🎨 Design Highlights

- **Color Scheme**: Green (primary), white, light yellow
- **Mobile-First**: Responsive on all devices
- **Large Fonts**: Easy to read for all users
- **Minimal Clutter**: Clean, simple UI
- **Emoji Icons**: Visual indicators instead of complex icons
- **Fast & Lightweight**: No heavy animations or dependencies
- **Bilingual**: Hindi + English support

## 📊 Key Features Explained

### 1. Hero Section
- Emotional call-to-action with mission statement
- Focuses on impact of tree plantation
- Uses cow emoji to connect with rural audience

### 2. Statistics Dashboard
- Real-time stats with auto-refresh (every 30 seconds)
- Progress bar showing trees planted vs. goal (100 trees)
- 1 tree = ₹500 donation calculation

### 3. Donation Flow
1. User sees QR code and payment instructions
2. Scans QR with UPI app and pays
3. Fills donation form with name and amount
4. Chooses to show/hide name publicly
5. Form submitted as "pending"
6. Admin reviews and approves
7. Appears on public donations list

### 4. Admin Panel
- Simple password login (default: `gaushala123`)
- Tabs for pending and all donations
- Quick approve/reject buttons
- Real-time stats dashboard
- Gallery management

### 5. Recent Donations
- Shows last 50 approved donations
- Auto-refreshes every 30 seconds
- Anonymous donors shown as "Anonymous"
- Displays trees contributed per donation

### 6. Top Supporters
- Shows top 3 public donors
- Medal badges (🥇🥈🥉)
- Total contribution and donation count
- Motivates others to donate

### 7. Proof Gallery
- Displays 6 placeholder images
- Captions in Hindi
- Shows environmental impact stats

## 🔐 Security Notes

- Admin password is hardcoded (production should use JWT + environment variables)
- No payment gateway integration (manual QR-based system)
- Simple token authentication (production should use proper JWT)
- Database not exposed to internet

## 🛠️ Development

### Running in Production

```bash
# Backend
cd server
npm start

# Frontend (build first)
cd client
npm run build
npm run preview
```

### Adding More Features

1. **Payment Gateway**: Integrate Razorpay or PayU
2. **Email Notifications**: Send confirmation to donors
3. **Analytics**: Track donation patterns
4. **Multi-language**: Add more languages
5. **Mobile App**: React Native version
6. **Social Sharing**: Share donation on WhatsApp/Facebook

## 📱 Mobile Optimization

- Responsive grid layouts
- Touch-friendly large buttons
- Mobile-optimized forms
- Fast loading times
- Minimal data usage
- Emoji-based visual indicators

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env or vite config
PORT=5001

# Or kill existing process
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### Database Not Found
- Delete `database.sqlite`
- Restart server (creates new database automatically)

### CORS Errors
- Check `FRONTEND_URL` in server/.env
- Should match frontend URL (default: http://localhost:5173)

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is open-source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please follow the code structure and add comments.

## 📞 Support

For issues or questions:
- Check GitHub issues
- Email: info@gaushala.org
- Create an issue with clear description

## ✨ Credits

Built with ❤️ for Gaushala and nature conservation.

**Key Technologies:**
- React for fast UI
- Tailwind for beautiful styling
- Express for robust backend
- SQLite for lightweight storage
- Vite for fast development

---

**Remember**: One tree brings relief to many lives! 🌳💚

Every donation plants a future. Every tree saves a life.
"एक पेड़ कई ज़िंदगियों को राहत देता है"
