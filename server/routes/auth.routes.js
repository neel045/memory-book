const express = require("express")
const authContoller = require("../controllers/auth.contoller")
const { uploadPhoto, resizeUserPhoto } = require("../utils/helper")
const { requireSignedIn } = require("../middlewares/auth")

const router = express.Router()

router.route("/signup").post(uploadPhoto, resizeUserPhoto, authContoller.signup)
router.route("/signin").post(authContoller.signin)
router.route("/:userId/verify-email/:token").get(authContoller.verifyEmail)

router.route("/:userId/change-password").post(requireSignedIn, authContoller.changePassword)

router.route("/forget-password").post(authContoller.forgetPassword)
router
    .route("/:userId/reset-password/:token")
    .get(authContoller.verifyResetPasswordToken)
    .post(authContoller.resetPassword)

module.exports = router
