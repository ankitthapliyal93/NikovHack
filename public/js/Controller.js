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
		var searchAPI=new Search(this.stringList)
		//MakaanSearch is a promise returned by the Search class 
		var MakaanSearch=searchAPI.startSearching();
		MakaanSearch.then(function(resolve){
				this.resultDataArray=resolve;
                //Creating the Display Class to display the results.
                var display=new DisplayResult(this.resultDataArray,this.requestType);
                display.displayResult();
                $('.feedback-ask').show();
				$('.feedback-thanks').hide();
                
                $(document).ready(function(){
					$("#"+this.requestType+"Yes").click(function(){ 
							var feedback=new Feedback(this.base64Data,1);
							feedback.collectFeedback();
							$('.feedback-ask').hide();
							$('.feedback-thanks').show();

						}.bind(this)
						
					);
					$("#"+this.requestType+"No").click(function(){ 
							var feedback=new Feedback(this.base64Data,0);
							feedback.collectFeedback();
							$('.feedback-ask').hide();
							$('.feedback-thanks').show();

						}.bind(this)
					);

				}.bind(this));	


            }.bind(this),function(reject){console.log("Error");}.bind(this));
		   

	}

	function requestError(error){
		//Fill this code for displaying error.
		alert('Could Not connect to the Server');
		$('body').removeClass("loading");
		return;
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