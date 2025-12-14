const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const db = require('./config/db'); // Import to trigger connection test

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Basic Route
app.get('/', (req, res) => {
    res.send('AI-Powered Automotive Intelligence Platform API Running');
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const carRoutes = require('./routes/carRoutes');
app.use('/api/cars', carRoutes);

const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

const manufacturerRoutes = require('./routes/manufacturerRoutes');
app.use('/api/manufacturer', manufacturerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    // Database connection is initialized in config/db.js when imported
    require('./config/db');
});
