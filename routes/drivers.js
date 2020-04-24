/* eslint-disable no-undef */
let express = require("express")
let router = express.Router()
let bcrypt = require("bcryptjs")
let jwt = require("jsonwebtoken")
let Driver = require("../models/drivers")
let dotenv = require("dotenv")
dotenv.config()

// Find all drivers
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Driver.find(function(err, drivers) {
        if (err) {
            res.send(err);
        } else if (drivers.length === 0) {
            res.json({message: "No drivers can be found"})
        }
        else {
            res.send(drivers, null, 5);
        }
    });
};

// Find one driver
router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Driver.find({ "_id" : req.params.id },function(err, drivers) {
        if (err) {
            res.json({message: 'Driver NOT Found!', errmsg : err});
        } else if (drivers.length === 0) {
            res.json({message: "No drivers can be found"})
        }
        else {
            res.send(JSON.stringify(drivers, null, 5));
        }
    });
}

// To add a driver
router.addDriver = (req, res) => {
    res.setHeader("Content-Type", "application/json")

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: err })
        } else {
            let driver = new Driver({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                driverprofilepicture: req.body.driverprofilepicture,
                uploadURL: req.body.uploadURL,
                likes: req.body.likes,
                password: hash
            })

            driver.save(function (err) {
                if (err) {
                    res.json({ message: "Driver not added", errmsg : err })
                } else {
                    res.json({ message: "Driver added to database", data : driver })
                }
            })
        }
    })
}

// To log in a driver
router.login = (req, res) => {
    Driver.findOne({email: req.body.email}).then(driver => {
        if (driver.length < 1) {
            // If the driver is trying to login when driver length is 0
            return res.status(401).send({
                message: "Authentication failed",
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
            // If Login success
            if (result) {
                const payload = {
                    _id: driver._id,
                    fname: driver.fname,
                    lname: driver.lname,
                    email: driver.email,
                    driverprofilepicture: driver.driverprofilepicture,
                    uploadURL: driver.uploadURL,
                    likes: req.body.likes
                }
                // Json Web Token
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

//Add like to the driver
router.incrementLikes = (req, res) => {

    Driver.findById(req.params.id, function(err, driver) {
        if (err)
            res.json({ message: 'Item NOT Found!', errmsg : err } );
        else {
            driver.likes += 1;
            driver.save(function (err) {
                if (err)
                    res.json({ message: 'Driver NOT liked!', errmsg : err } );
                else
                    res.json({ message: 'Driver Successfully liked!', data: driver });
            });
        }
    });
};

//Add like to the driver
router.reduceLikes = (req, res) => {

    Driver.findById(req.params.id, function(err, driver) {
        if (err)
            res.json({ message: 'Item NOT Found!', errmsg : err } );
        else {
            driver.likes -= 1;
            driver.save(function (err) {
                if (err)
                    res.json({ message: 'Driver NOT disliked!', errmsg : err } );
                else
                    res.json({ message: 'Driver Successfully disliked!', data: driver });
            });
        }
    });
};

// To delete a driver
router.deleteDriver = (req, res) => {

    Driver.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Driver NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Driver Successfully Deleted!'});
    });
};

module.exports = router
