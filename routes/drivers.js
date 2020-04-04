/* eslint-disable no-undef */
let Driver = require("../models/drivers")
let Job = require("../models/jobs")
let express = require("express")
let router = express.Router()
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
let dotenv = require("dotenv")

dotenv.config()

router.findAll = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    Driver.find(function (err, drivers) {
        if (err) {
            res.send(err)
        } else if (drivers.length === 0) {
            res.json({
                message: "Driver doesn't exist"
            })
        } else {
            res.send(JSON.stringify(drivers, null, 5))
        }
    })
}

router.findOne = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    Driver.find({
        "_id": req.params.id
    }, function (err, drivers) {
        if (err) {
            res.status(404).send({
                message: "Driver not found",
                errmsg: err
            })
        } else if (drivers.length === 0) {
            res.json({
                message: "Driver doesn't exist"
            })
        } else {
            res.send(JSON.stringify(drivers, null, 5))
        }
    })
}

router.addDriver = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            let driver = new Driver({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                password: hash
            })
            driver.save(function (err) {
                if (err) {
                    res.json({
                        message: "Driver not added",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Driver added to database",
                        data: driver
                    })
                }
            })
        }
    })
}

router.login = (req, res) => {
    Driver.findOne({email: req.body.email}).then(driver => {
        if (driver.length < 1) {
            // Error 401: Unauthorised
            return res.status(401).send({
                message: "Authentication failed, Please ensure the email and password are correct",
                errmsg: err
            })
        }
        bcrypt.compare(req.body.password, driver.password, (err, result) => {
            if (err) {
                return res.status(401).send({
                    message: "Authentication failed, Please ensure the email and password are correct",
                    errmsg: err
                })
            }
            if (result) {
                const payload = {
                    _id: driver._id,
                    fname: driver.fname,
                    lname: driver.lname,
                    email: driver.email
                }

                const token = jwt.sign(payload, process.env.JWT_KEY, {
                    expiresIn: "1d"
                })

                return res.status(200).send({
                    message: "Successfully Authenticated",
                    token: token,
                    driver: payload
                })
            }
            res.status(401).send({
                message: "Authentication failed, Please ensure the email and password are correct",
                errmsg: err
            })
        })
    })
        .catch(err => {
            res.status(500).send({
                error: err
            })
        })
}

router.updateDriver = (req, res) => {
    Driver.findById(req.params.id, function (err, drivers) {
        if (err) {
            res.status(404).send({
                message: "Cannot find driver associated with that id"
            })
        } else {
            if (req.body.fname) {
                drivers.fname = req.body.fname
            }
            if (req.body.lname) {
                drivers.lname = req.body.lname
            }
            if (req.body.email) {
                drivers.email = req.body.email
            }

            drivers.save(function (err) {
                if (err) {
                    res.json({
                        message: "Driver not updated",
                        errmsg: err
                    })
                } else {
                    res.json({
                        message: "Driver updated successfully",
                        data: drivers
                    })
                }
            })
        }
    })
}

router.deleteDriver = (req, res) => {
    Driver.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.status(404).json({
                message: "Driver not deleted",
                errmsg: err
            })
        } else {
            Job.deleteMany({
                driverID: req.params.id
            }, function (err) {
                if (err) {
                    res.json(err)
                }
            })
            res.json({
                message: "Driver successfully deleted"
            })
        }
    })
}


module.exports = router
