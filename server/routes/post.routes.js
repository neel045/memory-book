const express = require("express")

const router = express.Router()

const postController = require("../controllers/post.contoller")
const { requireSignedIn } = require("../middlewares/auth")
const { uploadPhoto, resizePostPhoto } = require("../utils/helper")

router.use(requireSignedIn)
router.route("/new/:userId").post(uploadPhoto, resizePostPhoto, postController.createPost)
router.route("/by/:userId").get(postController.listByUser)
router.route("/feed/:userId").get(postController.getFeed)

router.route("/likes").put(postController.updateLikes)

router.route("/add-comment").put(postController.addComment)
router.route("/delete-comment").put(postController.deleteComment)

router.route("/:postId").get(postController.getPost).delete(postController.deletePost)

module.exports = router
