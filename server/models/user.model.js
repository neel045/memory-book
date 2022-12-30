const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },

        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, "enter password"],
        },

        about: String,

        photo: {
            type: String,
            default: "default.jpg",
        },

        following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        verified: {
            type: Boolean,
            default: false,
        },

        active: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User
