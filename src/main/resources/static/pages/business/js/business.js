$(document).ready(function(){

	$.ajax({
		url : getApiBasepath() + "/business",
		type : 'GET',
		dataType : 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			console.log({data});
			
			var t = $('.datatable').DataTable();
			$.each(data.items, function(d, i){
				t.row.add([d.id, d.id, d.id, d.id, d.id, ""]).draw(false);
			})
			
			

		}, 
		error : function(jqXHR, status, errorThrown){
			showMessage(status, "Something went wrong .... ");
		}
	});

})