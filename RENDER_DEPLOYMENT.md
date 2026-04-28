# 🚀 Deploying Gaushala Backend to Render

This guide walks you through deploying the Gaushala Donation System backend to Render.

## Prerequisites

- Render account (https://render.com)
- GitHub repository with your code
- Supabase project with tables created (see MIGRATION_GUIDE.md)
- Environment variables ready

## Step 1: Push Code to GitHub

1. Initialize git in your project:
```bash
cd gaushala-donation-system
git init
git add .
git commit -m "Initial commit: Supabase migration"
```

2. Create a repository on GitHub and push:
```bash
git remote add origin https://github.com/yourusername/gaushala-donation-system.git
git branch -M main
git push -u origin main
```

**Important**: Make sure `.env` is in `.gitignore` to never commit secrets:

```
# In root .gitignore
server/.env
.env
.env.local
database.sqlite
node_modules/
uploads/
```

## Step 2: Connect Render

1. Go to https://render.com and log in
2. Click **New +** and select **Web Service**
3. Click **Connect Repository** and authorize GitHub
4. Select your `gaushala-donation-system` repository
5. Click **Connect**

## Step 3: Configure Service

Fill in the following details:

| Field | Value |
|-------|-------|
| **Name** | `gaushala-backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or Starter for production) |

Leave other fields as default.

## Step 4: Add Environment Variables

1. In the service settings, go to **Environment**
2. Click **Add Environment Variable** and enter:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your_anon_key_here
FRONTEND_URL=https://your-netlify-domain.netlify.app
PORT=5000
NODE_ENV=production
ADMIN_PASSWORD=your_secure_password_here
```

**Get these values from:**
- `SUPABASE_URL` & `SUPABASE_KEY`: Supabase Dashboard → Settings → API
- `FRONTEND_URL`: Your Netlify domain
- `ADMIN_PASSWORD`: Create a strong password

3. Click **Add** for each variable

## Step 5: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies
   - Build the project
   - Start the server
3. Once deployed, you'll see a live URL like: `https://gaushala-backend.onrender.com`

## Step 6: Verify Deployment

Test the health endpoint:
```bash
curl https://gaushala-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Step 7: Update Frontend

Update your frontend's `.env` with the new backend URL:

**Client `.env`:**
```env
VITE_API_URL=https://gaushala-backend.onrender.com/api
```

Rebuild and deploy to Netlify.

## Step 8: Verify Full System

1. Visit your Netlify frontend URL
2. Test donation submission:
   - Submit a donation
   - Check admin panel - it should appear as pending
   - Approve it
   - Verify it shows in the public list
3. Test expense upload:
   - Login as admin
   - Upload an expense with an image
   - Verify the image is stored in Supabase
   - Check that the expense appears in the list

## Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
- Delete `node_modules` and `package-lock.json` locally
- Run `npm install` again
- Push to GitHub - Render will reinstall

### "Connection refused" errors
- Verify `SUPABASE_URL` is correct (check Supabase Settings → API)
- Verify `SUPABASE_KEY` is the **anon key** (not service role key)
- Check that your Supabase project is active

### Slow response times
- Check Render logs: Click service → **Logs**
- Verify Supabase connection is not throttled
- Consider upgrading from Free tier to Starter

### Image upload fails
- Verify `expense-bills` bucket exists in Supabase
- Check bucket is set to **public**
- Verify storage policies allow uploads
- Check Render environment variables are set

### Logs on Render

To debug issues:
1. Go to your service on Render
2. Click **Logs** tab
3. View real-time server logs
4. Look for error messages

## Auto-Deploy with Git

Every time you push to GitHub, Render automatically:
1. Pulls the latest code
2. Installs dependencies
3. Builds the project
4. Restarts the server

No manual deployment needed! 🚀

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xyz.supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | `eyJhbGc...` |
| `FRONTEND_URL` | Frontend origin (CORS) | `https://gaushala.netlify.app` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment type | `production` |
| `ADMIN_PASSWORD` | Admin login password | `SecurePassword123!` |

## Scaling Tips

**As your project grows:**

1. **Free → Starter tier**: Render will hibernate free instances after inactivity
2. **Database backups**: Supabase auto-backs up (check Settings → Backups)
3. **Monitoring**: Set up alerts in Render for downtime
4. **Security**: Consider using JWT tokens instead of simple password auth
5. **Rate limiting**: Add rate limiting middleware for production

## Costs

| Service | Free Tier | Pricing |
|---------|-----------|---------|
| **Render** | 750 hours/month | $7+ per service |
| **Supabase** | 500MB database, 1GB storage | Pay-as-you-go |
| **Netlify** | Unlimited | Paid builds available |

Your startup costs are **minimal** to **free**! 💰

## Next Steps

1. ✅ Verify all API endpoints work
2. ✅ Test admin login and donation approval
3. ✅ Test file uploads to Supabase
4. ✅ Test from different devices/browsers
5. ✅ Share with real users for testing
6. ✅ Monitor logs for the first week
7. ✅ Set up regular backups

---

**Your Gaushala Donation System is now live on production!** 🎉

For issues, check:
- Render Logs
- Supabase SQL Editor for data verification
- Browser console for frontend errors
