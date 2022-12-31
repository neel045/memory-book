const multer = require("multer")
const handleAsync = require("./handleAsync")
const crypto = require("crypto")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")

class JsonResponse {
    constructor(statusCode) {
        this.statusCode = statusCode
    }

    success = (res, message, data) => {
        return res.status(this.statusCode).json({
            status: true,
            message,
            data,
        })
    }

    error = (res, message, data) => {
        return res.status(this.statusCode).json({
            status: false,
            message,
            data,
        })
    }
}

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else cb("only upload image", false)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})

const uploadPhoto = upload.single("photo")

const resizeUserPhoto = handleAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.body.photo = `user-${crypto.randomBytes(16).toString("hex")}-${new Date().getTime()}.jpeg`

    await sharp(req.file.buffer)
        .resize(180, 180)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/users/${req.body.photo}`)
    next()
})

const resizePostPhoto = handleAsync(async (req, res, next) => {
    if (!req.file) return next()

    req.body.photo = `post-${crypto.randomBytes(16).toString("hex")}-${new Date().getTime()}.jpeg`

    await sharp(req.file.buffer)
        .resize(500, 600, {
            fit: "contain",
            background: { r: 255, g: 255, b: 255 },
        })
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`public/img/posts/${req.body.photo}`)
    next()
})

const cratePublicDirectories = (rootDir) => {}

module.exports = { JsonResponse, uploadPhoto, resizeUserPhoto, resizePostPhoto }
