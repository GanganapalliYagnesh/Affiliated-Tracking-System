const User = require('../models/User');
const Affiliate = require('../models/Affiliate');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const user = await User.create({ name, email, mobile, password, role });
    
    if (user.role === 'affiliate') {
      const affiliateCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      await Affiliate.create({ user_id: user._id, affiliate_code: affiliateCode });
    }

    res.status(201).json({ message: 'User registered successfully', user: { id: user._id, name, email, role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    let affiliateData = null;
    if (user.role === 'affiliate') {
      affiliateData = await Affiliate.findOne({ user_id: user._id });
    }

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, affiliate_code: affiliateData?.affiliate_code } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.googleMockLogin = async (req, res) => {
  try {
    const email = 'google@example.com';
    let user = await User.findOne({ email });

    if (!user) {
      // Create mock google user
      const mockPassword = crypto.randomBytes(8).toString('hex');
      user = await User.create({ name: 'Google User', email, mobile: '1234567890', password: mockPassword, role: 'affiliate' });
      const affiliateCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      await Affiliate.create({ user_id: user._id, affiliate_code: affiliateCode, status: 'approved' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    let affiliateData = null;
    if (user.role === 'affiliate') {
      affiliateData = await Affiliate.findOne({ user_id: user._id });
    }

    res.json({ 
      token, 
      user: { id: user._id, name: user.name, email: user.email, role: user.role, affiliate_code: affiliateData?.affiliate_code } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
