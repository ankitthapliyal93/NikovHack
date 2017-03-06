

var AjaxHandler=(function AjaxHandler(){


		var AjaxHandler=function(){
			
		}

		//Private Functions
		var ajax=function(object){

			return new Promise(function(resolve,reject){

				object.success=function(response){
					resolve(response);
				};
				object.error=function(err){
					reject(err);
				}

				$.ajax(object);
			});

		}

		var getObject=function(url,data,type){
			return {
				'type' : type,
				'url' : url,
				'data' : data,
				'dataType':'json'
			}
		}

		AjaxHandler.prototype={

			post: function(url,data){
				var object= getObject(url,data,'post');
				return ajax(object);				
			},
			get: function(url,data){
				var object= getObject(url,data,'get');
				return ajax(object);				
			}
		};

		return AjaxHandler;


	}

)();

var service=new AjaxHandler();