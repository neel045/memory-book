const { JsonResponse } = require("./helper")

module.exports = (err, req, res, next) => {
    let error = { ...err }
    error.name = err.name
    error.message = err.message

    if (process.env.ENV === "production") {
        return new JsonResponse(500).error(res, "Internal Server Error")
    } else {
        return new JsonResponse(401).error(res, err.message, { error: error.stacktrace })
    }
}
