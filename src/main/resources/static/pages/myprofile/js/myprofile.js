var tableData = [];

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
	jsonData.active = true;
	jsonData.locked = false;

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
			if(data.success){
				showMessage('success', data.message);
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

	// submit form
	$('.form-submit').off('click').on('click', function(e){
		e.preventDefault();
		submitForm('PUT');
	})

})