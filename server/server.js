const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const app = require("./app")

// const DB = process.env.DB_URI.replace("<password>", process.env.DB_PASS)
const DB = process.env.DB_LOCAL_URI
mongoose.set("strictQuery", false)
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`server runnning at ${port}`)
})

process.on("unhandledRejection", (err) => {
    console.log(err.name, err.message)
    console.log("UNHANDLED REJECTION! Shutting Down...")
    server.close(() => {
        process.exit(1)
    })
})
