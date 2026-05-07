const express = require('express');
const router = express.Router();
const { register, login, googleMockLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google-mock', googleMockLogin);

module.exports = router;
