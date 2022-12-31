const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")

module.exports.signupValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).trim().required().label("Name"),
        email: Joi.string().email().trim().lowercase().required().label("Email"),
        password: passwordComplexity().required().label("password"),
        photo: Joi.string(),
        about: Joi.string().max(250).trim().label("About"),
    })

    return schema.validate(data)
}

module.exports.signinValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().trim().required().label("Email"),
        password: Joi.string().required().label("password"),
    })

    return schema.validate(data)
}

module.exports.userUpdateValidator = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).trim().label("Name"),
        photo: Joi.string().label("photo"),
        about: Joi.string()
            .allow(...["", null])
            .label("about"),
    })

    return schema.validate(data)
}
