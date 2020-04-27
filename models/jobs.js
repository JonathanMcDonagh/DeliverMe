let mongoose = require('mongoose');

// Job Schema
let DeliverMeSchema = new mongoose.Schema({
            name : String,
            deliveryRequest : String,
            place : String,
            deliveryFee : {
                type: Number,
                default: 0
            },
            dropOffLocation : String,
            dropOffTime: String,
            phoneNum: String,
            usertoken: String,
            profilephoto: String,
            jobStatus: String,
            jobMessage: String
    },
    { collection: 'jobs' });

module.exports = mongoose.model('Job', DeliverMeSchema);
