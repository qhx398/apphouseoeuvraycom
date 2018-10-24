//DEPENDANCIES
var express = require('express'),
    app = express();


//SETUP
app.set('view engine', 'ejs');
//ALLOW EJS TEMPLATE TO USE PUBLIC FOLDER
app.use(express.static(__dirname + '/public'));





//ROUTES
app.get('/', function(req, res) {
    res.render('index');
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

