/* eslint-disable no-undef */
let express = require("express")
let router = express.Router()
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
let Admin = require("../models/admins")
let dotenv = require("dotenv")
dotenv.config()

// To add an admin
router.addAdmin = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err })
        } else {
            let admin = new Admin({
                email: req.body.email,
                password: hash
            })

            admin.save(function (err) {
                if (err) {
                    res.json({ message: "Admin not added", errmsg: err })
                } else {
                    res.json({ message: "Admin added to database", data: admin })
                }
            })
        }
    })
}

// To log an admin in
router.adminLogin = (req, res) => {
    Admin.findOne({email: req.body.email}).then(admin => {
        if (admin.length < 1) {
            return res.status(401).send({
                message: "Authentication failed, Please ensure the email and password are correct",
                errmsg: err
            })
        }
        bcrypt.compare(req.body.password, admin.password, (err, result) => {
            if (err) {
                return res.status(401).send({
                    message: "Authentication failed, Please ensure the email and password are correct",
                    errmsg: err
                })
            }

            if (result) {
                const payload = { _id: admin._id, email: admin.email }

                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" })

                return res.status(200).send({ message: "Successfully Authenticated, thank you", token: token, admin: payload
                })
            }

            res.status(401).send({ message: "Authentication failed, Please ensure the email and password are correct", errmsg: err
            })
        })
    })
        .catch(err => {
            res.status(500).send({ error: err })
        })
}

module.exports = router
