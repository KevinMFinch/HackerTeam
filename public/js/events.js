$(document).ready(function(){
	var count = 0;
	$(".hackathon").each(function(){
		if(count % 2 ==0){
			$(this).css("background-color","#d3d3d3");
		}
		count++;
	})
})