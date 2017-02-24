//var trial_run="";
//var imgPath="";
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





function makeRequest(trial,imgpath) {

//code to be deleted after testing
var photo1=document.getElementById('photo');
var canvas = document.getElementById('canvas');
if(trial!="")
  photo.setAttribute('src', trial);




//Till this point

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
    request.then(function(response) {
        sanitize(response,imgpath);
        }, function(reason) {
        	//Code to display error to be introduced here.
            console.log('Error: ' + reason.result.error.message);
        }
    );
}






function hitAPI(imgpath) { 

     var trial="";
     //imgpath="";
     gapi.load('client',function(){
              
              /*  gapi.client.setApiKey('AIzaSyCoRHpUba248snvvEYnVSPmXpzyLP_mcI0');
                gapi.client.load('vision').then(toDataUrl('img/'+imgpath, function(base64Img) {
                //trial_run=base64Img;
                trial=base64Img;
        
          })).then(function(){makeRequest(trial,imgpath)});*/
   
          
          if(typeof imgpath == "object"){
             trial=imgpath.result;
             imgpath=imgpath.name;
             //trial=trial.replace("data:image/jpeg;base64,", "data:image/png;base64,");

          }else if(typeof imgpath=="string"){
           
          toDataUrl('img/'+imgpath, function(base64Img) {
                //trial_run=base64Img;
                trial=base64Img;
                
         });
        }

        gapi.client.setApiKey('AIzaSyCoRHpUba248snvvEYnVSPmXpzyLP_mcI0');
        gapi.client.load('vision').then(function(){makeRequest(trial,imgpath)});

         }
    );


  }
