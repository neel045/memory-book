const { JsonResponse } = require("./helper")

module.exports = (err, req, res, next) => {
    let error = { ...err }
    error.name = err.name
    error.message = err.message

    console.log(error.name)

    return new JsonResponse(401).error(res, "invalid token")
}
