//DEPENDANCIES
var express          = require('express'),
    app              = express(),
    mongoose         = require('mongoose'),
    bodyParser       = require('body-parser'),
    accesslogModel   = require('./models/accesslog.js');
    


//SETUP
app.set('view engine', 'ejs');

//ALLOW EJS TEMPLATE TO USE PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));

//ENABLE TRUST PROXY TO LOG IPS
app.enable('trust proxy');

//USE BODYPARSER TO GRAB FORM DATA
app.use(bodyParser.urlencoded({extended: true}));

//CONNECT TO MONGO
mongoose.connect('mongodb://localhost:27017/nodeapp', {useNewUrlParser: true });

//MIDDLEWARE

function isRightIP(req, res, next) {
    
    var allowedIP = ['142.179.122.11', '142.179.122.11', '142.179.122.1', '142.179.122.12', '142.179.122.32', '142.179.122.15'];
    var IPIsAllowed = false;

    for (var i = 0; i < allowedIP.length; i++) {
        if (req.ip == allowedIP[i]) {
            IPIsAllowed = true;
            console.log('true');
            break;
        } else if(req.ip !== allowedIP[i]) {
            IPIsAllowed = false;
            console.log('false');
        }
    }
    
    if(IPIsAllowed == false) {
        console.log('ACCESS DENIED TO IP: ' + req.ip + ' ON ROUTE: ' + req.url);
        res.redirect('https://www.google.com');
    } else {
        console.log('ACCESS GRANTED TO IP: ' + req.ip + ' ON ROUTE: ' + req.url);
        next();
    }
}


//ROUTES
app.get('/', isRightIP, function(req, res) {
    res.render('index');
});

app.post('/', isRightIP, function(req, res) {
    var accesslogdata = new accesslogModel({
        IP: req.ip,
        Username: req.body.username
    });
    
    accesslogdata.save(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.send('YOU HAVE REACHED THE POST ROUTE! AND THE RECORD IS SAVED!');
        }
    });

});

app.get('/accesslogs', isRightIP, function(req, res) {
    accesslogModel.find({}, function(err, query) {
        if(err) {
            console.log(err);
        } else {
            res.render('accesslogs', {query: query});
        }
    });
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

