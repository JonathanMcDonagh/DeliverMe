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
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Job.find(function(err, jobs) {
        if (err)
            res.send(err);
        else
            res.send(jobs,null,5);
    });
};


//Find one by ID
router.findById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Job.find({ "_id" : req.params.id },function(err, job) {
        if (err)
            res.json({ message: 'Job NOT Found!', errmsg : err } );
        else
            res.send(job,null,5);
    });
};

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

    job.save(function(err) {
        if (err)
            res.json({ message: 'Job NOT Added!', errmsg : err });
        else
            res.json({ message: 'Job Successfully Added!', data: job });
    });
};


//Updates job
router.updateJob = (req, res) => {

    Job.findById(req.params.id, function(err,job) {
        if (err)
            res.json({ message: 'Job NOT Found!', errmsg : err } );
        else {
            job.name = req.body.name;
            job.deliveryRequest = req.body.deliveryRequest;
            job.place = req.body.place;
            job.deliveryFee = req.body.deliveryFee;
            job.dropOffLocation = req.body.dropOffLocation;
            job.dropOffTime = req.body.dropOffTime;
            job.phoneNum = req.body.phoneNum;
            job.usertoken = req.body.usertoken;

            job.save(function (err) {
                if (err)
                    res.json({ message: 'Job NOT updated!', errmsg : err } );
                else
                    res.json({ message: 'Job Successfully updated!', data: job });
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

router.fetchJobsByUser = (req, res) => {
    Job.findById(req.params.usertoken, function (err) {
        if (err) {
            res.status(404).json({
                message: "Job not found by id",
                errmsg: err
            })
        } else {
            Job.find({
                usertoken: req.params.usertoken
            }, function (err, jobs) {
                if (err) {
                    res.json(err)
                } else if (jobs.length > 0) {
                    res.json(jobs)
                } else {
                    res.json({
                        message: "No jobs associated with this user"
                    })
                }
            })
        }
    })
}




module.exports = router;
