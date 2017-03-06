var path=require('path')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var logger=require('services/loggerService');



module.exports = function(app) {

	//This handles the upload of the image.    
    app.post('/upload',multipartMiddleware,handleImageUploadFilePath);

    //uploads base64
    app.post('/upload/base64',handleImageUploadBase64);

};








function handleImageUploadBase64(req,res){


  var fs = require('fs');
    var path = require('path');   //path is required to resolve the path
    var base64Data = req.body.content;
    var newName=req.body.imageName;
    var targetPath = path.resolve( __dirname,'../','uploads',newName);
    var imageBuffer = new Buffer(base64Data, 'base64'); //console = <Buffer 75 ab 5a 8a ...
    fs.writeFile(targetPath, imageBuffer, function(err) { 
      if (err) {
              logger.error("Error Occured: ",err);
              res.json({"code" : 100, "status" : "Error in Uploading image."});
              return;
            } 
            logger.info("Upload completed!");
            res.status(200).json({fileName:newName,success:"Image uploaded"});
            return;
  }); 

}




function handleImageUploadFilePath(req,res){

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


