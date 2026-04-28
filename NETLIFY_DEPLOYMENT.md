# 🚀 Deploying Gaushala Frontend to Netlify

This guide walks you through deploying the Gaushala React frontend to Netlify.

## Prerequisites

- Netlify account (https://netlify.com)
- GitHub repository with your code
- Backend deployed to Render (see RENDER_DEPLOYMENT.md)
- Node.js and npm installed locally

## Step 1: Update Backend URL

Update the frontend to use your Render backend URL.

**In `client/.env.production`:**
```env
VITE_API_URL=https://gaushala-backend.onrender.com/api
```

Replace `gaushala-backend` with your actual Render service name.

## Step 2: Test Locally

Before deploying, test locally:

```bash
cd client

# Development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

Verify:
- ✅ Donation form submits successfully
- ✅ API calls work (check browser console)
- ✅ Admin login works
- ✅ Images upload correctly

## Step 3: Push to GitHub

```bash
cd ..  # Go to project root
git add -A
git commit -m "Update backend URL for production"
git push origin main
```

Make sure `.env.development` is in `.gitignore` but `.env.production` is NOT (or keep it separate).

## Step 4: Connect Netlify

1. Go to https://netlify.com and log in
2. Click **Add new site** → **Import an existing project**
3. Select **GitHub** and authorize Netlify
4. Search for `gaushala-donation-system` repository
5. Click **Import**

## Step 5: Configure Build Settings

Netlify should auto-detect the settings, but verify:

| Setting | Value |
|---------|-------|
| **Base directory** | `client` |
| **Build command** | `npm run build` |
| **Publish directory** | `client/dist` |

**Verify these in Build settings:**

1. Click **Site settings** → **Build & deploy**
2. Check **Build settings**:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `dist`

## Step 6: Add Environment Variables

1. Go to **Site settings** → **Environment**
2. Click **Add environment variable** and enter:

```
VITE_API_URL=https://gaushala-backend.onrender.com/api
```

Replace with your actual Render backend URL.

3. Click **Add**

**Important**: Never commit sensitive data. Keep `.env` files in `.gitignore`.

## Step 7: Deploy

1. Go back to **Deployments** tab
2. Click **Trigger deploy** → **Deploy site**
3. Netlify will:
   - Clone your repository
   - Install dependencies
   - Build the React app
   - Deploy to CDN
4. Your site is live! 🎉

You'll get a URL like: `https://gaushala-donation-system.netlify.app`

## Step 8: Verify Deployment

1. Visit your Netlify URL
2. Check browser console (F12):
   - Should see API calls to your Render backend
   - No CORS errors
3. Test functionality:
   - Submit a donation
   - View donations list
   - Login to admin panel
   - Approve/reject donations
   - Upload expense with image

## Step 9: Set Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain: `gaushala.com` (or subdomain)
4. Follow instructions to update DNS

## Auto-Deploy with Git

Every time you push to GitHub:
1. Netlify detects the push
2. Automatically builds and deploys
3. Updates your live site

No manual steps needed! Just `git push` and your changes go live.

## Troubleshooting

### "Cannot find module 'react'"
- Your `base` directory is wrong
- Verify: **Site settings** → **Build & deploy** → **Base directory** = `client`
- Delete `node_modules` locally and run `npm install` again

### "Vite not found"
- Same issue - `base` directory should be `client`
- CORS errors when calling backend API

### "Cannot GET /" error
- Netlify can't find your index.html
- **Build settings** → **Publish directory** should be `client/dist` (not `client`)

### API calls fail with CORS errors
- Verify your backend is deployed and running on Render
- Check `VITE_API_URL` in environment variables
- Should be: `https://your-backend.onrender.com/api`
- Test: Visit `https://your-backend.onrender.com/health` in browser

### 404 on page refresh
This happens with React Router on static hosting:

1. Create `client/public/_redirects` file:
```
/*    /index.html   200
```

2. Add this to `client/vite.config.js`:
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

3. Redeploy

### "My changes aren't showing"
1. Check Netlify build logs:
   - **Deploys** tab → Click latest deploy → **Logs**
   - Look for build errors
2. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check browser cache:
   - Open DevTools (F12)
   - **Network** tab → Check "Disable cache"
   - Refresh page

### Slow performance
- Netlify uses global CDN (should be fast)
- Check browser Network tab for slow API calls
- May indicate backend on Render is slow
- Upgrade Render tier if needed

## Build Logs

To debug deployment issues:

1. Go to your Netlify site dashboard
2. Click **Deploys**
3. Click the deployment you want to check
4. Click **Logs** to see build output
5. Look for:
   - Build errors (red text)
   - Warnings (yellow text)
   - Success messages

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API endpoint | `https://backend.onrender.com/api` |

**Note**: Vite environment variables must start with `VITE_` to be accessible in the browser.

## Security

✅ **DO:**
- Keep `.env` in `.gitignore`
- Use HTTPS only (Netlify auto-enables)
- Update `VITE_API_URL` for each environment
- Verify backend responses are from your domain

❌ **DON'T:**
- Commit `.env` files with secrets
- Use hardcoded API URLs in code
- Expose service keys in frontend code

## Monitoring & Analytics

Netlify provides built-in:
- **Netlify Analytics**: Visit traffic, top pages
- **Speed metrics**: Page load performance
- **Deploy history**: See all version deployments
- **Logs**: Debug build and deploy issues

## Rollback to Previous Version

If something breaks:

1. Go to **Deploys** tab
2. Find the last working deployment
3. Click the **...** menu
4. Select **Publish deploy**
5. Your site reverts to that version instantly

## Staging Deployments

Deploy previews for pull requests:

1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes and push: `git push origin feature/my-feature`
3. Create a Pull Request on GitHub
4. Netlify automatically creates a preview URL
5. Test the preview before merging
6. Merge to `main` when ready
7. Netlify auto-deploys to production

## Database Migrations

If you update Supabase schema:

1. Make sure backend handles the changes
2. Redeploy backend to Render
3. Frontend doesn't need changes (usually)
4. If frontend UI changes needed:
   - Update React components
   - Push to GitHub
   - Netlify auto-deploys

## Costs

| Service | Free Tier | Pricing |
|---------|-----------|---------|
| **Netlify** | 300 build minutes/month | $19+ per month |
| **Render** | 750 hours/month | $7+ per service |
| **Supabase** | 500MB database, 1GB storage | Pay-as-you-go |

**Total startup cost: FREE to $100/month depending on usage** 💰

## Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Verify backend URL works
3. ✅ Test all features end-to-end
4. ✅ Monitor build logs for errors
5. ✅ Set up custom domain
6. ✅ Enable analytics
7. ✅ Share with users!

## Support & Debugging

**If something doesn't work:**

1. Check Netlify **Logs** (in Deploys tab)
2. Check browser **Console** (F12)
3. Check **Network** tab for API failures
4. Verify backend on Render is running:
   - Visit `https://backend.onrender.com/health`
5. Check Render logs for backend errors

---

**Your Gaushala frontend is now live!** 🎉

**Frontend URL**: `https://your-site.netlify.app`
**Backend URL**: `https://your-backend.onrender.com`
**Database**: Supabase (cloud)

Congratulations on launching production! 🚀
