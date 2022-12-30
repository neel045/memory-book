const handleAsync = require("../utils/handleAsync")
const jwt = require("jsonwebtoken")
const { JsonResponse } = require("../utils/helper")
const User = require("../models/user.model")

module.exports.requireSignedIn = handleAsync(async (req, res, next) => {
    if (!req.headers.authorization) {
        return new JsonResponse(401).error(res, "Not authorized")
    }
    const token = req.headers.authorization.split(" ")[1]
    const { id } = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(id).select({ password: 0 })
    if (!user) return new JsonResponse(401).error(res, "User not found")

    req.user = user
    req.user.id = id
    next()
})
