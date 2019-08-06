var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
require('./server/config/mongoose.js');
require('./server/config/socket.js');

app.use(bodyParser.json());
app.use(express.static( __dirname + '/public/dist/public'));
app.use(session({
	secret: 'secretkey1298375619843756',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}));

require('./server/config/routes.js')(app);
app.all("*", (req,res,next) => {res.sendFile(path.resolve("./public/dist/public/index.html"))});

const port = '8000';
app.listen(port, () => {console.log(`Server listening on port ${port}`)});