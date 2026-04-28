# ⚡ Quick Start: Production Deployment

**Time required: ~1 hour from start to live system**

This is the fast-track guide. For detailed info, see the other documentation.

---

## Step 1: Supabase Setup (15 min)

```
1. Go to supabase.com → Create project
2. Save these credentials:
   - SUPABASE_URL: https://xxx.supabase.co
   - SUPABASE_KEY: eyJhbGc...
3. SQL Editor → Run this:
```

**Copy-paste all SQL below at once:**

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

```
4. Storage → Create bucket "expense-bills"
5. Make it Public (toggle on)
```

---

## Step 2: Local Testing (10 min)

### Backend Setup
```bash
cd server
npm install
```

Create `server/.env`:
```env
SUPABASE_URL=https://your-url.supabase.co
SUPABASE_KEY=your_anon_key_here
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=gaushala123
```

Test:
```bash
npm start
# Visit http://localhost:5000/health
# Should see: {"status":"ok"}
```

### Frontend Setup
```bash
cd ../client
npm run dev
# Visit http://localhost:5173
```

Test:
1. Submit donation → Check admin panel (appears as pending)
2. Admin login (password: gaushala123) → Approve donation
3. Refresh public → See approved donation
4. Upload expense with image → Image should appear

✅ If all works → Ready to deploy!

---

## Step 3: Deploy Backend (10 min)

```
1. Push to GitHub (make sure .env is in .gitignore)
   git add -A
   git commit -m "Production ready"
   git push

2. Go to render.com → New Web Service
3. Connect GitHub repo
4. Fill in:
   Name: gaushala-backend
   Build: npm install
   Start: npm start
   Base dir: server (if needed)

5. Add Environment Variables:
   SUPABASE_URL=https://your-url.supabase.co
   SUPABASE_KEY=your_anon_key
   FRONTEND_URL=https://your-netlify-url.netlify.app
   ADMIN_PASSWORD=your_secure_password

6. Create Web Service
7. Wait for deploy (2-3 min)
8. Save backend URL: https://your-backend.onrender.com
```

Test: `curl https://your-backend.onrender.com/health`

---

## Step 4: Deploy Frontend (10 min)

### Update Frontend URL
Edit `client/.env.production`:
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

```
1. Push to GitHub
   git add client/.env.production
   git commit -m "Update backend URL"
   git push

2. Go to netlify.com → Add new site
3. Import existing project → GitHub
4. Select gaushala repo
5. Configure:
   Base dir: client
   Build: npm run build
   Publish: dist

6. Add env var:
   VITE_API_URL=https://your-backend.onrender.com/api

7. Deploy
8. Save frontend URL: https://your-site.netlify.app
```

---

## Step 5: Final Testing (5 min)

Visit your frontend URL:
1. Submit donation
2. Admin login (check Render backend URL works)
3. Approve donation
4. Upload expense with image
5. Verify stats update
6. Check browser console (F12) for errors

**Everything working? You're LIVE! 🎉**

---

## Environment Variables Cheat Sheet

**Backend (`server/.env`)**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGc...
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
ADMIN_PASSWORD=gaushala123
```

**Frontend (`client/.env.production`)**
```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check SUPABASE_URL and SUPABASE_KEY in .env |
| CORS errors | Update FRONTEND_URL in backend .env to match your Netlify URL |
| Images don't upload | Check expense-bills bucket is public |
| Admin login fails | Verify ADMIN_PASSWORD in .env matches what you entered |
| Frontend shows wrong data | Check API_BASE URL uses correct backend (not localhost) |

---

## Commands Reference

```bash
# Local development
cd server && npm start
cd client && npm run dev

# Build frontend
cd client && npm run build

# Test backend
curl http://localhost:5000/health

# Check backend logs
# In Render: Dashboard → Service → Logs

# Check frontend logs
# In Netlify: Deploys → Latest → Logs
```

---

## File Checklist

✅ Backend files updated:
- [x] server/package.json
- [x] server/server.js
- [x] server/models/db.js
- [x] server/lib/supabaseClient.js
- [x] server/controllers/donationController.js
- [x] server/controllers/expenseController.js
- [x] server/controllers/adminController.js
- [x] server/routes/adminRoutes.js
- [x] server/.env.example

✅ Frontend files updated:
- [x] client/.env.development
- [x] client/.env.production

✅ Documentation:
- [x] MIGRATION_GUIDE.md (detailed)
- [x] RENDER_DEPLOYMENT.md (detailed)
- [x] NETLIFY_DEPLOYMENT.md (detailed)
- [x] MIGRATION_COMPLETE.md (summary)
- [x] PRODUCTION_QUICK_START.md (this file)

---

## Success Checklist

- [ ] Supabase tables created
- [ ] Backend runs locally
- [ ] Frontend connects to backend
- [ ] Donation submission works
- [ ] Admin approval works
- [ ] Image upload works
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Netlify
- [ ] End-to-end test passes
- [ ] No errors in browser console

**All checked? CONGRATULATIONS!** 🚀

Your production system is live and ready for real users!

---

## Next

- Monitor Render logs for errors
- Test with real users
- Get feedback
- Scale as needed
- Celebrate! 🎉

For detailed info, see:
- `MIGRATION_GUIDE.md` - Complete setup guide
- `RENDER_DEPLOYMENT.md` - Backend details
- `NETLIFY_DEPLOYMENT.md` - Frontend details
