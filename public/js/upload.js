//This function uploads the image on the server
function uploadImage(reader)
{
	var flag=1;
	if(flag == 0){
		var url='http://localhost:3000/upload';
		var file_data = $("#fileupload").prop("files")[0];
		console.log(file_data);
		var formData=new FormData();
		formData.append("file", file_data);
		console.log(formData);


		var success=function(data){
  					console.log(data);
					var imageName=data.fileName;
					console.log("Image uploaded successfully !!! "+ imageName);
  				};

  		var error=function(error){
       			console.log(error);
       			console.log("Error");
	  		};



	  		$.ajax({
  		type: "POST",
  		url: url,
  		data: formData,
  		success: success,
  		dataType:"json",
  		processData: false,
  		contentType:false,
  		error: error
    });
	
	}else{


	var url='http://localhost:3000/upload/base64';
    var formData={ content: reader.result};

	var success=function(data){
  					console.log(data);
					var imageName=data.fileName;
					console.log("Image uploaded successfully !!! "+ imageName);
  				};

  	var error=function(error){
       			console.log(error);
       			console.log("Error");
	  		};
	

	$.ajax({
  		type: "POST",
  		url: url,
  		data: formData,
  		success: success,
  		dataType:"json",
  		error: error
    });

	}
}        
