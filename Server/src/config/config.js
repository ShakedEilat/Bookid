require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    DB_URI: process.env.DB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,  // Added JWT_SECRET here
};
