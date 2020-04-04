var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var app = express();
const jobs = require("./routes/jobs");
const drivers = require("./routes/drivers");
const admins = require("./routes/admins")

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
// routes for jobs
app.get('/jobs', jobs.getAll);
app.get('/jobs/user/:usertoken', jobs.findAll); //Find all jobs
app.get('/jobs/:id', jobs.findOne);

app.post('/jobs', jobs.addJob); //Adds job

app.put('/jobs/:id/update', jobs.updateJob); //Updates job

app.delete('/jobs/:id', jobs.deleteJob); //Deletes job

// routes for drivers
app.get("/drivers", drivers.findAll);
app.get("/drivers/:id", drivers.findOne);

app.post("/drivers/register", drivers.addDriver);
app.post("/drivers/login", drivers.login);

app.put("/drivers/:id/update", drivers.updateDriver);

app.delete("/drivers/:id", drivers.deleteDriver);

// routes for admin
app.post("/admins/login", admins.adminLogin);
app.post("/admins/register", admins.addAdmin);

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
