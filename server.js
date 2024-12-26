const express = require('express');
const mongoose = require('mongoose');
const { json } = require('body-parser');
const  config  = require('./src/config/config');
const { ROUTES, RESPONSE_MESSAGES } = require('./utils/consts');
// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const childProfileRoutes = require('./src/routes/childProfileRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const app = express();
// Middleware
app.use(json());
// Routes
app.use(ROUTES.AUTH, authRoutes);
app.use(ROUTES.CHILD_PROFILES, childProfileRoutes);
app.use(ROUTES.BOOKS, bookRoutes);
// Database Connection
mongoose
    .connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(RESPONSE_MESSAGES.SUCCESS))
    .catch((err) => console.error(err));
// Start Server
app.listen(config.PORT, () => console.log(`Server running on port ${config.PORT}`));