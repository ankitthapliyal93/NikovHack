
var mysqlService=require('../services/mysqlService');
var logger=require('services/loggerService')



module.exports = function(app) {

    //saves Feedback to the database
    app.post('/feedback',feedbackHandler);

};




function feedbackHandler(req,res){
	
    var data={
        imageID : req.body.imageID,
        feedback : req.body.feedback
    };
   
   var qry = "INSERT INTO feedback (imageID,feedback) VALUES ('"+data.imageID+ "','" +data.feedback+ "')";
      
    mysqlService.insert(qry).then(function(resolve){
    				logger.info('Insert Query Executed successfullly: ',qry);
    				res.json(resolve);
    			 },function(err){ 
    			 	logger.error('Insert Query Failed: ', err);
    			 	res.json(error);
    			 }
    		);
}



