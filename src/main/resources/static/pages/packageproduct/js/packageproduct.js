var tableData = [];

function loadTableData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/package",
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
					'<div>'+
						'<h3>' + d.name + '</h3>' +
					'</div>', 
					d.active ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>', 
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
			$('.modal-title').html("Update Template");
			$('.form-reset').removeClass('nodisplay');
			$('.form-update').removeClass('nodisplay');
			$('.form-submit').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

		$(row).find('.btn-view').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("SMS Template");
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
	$('#name').val(sObj.name)
	$('#content').val(sObj.content);

	$('#active').prop("checked", sObj.active);
}

function resetModal(){
	$('#myModal').modal('hide');
	$('.modal-title').html("Create Template");
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
	jsonData.id = $('#id').val();
	jsonData.name = $('#name').val();
	jsonData.content = $('#content').val();
	jsonData.active = $('#active').is(":checked");
	
	console.log(jsonData);

	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/package",
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
			url : getApiBasepath() + "/package/" + selectedId,
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


function updateDiscountSection(){
	$('#discountRate').val(0);
	$('#discountAmount').val(0);

	var discountType = $('#discountType').val();
	if(discountType == 'NONE'){
		$('#discountRate').attr('readonly', 'readonly');
		$('#discountAmount').attr('readonly', 'readonly');
	} else if (discountType == 'FLAT'){
		$('#discountRate').attr('readonly', 'readonly');
		$('#discountAmount').removeAttr('readonly');
	} else {
		$('#discountRate').removeAttr('readonly');
		$('#discountAmount').attr('readonly', 'readonly');
	}
}

function updateDiscountAmount(){
	
}

$(document).ready(function(){

	loadTableData();

	updateDiscountSection();
	$('#discountType').off('change').on('change', function(e){
		updateDiscountSection();
	})
	$('#discountRate').off('blur').on('blur', function(e){
		updateDiscountAmount();
	})


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