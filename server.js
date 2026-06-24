const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the app — inject env vars so the frontend can use them
// without exposing them in a public JS file
app.get('/', (req, res) => {
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

  // Inject credentials as JS variables before the closing </head>
  const inject = `<script>
    window.AIRTABLE_TOKEN   = "${process.env.AIRTABLE_TOKEN   || ''}";
    window.AIRTABLE_BASE_ID = "${process.env.AIRTABLE_BASE_ID || ''}";
  </script>`;

  html = html.replace('</head>', inject + '\n</head>');
  res.send(html);
});

// Serve static assets if you ever add any
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Field Strategy Dashboard running on port ${PORT}`);
});
