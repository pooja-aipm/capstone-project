const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically (optional for demo)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiRoutes);

// Base route test
app.get('/', (req, res) => {
    res.json({ message: 'Recruit-AI Backend Running' });
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
