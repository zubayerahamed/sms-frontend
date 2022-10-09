$(document).ready(function(){
				
		$('.show-btn').hide();
		$('#show').on('click', function(){					
			$('.show-btn').show();
			$('.confirm-btn').hide();
			
		});
		$('#show').on('focusout', function(){	
			if($("#show").val() == ''){
			$('.show-btn').hide();
			$('.confirm-btn').show();
			}
		});
	
	
		$('.show-btn').on('click', function(){
			window.location.href = getBasepath() +$(this).attr('path')+$("#show").val();
		
		});
});