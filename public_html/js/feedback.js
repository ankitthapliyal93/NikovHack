
//Function is responsible for collecting the user's feedback and submitting it to the server.
function collectFeedback(){

	var url='http://localhost:3000/feedback';
	var data={"imageID":"a1234","feedback":"ankit"};
	var success=function(data) {
		console.log(data);
		console.log("Ajax call Success");
	};
	var error=function(error){
       console.log(error);
	};

	$.ajax({
  		type: "POST",
  		url: url,
  		data: data,
  		dataType:'json',
  		success: success,
  		error: error

    });

}