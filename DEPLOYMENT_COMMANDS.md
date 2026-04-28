# 🚀 Deployment Commands: Copy & Paste

Use these exact commands to get your system deployed. Run them in order.

---

## ⏱️ Total Time: ~1 hour

---

## Phase 1: Supabase Setup (15 min)

### 1.1 Create Supabase Project
```
1. Go to: https://supabase.com
2. Click: "New Project"
3. Fill in:
   - Name: gaushala-donation-system
   - Password: [create strong password]
   - Region: [choose your region]
4. Click: "Create new project"
5. Wait: 2-3 minutes for setup
```

### 1.2 Copy Credentials
```
1. Go to: Settings → API
2. Copy: Project URL → Save as SUPABASE_URL
3. Copy: Anon public key → Save as SUPABASE_KEY
```

### 1.3 Create Tables (Copy entire SQL block)

Go to **SQL Editor** and paste:

```sql
-- Donations table
CREATE TABLE donations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  suggestion TEXT,
  is_public BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending',
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  amount BIGINT NOT NULL,
  description TEXT,
  image_url TEXT,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats table
CREATE TABLE stats (
  id BIGINT PRIMARY KEY DEFAULT 1,
  total_trees BIGINT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default stats row
INSERT INTO stats (id, total_trees) VALUES (1, 0) ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "read_approved_donations" ON donations FOR SELECT USING (status = 'approved');
CREATE POLICY "read_expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "read_stats" ON stats FOR SELECT USING (true);
```

### 1.4 Create Storage Bucket
```
1. Go to: Storage in Supabase
2. Click: "Create a new bucket"
3. Name: expense-bills
4. Set to: Public (toggle ON)
5. Create: Bucket
```

✅ **Supabase is ready!**

---

## Phase 2: Local Testing (20 min)

### 2.1 Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your credentials
cat > .env << EOF
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_key_here
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=gaushala123
EOF

# Verify .env was created
cat .env

# Start backend
npm start

# You should see: "✅ Connected to Supabase database"
# Keep this running, open new terminal for frontend
```

### 2.2 Test Backend Health

```bash
# In NEW TERMINAL, test the endpoint
curl http://localhost:5000/health

# Should see:
# {"status":"ok","message":"Server is running"}
```

### 2.3 Frontend Setup

```bash
# In NEW TERMINAL, navigate to client
cd client

# Install dependencies
npm install

# Start frontend dev server
npm run dev

# You should see: "Local: http://localhost:5173"
# Open in browser and test!
```

### 2.4 Local Testing Checklist

```bash
# In browser, visit: http://localhost:5173

# Test checklist:
✓ Submit donation form
✓ Check browser console (F12) for errors
✓ Go to /admin
✓ Login with password: gaushala123
✓ See pending donation in admin panel
✓ Click Approve
✓ Go back to public page
✓ See approved donation displayed
✓ Try uploading expense with image
✓ Verify image appears

# If all working → Ready to deploy!
```

✅ **Local testing complete!**

---

## Phase 3: Deploy Backend to Render (15 min)

### 3.1 Push Code to GitHub

```bash
# Go back to project root
cd ../..

# Make sure .env is in .gitignore (should be already)
cat .gitignore | grep "^.env$"

# Add and commit
git add -A
git commit -m "Production deployment: Supabase + Render"

# Push to GitHub (assuming 'main' branch)
git push origin main

# Wait: Code should now be on GitHub
```

### 3.2 Deploy to Render

```
1. Go to: https://render.com
2. Login or sign up
3. Click: "New +"
4. Select: "Web Service"
5. Click: "Connect repository"
6. Authorize GitHub
7. Search: "gaushala"
8. Select: "gaushala-donation-system"
9. Click: "Connect"

Build Settings:
  - Name: gaushala-backend
  - Environment: Node
  - Build Command: npm install
  - Start Command: npm start
  - Instance Type: Free

Click: "Create Web Service"
```

### 3.3 Add Environment Variables in Render

```
1. Wait for service to be created
2. Go to: Dashboard → gaushala-backend → Settings
3. Go to: Environment tab
4. Add variables:

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_key_here
FRONTEND_URL=https://your-netlify-domain.netlify.app
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=your_secure_password

5. Deploy should start automatically
6. Wait: 3-5 minutes for deployment
```

### 3.4 Verify Backend Deployed

```bash
# Visit your backend URL (shown in Render dashboard)
# Format: https://gaushala-backend.onrender.com

# In browser, visit:
https://gaushala-backend.onrender.com/health

# Should see:
# {"status":"ok","message":"Server is running"}

# Save this URL: https://gaushala-backend.onrender.com
```

✅ **Backend deployed to Render!**

---

## Phase 4: Deploy Frontend to Netlify (15 min)

### 4.1 Update Frontend URL

```bash
# Make sure you're in project root
pwd

# Edit client/.env.production
cat > client/.env.production << EOF
VITE_API_URL=https://gaushala-backend.onrender.com/api
EOF

# Replace 'gaushala-backend' with your actual Render service name if different
```

### 4.2 Push to GitHub

```bash
# Commit the change
git add client/.env.production
git commit -m "Update backend URL for production"
git push origin main

# Wait: Code updated on GitHub
```

### 4.3 Deploy to Netlify

```
1. Go to: https://netlify.com
2. Login or sign up
3. Click: "Add new site"
4. Select: "Import an existing project"
5. Choose: "GitHub"
6. Authorize Netlify
7. Search: "gaushala"
8. Select: "gaushala-donation-system"

Build Settings (should auto-detect):
  Base directory: client
  Build command: npm run build
  Publish directory: dist

Environment (if not auto-detected):
  VITE_API_URL=https://gaushala-backend.onrender.com/api

9. Click: "Deploy site"
10. Wait: 5-10 minutes for build & deploy
```

### 4.4 Verify Frontend Deployed

```
1. Go to: Netlify dashboard
2. Find your site URL (e.g., https://gaushala-prod.netlify.app)
3. Click the link to open live site
4. Verify everything loads
```

✅ **Frontend deployed to Netlify!**

---

## Phase 5: End-to-End Testing (10 min)

### 5.1 Full System Test

```
1. Visit your Netlify frontend URL
2. Submit a test donation:
   - Name: Test User
   - Amount: 1000
   - Suggestion: Test
   - Public: Yes
   - Click Submit

3. See confirmation message

4. Go to Admin panel (/admin):
   - Password: [your ADMIN_PASSWORD]
   - Click Login

5. Should see pending donation

6. Click Approve

7. Go back to public page

8. Refresh: See donation in recent list

9. Test file upload:
   - Still in admin
   - Fill expense form
   - Select an image
   - Submit
   - Verify image appears

10. Check browser console (F12):
    - Should see NO errors
    - API calls successful
```

### 5.2 Verification Checklist

```
✓ Frontend loads without errors
✓ Donation form submits successfully
✓ Admin login works with your password
✓ Pending donations appear for admin
✓ Admin can approve donations
✓ Approved donation appears on public site
✓ Expense upload works
✓ Images display from Supabase CDN
✓ Stats calculate correctly
✓ No CORS errors in console
✓ No 404 errors
✓ No database connection errors
```

✅ **System is live and working!**

---

## 🎉 Completion Verification

Run these commands to confirm everything is deployed:

```bash
# Test backend is running
curl https://gaushala-backend.onrender.com/health
# Should output: {"status":"ok","message":"Server is running"}

# Test frontend loads
curl https://your-site.netlify.app/
# Should output HTML (no 404)

# Check deployment timestamps
echo "Backend deployed at Render"
echo "Frontend deployed at Netlify"
echo "Database: Supabase"
```

---

## 📋 Important URLs to Save

Create a secure note with these:

```
Frontend (User Website):
https://your-site.netlify.app

Backend API:
https://gaushala-backend.onrender.com

Supabase Dashboard:
https://app.supabase.com

GitHub Repository:
https://github.com/yourusername/gaushala-donation-system

Credentials:
- SUPABASE_URL: https://xxx.supabase.co
- SUPABASE_KEY: eyJhbGc...
- ADMIN_PASSWORD: [your password]
```

---

## 🔄 Continuous Deployment (Future Pushes)

Every time you update code:

```bash
# Make changes locally
nano server/controllers/donationController.js  # Example

# Test locally
npm start  # Backend
npm run dev  # Frontend (in new terminal)

# Push to GitHub
git add -A
git commit -m "Fix: [describe your change]"
git push origin main

# That's it! 🚀
# Render & Netlify auto-deploy within 5 minutes
# No manual steps needed
```

---

## 🆘 If Something Goes Wrong

```bash
# Check Render backend logs
# Dashboard → gaushala-backend → Logs tab

# Check Netlify frontend logs
# Dashboard → Deploys → Latest → Logs

# Local debugging
cd server && npm start  # See any errors
cd client && npm run dev  # See console errors

# Check credentials
cat server/.env  # Never commit this!
cat client/.env.production

# Restart services
# Render: Click "Manual Deploy"
# Netlify: Click "Trigger deploy"
```

---

## ✨ Deployment Complete!

Your system is now:
- ✅ Production-ready
- ✅ Globally deployed
- ✅ Auto-scaling
- ✅ Backed up automatically
- ✅ Accessible from anywhere

**Congratulations!** 🎉

---

## 📚 Documentation References

For detailed explanations, see:
- `MIGRATION_GUIDE.md` - Complete setup guide
- `RENDER_DEPLOYMENT.md` - Backend details
- `NETLIFY_DEPLOYMENT.md` - Frontend details
- `PRODUCTION_QUICK_START.md` - Quick version
- `ARCHITECTURE_UPGRADE.md` - System design

---

**Last Command**: `git push origin main` → LIVE! 🚀
