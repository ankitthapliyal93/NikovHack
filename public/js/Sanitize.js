/*Aim: Accepts response from the Google Vision API. Processes and sanitizes the data  and passes the refined data to search process. */


var Sanitize=(function(){

  var Sanitize=function(apiData){
      this.apiData=apiData;
      this.scannedJson="";  //Parsed Content of API resullt
      this.sanitizedText = []; 
      this.stringList=[];   //List to maintain the list of strings to be searched
      initialize.call(this);
  }

  //Constructor function For Sanitize class
  function initialize(){
    this.scannedJson = JSON.parse(this.apiData.body);

  }


  //Construction Function for objects which store results obtained from the Google Vision API.
  //Used in sanitize() and refine() methods.
  function cTextObject () {

      this.m_strText = "";    //Stores the string. 
      this.m_cBoundingCoordinates = [];   //Stores the coordinates.
      this.mergedBefore=-1;    //Keeps track of if the string is merged before with another string. -1: Not mered before 1: Horizontally merged 0:vertically merged.
      this.stringMergeIndex=-1;   //Index in this.stringList,where it was merged before.
    }


  //Constructor function for objects that contain refined Strings. Used in this.stringList array.
  function stringListObject () {
      this.strText="";    //contains refined String.
      this.font_size=0;   //contain Font size of the string.
    }



  function handleLogoAnnotation(){
    var logoAnnotationsArray = this.scannedJson.responses[0].logoAnnotations;
    for(var index = 0; index < logoAnnotationsArray.length; index++){
        var tempObj = new stringListObject();
        tempObj.strText=logoAnnotationsArray[index].description;
        tempObj.font_size=logoAnnotationsArray[index].boundingPoly.vertices[3].y-logoAnnotationsArray[index].boundingPoly.vertices[0].y;
        this.stringList.push(tempObj);
      }

  }



  function handleTextAnnotation(){
    var textAnnotationsArray = this.scannedJson.responses[0].textAnnotations;
    for(var index = 0; index < textAnnotationsArray.length; index++){
      var textObj = new cTextObject();
      textObj.m_strText = textAnnotationsArray[index].description;
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[0]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[1]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[2]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[3]);

      this.sanitizedText.push(textObj);
    }

  }



  Sanitize.prototype={

      //Function responsible for processing the Google Vision API output into this.sanitizedText array.
      //Followed by call to refineText().

      sanitizeData: function () {  


        //Processing the logo Detection part
        if(this.scannedJson.responses[0].logoAnnotations){
          handleLogoAnnotation.call(this);
        }

        //Processing for the Text detection Part        
        if(this.scannedJson.responses[0].textAnnotations){
          handleTextAnnotation.call(this);
          console.log("Text Received from API:\n\n"+this.sanitizedText[0].m_strText);
        }
        
        if(this.sanitizedText.length!=0){
          this.refineText();   //call to refine the sanitized text.
        }
 
         return this.stringList;

      },

      //Function tries to construct logical structures of words and create strings that can then be hit on database.
      //It calculates the closest horizontal and vertical words (within range) and then merge them, if they satisfy certain condition. 

      refineText:function() {  

          
          var verticalMargin=5;   // Vertical distance between two words
          var horizontalMargin=20;    //Horizontal Distance between two words
          var verticalCloseMargin=10;   //If horizontally placed but with little different vertical placement
          var horizontalCloseMargin=10; //If vertically placed but with little different horizontal placement
          var maxLengthPermitted=20;  //Maximum length of the search string
          var minLengthPermitted=3; //Minimum length of the search string
          var minHeightDiff=10;   //Minimum height difference to push the words individually as well
          
          //Loop Takes strings one by one aand find the closest horizontal and vertical and merge them accordingly.
          //Index 0 contains the entire string, so loop starts with 1. Needs to run only till length-1.
          for(var index = 1; index < this.sanitizedText.length-1; index++){

            var minVertical=Infinity;   //Keeps track of minimum vertical and horizontal distance between the current word and the rest.
            var minHorizontal=Infinity;
            var verticalCloseIndex=-1;  //Indexes of minimum vertical and horizontal words in this.sanitizedText array.
            var horizontalCloseIndex=-1;

            var currHeight = this.sanitizedText[index].m_cBoundingCoordinates[3].y - this.sanitizedText[index].m_cBoundingCoordinates[0].y;
            //console.log("\n"+this.sanitizedText[index].m_strText+"\n");
            
            //Inner loop to scan through the rest of the array.
            for(var tempIndex = index+1; tempIndex < this.sanitizedText.length; tempIndex++){

              var verticalDistance=Math.abs(this.sanitizedText[tempIndex].m_cBoundingCoordinates[0].y - this.sanitizedText[index].m_cBoundingCoordinates[3].y);
              var horizontalDistance=Math.abs(this.sanitizedText[tempIndex].m_cBoundingCoordinates[0].x - this.sanitizedText[index].m_cBoundingCoordinates[1].x);
              var verticalClose=Math.abs(this.sanitizedText[tempIndex].m_cBoundingCoordinates[3].y - this.sanitizedText[index].m_cBoundingCoordinates[3].y);
              var horizontalClose=Math.abs(this.sanitizedText[tempIndex].m_cBoundingCoordinates[0].x - this.sanitizedText[index].m_cBoundingCoordinates[0].x);

              //console.log(this.sanitizedText[tempIndex].m_strText+" "+verticalDistance+" "+horizontalDistance+" "+verticalClose+" "+horizontalClose);

              if(verticalClose <= verticalCloseMargin && horizontalDistance <= horizontalMargin && minHorizontal == Infinity && horizontalDistance <= minHorizontal ){
                //We only need to check horizontaldistance only for the next element. This can be moved outside the loop.
                minHorizontal=horizontalDistance;    //need to keep track at this point
                horizontalCloseIndex=tempIndex;
              }
              else if(horizontalClose<= horizontalCloseMargin && verticalDistance <= verticalMargin && verticalDistance<=minVertical ){

                minVertical=verticalDistance;
                verticalCloseIndex=tempIndex;
              }

            }   //End of Inner Loop

            if( !(isFinite(minVertical) || isFinite(minHorizontal))) {    //Nothing is close to it within range
              if(this.sanitizedText[index].mergedBefore==-1) {         // If merged before, then do nothing, else add it as a new String to search.
                  var stringObject=new stringListObject();
                  stringObject.strText=this.sanitizedText[index].m_strText;
                  stringObject.font_size=currHeight;
                  this.stringList.push(stringObject);
              }
            }
            else {
              var nextIndex,tempVHeight,tempHHeight; // nextIndex: stores index to be merged with.
             
              //If both exists,then we look at the height of these.
              //Preference is given to the one with closer Height.
              if(verticalCloseIndex != -1 && horizontalCloseIndex != -1){
                tempVHeight=this.sanitizedText[verticalCloseIndex].m_cBoundingCoordinates[3].y - this.sanitizedText[index].m_cBoundingCoordinates[0].y;
                tempHHeight=this.sanitizedText[horizontalCloseIndex].m_cBoundingCoordinates[3].y - this.sanitizedText[index].m_cBoundingCoordinates[0].y;
                if(Math.abs(tempVHeight-currHeight) >= Math.abs(tempHHeight-currHeight)){
                  nextIndex=horizontalCloseIndex;
                }
                else{
                  nextIndex=verticalCloseIndex;
                }
              }
              else if(minVertical<minHorizontal){
                nextIndex=verticalCloseIndex;      
              }
              else {
                nextIndex=horizontalCloseIndex;
              }   

              var nextHeight=this.sanitizedText[nextIndex].m_cBoundingCoordinates[3].y - this.sanitizedText[nextIndex].m_cBoundingCoordinates[0].y;
              //console.log(this.sanitizedText[index].m_strText+" XXXXXXX "+currHeight+" "+nextHeight);

              //If height Difference is too huge or merging elements are vertically aligned then, we also push them individually.
              //This take care of faulty vertical merging.
              if(Math.abs(currHeight-nextHeight)>=minHeightDiff || nextIndex==verticalCloseIndex){ 

                var stringObject=new stringListObject();
                stringObject.strText=this.sanitizedText[index].m_strText;
                stringObject.font_size=currHeight;
                this.stringList.push(stringObject);
                stringObject=new stringListObject();
                stringObject.strText=this.sanitizedText[nextIndex].m_strText;
                stringObject.font_size=nextHeight;
                this.stringList.push(stringObject);
              }


              //Merging with the current element take place here. 
              //If merged before, then merge it on the same index,else create a new object to merge it with. 
              if(this.sanitizedText[index].mergedBefore==-1) {

                var stringObject=new stringListObject();
                stringObject.strText=this.sanitizedText[index].m_strText +" "+ this.sanitizedText[nextIndex].m_strText;
                stringObject.font_size=Math.max(currHeight,nextHeight);
                this.stringList.push(stringObject);
                if(nextIndex==verticalCloseIndex)
                  this.sanitizedText[nextIndex].mergedBefore=0;
                else
                  this.sanitizedText[nextIndex].mergedBefore=1;
                this.sanitizedText[nextIndex].stringMergeIndex=this.stringList.indexOf(stringObject);
              }
              else{
                //The check is introduced so the if horizontally (vertically) merged before, then merge should only take place horizontally (vertically).
                if(!((this.sanitizedText[index].mergedBefore==1 && nextIndex==verticalCloseIndex)||(this.sanitizedText[index].mergedBefore==0 && nextIndex==horizontalCloseIndex))){
                  this.stringList[this.sanitizedText[index].stringMergeIndex].strText+=(" " + this.sanitizedText[nextIndex].m_strText);
                  if(nextIndex==verticalCloseIndex)
                    this.sanitizedText[nextIndex].mergedBefore=0;
                  else
                    this.sanitizedText[nextIndex].mergedBefore=1;
                  this.sanitizedText[nextIndex].stringMergeIndex=this.stringList.indexOf(stringObject);
                }
              }

            }   //End of else.
          }   //End of outer for loop

          if(this.sanitizedText[index].mergedBefore == -1) {      //For last text detected.
            var stringObject=new stringListObject();
            stringObject.strText=this.sanitizedText[index].m_strText;
            stringObject.font_size=currHeight;
            this.stringList.push(stringObject);
          }

          //Sorting the List on the basis of the font Size, assuming that the key words will have more height than the normal text.        
          this.stringList.sort(  function(a, b) {
                              return parseFloat(b.font_size) - parseFloat(a.font_size);
                            }
          );

        
          

          //Loop deteles all strings that have length  greater than 20 or less than 2.
          //This also satistizes certain strings like eg: B H I W A D I --> BHIWADI
          //We  can also create a dictionary of words which cannot be the project or builder names and remove them like --"THE". 
          for(var index=0;index<this.stringList.length;index++){
            if(this.stringList[index].strText.length>maxLengthPermitted || this.stringList[index].strText.length<minLengthPermitted){
              //console.log(this.stringList[index].strText);
              this.stringList.splice(index,1);
              index--;
            }
            else{
              var tempArray=this.stringList[index].strText.split(" ");
              var tempBool=true;    //true: if all are single characters false: even if one is not a single character 
              tempArray.forEach(function(value){
                        if(value.length!=1){
                            tempBool=false;
                        }
               });
              if(tempBool)    //If all are single characters then merge them.
                this.stringList[index].strText=tempArray.join("");
            }
          }
          
          console.log("\nStringList after Cropping is:\n\n ");
          console.log(this.stringList);

      }      





    }; //End of Prototype functions


  return Sanitize;

}

)();





















