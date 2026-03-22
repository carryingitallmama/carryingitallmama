# Carrying It All — Website Setup Guide
# carryingitallmama.com

Everything you need to get this live. No coding knowledge required.
Read this top to bottom, in order.

---

## WHAT'S IN THIS FOLDER

```
carryingitall/
├── index.html          ← Homepage
├── about.html          ← About page
├── episodes.html       ← All episodes (auto-loads from RSS)
├── listen.html         ← All platforms
├── community.html      ← Email signup + social
├── contact.html        ← Contact / collaborations form
├── sitemap.xml         ← For Google Search Console
├── robots.txt          ← For Google
├── netlify.toml        ← Hosting config (Netlify reads this automatically)
├── css/
│   └── styles.css      ← All visual styles
├── js/
│   └── main.js         ← All interactivity + RSS fetching
└── images/             ← Put photos here (see step 4 below)
```

---

## STEP 1 — CREATE A FREE NETLIFY ACCOUNT

1. Go to: https://netlify.com
2. Click "Sign up" → use your email or GitHub
3. You're in — it's free, no credit card needed

---

## STEP 2 — DEPLOY THE WEBSITE (takes 2 minutes)

1. Inside Netlify, click the button: **"Add new site"**
2. Choose: **"Deploy manually"**
3. You'll see a big drag-and-drop box
4. Open the `carryingitall` folder on your computer
5. **Select all the files inside it** (Ctrl+A or Cmd+A)
6. Drag them all into Netlify's box
7. Wait 30 seconds — Netlify gives you a URL like `funny-name-abc123.netlify.app`
8. Click that URL — your site is live!

---

## STEP 3 — CONNECT YOUR DOMAIN (carryingitallmama.com)

Your domain is registered at Squarespace. You need to add two DNS records
there so the domain points to your Netlify site. This takes about 5 minutes.

---

### PART A — Add your domain in Netlify first

1. In Netlify, go to your site dashboard
2. Click **"Domain management"** in the left sidebar
3. Click **"Add custom domain"**
4. Type: `carryingitallmama.com` and click Verify
5. Netlify will say "This domain is already registered" — click **"Add domain"** anyway
6. You'll now see `carryingitallmama.com` listed with a yellow label: **"Awaiting External DNS"**
7. Click **"Check DNS configuration"** — it will show you the exact records needed
   (They will match exactly what's in Part B below)

---

### PART B — Add the DNS records in Squarespace

You need to add **2 records**. Here are the exact values:

**RECORD 1 — Points carryingitallmama.com to Netlify**
```
Type:  A
Host:  @
Value: 75.2.60.5
TTL:   Automatic (or 3600)
```

**RECORD 2 — Points www.carryingitallmama.com to Netlify**
```
Type:  CNAME
Host:  www
Value: [your-site-name].netlify.app
TTL:   Automatic (or 3600)
```
⚠️ For the CNAME Value, use the `.netlify.app` URL Netlify gave you after
deployment (the "funny name" URL from Step 2, like `graceful-fox-abc123.netlify.app`).
Replace `[your-site-name]` with that exact name.

---

### How to add them in Squarespace — exact steps:

1. Go to: **squarespace.com** and log in
2. Click your profile icon (top right) → **"Account & Security"**
3. In the left sidebar, click **"Domains"**
4. Click **"carryingitallmama.com"**
5. Click the **"DNS"** tab at the top of the page
6. Scroll down to the **"DNS Records"** section
7. Click **"Add Record"**

**Adding Record 1 (the A record):**
- Type: Select **"A Record"** from the dropdown
- Host: Type `@`  ← this symbol means "the root domain"
- Data / Value: Type `75.2.60.5`
- Click **"Save"**

**Adding Record 2 (the CNAME):**
- Click **"Add Record"** again
- Type: Select **"CNAME Record"** from the dropdown
- Host: Type `www`
- Data / Value: Type your Netlify URL, e.g. `graceful-fox-abc123.netlify.app`
- Click **"Save"**

---

### After saving:

Go back to Netlify → Domain management. Within a few minutes to a few hours,
the yellow "Awaiting" label will turn green and say **"Netlify DNS"**.

SSL (the padlock / https) turns on automatically once DNS is confirmed.
You don't do anything — Netlify handles it.

**Wait time:** Usually 10–30 minutes. Maximum 48 hours worldwide.
You'll know it worked when carryingitallmama.com loads your site in a browser.

---

## STEP 4 — ADD THE REAL PHOTOS

Replace the placeholder images with real ones:

**Host photo:**
1. Name the file: `host-photo.jpg`
2. Put it in the `images/` folder
3. In `about.html`, find this line:
   ```
   <!-- Replace with real photo: <img src="images/host-photo.jpg" ...> -->
   ```
4. Replace the whole `<div class="photo-placeholder">...</div>` block with:
   ```html
   <img src="images/host-photo.jpg" alt="[Her name] — host of Carrying It All podcast">
   ```
5. Do the same in `index.html` in the about section

**Podcast cover art:**
1. Name the file: `podcast-cover.jpg` (should be 3000×3000px square)
2. Put it in the `images/` folder
3. In `index.html`, find:
   ```
   <!-- Replace with actual cover art: <img src="images/podcast-cover.jpg" ...> -->
   ```
4. Replace the `<div class="cover-placeholder">...</div>` with:
   ```html
   <img src="images/podcast-cover.jpg" alt="Carrying It All Podcast Cover Art">
   ```

**Favicon (tiny browser tab icon):**
1. Create a 32×32px PNG with a purple "C" or the logo
2. Name it: `favicon.png`
3. Put it in the `images/` folder
4. It's already referenced in all 6 pages — nothing else to do

---

## STEP 5 — CONNECT THE RSS FEED (auto-episode loading)

This is the magic part. Once your podcast is live on a hosting platform:

1. Get your RSS feed URL from your podcast host
   - **Buzzsprout:** Settings → Podcast Information → RSS Feed URL
   - **Anchor/Spotify for Podcasters:** Settings → RSS Feed
   - **Podbean:** Feed URL shown in dashboard
   - It looks like: `https://feeds.buzzsprout.com/XXXXXX.rss`

2. Open `js/main.js` in any text editor (Notepad, TextEdit, VS Code)

3. Find this section near the top:
   ```javascript
   const PODCAST_RSS = {
     spotify: '',
     apple:   '',
     main:    ''    // ← PUT YOUR RSS URL HERE
   };
   ```

4. Paste your RSS URL between the quotes on the `main:` line:
   ```javascript
   main: 'https://feeds.buzzsprout.com/XXXXXX.rss'
   ```

5. Save the file and re-upload to Netlify (drag and drop again)

**After this, new episodes appear automatically** — no website changes needed.

---

## STEP 6 — UPDATE PLATFORM LINKS

Once your podcast is submitted to Apple Podcasts and Spotify:

1. Open `listen.html` in a text editor
2. Find each `href="#"` on the platform buttons
3. Replace `#` with the real URL:
   - Apple Podcasts: `https://podcasts.apple.com/podcast/id...`
   - Spotify: `https://open.spotify.com/show/...`
   - etc.
4. Do the same in `index.html` (the platform row at the bottom)
5. Re-upload to Netlify

---

## STEP 7 — CONNECT GOOGLE ANALYTICS

1. Go to: https://analytics.google.com
2. Create a new account → property → choose "Web"
3. Enter URL: `carryingitallmama.com`
4. You'll get a Measurement ID that looks like: `G-XXXXXXXXXX`
5. Open all 6 HTML files in a text editor
6. Find: `GA_MEASUREMENT_ID` (appears twice per file)
7. Replace both with your real ID: `G-XXXXXXXXXX`
8. Re-upload to Netlify
9. Go back to Google Analytics → Reports → Realtime — visit your site and confirm you see yourself

---

## STEP 8 — GOOGLE SEARCH CONSOLE

1. Go to: https://search.google.com/search-console
2. Click "Add property" → choose "URL prefix" → enter `https://carryingitallmama.com`
3. Choose verification method: **DNS record**
4. Google gives you a TXT record to add in Squarespace DNS (same place as step 3)
5. Add it, wait a few minutes, click Verify
6. Once verified, go to Sitemaps → enter: `sitemap.xml` → Submit

---

## STEP 9 — CONNECT EMAIL SIGNUP (Mailchimp or ConvertKit)

The community page has a placeholder form. Replace it with your real email platform:

**Mailchimp:**
1. Log in → Audience → Signup forms → Embedded forms
2. Customize your form
3. Copy the embed code
4. Open `community.html`
5. Find: `<!-- PASTE MAILCHIMP OR CONVERTKIT EMBED CODE HERE -->`
6. Paste your embed code there
7. Delete the `<form class="fallback-signup-form">...</form>` block below it
8. Re-upload to Netlify

**ConvertKit:**
Same process — create a Form in ConvertKit, choose Inline, copy embed code, paste in the same spot.

---

## UPDATING THE SITE IN THE FUTURE

You don't need to know how to code for most updates.

**To update text/copy:**
1. Open the relevant HTML file in a text editor
2. Find the text you want to change (Ctrl+F or Cmd+F to search)
3. Edit it
4. Save and re-upload to Netlify (drag and drop again)

**To add new episodes:**
Nothing to do — the site fetches them from your RSS feed automatically.

**To update platform links:**
Find the `href="#"` on the relevant button, replace with the real URL.

---

## CHECKLIST — BEFORE YOU CALL IT DONE

- [ ] Site loads at carryingitallmama.com
- [ ] HTTPS padlock shows in browser
- [ ] All 6 pages load with no errors
- [ ] Site looks correct on iPhone and desktop
- [ ] Host photo replaced (or placeholder is acceptable for now)
- [ ] Podcast cover art replaced (or placeholder is acceptable for now)
- [ ] RSS feed URL entered in js/main.js
- [ ] Platform links updated (or noted as pending until podcast is submitted)
- [ ] Contact form tested — sends a real test submission
- [ ] Google Analytics Measurement ID replaced on all pages
- [ ] Google Search Console verified, sitemap submitted
- [ ] Email signup connected to Mailchimp or ConvertKit

---

## QUESTIONS?

Email: hello@carryingitallmama.com
Instagram: @carryingitall.mama

---

Built for Carrying It All · carryingitallmama.com
