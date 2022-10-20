var tableData = [];
var allSuppliersData = [];

function loadTableData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/po",
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
					d.purchaseDate, 
					d.smsOperator,
					d.supplier.name, 
					d.smsQuantity, 
					d.purchaseAmount,
					d.confirmed ? '<i class="glyphicon glyphicon-ok text-success"></i>' : '<button data-id="'+ d.id +'" class="btn btn-xs btn-primary btn-confirm">Confirm Purchase</button>', 
					d.confirmed ? 
					'<div class="btn-group pull-right">'+
						'<button data-id="'+ d.id +'" class="btn btn-xs btn-default btn-view">View</button>' + 
					'</div>'
					:
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

function loadAllSuppliers(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/supplier",
		type : 'GET',
		dataType : 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			loadingMask2.hide();

			allSuppliersData = [];
			var mySelect = $('#supplier');
			$.each(data.items, function(i, d){
				mySelect.append(
					$('<option></option>').val(d.id).html(d.name)
				);
				allSuppliersData.push(d);
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

		$(row).find('.btn-confirm').off('click').on('click', function(e){
			e.preventDefault();
			confirmedPurchase($(this).data('id'));
		})

		$(row).find('.btn-edit').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Update Purchase Order");
			$('.form-reset').removeClass('nodisplay');
			$('.form-update').removeClass('nodisplay');
			$('.form-submit').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

		$(row).find('.btn-view').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Purchase Order");
			$('.form-update').addClass('nodisplay');
			$('.form-submit').addClass('nodisplay');
			$('.form-reset').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

	});

}

function resetModal(){
	$('#myModal').modal('hide');
	$('.modal-title').html("Create Purchase Order");
	$('.form-reset').removeClass('nodisplay');
	$('.form-update').addClass('nodisplay');
	$('.form-submit').removeClass('nodisplay');
}

function restForm(){
	$('#mainform').trigger("reset");
	$('#id').val("");
}

function setSelectedDataToForm(selectedId){
	var sObj = {};
	$.each(tableData, function(i, d){
		if(d.id == selectedId){
			sObj = d;
		}
	})

	$('#id').val(sObj.id);
	$('#purchaseDate').val(sObj.purchaseDate)
	$('#smsOperator').val(sObj.smsOperator);
	$('#smsQuantity').val(sObj.smsQuantity);
	$('#purchaseAmount').val(sObj.purchaseAmount);
	$('#supplier').val(sObj.supplier.id);
}

function submitForm(method){
	var targettedForm = $('form#mainform');
	if(!targettedForm.smkValidate()) return;

	var jsonData = {};
	jsonData.id = $('#id').val();
	jsonData.purchaseDate = $('#purchaseDate').val();
	jsonData.smsOperator = $('#smsOperator').val();
	jsonData.smsQuantity = $('#smsQuantity').val();
	jsonData.purchaseAmount = $('#purchaseAmount').val();
	jsonData.supplier = {
		'id' : $('#supplier').val()
	};

	console.log(jsonData);

	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/po",
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

function confirmedPurchase(selectedId){
	if(confirm("Are you want to confirm this purchase!")){
		loadingMask2.show();
		$.ajax({
			url : getApiBasepath() + "/po/confirm/" + selectedId,
			type : 'PUT',
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

function deleteData(selectedId){
	if(confirm("Are you want to delete this item!")){
		loadingMask2.show();
		$.ajax({
			url : getApiBasepath() + "/po/" + selectedId,
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
	loadAllSuppliers();

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