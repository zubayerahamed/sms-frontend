var tableData = [];

function loadTableData(){
	loadingMask2.show();
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
			loadingMask2.hide();

			tableData = [];
			var t = $('.datatable').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){
				t.row.add([
					d.id, 
					d.businessType, 
					d.name, 
					d.mobile, 
					d.active ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>', 
					'<div class="btn-group pull-right">'+
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-default btn-view">View</button>' + 
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-primary btn-edit">Edit</button>' +
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

function setTableButtonEvents(table){
	table.rows().every(function(index, element) {
		var row = $(this.node());

		$(row).find('.btn-edit').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Update Business");
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

	$('#businessId').val(sObj.id);
	$('#businessType').val(sObj.businessType);
	$('#name').val(sObj.name);
	$('#email').val(sObj.email);
	$('#mobile').val(sObj.mobile);
	$('#address').val(sObj.address);
	$('#active').prop('checked', sObj.active);
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
	$('#id').val("");
}

function submitForm(method){
	var targettedForm = $('form#mainform');
	if(!targettedForm.smkValidate()) return;

	var jsonData = {};
	jsonData.id = $('#businessId').val();
	jsonData.businessType = $('#businessType').val();
	jsonData.name = $('#name').val();
	jsonData.email = $('#email').val();
	jsonData.mobile = $('#mobile').val();
	jsonData.address = $('#address').val();
	jsonData.active = $('#active').is(":checked");

	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/business",
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