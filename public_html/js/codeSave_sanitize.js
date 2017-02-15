


function cTextObject () {
 
    this.m_strText = "";
    this.m_cBoundingCoordinates = [];
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


function refineText (sanitizedText) {
      
      var stringList=[];          //List to maintain the list of strings to be searched in makaan
      var marginOfError=5;          //difference between the font-size.
      var mergedBefore=false;       //Boolean to keep track if the current string is merged before.
    console.log("here1");
      
      for(var index = 1; index < sanitizedText.length-1;index++){
            
            var currheight=sanitizedText[index].m_cBoundingCoordinates[3].y - sanitizedText[index].m_cBoundingCoordinates[0].y;
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
                  return parseFloat(a.font_size) - parseFloat(b.font_size);
                });
            for(var i=0;i<= stringList.length-1;i++){
              console.log(stringList[i].strText);
              j++;
            }         


  }


  


