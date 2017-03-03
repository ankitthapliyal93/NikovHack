
//var bodyParser = require('body-parser');
var path=require('path')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var mysqlService=require('../services/mysqlService');



module.exports = function(app) {

    //saves Feedback to the database
    app.post('/feedback',feedbackHandler);

    //This handles the upload of the image.    
    app.post('/upload',multipartMiddleware,uploadFilePath);

    //uploads base64
    app.post('/upload/base64',uploadBase64);

};




function feedbackHandler(req,res){
    console.log("checking!!");
    var data={
        imageID : req.body.imageID,
        feedback : req.body.feedback
    };
      
    mysqlService.insert(data).then(function(resolve){ console.log("Here");res.json(resolve); },function(err){ console.log('Error');res.json(error); });
    //handleDatabase(req,res);
}



function uploadFilePath(req,res){
        //handleImageUpload(req,res);
    }



function uploadBase64(req,res){
    handleImageUploadBase64(req,res);
}



function handleImageUploadBase64(req,res){


  var fs = require('fs');
    var path = require('path');   //path is required to resolve the path
    var base64Data = req.body.content;
    var newName=req.body.imageName;
    var targetPath = path.resolve( __dirname,'../','uploads',newName);
    console.log("\n"+targetPath +"\n");
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


/*

function handleImageUpload(req,res){

  var fs = require('fs');
    var path = require('path');   //path is reqyired to resolve the path
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


*/