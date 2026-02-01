# GitHub Actions Workflow Fix - Node.js Version Update

## Problem
The GitHub Actions workflow was failing because:
1. **Node.js version too old**: Using Node.js 18.20.8, but Vite requires 20.19+ or 22.12+
2. **ESM module error**: Node.js 18 doesn't fully support the ES module syntax that Vite uses
3. **Submodule error**: Broken submodule reference causing checkout to fail

## Solution Applied

### Updated `deploy.yml` workflow file:

**Changed:**
- Node.js version: `'18'` → `'22'`
- Added `submodules: false` to checkout step

**File location:** `.github/workflows/deploy.yml`

## What Was Changed

```yaml
# BEFORE:
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # ❌ Too old for Vite

# AFTER:
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'  # ✅ Compatible with Vite 5+
```

```yaml
# BEFORE:
- name: Checkout
  uses: actions/checkout@v4

# AFTER:
- name: Checkout
  uses: actions/checkout@v4
  with:
    submodules: false  # ✅ Fixes submodule error
```

## Next Steps

1. **Commit and push the changes:**
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Update Node.js to version 22 for Vite compatibility"
   git push
   ```

2. **Verify the fix:**
   - Go to your GitHub repository
   - Click on "Actions" tab
   - The workflow should now use Node.js 22 and build successfully

## Expected Result

After pushing, the build should:
- ✅ Use Node.js 22 (compatible with Vite)
- ✅ Successfully load vite.config.js (ESM support)
- ✅ Complete the build without errors
- ✅ Deploy to GitHub Pages

## Alternative Node.js Versions

If Node.js 22 causes any issues, you can also use Node.js 20:
```yaml
node-version: '20'  # Also supported by Vite (requires 20.19+)
```

## Notes

- Vite 5.x requires Node.js 20.19+ or 22.12+
- The ESM error was caused by Node.js 18's limited ES module support
- The submodule error is now fixed by disabling submodule fetching

