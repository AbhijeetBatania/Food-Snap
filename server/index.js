const express = require('express');
const app = express();
const port = 5000;

// Middleware for JSON
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, this is the Smart Product Scanner API!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
