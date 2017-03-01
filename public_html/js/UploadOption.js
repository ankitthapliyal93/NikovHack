
var UploadOption=(function(){

	//UploadOption class.
	var UploadOption=function(){
		this.base64Data="";
		this.requestObject=null;	//Object of class Request 

		initialize.call(this);
	};

	//Constructor for UploadOption
	function initialize(){
		$(document).ready(function(){
			$("#submit").click(uploadSubmitHandler.bind(this));
		}.bind(this));		
	}

	//Private methods of this class
	
	function sendRequest(){
	  console.log("Sending Request");
      var requestType='upload';
      var passControl=new Controller(this.base64Data,requestType);
      passControl.startProcess();
    }

	function uploadSubmitHandler() {
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();
		reader.onloadend = function () {
							reader.name=file.name;
							this.base64Data=reader.result;
							//uploadImage(reader);
							
							sendRequest.call(this);
						}.bind(this);

		if (file) {
				reader.readAsDataURL(file); //reads the data as a URL
		}	    
	}

	return UploadOption;
})();