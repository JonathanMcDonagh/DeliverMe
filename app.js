var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
const jobs = require("./routes/jobs");
const drivers = require("./routes/drivers");


const cors = require("cors");


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);


//Custom Routes
//Student Details
app.get('/student', function (req, res) {
    res.send('STUDENT DETAILS - \n' +
        'Name: Jonathan McDonagh \n' +
        'Student ID: 20074520 \n' +
        'Final Year Project: DeliverMe');
});

//(Jobs)
//GET
app.get('/jobs', jobs.findAll); //Find all jobs
app.get('/jobs/:id', jobs.findById); //Find by ID

//POST (jobs)
app.post('/jobs',jobs.addJob); //Adds job

//PUT (jobs)
app.put('/job/:id/update', jobs.updateJob); //Updates job

//Delete (jobs)
app.delete('/jobs/:id', jobs.deleteJob); //Deletes job


//(Drivers)
//GET
app.get("/drivers", drivers.findAll)
app.get("/drivers/:id/jobs", drivers.findJobsAssociatedWithDriver)
app.get("/drivers/:id", drivers.findOne)
//POST
app.post("/drivers/register", drivers.addDriver)
app.post("/drivers/login", drivers.login)
//PUT
app.put("/drivers/:id/update", drivers.updateDriver)
//DELETE
app.delete("/drivers/:id", drivers.deleteDriver)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
