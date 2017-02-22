/*Aim: Accepts response from the Google Vision API. Processes and sanitizes the data  and passes the refined data to search process. */



//Construction Function for objects which store results obtained from the Google Vision API.
//Used in sanitize() and refine() methods.
function cTextObject () {

    this.m_strText = "";    //Stores the string. 
    this.m_cBoundingCoordinates = [];   //Stores the coordinates.
    this.mergedBefore=-1;    //Keeps track of if the string is merged before with another string. -1: Not mered before 1: Horizontally merged 0:vertically merged.
    this.stringMergeIndex=-1;   //Index in stringList,where it was merged before.
  }



//Constructor function for objects that contain refined Strings. Used in stringList array.
function stringListObject () {
    this.strText="";    //contains refined String.
    this.font_size=0;   //contain Font size of the string.
  }



//Function responsible for processing the Google Vision API output into sanitizedText array.
//Followed by call to refineText().

function sanitize (data,imgpath) {
  console.log("Data REceived from API: \n");
  console.log(data);
  //console.log(sanitizedText[0].m_strText); 
  var scannedJson = JSON.parse(data.body);

  console.log(scannedJson.responses[0].logoAnnotations);
  

  var sanitizedText = []; 
  var stringList=[];    //List to maintain the list of strings to be searched

  //Processing the logo Detection part
  if(scannedJson.responses[0].logoAnnotations){
    var logoAnnotationsArray = scannedJson.responses[0].logoAnnotations;
    for(var index = 0; index < logoAnnotationsArray.length; index++){
      var tempObj = new stringListObject();
      tempObj.strText=logoAnnotationsArray[index].description;
      tempObj.font_size=logoAnnotationsArray[index].boundingPoly.vertices[3].y-logoAnnotationsArray[index].boundingPoly.vertices[0].y;
      stringList.push(tempObj);
    }
  }



  
  if(scannedJson.responses[0].textAnnotations){
    var textAnnotationsArray = scannedJson.responses[0].textAnnotations;
    for(var index = 0; index < textAnnotationsArray.length; index++){
      var textObj = new cTextObject();
      textObj.m_strText = textAnnotationsArray[index].description;
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[0]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[1]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[2]);
      textObj.m_cBoundingCoordinates.push(textAnnotationsArray[index].boundingPoly.vertices[3]);

      sanitizedText.push(textObj);
    }
    	console.log(sanitizedText[0].m_strText); 
        refineText(sanitizedText,stringList);   //call to refine the sanitized text.
        var builderName=[];
    	//Call to findBuilder() function. Arguments include-Array of strings, arrayIndex, array of builders, imgpath. 
    	findBuilder(stringList,0,builderName,imgpath,0);     

      }
      else {
        alert("No Text in image!!"); //code if no Text is found in the image.
      }
    }




//Function tries to construct logical structures of words and create strings that can then be hit on database.
//It calculates the closest horizontal and vertical words (within range) and then merge them, if they satisfy certain condition. 

function refineText (sanitizedText,stringList) {  

    
    var verticalMargin=5;   // Vertical distance between two words
    var horizontalMargin=20;    //Horizontal Distance between two words
    var verticalCloseMargin=10;   //If horizontally placed but with little different vertical placement
    var horizontalCloseMargin=10; //If vertically placed but with little different horizontal placement
    var maxLengthPermitted=20;  //Maximum length of the search string
    var minLengthPermitted=3;	//Minimum length of the search string
    var minHeightDiff=10;		//Minimum height difference to push the words individually as well
    
    //Loop Takes strings one by one aand find the closest horizontal and vertical and merge them accordingly.
    //Index 0 contains the entire string, so loop starts with 1. Needs to run only till length-1.
    for(var index = 1; index < sanitizedText.length-1; index++){

      var minVertical=Infinity;   //Keeps track of minimum vertical and horizontal distance between the current word and the rest.
      var minHorizontal=Infinity;
      var verticalCloseIndex=-1;  //Indexes of minimum vertical and horizontal words in sanitizedText array.
      var horizontalCloseIndex=-1;

      var currHeight = sanitizedText[index].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;
      console.log("\n"+sanitizedText[index].m_strText+"\n");
      
      //Inner loop to scan through the rest of the array.
      for(var tempIndex = index+1; tempIndex < sanitizedText.length; tempIndex++){

        var verticalDistance=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[0].y - sanitizedText[index].m_cBoundingCoordinates[3].y);
        var horizontalDistance=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[0].x - sanitizedText[index].m_cBoundingCoordinates[1].x);
        var verticalClose=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[3].y);
        var horizontalClose=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[0].x - sanitizedText[index].m_cBoundingCoordinates[0].x);

        console.log(sanitizedText[tempIndex].m_strText+" "+verticalDistance+" "+horizontalDistance+" "+verticalClose+" "+horizontalClose);

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
        if(sanitizedText[index].mergedBefore==-1) {         // If merged before, then do nothing, else add it as a new String to search.
            var stringObject=new stringListObject();
            stringObject.strText=sanitizedText[index].m_strText;
            stringObject.font_size=currHeight;
            stringList.push(stringObject);
        }
      }
      else {
        var nextIndex,tempVHeight,tempHHeight; // nextIndex: stores index to be merged with.
       
        //If both exists,then we look at the height of these.
        //Preference is given to the one with closer Height.
        if(verticalCloseIndex != -1 && horizontalCloseIndex != -1){
          tempVHeight=sanitizedText[verticalCloseIndex].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;
          tempHHeight=sanitizedText[horizontalCloseIndex].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;
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

        var nextHeight=sanitizedText[nextIndex].m_cBoundingCoordinates[3].y - sanitizedText[nextIndex].m_cBoundingCoordinates[0].y;
        console.log(sanitizedText[index].m_strText+" XXXXXXX "+currHeight+" "+nextHeight);

        //If height Difference is too huge or merging elements are vertically aligned then, we also push them individually.
        //This take care of faulty vertical merging.
        if(Math.abs(currHeight-nextHeight)>=minHeightDiff || nextIndex==verticalCloseIndex){ 

          var stringObject=new stringListObject();
          stringObject.strText=sanitizedText[index].m_strText;
          stringObject.font_size=currHeight;
          stringList.push(stringObject);
          stringObject=new stringListObject();
          stringObject.strText=sanitizedText[nextIndex].m_strText;
          stringObject.font_size=nextHeight;
          stringList.push(stringObject);
        }


        //Merging with the current element take place here. 
        //If merged before, then merge it on the same index,else create a new object to merge it with. 
        if(sanitizedText[index].mergedBefore==-1) {

          var stringObject=new stringListObject();
          stringObject.strText=sanitizedText[index].m_strText +" "+ sanitizedText[nextIndex].m_strText;
          stringObject.font_size=Math.max(currHeight,nextHeight);
          stringList.push(stringObject);
          if(nextIndex==verticalCloseIndex)
            sanitizedText[nextIndex].mergedBefore=0;
          else
            sanitizedText[nextIndex].mergedBefore=1;
          sanitizedText[nextIndex].stringMergeIndex=stringList.indexOf(stringObject);
        }
        else{
          //The check is introduced so the if horizontally (vertically) merged before, then merge should only take place horizontally (vertically).
          if(!((sanitizedText[index].mergedBefore==1 && nextIndex==verticalCloseIndex)||(sanitizedText[index].mergedBefore==0 && nextIndex==horizontalCloseIndex))){
            stringList[sanitizedText[index].stringMergeIndex].strText+=(" " + sanitizedText[nextIndex].m_strText);
            if(nextIndex==verticalCloseIndex)
              sanitizedText[nextIndex].mergedBefore=0;
            else
              sanitizedText[nextIndex].mergedBefore=1;
            sanitizedText[nextIndex].stringMergeIndex=stringList.indexOf(stringObject);
          }
        }

      }   //End of else.
    }   //End of outer for loop

    if(sanitizedText[index].mergedBefore == -1) {      //For last text detected.
      var stringObject=new stringListObject();
      stringObject.strText=sanitizedText[index].m_strText;
      stringObject.font_size=currHeight;
      stringList.push(stringObject);
    }

    //Sorting the List on the basis of the font Size, assuming that the key words will have more height than the normal text.        
    stringList.sort(  function(a, b) {
                        return parseFloat(b.font_size) - parseFloat(a.font_size);
                      }
    );

    console.log("\nStringList Before Cropping is:\n\n ");
    console.log(stringList);
    

    //Loop deteles all strings that have length  greater than 20 or less than 2.
    //This also satistizes certain strings like eg: B H I W A D I --> BHIWADI
    //We  can also create a dictionary of words which cannot be the project or builder names and remove them like --"THE". 
    for(var index=0;index<stringList.length;index++){
      if(stringList[index].strText.length>maxLengthPermitted || stringList[index].strText.length<minLengthPermitted){
        console.log(stringList[index].strText);
        stringList.splice(index,1);
        index--;
      }
      else{
      	var tempArray=stringList[index].strText.split(" ");
      	var tempBool=true;		//true: if all are single characters false: even if one is not a single character 
      	tempArray.forEach(function(value){
      						if(value.length!=1){
      								tempBool=false;
      						}
      	 });
      	if(tempBool)		//If all are single characters then merge them.
      		stringList[index].strText=tempArray.join("");
      }
    }
    
    console.log("\nStringList after Cropping is:\n\n ");
    console.log(stringList);

}

