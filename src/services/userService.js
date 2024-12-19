const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { ERROR_MESSAGES, STATUS_CODES } = require('../../utils/consts');

const generateAuthToken = (userId) => {
    const payload = { userId };
    return jwt.sign(payload, config.JWT_SECRET);
};

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(STATUS_CODES.UNAUTHORIZED).send({ error: ERROR_MESSAGES.AUTH_FAILED });  // 401 Error Handling
    }
};

module.exports = { generateAuthToken, authenticateUser };
