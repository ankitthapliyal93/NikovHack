/*Aim: First try to search for the builder from the List of strings and then using a combined search for builders and strings
        generate Projects of relevance.*/


var Search=(function(){

  var Search=function(stringList){
    this.searchString=stringList;
    this.builderName=[];
    this.resultDataArray=[];
    this.totalBuilderSearch=30;    //No of builder search strings , later will be set to length of the searchString array
    this.builderSearchCompleteIndex=0;
    this.totalStringSearch=30; //No of strings that will be searched
    this.stringSearchCompleteIndex=0;
    this.builderlock=false;
    this.resultArrayLock=false;

  };


  //Constructor function for objects that store the individual projects. Used in this.resultDataArray.
  function resultString () {
    this.resObject={};    //Object that contains properties of the Project.
    this.relevanceScore=0;    //Used for sorting among the various Projects.
    this.searchString="";     //Keeps track of which string resulted in this Project.
    this.builder="";    //Corressponding builder in the search.
    this.fontSize=0;    //Stores font size of the search String, used in sorting.
  }


  //Function constructs the data node for the resultString Object.
  function createResultNode(nodeData){

    var temp= { projectId : nodeData.id.split("-")[2],
                displayText : nodeData.displayText,
                entityName : nodeData.entityName,
                builderName : nodeData.builderName,
                redirectURL: nodeData.redirectUrl
              };
    
    return temp;
  }

   //Function is responsible for finding possible builders and insert them into the builderName Array.
  function findBuilder(stringListIndex,serverTrial,resolve,reject){
    var query=this.searchString[stringListIndex].strText;
    if(this.searchString[stringListIndex].strText.indexOf("%")>=0) query="";   //Invalid search string.
    
    var url = "https://www.makaan.com/columbus/app/v6/typeahead?query="+query+"&typeAheadType=BUILDER&city=&usercity=&rows=5&enhance=gp&category=buy&view=buyer&sourceDomain=Makaan&format=json";
    var data = {};
    $.ajax({
      type: "GET",
      url: url,
      data:data,
      success: function(response) {
         if(response.data != ""){
           //Loop to scan through the results of builders
           for(var index=0; index < response.data.length; index++){
            if(response.data[index].builderName ){    //If buildername exists
              var location=response.data[index].builderName.toLowerCase().indexOf(this.searchString[stringListIndex].strText.toLowerCase());    //If string exists in response builder name.
              var tempValue=this.searchString[stringListIndex].strText.split(" ").join("");   //Joining the words incase ocr seperates them. Example: super tech.

              if(location>=0){
                //Either search string is exactly same as builder name or is in between the builder name.
                if( (location+this.searchString[stringListIndex].strText.length == response.data[index].builderName.length) ||response.data[index].builderName[location+this.searchString[stringListIndex].strText.length]==" "){
                  //If buildername doesnot already exists in the builderName Array, then insert it.
                  
                  while(this.builderlock);  //Polling the builderlock
                  this.builderlock=true;
                  if(this.builderName.indexOf(this.searchString[stringListIndex].strText.toLowerCase())<0){
                    this.builderName.push(this.searchString[stringListIndex].strText.toLowerCase());   //Inserting the search string and not the actual builder name.
                    
                  }
                  this.builderlock=false; //Releasing the lock

                  /*  this.searchString.splice(stringListIndex,1); 
                  stringListIndex--;*/
                  break;    // If Builder name found then break.
                }
              }
              else if(tempValue != this.searchString[stringListIndex].strText) { // If their was only one word in the search string, then it will be a repetition.
                location=response.data[index].builderName.toLowerCase().indexOf(tempValue.toLowerCase());
                if(location>=0){
                  if( (location+tempValue.length == response.data[index].builderName.length) ||response.data[index].builderName[location+tempValue.length]==" "){
                    while(this.builderlock);  //Polling the builderlock
                    this.builderlock=true;
                    if(this.builderName.indexOf(tempValue.toLowerCase())<0){
                      this.builderName.push(tempValue.toLowerCase());
                      //this.builderName.push(response.data[index].builderName);
                      
                      
                    }
                    this.builderlock=false; //Releasing the lock
                    break;
                  }
                }
              } 
              else if(this.searchString[stringListIndex].strText.toLowerCase().indexOf(response.data[index].builderName.toLowerCase())>=0){
                while(this.builderlock);  //Polling the builderlock
                this.builderlock=true;
                //If the search string Contains the builder name. If search string has extra text. In that case we push actual builder name.
                if(this.builderName.indexOf(response.data[index].builderName.toLowerCase())<0){
                  this.builderName.push(response.data[index].builderName.toLowerCase());
                }
                this.builderlock=false; //Releasing the lock
              }
            }// End of if builder name exists

          }
        }

        //Calling the function recusively for other strings as well and at the end calling the talkToMakan function for getting project List.  
       this.builderSearchCompleteIndex++;
       if(this.builderSearchCompleteIndex==this.totalBuilderSearch){
          console.log("\nBuilder Name List for :");
          console.log(this.builderName);
          resolve(this.builderName);
          //talkToMakan.call(this,0,0,0);
        }

      }.bind(this),//end of success
      error: function(err){
          if(serverTrial<5)
            findBuilder.call(this,stringListIndex,serverTrial+1,resolve,reject);
          else{
           this.builderSearchCompleteIndex++;
           if(this.builderSearchCompleteIndex==this.totalBuilderSearch){
              console.log("Builder Name List for :");
              console.log(this.builderName);
               resolve(this.builderName);
            }

            console.log("\nError: Could not connect to the API"); //Code to handle if could not connect to API.

          }
          
      }.bind(this)
    });

  }


  //Function  is responsible for getting the Project List from the API for given this.searchString and builder name and store 
  //reults in this.resultDataArray.
  function talkToMakan(stringListIndex,builderIndex,serverTrial,resolve,reject) {

    var builder=""; 
    var query="";
    if(this.builderName.length > builderIndex) 
      {
        builder=this.builderName[builderIndex];
      }

    var query=builder+" "+this.searchString[stringListIndex].strText;
    if(this.searchString[stringListIndex].strText.indexOf("%")>=0) query="";   //For wrong String


      if(builder!= "" && this.searchString[stringListIndex].strText.toLowerCase().indexOf(builder.toLowerCase())>=0) { query="";}//Because in this case search will be made when builder is empty case.

      var url = "https://www.makaan.com/columbus/app/v6/typeahead?query="+query+"&typeAheadType=PROJECT&city=&usercity=&rows=6&enhance=gp&category=buy&view=buyer&sourceDomain=Makaan&format=json";
      var data = {};
     
      
      
      $.ajax({
        type: "GET",
        url: url,
        data:data,
        success: function(response) {

         
         
          if(response.data!=""){
            for(var index=0; index<response.data.length;index++){
              var temp=new resultString();
              temp.resObject=createResultNode(response.data[index]);
              temp.relevanceScore=(response.data[index].score)?response.data[index].score:0; //0 : In case of GP(Google Places).  
              temp.searchString=this.searchString[stringListIndex].strText;
              temp.fontSize=this.searchString[stringListIndex].font_size;
              temp.builder=builder;
              while(this.resultArrayLock);
              this.resultArrayLock=true;
              this.resultDataArray.push(temp);
              this.resultArrayLock=false;
            }
          }
          else{//Only for testing Purposes
            var temp=new resultString();
            temp.searchString=this.searchString[stringListIndex].strText;
          
            temp.relevanceScore=-1;
            temp.fontSize=-1;
            while(this.resultArrayLock);
            this.resultArrayLock=true;
            this.resultDataArray.push(temp);
            this.resultArrayLock=false;
          }
          while(this.resultArrayLock);
          this.resultArrayLock=true;
          this.stringSearchCompleteIndex++;
          this.resultArrayLock=false;
          
          if(this.stringSearchCompleteIndex == this.totalStringSearch*(this.builderName.length+1)){
                resolve(this.resultDataArray);
          }

        }.bind(this),  //End of success Function.
        
        error: function(err){
          console.log('Error: '+ err);
          if(serverTrial<5)
            talkToMakan.call(this,stringListIndex,builderIndex,serverTrial+1,resolve,reject);
          else{
            this.stringSearchCompleteIndex++;
            if(this.stringSearchCompleteIndex==this.totalStringSearch){
               resolve(this.resultDataArray);
            }

            console.log("\n\nError: Could not connect to the Server: ");
          }
        }.bind(this)
     });    //End of Ajax Call.
  }   //End of function.





  Search.prototype={

    startSearching:function(){
      this.totalBuilderSearch=Math.min(this.totalBuilderSearch,this.searchString.length);
      this.builderSearchCompleteIndex=0;
      var builderSearch=new Promise(function(resolve,reject){
        if(this.searchString.length==0)
          resolve(this.resultDataArray);
        for(var index=0;index<this.totalBuilderSearch; index++){
            (function(tempIndex){
              findBuilder.call(this,tempIndex,0,resolve,reject); //StringListIndex, ServerTrials
            }).call(this,index);
        }
      }.bind(this));

      //Invoking the buildersearch ajax calls
      return builderSearch.then(
        function(resolve){
            
           
            //Invoking the Properties search calls
            this.stringSearchCompleteIndex=0;
            this.totalStringSearch=Math.min(this.totalStringSearch,this.searchString.length);
            
            return new Promise(function(resolve,reject){

                 if(this.searchString.length==0)
                    {resolve([]);
                    return;
                  }  
                for(var index=0;index<=this.builderName.length; index++){
                  for(var innerIndex=0;innerIndex<this.totalStringSearch ;innerIndex++){
                      (function(builderIndex,stringListIndex){
              
                          talkToMakan.call(this,stringListIndex,builderIndex,0,resolve,reject);
                      }).call(this,index,innerIndex);
                    }  
                }  
            }.bind(this));

        }.bind(this),function(reject){}.bind(this));
    }
  } 

  return Search;

}

)();






  


 
  






  





