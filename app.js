var express = require('express');
var mysql  = require('mysql');
var hbs = require('hbs');
var app = express();


//To set the content type HMTL.
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static('public_html'));


var bodyParser = require('body-parser');
	app.use(bodyParser.json()); 		// support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true,limit:'5mb' })); 	// support
//Setting th upload directory
//app.use(ebodyParser.({uploadDir:'/uploads'}));




//creating a pool for database connectivity to handle concurrent users properly. 
var pool      =    mysql.createPool({
    connectionLimit : 100, 
    host     : 'localhost',
    port	  : '3306',
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





function getNewName(path){
	var time =new Date().getTime();
	var tempArray=path.split(".");
	var type=tempArray[tempArray.length-1];
	var random=Math.floor((Math.random() * 100) + 1);	//Last part generates random number between 1-100

	var newName='img-' + time + '-' + random + '.' + type;
	console.log(newName);
	return newName; 

}






function handleImageUpload(req,res){

	var fs = require('fs');
  	var path = require('path');		//path is reqyired to resolve the path
    var tempPath = req.files.file.path;
    var newName=getNewName(tempPath)
    var newPath='./uploads/'+newName;
    var targetPath = path.resolve(newPath);
    console.log("Paths:  "+tempPath+" "+targetPath)
    fs.rename(tempPath, targetPath, function(err) {
            if (err) {
            	console.log("Error Occured"+ err);
            	res.json({"code" : 100, "status" : "Error in Uploading image."});
            	return;
            }	
            console.log("Upload completed!");
            res.status(200).json({fileName:newName,success:"Image uploaded"});
            return;
        });
}




function handleImageUploadBase64(req,res){


	var fs = require('fs');
  	var path = require('path');		//path is required to resolve the path
   	console.log(req.body);
    var base64Data = req.body.content;

    var type=base64Data.split(',')[0].split('/')[1].split(';')[0];
    base64Data=base64Data.replace(/data:image\/.*;base64,/, "");

    var newName=getNewName(type);
    var newPath='./uploads/'+newName;
    var targetPath = path.resolve(newPath);
    console.log("\n"+targetPath +"\n")
    var imageBuffer = new Buffer(base64Data, 'base64'); //console = <Buffer 75 ab 5a 8a ...
	fs.writeFile(targetPath, imageBuffer, function(err) { 
			if (err) {
            	console.log("Error Occured"+ err);
            	res.json({"code" : 100, "status" : "Error in Uploading image."});
            	return;
            }	
            console.log("Upload completed!");
            res.status(200).json({fileName:newName,success:"Image uploaded"});
            return;
	}); 

}



//This handles all the request to homepage. 
app.get('/', function(req, res) {
    res.render('index');
});





//This handles the post request to save the feedback of the user to the database.
app.post('/feedback',function(req,res){
	console.log("checking!!");
	handleDatabase(req,res);
});




//This handles the upload of the image.
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
app.post('/upload',multipartMiddleware,function(req,res){
	handleImageUpload(req,res);
});


app.post('/upload/base64',function(req,res){
	handleImageUploadBase64(req,res);
});



app.listen(3000);