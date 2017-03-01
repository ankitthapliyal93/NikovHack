//This class is reponsible for managing the flow of data and responses throughout the program execution.

var Controller= (function(){

	var Controller=function(base64Data,requestType){
		this.base64Data=base64Data;
		this.requestType=requestType;
		this.apiResult="";
		this.stringList=[];		//Array of Object[Strings,font-size] to be hit on makaan. 
		this.resultDataArray=[];

		initialize.call(this);
	}

	//Constructor Function for Controller class.
	function initialize(){
		console.log("Creating the Request object");
		
	}

	//Private methods for Controller Class
	function requestComplete(result){

		this.apiResult=result;
		
		//Sanitizing the data
		var sanitize=new Sanitize(this.apiResult);
		this.stringList=sanitize.sanitizeData();		//Invoking the sanitize Operation.

		//Searching the makaan API.
		var search=new Search(this.stringList)
		this.resultDataArray=search.startSearching();
		/*var builderName=[];
        //Call to findBuilder() function. Arguments include-Array of strings, arrayIndex, array of builders, imgpath,index. 
        */     

	}

	function requestError(error){
		//Fill this code for displaying error.
	}


	//Prototype methods
	Controller.prototype={

		startProcess:function(){
			var request=new Request(this.base64Data);
			request.hitAPI().then(requestComplete.bind(this), requestError.bind(this));
		}
	};


	return Controller;
}
)();