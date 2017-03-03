
var express = require('express');
var bodyParser = require('body-parser');
var path=require('path');
var hbs=require('hbs');

//setting up the environment variables.
require('dotenv').config();


//Resolves the module path
require('app-module-path').addPath(path.resolve(__dirname, './server'));

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























/*
//creating a pool for database connectivity to handle concurrent users properly. 
var pool      =    mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    port    : '3306',
    user     : 'root',
    password : '',
    database : 'makaanCam',
    debug    :  false
});
 



 




//This functions handles the database connectivity and inserts the feedback into the database.
function handleDatabase(req,res) {
  //This is required for post request for parsing the post body.
  
  pool.getConnection(function(err,connection){
        if (err) {
           connection.release();
           res.json({"code" : 100, "status" : "Error in connection database"});
           return;
        }   
 
      console.log('connected as id ' + connection.threadId);

        //Parsing the values of the feedback
        var values={
            imageID : req.body.imageID,
            feedback : req.body.feedback
          };

        var qry = "INSERT INTO feedback (imageID,feedback) VALUES ('"+values.imageID+ "','" +values.feedback+ "')";
        
        connection.query(qry, function(err,rows){
            connection.release();
            if(err) {
              console.log("Error: "+err);
              res.json({"code" : 100, "status" : err});  
              return;               
              }
            else{
              res.json(rows);
              return;
             }             
      });
 
        connection.on('error', function(err) {      
               res.json({"code" : 100, "status" : "Error in connection database"});
               return;     
        });
   });
}


*/







