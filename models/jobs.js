let mongoose = require('mongoose');

// Job Schema
let DeliverMeSchema = new mongoose.Schema({
            name : String,
            deliveryRequest : String,
            place : String,
            deliveryFee : String,
            dropOffLocation : String,
            dropOffTime: String,
            phoneNum: String,
            usertoken: String,
            profilephoto: String
    },
    { collection: 'jobs' });

module.exports = mongoose.model('Job', DeliverMeSchema);
