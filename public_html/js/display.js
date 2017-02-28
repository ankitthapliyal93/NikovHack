//This module is reponsible for displaying results.


function displayResult(resultDataArray){
  $('body').removeClass("loading");
  

    var flag=true; //true for upload
    //flag=false;
    var cmd;
    if(flag){
      cmd='upload';
    }
    else{
      cmd='capture';
    }

    var noOfResults=5;

    var fontFactor=3,scoreFactor=6.5;   //Factors to be used while sorting the results.
    
    //Sorting the Results.
    resultDataArray.sort(function(a,b){
                  return ((parseFloat(b.fontSize)*fontFactor+parseFloat(b.relevanceScore)*scoreFactor) - (parseFloat(a.fontSize)*fontFactor+parseFloat(a.relevanceScore)*scoreFactor));
                });

    $("#"+cmd+"-propperty-list").html("");

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

    for(var tempIndex=0; tempIndex < resultDataArray.length  && tempIndex<noOfResults; tempIndex++){
      if(resultDataArray[tempIndex].relevanceScore==-1){
         if(tempIndex==0){
          var resultData='<div class="box shadow6"><h3>No matching results Found!!!</h3></div>';
          $('#'+cmd+'-propperty-list').append(resultData);
          break;
         }
        continue;
      }
      else{
        //var tempdata=" Display Text : "+resultDataArray[tempIndex].resObject.displayText+" , Entitity Name : "+resultDataArray[tempIndex].resObject.entityName+" , Builder Name : "+resultDataArray[tempIndex].resObject.builderName;
        var tempdata=[];
        tempdata[0]=resultDataArray[tempIndex].resObject.entityName;
        tempdata[1]=resultDataArray[tempIndex].resObject.displayText;
      }
      var resultData='<div class="box shadow6"><img src="../img/contact page bg.png" class="iconDetails"/><div class="result-text"><h4>'+tempdata[0]+'</h4><p>'+tempdata[1]+'</p></div></div>';
      $('#'+cmd+'-propperty-list').append(resultData);
    }
    
  
    if(flag){
      $('.form').hide();
      $("#showResults_upload").show();
      $('#back-to-upload').click(function(){
        $("#showResults_upload").hide();
        $('.form').show();
      });
    }else{
      $('.camera-result-wrapper').hide();
      $("#showResults_capture").show();
      $('#back-to-capture').click(function(){
        $("#showResults_capture").hide();
        resetCamera();
        $('.camera').show();
      });

    }


/*
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
    }*/


  }//End of function
