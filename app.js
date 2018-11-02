//DEPENDANCIES
var express = require('express'),
    app = express(),
    passport = require('passport'),
    flash = require('connect-flash'),
    localStrategy = require('passport-local').Strategy,
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    accesslogModel = require('./models/accesslog.js'),
    userModel = require('./models/user.js');




//SETUP

//SET THE VIEW ENGINE TO EJS
app.set('view engine', 'ejs');

//ALLOW EJS TEMPLATE TO USE PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));

//ENABLE TRUST PROXY TO LOG IPS
app.enable('trust proxy');

//USE BODYPARSER TO GRAB FORM DATA
app.use(bodyParser.urlencoded({
    extended: true
}));

//CONNECT TO MONGO
mongoose.connect('mongodb://localhost:27017/nodeapp', {
    useNewUrlParser: true
});

//MIDDLEWARES 

function isRightIP(req, res, next) {

    //HARD DEFINITIVE LIST
    var allowedIP = ['142.179.122.12', '142.179.122.11', '142.179.122.1', '142.179.122.100', '142.179.122.32', '142.179.122.15'];
    var IPIsAllowed = false;
    //MATCHING REGEX FOR LAN USAGE SO ALL IPS ARE NOT HARD CODED
    var regex = /192\.168\.1\.\d{1,3}/;

    for (var i = 0; i < allowedIP.length; i++) {
        if (req.ip == allowedIP[i] || req.ip.match(regex)) {
            IPIsAllowed = true;
            console.log('true');
            break;
        } else if (req.ip !== allowedIP[i]) {
            IPIsAllowed = false;
            console.log('false');
        }
    }

    if (IPIsAllowed == false) {
        console.log('ACCESS DENIED TO IP: ' + req.ip + ' ON ROUTE: ' + req.url);
        res.render('accessdenied');
    } else {
        console.log('ACCESS GRANTED TO IP: ' + req.ip + ' ON ROUTE: ' + req.url);
        next();
    }

}

//APPLY ISRIGHTIP MIDDLWARE TO ALL ROUTES
app.use('/', isRightIP);

//PASSPORT MIDDLEWARE SETUP

app.use(session({
    secret: 'vJ46Zs5KJNQH4vDjMDe6WKaZFhcba7A3Sp533HeG9Tw68stUv8ayEPCWh8UXQy9MVHATuRkMQQhDK59e',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(flash());

passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());



//ROUTES
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/', passport.authenticate('local', {
    successRedirect: '/success',
    failureRedirect: '/failure'
}), function(req, res) {

    var accesslogdata = new accesslogModel({
        IP: req.ip,
        Username: req.body.username
    });

    accesslogdata.save(function(err) {
        if (err) {
            console.log(err);
        } else {

            res.send('YOU HAVE REACHED THE POST ROUTE! AND THE RECORD IS SAVED!');
        }
    });


});

app.get('/accesslogs', function(req, res) {
    accesslogModel.find({}, function(err, query) {
        if (err) {
            console.log(err);
        } else {
            res.render('accesslogs', {
                query: query
            });
        }
    });
});

app.get('/register', function(req, res) {
    res.render('register');
});

app.post('/register', function(req, res) {
    var newUser = new userModel({
        username: req.body.username
    });

    userModel.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.send(err);
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/");
        });
    });
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

//KEEP UNDEFINED ROUTE AT THE BOTTOM TO NOT INTEFERE WITH VALID ROUTES!
app.get('*', function(req, res) {
    res.send('NOTHING TO SEE HERE :)');
});




//START SERVER
if (process.env.PORT == '8080') {
    app.listen(process.env.PORT, console.log('NODEAPP IS LISTENING ON PORT ' + process.env.PORT + '!'));
} else {
    app.listen('5004', console.log('NODEAPP IS LISTENING ON PORT 5004!'));
}