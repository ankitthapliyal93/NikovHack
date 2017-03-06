
var mysql  = require('mysql');
var logger = require('services/loggerService')
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

function insert(qry){

 	return new Promise(function(resolve,reject){		
		pool.getConnection(function(err,connection){
		        if (err) {
		           connection.release();
		           reject(err);
		           return;
		        }   
		 
		    	logger.debug('connected as id: ' + connection.threadId);
		        logger.debug('The query is: ',qry);
		

		        
		  
		        connection.query(qry, function(err,rows){
		            connection.release();
		            if(err) {
		            	logger.error("Error: "+err);
		            	reject(err); 
		            	return;               
		             	}
		            else{
		             	resolve(rows);
		             	return;
		             }	           
		    	});
		 
		        connection.on('error', function(err) {
		        	   logger.error("Error:  "+err);      
		               reject(err);
		               return;     
		        });
		   });
	 	}
	 );
 	}


mysqlService.insert=insert;
module.exports=mysqlService; 	