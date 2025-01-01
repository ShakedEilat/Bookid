const { ERROR_MESSAGES } = require('./consts');

const validateChildProfileInput = (data) => {
    if (!data.name) throw new Error(ERROR_MESSAGES.MISSING_NAME);
    if (!data.age || isNaN(data.age)) throw new Error(ERROR_MESSAGES.MISSING_AGE);
    if (!data.gender) throw new Error(ERROR_MESSAGES.MISSING_GENDER);
};

module.exports = { validateChildProfileInput };