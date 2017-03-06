
//Function is responsible for collecting the user's feedback and submitting it to the server

var Feedback=(function(base64Data){

	var Feedback=function(base64Data,response){
		this.collected=false;	//Track if feedback was collected before or not.
		this.base64Data=base64Data;
		this.response=response; 	//1 for success; 0 for Failure.
		this.imgName="";

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



	function uploadImage(){
		var url='/upload/base64';
	    var formData={ content: this.base64Data, imageName:this.imgName};

		var success=function(data){
	  					console.log(data);
						var imageName=data.fileName;
						console.log("Image uploaded successfully !!! "+ imageName);
	  				};

	  	var error=function(error){
	       			console.log(error);
	       			console.log("Error");
		  		};
		
		

		service.post(url,formData).then(success,error);		
		
	}

	//Prototype Functions.
	Feedback.prototype={

		collectFeedback:function(){

			var type=this.base64Data.split(',')[0].split('/')[1].split(';')[0];
    		this.base64Data=this.base64Data.replace(/data:image\/.*;base64,/, "");
    		this.imgName=getNewName(type);
			
			uploadImage.call(this);
			
			var url='/feedback';
			var data={"imageID" : this.imgName , "feedback" : this.response};
			var success=function(data) {
				console.log(data);
				console.log("Ajax call Success");
			};
			var error=function(error){
		       console.log(error);
			};
		
			service.post(url,data).then(success,error);
		}



	}

	return Feedback;
})();
