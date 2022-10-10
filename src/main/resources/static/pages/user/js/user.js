var tableData = [];

function loadTableData(){
	$.ajax({
		url : getApiBasepath() + "/user",
		type : 'GET',
		dataType : 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			console.log({data});

			tableData = [];
			var t = $('.datatable').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){
				
				var role = "";
				if(d.systemadmin){
					role = "System Admin";
				} else if (d.owner){
					role = "Owner";
				} else if (d.reseller){
					role = "Reseller";
				} else {
					role = "Customer";
				}
				
				t.row.add([
					d.fullName, 
					d.username, 
					d.email, 
					d.mobile, 
					d.active,
					d.locked,
					d.expiryDate,
					role,
					'<div class="btn-group pull-right">'+
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-default btn-view">View</button>' + 
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-primary btn-edit">Edit</button>' +
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-danger btn-delete">Delete</button>'+
					'</div>'
				]).draw(false);

				tableData.push(d);
			})

			setTableButtonEvents();

		}, 
		error : function(jqXHR, status, errorThrown){
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function setTableButtonEvents(){
	$('.btn-delete').off('click').on('click', function(e){
		e.preventDefault();
		deleteData($(this).data('id'));
	})

	$('.btn-edit').off('click').on('click', function(e){
		e.preventDefault();

		$('#myModal').modal('show');
		$('.modal-title').html("Update Business");
		$('.form-reset').removeClass('nodisplay');
		$('.form-update').removeClass('nodisplay');
		$('.form-submit').addClass('nodisplay');

		setSelectedDataToForm($(this).data('id'));
	})

	$('.btn-view').off('click').on('click', function(e){
		e.preventDefault();

		$('#myModal').modal('show');
		$('.modal-title').html("Business");
		$('.form-update').addClass('nodisplay');
		$('.form-submit').addClass('nodisplay');
		$('.form-reset').addClass('nodisplay');

		setSelectedDataToForm($(this).data('id'));
	})
}


function setSelectedDataToForm(selectedId){
	var sObj = {};
	$.each(tableData, function(i, d){
		if(d.id == selectedId){
			sObj = d;
		}
	})

	$('#id').val(sObj.id);
	$('#fullName').val(sObj.fullName);
	$('#username').val(sObj.username);
	$('#email').val(sObj.email);
	$('#password').val(sObj.password);
	$('#mobile').val(sObj.mobile);
	$('#expiryDate').val(sObj.expiryDate);
	
	$('#systemadmin').prop("checked", sObj.systemadmin);
	$('#owner').prop("checked", sObj.owner);
	$('#reseller').prop("checked", sObj.reseller);
	$('#customer').prop("checked", sObj.customer);
	
	$('#active').prop("checked", sObj.active);
	$('#locked').prop("checked", sObj.locked);
}

function resetModal(){
	$('#myModal').modal('hide');
	$('.modal-title').html("Create Business");
	$('.form-reset').removeClass('nodisplay');
	$('.form-update').addClass('nodisplay');
	$('.form-submit').removeClass('nodisplay');
}

function restForm(){
	$('#mainform').trigger("reset");
}

function submitForm(method){
	var targettedForm = $('form#mainform');
	if(!targettedForm.smkValidate()) return;

	var jsonData = {};
	jsonData.id = $('#id').val();
	jsonData.fullName = $('#fullName').val();
	jsonData.username = $('#username').val();
	jsonData.email = $('#email').val();
	jsonData.password = $('#password').val();
	jsonData.mobile = $('#mobile').val();
	jsonData.expiryDate = $('#expiryDate').val();
	
	jsonData.systemadmin = $('#systemadmin').is(":checked");
	jsonData.owner = $('#owner').is(":checked");
	jsonData.reseller = $('#reseller').is(":checked");
	jsonData.customer = $('#customer').is(":checked");
	
	jsonData.active = $('#active').is(":checked");
	jsonData.locked = $('#locked').is(":checked");
	
	console.log(jsonData);

	$.ajax({
		url : getApiBasepath() + "/user",
		type : method,
		dataType : 'json',
		data: JSON.stringify(jsonData),
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			console.log({data})
			if(data.success){
				if(method == 'POST'){
					restForm();
				}
				loadTableData();
			} else {
				alert(data.message);
			}
		}, 
		error : function(jqXHR, status, errorThrown){
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function deleteData(selectedId){
	if(confirm("Are you want to delete this item!")){
		$.ajax({
			url : getApiBasepath() + "/user/" + selectedId,
			type : 'DELETE',
			dataType : 'json',
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
			},
			success : function(data) {
				if(data.success){
					loadTableData();
				} else {
					alert(data.message);
				}
			}, 
			error : function(jqXHR, status, errorThrown){
				showMessage(status, "Something went wrong .... ");
			}
		});
	}
}

$(document).ready(function(){

	loadTableData();

	$('.modal-close').off('click').on('click', function(e){
		e.preventDefault();
		resetModal();
		restForm();
	})

	// reset form
	$('.form-reset').off('click').on('click', function(e){
		e.preventDefault();
		restForm();
	})

	// submit form
	$('.form-submit').off('click').on('click', function(e){
		e.preventDefault();
		submitForm('POST');
	})

	// update form
	$('.form-update').off('click').on('click', function(e){
		e.preventDefault();
		submitForm('PUT');
	})

})