// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const matterRoutes = require('./routes/matterRoutes');
const initializeServer = require('./utils/initializeServer');
const path = require('path');

// Initialize app and middleware
const app = express();
app.use(express.json());

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/matterDB';
mongoose.connect(mongoURI);

// On server start, load solid matters and clean up database
initializeServer();

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Routes
app.use('/matter', matterRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
