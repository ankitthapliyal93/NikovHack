
var mysql  = require('mysql');
var mysqlService={};

	//creating a pool for database connectivity to handle concurrent users properly. 
var pool      =    mysql.createPool({
	connectionLimit : 100, 
	host     :  process.env.DB_HOST,
	port	 :  process.env.DB_PORT,
	user     : 	process.env.DB_USER,
	password : 	'',
	database :  process.env.DB_DATABASE,
	debug    :  false
});

function insert(data){

 	return new Promise(function(resolve,reject){
 		console.log('Promise query');
		pool.getConnection(function(err,connection){
		        if (err) {
		           connection.release();
		           reject(err);
		           return;
		        }   
		 
		    	console.log('connected as id ' + connection.threadId);

		        //Parsing the values of the feedback
		        

		        var qry = "INSERT INTO feedback (imageID,feedback) VALUES ('"+data.imageID+ "','" +data.feedback+ "')";
		        
		        connection.query(qry, function(err,rows){
		            connection.release();
		            if(err) {
		            	console.log("Error: "+err);
		            	reject(err); 
		            	return;               
		             	}
		            else{
		             	resolve(rows);
		             	return;
		             }	           
		    	});
		 
		        connection.on('error', function(err) {      
		               reject(err);
		               return;     
		        });
		   });
	 	}
	 );
 	}


mysqlService.insert=insert;
module.exports=mysqlService; 	