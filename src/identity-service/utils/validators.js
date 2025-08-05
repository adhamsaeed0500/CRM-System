const Joi = require('joi');

const validateRegisteration = (data) => {
    const schema = Joi.object({
        name:Joi.string().min(2).max(60).required(),
        email:Joi.email().required(),
        password:Joi.string().min(5).required(),
        role:Joi.string().required()
    });

    return schema.validate(data);
};