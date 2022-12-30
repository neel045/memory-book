const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        text: {
            type: String,
            trim: true,
            max: [250, "can't have more than 250 characters"],
        },

        photo: String,

        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        comments: [
            {
                text: String,
                postedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            },
        ],

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
)

const Post = mongoose.model("Post", userSchema)

module.exports = Post
