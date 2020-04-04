let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let uriUtil = require('mongodb-uri');
let Job = require('../models/jobs');
let Fuse = require('fuse.js');

var mongodbUri = 'mongodb+srv://jonathanmcdonagh:20074520@web-app-cluster-uct5k.mongodb.net/delivermedb?retryWrites=true&w=majority';

// noinspection JSIgnoredPromiseFromCall
mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to connect to [ ' + db.name + ' ]', err);
});
db.once('open', function () {
    console.log('Successfully connected to DeliverMe Database as ' + db.name);
});

//Find all
router.getAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Job.find(function(err, jobs) {
        if (err)
            res.send(err);
        else
            res.send(jobs,null,5);
    });
};

//Find all
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Job.find({ "usertoken" : req.params.usertoken },function(err, jobs) {
        if (err)
            res.send(err);
        else
            res.send(JSON.stringify(jobs,null,5));
    });
};


router.findOne = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Job.find({ "_id" : req.params.id },function(err, job) {
        if (err)
            res.json({ message: 'Job NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(job,null,5));
    });
}

//Add an job
router.addJob = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var job = new Job();
    job.name = req.body.name;
    job.deliveryRequest = req.body.deliveryRequest;
    job.place = req.body.place;
    job.deliveryFee = req.body.deliveryFee;
    job.dropOffLocation = req.body.dropOffLocation;
    job.dropOffTime = req.body.dropOffTime;
    job.phoneNum = req.body.phoneNum;
    job.usertoken = req.body.usertoken;
    job.profilephoto = req.body.profilephoto;

    job.save(function(err) {
        if (err)
            res.json({ message: 'Job NOT Added!', errmsg : err });
        else
            res.json({ message: 'Job Successfully Added!', data: job });
    });
};


//Updates job
router.updateJob = (req, res) => {

    Job.findById(req.params.id, function (err, jobs) {
        if (err)
            res.json({
                message: 'Job NOT Found!',
                errmsg : err
            });
        else {
            if (req.body.name) {
                jobs.name = req.body.name
            }
            if (req.body.deliveryRequest) {
                jobs.deliveryRequest = req.body.deliveryRequest
            }
            if (req.body.place) {
                jobs.place = req.body.place
            }
            if (req.body.deliveryFee) {
                jobs.deliveryFee = req.body.deliveryFee
            }
            if (req.body.dropOffLocation) {
                jobs.dropOffLocation = req.body.dropOffLocation
            }
            if (req.body.dropOffTime) {
                jobs.dropOffTime = req.body.dropOffTime
            }
            if (req.body.usertoken) {
                jobs.usertoken = req.body.usertoken
            }
            if (req.body.profilephoto) {
                jobs.profilephoto = req.body.profilephoto
            }

            jobs.save(function (err) {
                if (err)
                    res.json({ message: 'Job NOT updated!', errmsg : err } );
                else
                    res.json({ message: 'Job Successfully updated!', data: jobs });
            });
        }
    });
};

//Deletes Job
router.deleteJob = (req, res) => {

    Job.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Job NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Job Successfully Deleted!'});
    });
};

module.exports = router;
