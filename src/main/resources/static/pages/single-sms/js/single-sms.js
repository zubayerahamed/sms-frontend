var tableData = [];
var templateData = [];

function loadTableData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/contact",
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
			var t = $('.contact-table').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){
				if(d.active) {
					t.row.add([
						d.name, 
						d.mobile, 
						'<div class="btn-group pull-right">'+
							'<button data-mobile="'+ d.mobile +'" class="btn btn-xs btn-default btn-select">Select</button>' +
						'</div>'
					]).draw(false);
	
					tableData.push(d);
				}
			})

			setTableButtonEvents();

		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function loadTemplateTableData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/template",
		type : 'GET',
		dataType : 'json',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("Accept", "application/json");
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.setRequestHeader("Authorization", 'Bearer '+ getApiToken());
		},
		success : function(data) {
			loadingMask2.hide();

			templateData = [];
			var t = $('.template-table').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){
				if(d.active) {
					t.row.add([
						d.name, 
						d.content, 
						'<div class="btn-group pull-right">'+
							'<button data-content="'+ d.content +'" class="btn btn-xs btn-default btn-template-select">Select</button>' +
						'</div>'
					]).draw(false);

					templateData.push(d);
				}
			})

			setTemplateTableButtonEvents();

		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function setTableButtonEvents(){
	$('.btn-select').off('click').on('click', function(e){
		e.preventDefault();

		$('#myModal').modal('hide');
		$('#mobile').val($(this).data('mobile'));
	})
}

function setTemplateTableButtonEvents(){
	$('.btn-template-select').off('click').on('click', function(e){
		e.preventDefault();

		$('#templateModal').modal('hide');
		$('#content').val($(this).data('content'));
	})
}

function restForm(){
	$('#mainform').trigger("reset");
}

function submitForm(method){
	var targettedForm = $('form#mainform');
	if(!targettedForm.smkValidate()) return;

	var jsonData = {};
	jsonData.mobile = $('#mobile').val();
	jsonData.content = $('#content').val();
	jsonData.singleSms = true;
	jsonData.language = $('#language').is(":checked") ? 'BANGLA' : 'ENGLISH';

	console.log(jsonData);

	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/sendsms",
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
				restForm();
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
	loadTemplateTableData();

	$('.modal-close').off('click').on('click', function(e){
		e.preventDefault();
		$('#myModal').modal('hide');
	})
	$('.template-modal-close').off('click').on('click', function(e){
		e.preventDefault();
		$('#templateModal').modal('hide');
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

	$('.contact-modal').off('click').on('click', function(e){
		e.preventDefault();
		$('#myModal').modal('show');
	})
	$('.template-modal').off('click').on('click', function(e){
		e.preventDefault();
		$('#templateModal').modal('show');
	})

})