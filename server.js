const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Title cache so we don't re-fetch the same URL repeatedly
const titleCache = {};

// Fetch page title server-side (bypasses browser CORS restrictions)
app.get('/fetch-title', (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith('https://')) return res.json({ title: null });
  if (titleCache[url]) return res.json({ title: titleCache[url] });

  try {
    const reqUrl = new URL(url);
    https.get({ hostname: reqUrl.hostname, path: reqUrl.pathname + reqUrl.search, headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; if (data.length > 50000) response.destroy(); });
      response.on('end', () => {
        const match = data.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = match ? match[1].replace(/ - Google (Docs|Sheets|Slides|Drive)$/i, '').trim() : null;
        if (title) titleCache[url] = title;
        res.json({ title });
      });
      response.on('error', () => res.json({ title: null }));
    }).on('error', () => res.json({ title: null }));
  } catch(e) {
    res.json({ title: null });
  }
});

// Debug endpoint
app.get('/debug', (req, res) => {
  res.json({
    AIRTABLE_TOKEN_SET: !!process.env.AIRTABLE_TOKEN,
    AIRTABLE_BASE_ID_SET: !!process.env.AIRTABLE_BASE_ID,
    AIRTABLE_TOKEN_LENGTH: (process.env.AIRTABLE_TOKEN || '').length,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'NOT SET',
  });
});

// Serve the app — inject env vars
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const token  = JSON.stringify(process.env.AIRTABLE_TOKEN   || '');
  const baseId = JSON.stringify(process.env.AIRTABLE_BASE_ID || '');
  const inject = `<script>
    window.AIRTABLE_TOKEN   = ${token};
    window.AIRTABLE_BASE_ID = ${baseId};
  </script>`;
  html = html.replace('</head>', inject + '\n</head>');
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Field Strategy Dashboard running on port ${PORT}`);
  console.log(`AIRTABLE_TOKEN set: ${!!process.env.AIRTABLE_TOKEN}`);
  console.log(`AIRTABLE_BASE_ID set: ${!!process.env.AIRTABLE_BASE_ID}`);
});
