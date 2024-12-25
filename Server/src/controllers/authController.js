const User = require('../models/userModel');
const { generateAuthToken } = require('../services/userService');
const { ERROR_MESSAGES, RESPONSE_MESSAGES, STATUS_CODES } = require('../../utils/consts');

/**
 * @api {post} /register User Registration
 * @apiName Register
 * @apiGroup Authentication
 *
 * @apiDescription Registers a new user and returns a JWT token.
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {String} token JWT token
 *
 * @apiError {String} error Error message
 */
exports.register = async (req, res) => {
    try {
        // Get the email and password from the request body
        const { email, password } = req.body;

        // Create a new user with the given email and password
        const user = new User({ email, password });

        // Save the user to the database
        await user.save();

        // Generate a JWT token for the user
        const token = generateAuthToken(user._id);

        // Send a success response with the JWT token
        res.status(STATUS_CODES.CREATED).send({ message: RESPONSE_MESSAGES.SUCCESS, token });
    } catch (error) {
        // Log the error
        console.error(error);

        // Send an error response
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};

/**
 * @api {post} /login User Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiDescription Authenticates a user and returns a JWT token.
 *
 * @apiParam {String} email User's email
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} message Success message
 * @apiSuccess {String} token JWT token for authenticated user
 *
 * @apiError {Object} 400 Invalid credentials
 * @apiError {Object} 500 Internal server error
 */
exports.login = async (req, res) => {
    try {
        // Extract email and password from request body
        const { email, password } = req.body;

        // Attempt to find the user with matching email and password
        const user = await User.findOne({ email, password });

        // If no user is found, send a 400 response with an error message
        if (!user) {
            return res.status(STATUS_CODES.BAD_REQUEST).send({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });
        }

        // Generate JWT token for the authenticated user
        const token = generateAuthToken(user._id);

        // Send a success response with the token
        res.status(STATUS_CODES.SUCCESS).send({ message: RESPONSE_MESSAGES.SUCCESS, token });
    } catch (error) {
        // Log and send a 500 response if an exception occurs
        console.error(error);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};
