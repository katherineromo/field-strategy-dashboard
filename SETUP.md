# Field Strategy Dashboard — Setup Guide

This is a 3-step process: set up Airtable (your database), push code to GitHub, and deploy on Render. Takes about 10–15 minutes total.

---

## Step 1 — Set Up Airtable (your database)

1. Go to [airtable.com](https://airtable.com) and create a free account (or log in).
2. Click **Create a base** → **Start from scratch**. Name it `Field Strategy`.
3. Rename the default table to `Projects` (click the table tab name to edit).
4. Set up these fields — delete any defaults and create these exactly:

| Field Name | Field Type       | Notes                                      |
|------------|------------------|--------------------------------------------|
| Name       | Single line text | This is the default first field — keep it |
| Owner      | Single select    | Options: `AJ`, `Johnet`, `Kat`             |
| Priority   | Single select    | Options: `High`, `Medium`, `Low`           |
| Status     | Single select    | Options: `Not Started`, `In Progress`, `At Risk`, `Complete` |
| DueDate    | Date             | Format: ISO (YYYY-MM-DD)                   |
| Notes      | Single line text |                                            |

5. **Get your Base ID:**
   - Open your base. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - The part starting with `app` is your **Base ID**. Copy it.

6. **Create a Personal Access Token:**
   - Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
   - Click **Create new token**
   - Name it `field-strategy-dashboard`
   - Scopes: add `data.records:read` and `data.records:write`
   - Access: add your `Field Strategy` base
   - Click **Create token** and copy it — you won't see it again!

---

## Step 2 — Push to GitHub

1. Go to [github.com](https://github.com) and create a free account (or log in).
2. Click **New repository** → name it `field-strategy-dashboard` → **Create repository**.
3. Upload the three files (`index.html`, `server.js`, `package.json`) using the **uploading an existing file** link on the repo page.
4. Click **Commit changes**.

---

## Step 3 — Deploy on Render

1. Go to [render.com](https://render.com) and create a free account (or log in with GitHub).
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select the `field-strategy-dashboard` repo.
4. Configure:
   - **Name:** `field-strategy-dashboard` (or whatever you like)
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Instance Type:** Free
5. Scroll down to **Environment Variables** and add:
   - `AIRTABLE_TOKEN` → paste your token from Step 1
   - `AIRTABLE_BASE_ID` → paste your Base ID from Step 1
6. Click **Create Web Service**.

Render will build and deploy — takes about 2 minutes. You'll get a URL like:
`https://field-strategy-dashboard.onrender.com`

**Share that URL with your team — that's it!**

---

## Making Updates Later

Whenever you want to update the dashboard (new features, design changes, etc.):
1. Edit the files in your GitHub repo (click the file → pencil icon to edit)
2. Commit the changes
3. Render auto-deploys within ~60 seconds

Or, share your GitHub repo link with whoever is helping you make changes — they can push updates directly.

---

## Notes

- **Free tier:** Render's free tier spins down after 15 min of inactivity. First load may take ~30 seconds to wake up. Upgrade to Starter ($7/mo) if you want it always-on.
- **Data lives in Airtable:** You can view and edit all your projects directly in Airtable as a spreadsheet anytime — it's fully in sync with the dashboard.
- **User access:** The app uses an honor system — each person selects their name from the top-right dropdown. There's no password login.
