  /*Aim: First try to search for the builder from the List of strings and then using a combined search for builders and strings
         generate Projects of relevance.*/



  //Constructor function for objects that store the individual projects. Used in resultDataArray.
  function resultString () {
    this.resObject={};    //Object that contains properties of the Project.
    this.relevanceScore=0;    //Used for sorting among the various Projects.
    this.searchString="";     //Keeps track of which string resulted in this Project.
    this.builder="";    //Corressponding builder in the search.
    this.imageName="";    //imageName: required only for testing purposes.
    //this.result=false;    
    this.fontSize=0;    //Stores font size of the search String, used in sorting.
  }


  //Function constructs the data node for the resultString Object.
  function createResultNode(nodeData){

    var temp= { projectId : nodeData.id.split("-")[2],
                displayText : nodeData.displayText,
                entityName : nodeData.entityName,
                builderName : nodeData.builderName};
    
    return temp;
  }


  //Function is responsible for finding possible builders and insert them into the builderName Array.
  function findBuilder(searchString,arrayIndex,builderName,imgpath){

    console.log("Here I am :"+searchString[arrayIndex].strText+" "+arrayIndex);
    var query=searchString[arrayIndex].strText;
    if(searchString[arrayIndex].strText.indexOf("%")>=0) query="";   //Invalid search string.
    //A logic can be created here to sanitize the query string itself.
    //query=query.toLowerCase().replace('the','');
    //searchString[arrayIndex].strText=query;
    //console.log(query+" GGGGGGG");
    
    var url = "https://www.makaan.com/columbus/app/v6/typeahead?query="+query+"&typeAheadType=BUILDER&city=&usercity=&rows=5&enhance=gp&category=buy&view=buyer&sourceDomain=Makaan&format=json";
    var data = {};
    $.ajax({
      type: "GET",
      url: url,
      data:data,
      success: function(response) {
         if(response.data != ""){
           console.log(response.data);
           //Loop to scan through the results of builders
           for(var index=0; index < response.data.length; index++){
            if(response.data[index].builderName ){    //If buildername exists
              var location=response.data[index].builderName.toLowerCase().indexOf(searchString[arrayIndex].strText.toLowerCase());    //If string exists in response builder name.
              var tempValue=searchString[arrayIndex].strText.split(" ").join("");   //Joining the words incase ocr seperates them. Example: super tech.

              if(location>=0){
                //Either search string is exactly same as builder name or is in between the builder name.
                if( (location+searchString[arrayIndex].strText.length == response.data[index].builderName.length) ||response.data[index].builderName[location+searchString[arrayIndex].strText.length]==" "){
                  //If buildername doesnot already exists in the builderName Array, then insert it.
                  if(builderName.indexOf(searchString[arrayIndex].strText.toLowerCase())<0){
                    builderName.push(searchString[arrayIndex].strText.toLowerCase());   //Inserting the search string and not the actual builder name.
                    //builderName.push(response.data[index].builderName);
                    console.log("hey1 "+searchString[arrayIndex].strText);
                    
                  }
                  /*  searchString.splice(arrayIndex,1); 
                  arrayIndex--;*/
                  break;    // If Builder name found then break.
                }
              }
              else if(tempValue != searchString[arrayIndex].strText) { // If their was only one word in the search string, then it will be a repetition.
                location=response.data[index].builderName.toLowerCase().indexOf(tempValue.toLowerCase());
                if(location>=0){
                  if( (location+tempValue.length == response.data[index].builderName.length) ||response.data[index].builderName[location+tempValue.length]==" "){
                    if(builderName.indexOf(tempValue.toLowerCase())<0){
                      builderName.push(tempValue.toLowerCase());
                      //builderName.push(response.data[index].builderName);
                      console.log("hey3 "+tempValue);
                      
                    }
                    break;
                  }
                }
              } 
              else if(searchString[arrayIndex].strText.toLowerCase().indexOf(response.data[index].builderName.toLowerCase())>=0){
                //If the search string Contains the builder name. If search string has extra text. In that case we push actual builder name.
                if(builderName.indexOf(response.data[index].builderName.toLowerCase())<0){
                  builderName.push(response.data[index].builderName.toLowerCase());
                  console.log("hey2 "+response.data[index].builderName);
                }
              }
            }// End of if builder name exists


                    /* var temp=arrayIndex;
                     if(response.data[index].builderName ){
                        var subName=response.data[index].builderName.split(" ");
                        for(tempIndex=0;tempIndex<subName.length;tempIndex++){
                          if(searchString[arrayIndex].strText.toUpperCase() === subName[tempIndex].toUpperCase()){
                            builderName.push(searchString[arrayIndex].strText);
                            searchString.splice(arrayIndex,1); 
                            arrayIndex--;
                            break;
                            }  //removing the builder from the list.

                        }
                        if(arrayIndex!=temp) break;
                      }*/

          }
        }

        //Calling the function recusively for other strings as well and at the end calling the talkToMakan function for getting project List.  
        if(/*arrayIndex+1 <=12 &&*/ arrayIndex+1 < searchString.length )
          findBuilder(searchString,arrayIndex+1,builderName,imgpath);
        else{
          var resultDataArray=[];
          console.log("Builder Name List for :");
          console.log(builderName);
          talkToMakan(searchString,0,resultDataArray,builderName,0,imgpath);
        }
      },//end of success
      error: function(xhr, status,errorThrown){
          alert("Could not connect to the API"); //Code to handle if could not connect to API.
      }
    });

  }


  //Function  is responsible for getting the Project List from the API for given searchString and builder name and store 
  //reults in resultDataArray.
  function talkToMakan(searchString,arrayIndex,resultDataArray,builderName,builderIndex,imgpath) {

    var builder=""; 
    var query=""
    if(builderName.length > builderIndex) 
      {
        builder=builderName[builderIndex];
      }

    var query=builder+" "+searchString[arrayIndex].strText;
    if(searchString[arrayIndex].strText.indexOf("%")>=0) query="";   //For wrong String


      if(builder!= "" && searchString[arrayIndex].strText.toLowerCase().indexOf(builder.toLowerCase())>=0) { query="";}//Because in this case search will be made when builder is empty case.

      var url = "https://www.makaan.com/columbus/app/v6/typeahead?query="+query+"&typeAheadType=PROJECT&city=&usercity=&rows=7&enhance=gp&category=buy&view=buyer&sourceDomain=Makaan&format=json";
      var data = {};
      console.log(query);
      
      
      $.ajax({
        type: "GET",
        url: url,
        data:data,
        success: function(response) {

          if(response.data!=""){

            for(var index=0; index<response.data.length;index++){
              var temp=new resultString();
              temp.imageName=imgpath;
              temp.resObject=createResultNode(response.data[index]);
              temp.relevanceScore=(response.data[index].score)?response.data[index].score:0; //0 : In case of GP(Google Places).  
              temp.searchString=searchString[arrayIndex].strText;
              temp.fontSize=searchString[arrayIndex].font_size;
              temp.builder=builder;
              resultDataArray.push(temp);
            }
          }
          else{//Only for testing Purposes
            var temp=new resultString();
            temp.searchString=searchString[arrayIndex].strText;
            temp.imageName=imgpath;
            temp.relevanceScore=-1;
            temp.fontSize=-1;
            resultDataArray.push(temp);
          }

          if((arrayIndex+1 <30 && arrayIndex+1 < searchString.length) ) //Search various strings for a particular builder name.
            talkToMakan(searchString,arrayIndex+1,resultDataArray,builderName,builderIndex,imgpath);
          else if(builderName.length >= builderIndex+1)     //Increment the builder name and proceed as usual.
          {
            talkToMakan(searchString,0,resultDataArray,builderName,builderIndex+1,imgpath)
          }
          else{   //In the end Display Results.
            if(imgpath=="")
              loadDetails(resultDataArray);
            else
              displayResult(resultDataArray);

          }
        },  //End of success Function.
        error: function(xhr, status,errorThrown){
          alert("Could not connect to the Server");
        }
     });    //End of Ajax Call.
  }   //End of function.







  function displayResult(resultDataArray){

    var fontFactor=3,scoreFactor=6.5;   //Factors to be used while sorting the results.
    
    //Sorting the Results.
    resultDataArray.sort(function(a,b){
                  return ((parseFloat(b.fontSize)*fontFactor+parseFloat(b.relevanceScore)*scoreFactor) - (parseFloat(a.fontSize)*fontFactor+parseFloat(a.relevanceScore)*scoreFactor));
                });

    $("#showResults").html("");
    console.log(resultDataArray);


    resultDataArray.length=(resultDataArray.length>50)?50:resultDataArray.length; //Reducing the number of results in the array
    
    //Removing Duplicates from the results.
    for(var index=0;index<resultDataArray.length-1;index++){
      for(var tempIndex=index+1;tempIndex< resultDataArray.length; tempIndex++){
        if(resultDataArray[index].resObject.projectId === resultDataArray[tempIndex].resObject.projectId){
            resultDataArray.splice(tempIndex,1);
            tempIndex--;
        }
      }
    }



    //For single Image tab.
    for(var tempIndex=0; tempIndex < resultDataArray.length; tempIndex++){
      if(resultDataArray[tempIndex].relevanceScore==-1){
        var tempdata=" No Data returned for this!!";
      }
      else{
        var tempdata=" Display Text : "+resultDataArray[tempIndex].resObject.displayText+" , Entitity Name : "+resultDataArray[tempIndex].resObject.entityName+" , Builder Name : "+resultDataArray[tempIndex].resObject.builderName;
      }
      var resultData='<div class="alert alert-info"><strong>'+resultDataArray[tempIndex].builder+" "+resultDataArray[tempIndex].searchString+' : </strong>'+tempdata+'</div>';
      $('#showResults').append(resultData);
    }

    //for success rate tab
    var projectName=((resultDataArray[0].imageName.split('.'))[0]).split('_')[0];
    var tempBoolean=false;
    //checking only top 5 results.
    for(var tempIndex=0; tempIndex < resultDataArray.length && tempIndex<5; tempIndex++){
      if(resultDataArray[tempIndex].relevanceScore==-1){
        continue;
      }
      if(resultDataArray[tempIndex].resObject.displayText.toLowerCase().indexOf(projectName.toLowerCase())>=0){
        //resultDataArray[tempIndex].result= true;
        tempBoolean=true;
        var tempdata='<tr><td>'+tempIndex+'</td><td>'+resultDataArray[tempIndex].imageName+'</td><td>'+resultDataArray[tempIndex].searchString+'</td><td>'+resultDataArray[tempIndex].resObject.displayText+'</td><td>Success</tr>';
        $('#tableContent').append(tempdata);
        break;
      }
    }
    
    if(!tempBoolean){
      var tempdata='<tr><td></td><td>'+resultDataArray[0].imageName+'</td><td>'+resultDataArray[0].searchString+'</td><td> --- </td><td>Failure</tr>';
      $('#tableContent').append(tempdata); 
    }
  }//End of function





