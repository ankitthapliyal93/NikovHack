
var UploadOption=(function(){

	//UploadOption class.
	var UploadOption=function(){
		this.base64Data="";
		this.requestObject=null;	//Object of class Request 
		this.MAX_HEIGHT=768;
		this.MAX_WIDTH=1024;

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


    function compressImage(reader) {

    	//Done to get the width and height of the actual image.
    	var img=document.createElement('img');
    	img.setAttribute('src',reader.result);
    	var actualWidth=img.width;
    	var actualHeight=img.height;
    	console.log("Image Size: "+actualWidth+" "+actualHeight);
    	
    	//Keeping the aspect Ratio of the image as same.
    	if (actualWidth > actualHeight) {
  			if (actualWidth > this.MAX_WIDTH) {
    			actualHeight *= this.MAX_WIDTH / actualWidth;
    			actualWidth = this.MAX_WIDTH;
  			}
		} else {
  			if (actualHeight > this.MAX_HEIGHT) {
    			actualWidth *= this.MAX_HEIGHT / actualHeight;
    			actualHeight = this.MAX_HEIGHT;
  			}
		}
		console.log("Image Compressed: "+actualWidth+" "+actualHeight);
		var canvas=document.createElement('canvas');
		canvas.width=actualWidth;
		canvas.height=actualHeight;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, actualWidth, actualHeight);
		this.base64Data=canvas.toDataURL();

    }

	function uploadSubmitHandler() {
		var file    = document.querySelector('input[type=file]').files[0];
		var reader  = new FileReader();
		reader.onloadend = function () {
							reader.name=file.name;
							console.log(reader);
							compressImage.call(this,reader);							
							sendRequest.call(this);
						}.bind(this);

		if (file) {
				reader.readAsDataURL(file); //reads the data as a URL
		}	    
	}

	return UploadOption;
})();