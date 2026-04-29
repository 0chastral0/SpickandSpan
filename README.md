# Spick & Span — PWA Shell

A tiny static site that wraps the Google Apps Script Web App in a clean origin
so iOS Safari treats it as a real installable Progressive Web App.

## How it works

```
iPhone home-screen icon
      │
      ▼
https://YOUR-USER.github.io/spick-and-span/  ← this folder, served by GitHub Pages
      │ (loads index.html with manifest.json)
      ▼
   <iframe src="https://script.google.com/.../exec">  ← the actual React app
```

iOS sees the GitHub Pages URL as the app's origin → installs it properly,
shows the icon, hides Safari chrome, persists the session — none of which
work reliably when you Add-to-Home-Screen the raw GAS URL directly.

## One-time setup

1. **Deploy the GAS Web App** (in the GAS editor):
   - Deploy → New deployment → type: Web app
   - Execute as: **Me**
   - Who has access: **Anyone with Google account** (or your domain)
   - Click Deploy → copy the `https://script.google.com/macros/s/.../exec` URL

2. **Paste the URL** into `index.html`:
   ```html
   <iframe id="appFrame" src="PASTE_YOUR_EXEC_URL_HERE" ...>
   ```

3. **Generate PNG icons** (optional but recommended for older iOS):
   - Open `icon.svg` in any vector tool (Figma, Inkscape) or use an online
     SVG-to-PNG converter, and export at 192×192 and 512×512.
   - Save as `icon-192.png` and `icon-512.png` in this folder.
   - Also export at 180×180 and save as `apple-touch-icon.png`.

4. **Push to GitHub**:
   ```bash
   # from the project root
   cd pwa-shell
   git init -b main
   git add .
   git commit -m "init pwa shell"
   git remote add origin git@github.com:YOUR-USER/spick-and-span.git
   git push -u origin main
   ```

5. **Enable GitHub Pages**:
   - Repo → Settings → Pages
   - Source: Deploy from a branch → `main` → `/ (root)` → Save
   - Wait ~30 s. URL will be `https://YOUR-USER.github.io/spick-and-span/`.

6. **Install on iPhone**:
   - Open the GitHub Pages URL in **Safari**.
   - Share → Add to Home Screen → Add.
   - Tap the new icon. Fullscreen, branded splash, persistent login. ✨

## Updating

If the GAS Web App URL changes (e.g. after a fresh deployment with a new
version), just edit `index.html` and push — Pages re-deploys automatically.

The actual app code lives in `gas-backend/` and `src/` at the project root;
this shell never needs touching unless the URL changes.
