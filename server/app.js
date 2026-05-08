const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const cookieParser = require('cookie-parser');

const app = express();

// Middlewares

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    const allowedOrigins = [
      'https://affiliated-tracking-system.vercel.app'
    ];

    if (process.env.CLIENT_URL) {
      allowedOrigins.push(process.env.CLIENT_URL);
    }

    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/authRoutes');
const affiliateRoutes = require('./routes/affiliateRoutes');
const trackingRoutes = require('./routes/trackingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

// Serve Static Files (Frontend)
const clientPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientPath));

app.use('/api/auth', authRoutes);
app.use('/api/affiliates', affiliateRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientPath, 'index.html'));
});

module.exports = app;
