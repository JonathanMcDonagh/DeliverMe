let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index');
let app = express();
const jobs = require("./routes/jobs");
const drivers = require("./routes/drivers");
const admins = require("./routes/admins");

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
// GET
app.get('/jobs', jobs.getAll);
app.get('/jobs/user/:usertoken', jobs.findAll); //Find all jobs
app.get('/jobs/driver/:jobStatus', jobs.findAllByJobStatus); //Find all jobs
app.get('/jobs/:id', jobs.findOne);

// POST
app.post('/jobs', jobs.addJob); //Adds job

// PUT
app.put('/jobs/:id/update', jobs.updateJob); //Updates job

// DELETE
app.delete('/jobs/:id', jobs.deleteJob); //Deletes job


// routes for drivers
// GET
app.get("/drivers", drivers.findAll);
app.get("/driver/:email", drivers.findOne);
app.get("/driver/account/:email", drivers.findOneByEmail);

// POST
app.post("/drivers/register", drivers.addDriver);
app.post("/drivers/login", drivers.login);

// PUT
app.put('/driver/:id/like', drivers.incrementLikes); //Adds like to item
app.put('/driver/:id/dislike', drivers.reduceLikes); //Adds like to item

// DELETE
app.delete("/drivers/:id", drivers.deleteDriver);


// routes for admin
// POST
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
