const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

const userRoutes = require("./routes/user.routes")
const postRoutes = require("./routes/post.routes")
const authRoutes = require("./routes/auth.routes")

const app = express()

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)

app.all("*", (req, res) => {
    res.status(404).json({ message: "Not Found" })
})

// app.use(errorHandler)

module.exports = app
