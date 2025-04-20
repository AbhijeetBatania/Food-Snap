// Define routes here
const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// When someone sends a POST request to /api/scan, call handleScan
router.post('/', scanController.handleScan);

module.exports = router;
