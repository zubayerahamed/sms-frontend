var tableData = [];
var resellerData = [];

function loadTableData(){
	loadingMask2.show();
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
			loadingMask2.hide();

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
					d.active ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>', 
					d.locked ? '<span class="label label-danger">Locked</span>' : '<span class="label label-success">Unlocked</span>', 
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

			setTableButtonEvents(t);

		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function loadAvailableResellerBusinessData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/business/available/resellers",
		type : 'GET',
		dataType : 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			loadingMask2.hide();

			resellerData = [];
			var mySelect = $('#resellerBusiness');
			mySelect.empty();
			$.each(data.items, function(i, d){
				mySelect.append(
						$('<option></option>').val(d.id).html(d.name)
				);
				resellerData.push(d);
			})

		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function setTableButtonEvents(table){
	table.rows().every(function(index, element) {
		var row = $(this.node());

		$(row).find('.btn-delete').off('click').on('click', function(e){
			e.preventDefault();
			deleteData($(this).data('id'));
		})

		$(row).find('.btn-edit').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Update User");
			$('.form-reset').removeClass('nodisplay');
			$('.form-update').removeClass('nodisplay');
			$('.form-submit').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

		$(row).find('.btn-view').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Business");
			$('.form-update').addClass('nodisplay');
			$('.form-submit').addClass('nodisplay');
			$('.form-reset').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

	});
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
	$('.modal-title').html("Create User");
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
	jsonData.resellerBusiness = $('#resellerBusiness').val();
	
	jsonData.systemadmin = $('#systemadmin').is(":checked");
	jsonData.owner = $('#owner').is(":checked");
	jsonData.reseller = $('#reseller').is(":checked");
	jsonData.customer = $('#customer').is(":checked");
	
	jsonData.active = $('#active').is(":checked");
	jsonData.locked = $('#locked').is(":checked");
	
	console.log(jsonData);

	loadingMask2.show();
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
			loadingMask2.hide();
			//console.log({data})
			if(data.success){
				showMessage('success', data.message);
				if(method == 'POST'){
					restForm();
				}
				loadTableData();
			} else {
				showMessage('error', data.message);
			}
		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function deleteData(selectedId){
	if(confirm("Are you want to delete this item!")){
		loadingMask2.show();
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
				loadingMask2.hide();
				if(data.success){
					showMessage('success', data.message);
					loadTableData();
				} else {
					showMessage('error', data.message);
				}
			}, 
			error : function(jqXHR, status, errorThrown){
				loadingMask2.hide();
				showMessage(status, "Something went wrong .... ");
			}
		});
	}
}

$(document).ready(function(){

	loadTableData();
	loadAvailableResellerBusinessData();

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

	//roles event
	$('#systemadmin').off('click').on('click', function(e){
		$('#owner').prop('checked', false);
		$('#reseller').prop('checked', false);
		$('#customer').prop('checked', false);
		$('.resellerDropdown').addClass('nodisplay');
	})
	$('#owner').off('click').on('click', function(e){
		$('#systemadmin').prop('checked', false);
		$('#reseller').prop('checked', false);
		$('#customer').prop('checked', false);
		$('.resellerDropdown').addClass('nodisplay');
	})
	$('#reseller').off('click').on('click', function(e){
		$('#owner').prop('checked', false);
		$('#systemadmin').prop('checked', false);
		$('#customer').prop('checked', false);
		$('.resellerDropdown').removeClass('nodisplay');
	})
	$('#customer').off('click').on('click', function(e){
		$('#owner').prop('checked', false);
		$('#reseller').prop('checked', false);
		$('#systemadmin').prop('checked', false);
		$('.resellerDropdown').addClass('nodisplay');
	})
	

})