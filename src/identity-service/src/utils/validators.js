const Joi = require('joi');

const validateRegistration = (data) => {
    const schema = Joi.object({
        name:Joi.string().min(2).max(60).required(),
        email:Joi.email().required(),
        password:Joi.string().min(5).required(),
    });

    return schema.validate(data);
};

const validateRegistrationByAdmin = (data) => {
    const schema = Joi.object({
        name:Joi.string().min(2).max(60).required(),
        email:Joi.email().required(),
        password:Joi.string().min(5).required(),
        role:Joi.string().required()
    });

    return schema.validate(data);
};

module.exports = { validateRegistration };