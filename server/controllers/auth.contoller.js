const User = require("../models/user.model")
const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")
const { signinValidator, signupValidator } = require("../utils/validtors")
const bcrypt = require("bcrypt")
const { sendVerificationEmail, sendResetPasswordEmail } = require("../utils/sendEmail")
const Joi = require("joi")
const passwordComplexity = require("joi-password-complexity")
const jwt = require("jsonwebtoken")
const Token = require("../models/token.model")

const createToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

module.exports.signup = handleAsync(async (req, res, next) => {
    const { error } = signupValidator(req.body)
    if (error) return new JsonResponse(400).error(res, error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return new JsonResponse(400).error(res, "user already exists")

    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    user = new User({ ...req.body, password: hashedPassword })
    await user.save()

    await sendVerificationEmail(user)

    return new JsonResponse(201).success(
        res,
        "An email has been sent to your registered account please verify"
    )
})

module.exports.verifyEmail = handleAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(400).error(res, "Invalid link")

    const token = await Token.findOne({ userId: user._id, token: req.params.token })
    if (!token) return new JsonResponse(400).error(res, "Invalid link")

    await User.findByIdAndUpdate(user._id, { verified: true })
    await token.remove()
    return new JsonResponse(201).success(res, "Your account has been verified")
})

module.exports.signin = handleAsync(async (req, res, next) => {
    const { error } = signinValidator(req.body)
    if (error) return new JsonResponse(400).error(res, error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
        .populate("following", "_id name photo")
        .populate("followers", "_id name photo")
        .exec()

    if (!user) return new JsonResponse(404).error(res, "invalid user credentials")

    if (!user.verified) {
        await sendVerificationEmail(user)
        return new JsonResponse(201).error(
            res,
            "your email is not verifed, An email has been sent to your registered account please verify"
        )
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password)
    if (!isMatched) return new JsonResponse(404).error(res, "invalid user credentials")

    const token = createToken(user)
    const { name, photo, about, email, _id, following, followers, active, createdAt } = user

    return new JsonResponse(200).success(res, "Sign in successful", {
        user: { name, photo, about, email, _id, following, followers, active, token, createdAt },
    })
})

module.exports.changePassword = handleAsync(async (req, res, next) => {
    const schema = Joi.object({
        password: Joi.string().required().label("password"),
        newPassword: passwordComplexity().required().label("New password"),
    })

    const { error } = schema.validate(req.body)
    if (error) return new JsonResponse(400).error(res, error.details[0].message)

    const user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(400).error(res, "invalid user credentials")

    const isMatched = await bcrypt.compare(req.body.password, user.password)
    if (!isMatched) return new JsonResponse(400).error(res, "invalid user password")

    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)

    await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    return new JsonResponse(200).success(res, "password changed successfully")
})

module.exports.forgetPassword = handleAsync(async (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
    })

    const { error } = schema.validate(req.body)
    if (error) return new JsonResponse(400).error(res, error.details[0].message)

    const user = await User.findOne({ email: req.body.email })
    if (!user) return new JsonResponse(404).error(res, "user does not exsists")

    await sendResetPasswordEmail(user)

    return new JsonResponse(200).success(
        res,
        "password reset token has been sent to your registered Email account"
    )
})

module.exports.verifyResetPasswordToken = handleAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(404).error(res, "user does not exsists")

    const token = await Token.findOne({ userId: user._id, token: req.params.token })
    if (!token) return new JsonResponse(400).error(res, "Invalid link")

    await User.findByIdAndUpdate(user._id, { verified: true })

    return new JsonResponse(201).success(res, "valid link")
})

module.exports.resetPassword = handleAsync(async (req, res, next) => {
    const schema = Joi.object({
        password: passwordComplexity().required().label("password"),
    })

    const { error } = schema.validate(req.body)
    if (error) return new JsonResponse(400).error(res, error.details[0].message)

    let user = await User.findById(req.params.userId)
    if (!user) return new JsonResponse(404).error(res, "user does not exsists")

    const token = await Token.findOne({ userId: user._id, token: req.params.token })
    if (!token) return new JsonResponse(400).error(res, "Invalid link")

    token.remove()

    const salt = await bcrypt.genSalt(Number(process.env.SALT))
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    await User.findByIdAndUpdate(user._id, { password: hashedPassword }, { returnOriginal: false })

    return new JsonResponse(201).success(res, "password changed successfully")
})
