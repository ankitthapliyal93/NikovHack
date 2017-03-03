
var Request=(function(){

  var Request=function(base64Data){
    this.base64Data=base64Data;
    this.result="";

    initialize.call(this);

  }

  //constructor function for Request class
  function initialize(){
    $('body').addClass("loading");
  }

  //Private Functions
  function initAPI(resolve,reject){
    
    gapi.client.setApiKey('AIzaSyCoRHpUba248snvvEYnVSPmXpzyLP_mcI0');
    gapi.client.load('vision').then(makeRequest.bind(this,resolve,reject));
  }

  function requestSuccess(resolve,response){
      this.result=response;
      resolve(this.result);
  }

  function requestFailure(reject,error){
    this.result={'Error': reason.result.error.message};
    reject(this.result);
    console.log('Error: ' + reason.result.error.message);
  }

  
  function makeRequest(resolve,reject) {
    var photo=document.getElementById("photo");
    photo.setAttribute('src', this.base64Data); //setting the data for the request.

    var request = gapi.client.vision.images.annotate({
        "requests":
        [
          {
            "image":
            {
              "content": $('#photo').attr('src').replace(/data:image\/.*;base64,/, "")
               
            },
            "features":
            [
              {
                "maxResults": 100,
                "type": "TEXT_DETECTION"
              },
               {
                "type": "LOGO_DETECTION"
            }
            ]
          }
        ]
      });

      //Making Request
      request.then(requestSuccess.bind(this,resolve), requestFailure.bind(this,reject));
  }

  //Function Kept for future use.Dont getting invoked anywhere.
  function toDataUrl(src, callback, outputFormat) {
      var img = new Image();
      img.crossOrigin = 'Anonymous';

      img.onload = function() {
        var canvas = document.createElement('CANVAS');
        var ctx = canvas.getContext('2d');
        var dataURL;
      canvas.height = this.height;
        canvas.width = this.width;
       /*canvas.width=1024;
      canvas.height=768;*/
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
      
        callback(dataURL);
      };
      img.src = src;
      if (img.complete || img.complete === undefined) {
        console.log("Error");
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
      }
    }



  //Prototype Functions
  Request.prototype={

    hitAPI: function(){
      return new Promise(function(resolve,reject){
          gapi.load('client',initAPI.bind(this,resolve,reject));
      }.bind(this));  
    }

  };

  return Request;

}
)();


