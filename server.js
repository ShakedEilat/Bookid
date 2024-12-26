const express = require('express');
const mongoose = require('mongoose');
const { json } = require('body-parser');
const  config  = require('./src/config/config');
const { ROUTES, RESPONSE_MESSAGES } = require('./utils/consts');
const cors = require('cors')

// Import Routes
const authRoutes = require('./src/routes/authRoutes');

const app = express();

app.use(cors())
// Middleware
app.use(json());