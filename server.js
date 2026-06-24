const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug endpoint — check env vars are loaded (safe, doesn't expose values)
app.get('/debug', (req, res) => {
  res.json({
    AIRTABLE_TOKEN_SET: !!process.env.AIRTABLE_TOKEN,
    AIRTABLE_BASE_ID_SET: !!process.env.AIRTABLE_BASE_ID,
    AIRTABLE_TOKEN_LENGTH: (process.env.AIRTABLE_TOKEN || '').length,
    AIRTABLE_BASE_ID: process.env.AIRTABLE_BASE_ID || 'NOT SET',
  });
});

// Serve the app — inject env vars so the frontend can use them
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  const inject = `<script>
    window.AIRTABLE_TOKEN   = "${process.env.AIRTABLE_TOKEN   || ''}";
    window.AIRTABLE_BASE_ID = "${process.env.AIRTABLE_BASE_ID || ''}";
  </script>`;

  html = html.replace('</head>', inject + '\n</head>');
  res.send(html);
});

app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Field Strategy Dashboard running on port ${PORT}`);
  console.log(`AIRTABLE_TOKEN set: ${!!process.env.AIRTABLE_TOKEN}`);
  console.log(`AIRTABLE_BASE_ID set: ${!!process.env.AIRTABLE_BASE_ID}`);
});
