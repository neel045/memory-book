const Post = require("../models/post.model")
const User = require("../models/user.model")
const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")

module.exports.createPost = handleAsync(async (req, res, next) => {
    const { text, photo } = req.body

    let post = await new Post({
        text,
        photo,
        postedBy: req.params.userId,
    }).save()

    await Post.populate(post, { path: "postedBy", select: "_id name photo" })
    await Post.populate(post, { path: "comments.postedBy", select: "_id name photo" })

    return new JsonResponse(201).success(res, "Post created", { post })
})

module.exports.listByUser = handleAsync(async (req, res, next) => {
    const { userId } = req.params
    let posts = await Post.find({ postedBy: userId })
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .sort("-createdAt")
        .exec()

    if (!posts) return new JsonResponse(404).error(res, "there are not post", { posts: null })

    return new JsonResponse(200).success(res, "", { posts })
})

module.exports.getFeed = handleAsync(async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId)
    let { following } = user
    following.push(userId)

    let posts = await Post.find({ postedBy: { $in: following } })
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .sort("-createdAt")
        .exec()

    if (!posts) return new JsonResponse(404).error(res, "there are not post", { posts: null })

    return new JsonResponse(200).success(res, "", { posts })
})

module.exports.updateLikes = handleAsync(async (req, res, next) => {
    const userId = req.user._id

    let post = await Post.findById(req.body.postId)

    if (!post) return new JsonResponse(404).error(res, "there are not post")

    if (!post.likes.includes(userId)) {
        post = await Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: userId } },
            { new: true }
        )
            .populate("comments.postedBy", "_id name photo")
            .populate("postedBy", "_id name photo")
            .exec()
    } else {
        post = await Post.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: userId } },
            { new: true }
        )
            .populate("comments.postedBy", "_id name photo")
            .populate("postedBy", "_id name photo")
            .exec()
    }

    return new JsonResponse(200).success(res, "", { post })
})

module.exports.addComment = handleAsync(async (req, res, next) => {
    const { comment } = req.body
    comment.postedBy = req.user._id

    let post = await Post.findById(req.body.postId)
    if (!post) return new JsonResponse(404).error(res, "there are not post", { post: null })

    post = await Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .exec()

    return new JsonResponse(200).success(res, "updated successfully", { post })
})

module.exports.deleteComment = handleAsync(async (req, res, next) => {
    const { comment } = req.body

    if (req.user.id !== req.body.comment.postedBy._id) {
        return new JsonResponse(401).error(res, "you are not allowed to delete the comment")
    }

    let post = await Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .exec()

    return new JsonResponse(200).success(res, "", { post })
})

module.exports.getPost = handleAsync(async (req, res, next) => {
    const { postId } = req.params
    let post = await Post.findById(postId)
        .populate("comments.postedBy", "_id name photo")
        .populate("postedBy", "_id name photo")
        .exec()

    if (!post) return new JsonResponse(404).error(res, "there are not post", { post: null })

    return new JsonResponse(200).success(res, "", { post })
})

module.exports.deletePost = handleAsync(async (req, res, next) => {
    const { postId } = req.params

    let post = await Post.findOneAndDelete(
        { _id: postId, postedBy: req.user._id },
        { returnOriginal: true }
    )
    if (!post) return new JsonResponse(404).error(res, "there are not post")

    return new JsonResponse(200).success(res, "", { post })
})
