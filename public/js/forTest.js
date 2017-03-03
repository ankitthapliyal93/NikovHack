/*Purpose: This is responsible for handling the triggers generated through various options*/

$(document).ready(function(){

	
	$('#feedback').click(collectFeedback);


	//For files from local host
	$("#submitImg").click(function() {
		var img=document.getElementById("imgPath");
	    hitAPI(img.value);

	});


	//For files from local computer
	

	//For starting the testing Process.
	$("#startProcess").click(function() {
		//var imgList=["godrej prana.jpg","aangan.jpg","godrej sky.jpg","hill town.jpg","shantigram.jpg","sports city.jpg","springview heights.jpg","twin tower.jpg","godrej 101.jpg","greenarch.jpg","bannerghatta.jpg","devanahalli.jpg","myra.jpg","one33.jpg","hyde park.jpg","wind park.jpg","palm hills.jpg","manorial.jpg","mirabella.jpg","mantra.jpg"];
	 
	var imgList=["aangan.jpg","amantra.jpg","anmol fortune.jpg","atmosphere.jpg","bannerghatta.jpg","belvedere.jpg","blossom.jpg","daffodil.jpg","devanahalli.jpg",
					"gaur.jpg","godrej 101.jpg","godrej prana.jpg","godrej sky.jpg","greenarch.jpg","hill town.jpg","hyde park.jpg",
					"manorath.jpg","manorial.jpg","mantra.jpg","meridian.jpg","mirabella.jpg",
					"myra.jpg","one33.jpg","palm hills.jpg","platino.jpg","romano_1.jpg","romano_2.jpg","royal city.jpg",
					"royal court.jpg","shantigram_1.jpg","shantigram_2.jpg","sports city.jpg","springview heights.jpg","supernova_1.jpg","supernova_2.jpg","tranquility.png",
					"twin tower.jpg","wind park.jpg","park city.jpeg","gundecha.jpg","green.jpg","unitech.jpg","white city.jpg","krish city.jpg","ruksun.jpg",
					"golf homes.jpg","prakriti.jpg","antilia.jpg","gateway.jpg","collina.jpg","garden city.jpg","unnati.jpg","neemrana grace.jpg","golf village.jpg",
					"grand arch.png","greens.png","magnificia.png","cosmopolis.jpg","sky.jpg","dlf hyde park.png",
					"homeland.jpg","arden.jpg","platina.jpg","grandeur.jpg","savithanjali.jpg","enclave.jpg","ultima.jpg","meadows.jpg",
					"opulence.jpg","classic.jpg","bounty.jpg","eternia.jpg","nisarg.jpg","capitol.jpg","serenity.jpg",
					"victorian county.jpg","botnia.jpg","golf links.jpg","royal.jpg","international city.png"]; 


		//var imgList=["amantra.jpg","anmol fortune.jpg","atmosphere.jpg","belvedere.jpg","blossom.jpg","daffodil.jpg","gaur.jpg","greenarch.jpg","manorath.jpg","meridian.jpg","platino.jpg","romano_1.jpg","romano_2.jpg","royal city.jpg","royal court.jpg","shantigram_1.jpg","supernova_1.jpg","supernova_2.jpg","tranquility.png"];


		//var imgList=["park city.jpeg","gundecha.jpg","green.jpg","unitech.jpg","white city.jpg","krish city.jpg","ruksun.jpg",
		//			"golf homes.jpg","prakriti.jpg","antilia.jpg"];


	//	var imgList=["gateway.jpg","collina.jpg","garden city.jpg","unnati.jpg","neemrana grace.jpg","golf village.jpg",
	//				"grand arch.png","greens.png","magnificia.png","cosmopolis.jpg","sky.jpg","dlf hyde park.png"]



	//var imgList=["homeland.jpg","arden.jpg","platina.jpg","grandeur.jpg","savithanjali.jpg","enclave.jpg","ultima.jpg","meadows.jpg",
	//			"opulence.jpg","classic.jpg","bounty.jpg","eternia.jpg","nisarg.jpg","capitol.jpg","serenity.jpg",
	//			"victorian county.jpg","botnia.jpg","golf links.jpg","royal.jpg","international city.png"];


	 	$('#tableContent').html(""); 
		for(var index=0;index<imgList.length; index++){
		    var imgpath=imgList[index];
		     (function(x){
					hitAPI(x);
			})(imgpath);
		}

	});

});