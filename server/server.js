const app = require('./app');
const http = require('http');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5005;

const startServer = (port) => {
  const server = http.createServer(app);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is busy, trying port ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log(`\n✅ Server running on port ${port}`);
    console.log(`   API: http://localhost:${port}/api/auth/login\n`);
  });
};

connectDB().then(() => {
  startServer(PORT);
});
