function loadTableData(){
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
			t.clear().draw();
			$.each(data.items, function(i, d){
				t.row.add([
					d.id, 
					d.businessType, 
					d.name, 
					d.mobile, 
					d.active, 
					'<div class="btn-group pull-right"><button class="btn btn-xs btn-default">View</button>' + 
					'<button class="btn btn-xs btn-primary">Edit</button>' +
					'<button class="btn btn-xs btn-danger">Delete</button></div>'
				]).draw(false);
			})

			
			

		}, 
		error : function(jqXHR, status, errorThrown){
			showMessage(status, "Something went wrong .... ");
		}
	});
}

$(document).ready(function(){

	loadTableData();

	$('.form-submit').off('click').on('click', function(e){
		e.preventDefault();
		
		var data = $('#mainform').serializeArray();
		console.log(data);
		
	})
	

})