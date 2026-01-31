# Deployment Guide

## GitHub Pages Deployment

This project can be deployed to GitHub Pages using two methods:

### Method 1: GitHub Actions (Recommended)

The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys when you push to `main` or `master` branch.

**Setup:**
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Push to `main` or `master` branch
4. The workflow will automatically build and deploy

**Manual Trigger:**
- Go to Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### Method 2: Manual Deployment with gh-pages

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy (clean cache first if you encounter errors)
npm run deploy:clean
```

**If you get submodule errors:**
```bash
# Clean the gh-pages cache
rm -rf node_modules/.cache/gh-pages

# Then deploy
npm run deploy
```

## Configuration

### Base Path

The app is configured to deploy to `/mush/` subdirectory (see `vite.config.js`).

**To deploy to root (`/`):**
1. Update `vite.config.js`:
   ```js
   base: '/'
   ```
2. Update `package.json` deploy script if needed
3. Update GitHub Pages settings to use root directory

**To deploy to a different subdirectory:**
1. Update `vite.config.js`:
   ```js
   base: '/your-subdirectory/'
   ```
2. Update GitHub Pages settings accordingly

### Environment Variables

For GitHub Actions deployment, you can set `VITE_API_URL` as a repository secret:

1. Go to Settings → Secrets and variables → Actions
2. Add a new secret: `VITE_API_URL`
3. Set value: `https://mushbackend-production.up.railway.app/api`

The workflow will use this secret, or fall back to the default production URL.

## Troubleshooting

### Error: "No url found for submodule path"

**Solution 1:** Clean gh-pages cache
```bash
rm -rf node_modules/.cache/gh-pages
npm run deploy
```

**Solution 2:** Use GitHub Actions (recommended)
- The GitHub Actions workflow avoids this issue entirely

**Solution 3:** Remove .gitmodules if it exists
```bash
rm -f .gitmodules
git rm --cached .gitmodules
```

### Error: "The process '/usr/bin/git' failed with exit code 128"

This usually means:
- Git authentication issues
- Submodule problems
- Cache corruption

**Fix:**
1. Use GitHub Actions instead (recommended)
2. Or clean cache: `rm -rf node_modules/.cache/gh-pages`

### Pages not updating

1. Check GitHub Actions workflow status
2. Clear browser cache
3. Verify the base path in `vite.config.js` matches your Pages settings
4. Check that `.nojekyll` file exists in `dist/` folder

## Local Testing

Before deploying, test the production build locally:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to verify everything works.

