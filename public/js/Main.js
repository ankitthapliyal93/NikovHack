//Initial point for the JavaScript. This will initialize all the classes and methods.


var Main=(function(){   //Self invoking function


	//Constructor function for the main class.
	var Main=function(){
		
		this.captureObject=null;
		this.uploadObject=null;
		initialize.call(this);		//calling the constructor for the main class.

	}

	//Initialize function for main class
	function initialize() {
        this.captureObject = new CaptureOption();        
        this.uploadObject = new UploadOption();
    }

    return Main;

})();

new Main();