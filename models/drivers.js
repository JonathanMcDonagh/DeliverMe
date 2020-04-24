let mongoose = require("mongoose")

// Driver Schema
let DriverSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    driverprofilepicture: {
        type: String,
        required: true
    },
    uploadURL: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    collection: "drivers"
})

mongoose.set("useCreateIndex", true)

module.exports = mongoose.model("Driver", DriverSchema)
