//This module is reponsible for displaying results.

var DisplayResult=(function(){

  var DisplayResult=function(resultDataArray,requestType){
    this.resultDataArray=resultDataArray;
    this.cmd=requestType;
    this.noOfResults=5;
    this.fontFactor=3;
    this.scoreFactor=6.5;
  }


  DisplayResult.prototype={

    displayResult:function(){
      $('body').removeClass("loading");
        
        //Sorting the Results.
        this.resultDataArray.sort(function(a,b){
                      return ((parseFloat(b.fontSize)*this.fontFactor+parseFloat(b.relevanceScore)*this.scoreFactor) - (parseFloat(a.fontSize)*this.fontFactor+parseFloat(a.relevanceScore)*this.scoreFactor));
                    }.bind(this));

        $("#"+this.cmd+"-propperty-list").html("");

        console.log(this.resultDataArray);


        this.resultDataArray.length=(this.resultDataArray.length>50)?50:this.resultDataArray.length; //Reducing the number of results in the array
        
        //Removing Duplicates from the results.
        for(var index=0;index<this.resultDataArray.length-1;index++){
          for(var tempIndex=index+1;tempIndex< this.resultDataArray.length; tempIndex++){
            if(this.resultDataArray[index].resObject.projectId === this.resultDataArray[tempIndex].resObject.projectId){
                this.resultDataArray.splice(tempIndex,1);
                tempIndex--;
            }
          }
        }



        //For single Image tab.

        for(var tempIndex=0; tempIndex < this.resultDataArray.length  && tempIndex<this.noOfResults; tempIndex++){
          if(this.resultDataArray[tempIndex].relevanceScore==-1){
             if(tempIndex==0){
              var resultData='<div class="box shadow6"><h3>No matching results Found!!!</h3></div>';
              $('#'+this.cmd+'-propperty-list').append(resultData);
              break;
             }
            continue;
          }
          else{
            //var tempdata=" Display Text : "+this.resultDataArray[tempIndex].resObject.displayText+" , Entitity Name : "+this.resultDataArray[tempIndex].resObject.entityName+" , Builder Name : "+this.resultDataArray[tempIndex].resObject.builderName;
            var tempdata=[];
            tempdata[0]=this.resultDataArray[tempIndex].resObject.entityName;
            tempdata[1]=this.resultDataArray[tempIndex].resObject.displayText;
          }
          var resultData='<div class="box shadow6"><img src="../img/contact page bg.png" class="iconDetails"/><div class="result-text"><h4>'+tempdata[0]+'</h4><p>'+tempdata[1]+'</p></div></div>';
          $('#'+this.cmd+'-propperty-list').append(resultData);
        }
        
      
        if(this.cmd=='upload'){
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
        var projectName=((this.resultDataArray[0].imageName.split('.'))[0]).split('_')[0];
        var tempBoolean=false;
        //checking only top 5 results.
        for(var tempIndex=0; tempIndex < this.resultDataArray.length && tempIndex<5; tempIndex++){
          if(this.resultDataArray[tempIndex].relevanceScore==-1){
            continue;
          }
          if(this.resultDataArray[tempIndex].resObject.displayText.toLowerCase().indexOf(projectName.toLowerCase())>=0){
            //this.resultDataArray[tempIndex].result= true;
            tempBoolean=true;
            var tempdata='<tr><td>'+tempIndex+'</td><td>'+this.resultDataArray[tempIndex].imageName+'</td><td>'+this.resultDataArray[tempIndex].searchString+'</td><td>'+this.resultDataArray[tempIndex].resObject.displayText+'</td><td>Success</tr>';
            $('#tableContent').append(tempdata);
            break;
          }
        }
        
        if(!tempBoolean){
          var tempdata='<tr><td></td><td>'+this.resultDataArray[0].imageName+'</td><td>'+this.resultDataArray[0].searchString+'</td><td> --- </td><td>Failure</tr>';
          $('#tableContent').append(tempdata); 
        }*/


      }//End of function

  }


  return DisplayResult;

}
)();




