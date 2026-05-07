const express = require('express');
const router = express.Router();
const { handleConversion } = require('../controllers/webhookController');

router.post('/conversion', handleConversion);

module.exports = router;
