


function cTextObject () {
 
    this.m_strText = "";
    this.m_cBoundingCoordinates = [];
    this.mergedBefore=false;   //To keep track of weather it was merged with other string before
    this.stringMergeIndex=-1; //To keep Track of where it was merged
}

function stringListObject () {
    this.strText="";
    this.font_size=0;
}

function sanitize (data) {
  
    sanitizedText = []; 
console.log(data);
    var scannedJson = JSON.parse(data.body);
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

        refineText(sanitizedText);
        alert(sanitizedText[0].m_strText);   //code to now process it on makaan.
      }
    else {
        alert("No Text in image!!"); //code if no Text is found in the image.
      }
  }



function findDistance(){}




/* In this function we will try to use the concept of Distance matrix to find the closest text associated with the remaining array.*/

function refineText (sanitizedText) {  
      
      var stringList=[];          //List to maintain the list of strings to be searched in makaan
      var marginOfError=5;          //difference between the font-size.
      var verticalMargin=5;            // Keeping distance check.
      var horizontalMargin=5;
    console.log("here1");
      
      for(var index = 1; index < sanitizedText.length-1;index++){
            
            var minVertical=Infinity;
            var minHorizontal=Infinity;
            var verticalCloseIndex=-1;
            var horizontalCloseIndex=-1;
            var currHeight=sanitizedText[index].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;

            for(var tempIndex=index+1;tempIndex < sanitizedText.length;tempIndex++){

                var verticalDistance=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y);
                var horizontalDistance=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[1].x - sanitizedText[index].m_cBoundingCoordinates[0].x);
                var verticalClose=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[0].y - sanitizedText[index].m_cBoundingCoordinates[0].y);
                var horizontalClose=Math.abs(sanitizedText[tempIndex].m_cBoundingCoordinates[0].x - sanitizedText[index].m_cBoundingCoordinates[0].x);
                
                if(verticalClose <= verticalMargin && horizontalDistance <= horizontalMargin && horizontalDistance <= minHorizontal ){
                      minHorizontal=horizontalDistance;    //need to keep track at this point
                      horizontalCloseIndex=tempIndex;
                  }
                else if(horizontalClose<= horizontalMargin && verticalDistance <= VerticalMArgin && VerticalDistance<=minVertical ){
                   minVertical=verticalDistance;
                   verticalCloseIndex=tempIndex;
                  }

              }

            if( !(isFinite(minVertical) || isFinite(minHorizontal))) {    //If nothing else is close to it now
                    if(sanitizedText[index].mergedBefore==false) {         // If not merged before then add it as new string else do nothing
                        var stringObject=new stringListObject();
                        stringObject.strText=sanitizedText[index].m_strText;
                        stringObject.font_size=currHeight;
                        stringList.push(stringObject);
                        console.log("\nCase7: "+stringObject.strText);
                      }
                  }
            else {
                    var nextIndex;
                    if(minVertical<minHorizontal){
                        nextIndex=verticalCloseIndex;      
                      }
                    else{
                       nextIndex=horizontalCloseIndex;
                    }

                    var nextHeight=sanitizedText[nextIndex].m_cBoundingCoordinates[3].y - sanitizedText[nextIndex].m_cBoundingCoordinates[0].y;
            
                    if(sanitizedText[index].mergedBefore==false) {
                        var stringObject=new stringListObject();
                        stringObject.strText=sanitizedText[index].m_strText +" "+ sanitizedText[nextIndex].m_strText;
                        stringObject.font_size=Math.max(currheight,nextheight);
                        stringList.push(stringObject);
                        sanitizedText[nextIndex].mergedBefore=true;
                        sanitizedText[nextIndex].stringMergeIndex=stringList.indexOf(stringObject);

                                console.log("\nCase1: " +stringObject.strText+stringList);
                        }
                    else{
                      stringList[sanitizedText[index].stringMergeIndex].strText+=" " + sanitizedText[nextIndex].m_strText;
                      sanitizedText[nextIndex].mergedBefore=true;
                      sanitizedText[nextIndex].stringMergeIndex=stringList.indexOf(stringObject);
                    }

                }



            }

            if(sanitizedText[index].mergedBefore == false) {      //for last text detected
                    var stringObject=new stringListObject();
                    stringObject.strText=sanitizedText[index].m_strText;
                    stringObject.font_size=currheight;
                    stringList.push(stringObject);
                    console.log("\nCase7: "+stringObject.strText);
                  }

            var j=0;
            stringList.sort(  function(a, b) {
                  return parseFloat(b.font_size) - parseFloat(a.font_size);
                });
            for(var i=0;i<= stringList.length-1;i++){
              console.log(stringList[i].strText+" "+stringList[i].font_size);
              j++;
            }         



        }

         /*   var currheight=sanitizedText[index].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;
            var nextheight=sanitizedText[index+1].m_cBoundingCoordinates[3].y - sanitizedText[index+1].m_cBoundingCoordinates[0].y;
            var checkHorizontal=Math.abs(sanitizedText[index].m_cBoundingCoordinates[0].y - sanitizedText[index+1].m_cBoundingCoordinates[0].y);
            var checkVertical=Math.abs(sanitizedText[index].m_cBoundingCoordinates[0].y - sanitizedText[index+1].m_cBoundingCoordinates[3].y);
            console.log(currheight+" "+nextheight+" "+checkHorizontal+" "+checkVertical+"\n");
            
            if(Math.abs(currheight-nextheight) <= marginOfError) {              //Height is same 
                    if(checkHorizontal <= marginOfError || checkVertical <= marginOfError)  {      //Horizontal or vertical with same Height
                        if(mergedBefore==false){                                                   //if current haven't merged before.
                            var stringObject=new stringListObject();
                            stringObject.strText=sanitizedText[index].m_strText +" "+ sanitizedText[index+1].m_strText;
                            stringObject.font_size=Math.max(currheight,nextheight);
                            stringList.push(stringObject);
                            mergedBefore=true;

                            console.log("\nCase1: " +stringObject.strText+stringList);
                          }
                        else{                                                         //if current was merged before then merge the next one with that only.
                            stringList[stringList.length-1].strText=stringList[stringList.length-1].strText+" "+sanitizedText[index+1].m_strText;
                            console.log("\nCase2: " );
                        }
                    }
                    else {                                          //if next is seperate from current
                      if(mergedBefore == false) {                   //if current is not added before
                            var stringObject=new stringListObject();
                            stringObject.strText=sanitizedText[index].m_strText;
                            stringObject.font_size=currheight;
                            stringList.push(stringObject);
                            console.log("\nCase3: " +stringObject.strText);
                        }
                      else{                                          //if current was already added   
                          mergedBefore=false;
                          console.log("\nCase4: ");
                      }
                      }

                }
            else{                                     //If Height doesnt match
                if(mergedBefore == false) {           //if current is not added before
                    var stringObject=new stringListObject();
                    stringObject.strText=sanitizedText[index].m_strText;
                    stringObject.font_size=currheight;
                    stringList.push(stringObject);
                    console.log("\nCase5: "+stringObject.strText);
                  }
                else{                                 //If current already added
                  mergedBefore=false;
                  console.log("\nCase6: ");
                }

              }
            }  


            if(mergedBefore == false) {      //for last text detected
                    var stringObject=new stringListObject();
                    stringObject.strText=sanitizedText[index].m_strText;
                    stringObject.font_size=currheight;
                    stringList.push(stringObject);
                    console.log("\nCase7: "+stringObject.strText);
                  }

            var j=0;
            stringList.sort(  function(a, b) {
                  return parseFloat(b.font_size) - parseFloat(a.font_size);
                });
            for(var i=0;i<= stringList.length-1;i++){
              console.log(stringList[i].strText+" "+stringList[i].font_size);
              j++;
            }         


  }


  


*/