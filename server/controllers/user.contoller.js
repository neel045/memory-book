const handleAsync = require("../utils/handleAsync")
const { JsonResponse } = require("../utils/helper")
const User = require("../models/user.model")
const { userUpdateValidator } = require("../utils/validtors")

module.exports.getUser = handleAsync(async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findById(userId)
        .select("-password")
        .populate("following", "_id name photo")
        .populate("followers", "_id name photo")
        .exec()

    if (!user) return new JsonResponse(404).error(res, "user does not exsists")

    return new JsonResponse(200).success(res, "user found", {
        user,
    })
})

module.exports.updateUser = handleAsync(async (req, res, next) => {
    const { userId } = req.params

    if (userId != req.user.id)
        return new JsonResponse(401).error(res, "You are not allowed to do this")

    const { error } = userUpdateValidator(req.body)
    if (error) return new JsonResponse(200).error(res, "user not found", { error })

    const { name: newName, about: newBio, photo: newPhoto } = req.body

    let user = await User.findById(req.user._id)

    if (!user) return new JsonResponse(200).error(res, "user not found")

    user = await User.findByIdAndUpdate(
        req.user._id,
        { name: newName, about: newBio, photo: newPhoto },
        { returnOriginal: false }
    )
        .select("-password")
        .populate("following", "_id name photo")
        .populate("followers", "_id name photo")
        .exec()

    return new JsonResponse(202).success(res, "user updated succesfully", {
        user,
    })
})

module.exports.deleteUser = handleAsync(async (req, res, next) => {
    const { userId } = req.params
    const user = await User.findByIdAndDelete(userId, { returnOriginal: true })
    if (!user) return new JsonResponse(404).error(res, "user does not exsists")

    const { name, email, _id } = user

    return new JsonResponse(200).success(res, "user deleted succesfully", {
        user: { name, email, _id },
    })
})

module.exports.followUnfollow = handleAsync(async (req, res, next) => {
    const userIdToFollowUnfollow = req.params.userId
    let { user } = req

    let userToFollowUnfollow = await User.findById(userIdToFollowUnfollow)

    if (!userIdToFollowUnfollow) return new JsonResponse(404).error(res, "user not found")

    let updateUser, updateUserToFollowUnfollow

    if (
        !user.following.includes(userToFollowUnfollow._id) &&
        !userToFollowUnfollow.followers.includes(user._id)
    ) {
        updateUser = {
            $push: { following: userToFollowUnfollow._id },
        }
        updateUserToFollowUnfollow = {
            $push: { followers: user._id },
        }
    }

    if (
        user.following.includes(userToFollowUnfollow._id) &&
        userToFollowUnfollow.followers.includes(user._id)
    ) {
        updateUser = {
            $pull: { following: userToFollowUnfollow._id },
        }

        updateUserToFollowUnfollow = {
            $pull: { followers: user._id },
        }
    }

    user = await User.findByIdAndUpdate(user._id, updateUser, { new: true })
        .populate("following", "_id name photo")
        .populate("followers", "_id name photo")
        .exec()

    userToFollowUnfollow = await User.findByIdAndUpdate(
        userToFollowUnfollow._id,
        updateUserToFollowUnfollow,
        { new: true }
    )
        .select("-password")
        .populate("following", "_id name photo")
        .populate("followers", "_id name photo")
        .exec()

    return new JsonResponse(200).success(res, "user deleted succesfully", {
        user,
    })
})

module.exports.searchAccount = handleAsync(async (req, res, next) => {
    const { name } = req.query
    if (!name) return new JsonResponse(400).error(res, "please Provide search name")

    const users = await User.find({ name: { $regex: new RegExp(name, "i") } }).select("-password")

    return new JsonResponse(201).success(res, "success", { users })
})
