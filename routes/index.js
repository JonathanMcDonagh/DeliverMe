var express = require('express');
var router = express.Router();

/* GET home page for backend */
router.get('/', function(req, res) {
  res.render('index', { title: 'Deliver' });
});

module.exports = router;
