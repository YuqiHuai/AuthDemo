const Joi = require('@hapi/joi');


const registerValidation = () => {
    const schema = Joi.object({
        name: Joi.string().required().min(6),
        email: Joi.string().email().min(6).required(),
        password: Joi.string().min(6).required()
    });
    return schema;
}

module.exports.registerValidation = registerValidation;

const loginValidation = () => {
    const schema = Joi.object({
        email: Joi.string().min(6).email().required(),
        password: Joi.string().min(6).required()
    })
    return schema;
};

module.exports.loginValidation = loginValidation;