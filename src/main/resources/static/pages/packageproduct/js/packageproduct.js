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
						'<h2 style="margin: 0; padding: 5px 0px;">' + d.name + '</h2>' +
						'<h4 style="margin: 0; padding: 5px 0px;">SMS Quantity : ' + d.smsQuantity + '</h4>' +
						'<span style="margin: 0; padding: 5px 0px;">Validity : ' + d.validity + ' Days</span>' +
						'<span style="margin: 0; padding: 5px 0px; font-weight: bold;" class="text-success pull-right">Price : ' + d.finalPrice + ' TK</span>' +
					'</div>', 
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
			$('.modal-title').html("Update Product");
			$('.form-reset').removeClass('nodisplay');
			$('.form-update').removeClass('nodisplay');
			$('.form-submit').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'));
		})

		$(row).find('.btn-view').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Product");
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
	$('#name').val(sObj.name);
	$('#smsQuantity').val(sObj.smsQuantity);
	$('#price').val(sObj.price);
	$('#vatRate').val(sObj.vatRate);
	$('#vatAmount').val(sObj.vatAmount);
	$('#discountType').val(sObj.discountType);
	$('#discountRate').val(sObj.discountRate);
	$('#discountAmount').val(sObj.discountAmount);
	$('#finalPrice').val(sObj.finalPrice);
	$('#validity').val(sObj.validity);

	$('#unlimitedValidity').prop("checked", sObj.unlimitedValidity);
	$('#sellable').prop("checked", sObj.sellable);
	$('#allowPromotion').prop("checked", sObj.allowPromotion);
	$('#resellerOnly').prop("checked", sObj.resellerOnly);
	$('#locked').prop("checked", sObj.locked);
	$('#active').prop("checked", sObj.active);

	updateVatAmount();
	updateDiscountSection();
	updateDiscountAmount();
	updateFinalPrice();
}

function resetModal(){
	$('#myModal').modal('hide');
	$('.modal-title').html("Create Product");
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
	jsonData.smsQuantity = $('#smsQuantity').val();
	jsonData.price = $('#price').val();
	jsonData.vatRate = $('#vatRate').val();
	jsonData.vatAmount = $('#vatAmount').val();
	jsonData.discountType = $('#discountType').val();
	jsonData.discountRate = $('#discountRate').val();
	jsonData.discountAmount = $('#discountAmount').val();
	jsonData.finalPrice = $('#finalPrice').val();
	jsonData.validity = $('#validity').val();

	jsonData.unlimitedValidity = $('#unlimitedValidity').is(":checked");
	jsonData.sellable = $('#sellable').is(":checked");
	jsonData.allowPromotion = $('#allowPromotion').is(":checked");
	jsonData.resellerOnly = $('#resellerOnly').is(":checked");
	jsonData.locked = $('#locked').is(":checked");
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
	var price = $('#price').val();
	if(isNaN(price)) {
		alert("Price not a number");
		return;
	}

	var discountRate = $('#discountRate').val();
	if(isNaN(discountRate)) {
		alert("Discount rate not a number");
		return;
	}

	var discountAmt = (price * discountRate)/100;
	$('#discountAmount').val(discountAmt);
}

function updateVatAmount(){
	var price = $('#price').val();
	if(isNaN(price)) {
		alert("Price not a number");
		return;
	}

	var vatRate = $('#vatRate').val();
	if(isNaN(vatRate)) {
		alert("VAT rate not a number");
		return;
	}

	var vatAmt = (price * vatRate)/100;
	$('#vatAmount').val(vatAmt);
}

function updateFinalPrice(){
	$('#finalPrice').val(0);

	var price = $('#price').val();
	if(isNaN(price)) {
		alert("Price not a number");
		return;
	}

	var vatAmt = $('#vatAmount').val();
	if(isNaN(vatAmt)) {
		alert("VAT amount not a number");
		return;
	}

	var discountAmt = $('#discountAmount').val();
	if(isNaN(discountAmt)) {
		alert("Discount amount not a number");
		return;
	}

	$('#finalPrice').val(Number(price) + Number(vatAmt) - Number(discountAmt));
}

$(document).ready(function(){

	loadTableData();


	updateVatAmount();
	updateDiscountSection();
	updateDiscountAmount();
	updateFinalPrice();
	$('#vatRate').off('blur').on('blur', function(e){
		updateVatAmount();
		updateFinalPrice();
	})
	$('#discountType').off('change').on('change', function(e){
		updateDiscountSection();
		updateFinalPrice();
	})
	$('#discountRate').off('blur').on('blur', function(e){
		updateDiscountAmount();
		updateFinalPrice();
	})
	$('#discountAmount').off('blur').on('blur', function(e){
		updateFinalPrice();
	})
	$('#price').off('blur').on('blur', function(e){
		updateFinalPrice();
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