
var express = require('express');
var bodyParser = require('body-parser');
var path=require('path');
var hbs=require('hbs');

//setting up the environment variables.
require('dotenv').config();


//Resolves the module path
require('app-module-path').addPath(path.resolve(__dirname, './server'));

//required for logging service.
var logger=require('services/loggerService');

//Sets the Port that our server will listen too.
const PORT = process.env.PORT || 4000;

var app = express();

//Setting the path for the view folder.
app.set('views', path.join(__dirname, '/server/views'));

//To set Path of static assets..
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('public'));


app.use(bodyParser.json()); 		// support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true,limit:'5mb' })); 	// Limit is 5mb so that base64 data can be saved.



// Setup api routes
require('services/routeService')(app);
app.listen(PORT);
logger.info('Server Started');

