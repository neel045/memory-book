const express = require("express")

const router = express.Router()
const usersController = require("../controllers/user.contoller")
const { requireSignedIn } = require("../middlewares/auth")
const { uploadPhoto, resizeUserPhoto } = require("../utils/helper")

router.use(requireSignedIn)

router.route("/search-user").get(usersController.searchAccount)

router
    .route("/:userId")
    .get(usersController.getUser)
    .delete(usersController.deleteUser)
    .patch(uploadPhoto, resizeUserPhoto, usersController.updateUser)

router.route("/follow-unfollow/:userId").patch(usersController.followUnfollow)

module.exports = router
