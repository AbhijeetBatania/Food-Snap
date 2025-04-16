const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));

// Root route → redirect to index.html in client folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
