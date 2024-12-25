const ChildProfile = require('../models/childProfileModel');
const { extractDetails } = require('../services/openaiService');
const { validateChildProfileInput } = require('../../utils/validateInput');
const { ERROR_MESSAGES, RESPONSE_MESSAGES, STATUS_CODES } = require('../../utils/consts');

/**
 * @api {post} /child_profiles Create a new child profile
 * @apiName CreateChildProfile
 * @apiGroup Child Profiles
 *
 * @apiDescription Creates a new child profile.
 *
 * @apiParam {String} description A description of the child
 * @apiParam {Object} structuredDetails The structured details of the child
 * @apiParam {String} structuredDetails.name The name of the child
 * @apiParam {Number} structuredDetails.age The age of the child
 * @apiParam {String} structuredDetails.gender The gender of the child
 * @apiParam {String} structuredDetails.appearance The appearance of the child
 * @apiParam {String} structuredDetails.hobbies The hobbies of the child
 * @apiParam {String} structuredDetails.location The location of the child
 * @apiParam {String} structuredDetails.outfit The outfit of the child
 * @apiParam {String} structuredDetails.favoriteFood The favorite food of the child
 * @apiParam {String} structuredDetails.favoriteColor The favorite color of the child
 * @apiParam {String} structuredDetails.favoriteThingToDo The favorite thing to do of the child
 * @apiParam {String} structuredDetails.mostLovedCharacter The most loved character of the child
 * @apiParam {String} structuredDetails.additionalInfo Any additional information about the child
 *
 * @apiSuccess {Object} child The created child profile document
 * @apiSuccess {String} child.name The name of the child
 * @apiSuccess {Number} child.age The age of the child
 * @apiSuccess {String} child.gender The gender of the child
 * @apiSuccess {String} child.appearance The appearance of the child
 * @apiSuccess {String} child.hobbies The hobbies of the child
 * @apiSuccess {String} child.location The location of the child
 * @apiSuccess {String} child.outfit The outfit of the child
 * @apiSuccess {String} child.favoriteFood The favorite food of the child
 * @apiSuccess {String} child.favoriteColor The favorite color of the child
 * @apiSuccess {String} child.favoriteThingToDo The favorite thing to do of the child
 * @apiSuccess {String} child.mostLovedCharacter The most loved character of the child
 * @apiSuccess {String} child.additionalInfo Any additional information about the child
 *
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.createChildProfile = async (req, res) => {
    console.log('createChildProfile - Request received');
    try {
        const { description, structuredDetails } = req.body;

        // Validate input
        validateChildProfileInput(structuredDetails);

        // Combine extracted and structured details
        const childData = { ...structuredDetails, additionalInfo: description, userId: req.userId };

        console.log('createChildProfile - Creating new child profile...');
        // Save child profile
        const newChildProfile = new ChildProfile(childData);
        try {
            await newChildProfile.save();
            console.log(`createChildProfile - Saved new child profile with ID ${newChildProfile._id}`);
        } catch (error) {
            console.error('createChildProfile - Error saving new child profile:', error);
            throw error;
        }

        res.status(STATUS_CODES.CREATED).send({ message: RESPONSE_MESSAGES.SUCCESS, child: newChildProfile });
    } catch (error) {
        console.error(`createChildProfile - Caught an error: ${error}`);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};

/**
 * @api {get} /child_profiles Fetch all child profiles associated with a user
 * @apiName GetChildProfiles
 * @apiGroup Child Profiles
 *
 * @apiDescription Fetches all child profiles associated with the user.
 *
 * @apiSuccess {Object[]} children An array of child profile objects
 * @apiSuccess {Object} children.childProfile The child profile document
 * @apiSuccess {String} children.childProfile.name The name of the child
 * @apiSuccess {Number} children.childProfile.age The age of the child
 * @apiSuccess {String} children.childProfile.gender The gender of the child
 * @apiSuccess {String} children.childProfile.appearance The appearance of the child
 * @apiSuccess {String} children.childProfile.hobbies The hobbies of the child
 * @apiSuccess {String} children.childProfile.location The location of the child
 * @apiSuccess {String} children.childProfile.outfit The outfit of the child
 * @apiSuccess {String} children.childProfile.favoriteFood The favorite food of the child
 * @apiSuccess {String} children.childProfile.favoriteColor The favorite color of the child
 * @apiSuccess {String} children.childProfile.favoriteThingToDo The favorite thing to do of the child
 * @apiSuccess {String} children.childProfile.mostLovedCharacter The most loved character of the child
 * @apiSuccess {String} children.childProfile.additionalInfo Any additional information about the child
 *
 * @apiError {Object} 404 Child profile not found
 * @apiError {String} 404.error The error message
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.getChildProfile = async (req, res) => {
    console.log('getChildProfile - Request received');
    try {
        // Find all child profiles associated with the user
        const childProfile = await ChildProfile.find({ userId: req.userId });

        // If the child profile is not found, send a 404 response
        if (!childProfile) {
            console.log('getChildProfile - No child profiles found. Sending 404 response.');
            return res.status(STATUS_CODES.NOT_FOUND).send({ error: ERROR_MESSAGES.CHILD_PROFILE_NOT_FOUND });
        }

        // Send the retrieved child profiles with a 200 status code
        console.log('getChildProfile - Child profiles retrieved successfully. Returning response.');
        res.send({ children: childProfile });
    } catch (error) {
        // Log the error and send a 500 response if an exception occurs
        console.error(`getChildProfile - Caught an error: ${error}`);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};

//todo:add edut child profile routes

/**
 * @api {put} /child_profiles Edit a child profile
 * @apiName EditChildProfile
 * @apiGroup Child Profiles
 *
 * @apiDescription Edits an existing child profile.
 *
 * @apiParam {Object} structuredDetails The updated structured details of the child
 * @apiParam {String} structuredDetails.name The name of the child (optional)
 * @apiParam {Number} structuredDetails.age The age of the child (optional)
 * @apiParam {String} structuredDetails.gender The gender of the child (optional)
 * @apiParam {String} structuredDetails.appearance The appearance of the child (optional)
 * @apiParam {String} structuredDetails.hobbies The hobbies of the child (optional)
 * @apiParam {String} structuredDetails.location The location of the child (optional)
 * @apiParam {String} structuredDetails.outfit The outfit of the child (optional)
 * @apiParam {String} structuredDetails.favoriteFood The favorite food of the child (optional)
 * @apiParam {String} structuredDetails.favoriteColor The favorite color of the child (optional)
 * @apiParam {String} structuredDetails.favoriteThingToDo The favorite thing to do of the child (optional)
 * @apiParam {String} structuredDetails.mostLovedCharacter The most loved character of the child (optional)
 * @apiParam {String} structuredDetails.additionalInfo Any additional information about the child (optional)
 *
 * @apiSuccess {Object} child The updated child profile document
 * @apiSuccess {String} child.name The name of the child
 * @apiSuccess {Number} child.age The age of the child
 * @apiSuccess {String} child.gender The gender of the child
 * @apiSuccess {String} child.appearance The appearance of the child
 * @apiSuccess {String} child.hobbies The hobbies of the child
 * @apiSuccess {String} child.location The location of the child
 * @apiSuccess {String} child.outfit The outfit of the child
 * @apiSuccess {String} child.favoriteFood The favorite food of the child
 * @apiSuccess {String} child.favoriteColor The favorite color of the child
 * @apiSuccess {String} child.favoriteThingToDo The favorite thing to do of the child
 * @apiSuccess {String} child.mostLovedCharacter The most loved character of the child
 * @apiSuccess {String} child.additionalInfo Any additional information about the child
 *
 * @apiError {Object} 500 Server error
 * @apiError {String} 500.error The error message
 */
exports.editChildProfile = async (req, res) => {
    console.log('editChildProfile - Request received');
    try {
        // Find the child profile by ID
        const childProfileId = req.params.id;

        console.log('editChildProfile - Updating child profile...');
        try {
            const updatedChildProfile = await ChildProfile.findOneAndUpdate(
                { _id: childProfileId },
                { $set: req.body },
                { new: true }
            );

            if (!updatedChildProfile) {
                console.log('editChildProfile - No child profile found with the specified ID. Sending 404 response.');
                return res.status(STATUS_CODES.NOT_FOUND).send({ error: ERROR_MESSAGES.CHILD_PROFILE_NOT_FOUND });
            }
            // await existingChildProfile.save();
            console.log(`editChildProfile - Successfully updated child profile with ID ${childProfileId}`);
            res.send({ message: RESPONSE_MESSAGES.SUCCESS, child: updatedChildProfile });
    
        } catch (error) {
            console.error('editChildProfile - Error updating child profile:', error);
            throw error;
        }
    } catch (error) {
        console.error(`editChildProfile - Caught an error: ${error}`);
        res.status(STATUS_CODES.SERVER_ERROR).send({ error: ERROR_MESSAGES.ERROR });
    }
};