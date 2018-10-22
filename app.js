var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('HELLO WORLD THIS IS MY FIRST NODE APP');
});

if (process.env.PORT == '8080') {
    app.listen(process.env.PORT, console.log('NODEAPP IS LISTENING ON PORT ' + process.env.PORT + '!'));
} else {
    app.listen('5004', console.log('NODEAPP IS LISTENING ON PORT 5004!'));
}

