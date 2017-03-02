//Class is responsible for capturing the inpur from the camera and providing it to the 


var CaptureOption =( function() {


  var CaptureOption=function(){

    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
    this.width=320;  // We will scale the photo width to this
    this.height=0;   // This will be computed based on the input stream
    this.streaming=false; // |streaming| indicates whether or not we're currently streaming
    this.video=null;
    this.canvas=null;
    this.photo=null;
    this.startbutton=null;
    this.localstream=null; 
    this.base64Data="";
    this.requestObject=null;  //Object of class Request 

    initialize.call(this);  
  };


  //Constructor Function
  function initialize(){
    var startUp = this.startUp.bind(this);
    window.addEventListener('load', startUp, false);    //Event to be invoked when window is loaded.

  }
 
  //Private Functions

  function canPlayHandler(ev){
          if (!this.streaming) {
            this.height = this.video.videoHeight / (this.video.videoWidth/this.width);

            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (isNaN(this.height)) {
              this.height = this.width / (4/3);
            }

            this.video.setAttribute('width', this.width);
            this.video.setAttribute('height', this.height);
            this.canvas.setAttribute('width', this.width);
            this.canvas.setAttribute('height', this.height);
            this.streaming = true;
          }
        }


  function navigatorSuccessHandler(stream) {
            if (navigator.mozGetUserMedia) {
              this.video.mozSrcObject = stream;
            } 
            else {
              var vendorURL = window.URL || window.webkitURL;
              this.video.srcObject=stream;
              this.localstream=stream;
            }
            this.video.play();
          }

  function navigatorFailureHandler(err) {
            console.log("An error occured! " + err);
          }


  
  function startbuttonClickHandler(ev){

        this.takepicture();
        this.vidOff();
        $(".camera").hide();
        $(".camera-result-wrapper").show();
        ev.preventDefault();
        }

  function sendRequest(){
      var requestType='capture';
      var passControl=new Controller(this.base64Data,requestType);
      passControl.startProcess();
    }

  
  //Prototype Functions
  CaptureOption.prototype={



    startUp: function() {
      
      document.getElementById("defaultOpen").click(); //For default opening of the tab.        
      this.video = document.getElementById('video');
      this.photo = document.getElementById('photo');
      this.startbutton = document.getElementById('startbutton');
      this.canvas = document.createElement('canvas');

      navigator.getMedia = ( navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia ||
                             navigator.msGetUserMedia);
      navigator.getMedia({video: true,audio: false},navigatorSuccessHandler.bind(this),navigatorFailureHandler); 

      
      this.video.addEventListener('canplay', canPlayHandler.bind(this), false);
      this.startbutton.addEventListener('click',startbuttonClickHandler.bind(this), false);
      $("#capture-retake").click(this.resetCamera.bind(this));
      $("#capture-submit").click(sendRequest.bind(this));
      this.clearphoto();
    },   //End of startup function.

    // Fill the photo with an indication that none has been
        // captured.

    clearphoto:function() {
      var context = this.canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      var data = this.canvas.toDataURL('image/jpeg');
      this.photo.setAttribute('src', data);
    },

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.


    takepicture:function () {
              var context = this.canvas.getContext('2d');
              if (this.width && this.height) {
                this.canvas.width = this.width;
                this.canvas.height = this.height;
                context.drawImage(this.video, 0, 0, this.width, this.height);
                this.base64Data = this.canvas.toDataURL('image/jpeg');
                this.photo.setAttribute('src', this.base64Data);
              } else {
                this.clearphoto();
              }
    },


      vidOff:function () {
              this.video.pause();
              this.video.src = "";
              this.localstream.getTracks()[0].stop();
            },

      resetCamera: function(){

          navigator.getMedia = ( navigator.getUserMedia ||
                                 navigator.webkitGetUserMedia ||
                                 navigator.mozGetUserMedia ||
                                 navigator.msGetUserMedia);
          navigator.getMedia({video: true,audio: false},navigatorSuccessHandler.bind(this),navigatorFailureHandler); 
          this.clearphoto();
          $(".camera-result-wrapper").hide();
          $(".camera").show();
      }

  };
       
    


 return CaptureOption;

 }        
)();



