let mongoose = require('mongoose');

let DeliverMeSchema = new mongoose.Schema({
            name : String,
            deliveryRequest : String,
            place : String,
            deliveryFee : String,
            dropOffLocation : String,
            dropOffTime: String
    },
    { collection: 'jobs' });

module.exports = mongoose.model('Job', DeliverMeSchema);
