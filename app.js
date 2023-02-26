var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const monogoose = require('mongoose')


var indexRouter = require('./routes/index');
const config = require('./config/index');
const passport = require('passport');

const MonitorRouter = require('./routes/monitor')
const userController =require('./routes/users')
const staffController =require('./routes/staff')

const errorHandle = require('./middleware/errorHandle')

var cors = require('cors')

var app = express();
monogoose.connect(config.MONGODB_URI,{useNewUrlParser: true, useUnifiedTopology: true})
app.use(cors())
app.use(logger('dev'));
app.use(express.json({
    limit:'50mb'
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());

app.use('/', indexRouter);

app.use('/user',userController)
app.use('/login',userController)
app.use('/delete',userController)
app.use('/monitor',MonitorRouter);
app.use('/staff',staffController)

app.use(errorHandle);


module.exports = app;
