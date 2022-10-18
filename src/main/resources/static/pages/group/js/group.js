var tableData = [];
var contactData = [];
var selectedContactData = [];

function loadTableData(){
	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/group",
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
			var t = $('.group-table').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){

				t.row.add([
					d.name, 
					d.active ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>',
					d.totalContacts,
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

function loadContactTableData(){
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

			contactData = [];
			var t = $('.contact-table').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){

				t.row.add([
					d.name, 
					d.mobile,
					d.active ? '<span class="label label-success">Active</span>' : '<span class="label label-danger">Inactive</span>',
					'<button data-id="'+ d.id +'" class="btn btn-xs btn-default con-btn btn-select pull-right">Select</button>'
				]).draw(false);

				contactData.push(d);

			})

			setContactSelectButtonEvents(t);

		}, 
		error : function(jqXHR, status, errorThrown){
			loadingMask2.hide();
			showMessage(status, "Something went wrong .... ");
		}
	});
}

function setContactSelectButtonEvents(table){
	table.rows().every(function(index, element) {
		var row = $(this.node());
		$(row).find('button.btn-select').off('click').on('click', function(e){
			e.preventDefault();

			if($(this).html() == "Selected"){
				$(this).addClass('btn-default');
				$(this).html("Select");
				$(this).removeClass('btn-success');

				for( var i = 0; i < selectedContactData.length; i++){ 
					if ( selectedContactData[i] === $(this).data('id')) { 
						selectedContactData.splice(i, 1); 
					}
				}

			} else {
				$(this).removeClass('btn-default');
				$(this).html("Selected");
				$(this).addClass('btn-success');

				selectedContactData.push($(this).data('id'));
			}

		})
	});
}

function setTableButtonEvents(table){
	// loop thorugh each row in table
	var contactTable = $('.contact-table').DataTable();

	table.rows().every(function(index, element) {
		var row = $(this.node());
		$(row).find('.btn-delete').off('click').on('click', function(e){
			e.preventDefault();
			deleteData($(this).data('id'));
		})

		$(row).find('.btn-edit').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Update Group");
			$('.form-reset').removeClass('nodisplay');
			$('.form-update').removeClass('nodisplay');
			$('.form-submit').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'), contactTable);
			selectAllButtonEvent();
		})

		$(row).find('.btn-view').off('click').on('click', function(e){
			e.preventDefault();

			$('#myModal').modal('show');
			$('.modal-title').html("Group");
			$('.form-update').addClass('nodisplay');
			$('.form-submit').addClass('nodisplay');
			$('.form-reset').addClass('nodisplay');

			setSelectedDataToForm($(this).data('id'), contactTable);
			selectAllButtonEvent();
		})

	});

}


function setSelectedDataToForm(selectedId, table){
	var sObj = {};
	$.each(tableData, function(i, d){
		if(d.id == selectedId){
			sObj = d;
		}
	})

	$('#id').val(sObj.id);
	$('#name').val(sObj.name);
	$('#active').prop("checked", sObj.active);

	// set selected contacts
	selectedContactData = [];
	$.each(sObj.contacts, function(i, d){
		selectedContactData.push(d.id);
	})
	table.rows().every(function(index, element) {
		var row = $(this.node());
		if(selectedContactData.includes($(row).find('button.con-btn').data('id'))){
			$(row).find('button.con-btn').removeClass('btn-default');
			$(row).find('button.con-btn').html("Selected");
			$(row).find('button.con-btn').addClass('btn-success');
		} else {
			$(row).find('button.con-btn').addClass('btn-default');
			$(row).find('button.con-btn').html("Select");
			$(row).find('button.con-btn').removeClass('btn-success');
		}
	});
}

function resetModal(){
	$('#myModal').modal('hide');
	$('.modal-title').html("Create Group");
	$('.form-reset').removeClass('nodisplay');
	$('.form-update').addClass('nodisplay');
	$('.form-submit').removeClass('nodisplay');

	// reset contact table
	var contactTable = $('.contact-table').DataTable();
	contactTable.rows().every(function(index, element) {
		var row = $(this.node());
		$(row).find('button.con-btn').addClass('btn-default');
		$(row).find('button.con-btn').html("Select");
		$(row).find('button.con-btn').removeClass('btn-success');
	});
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
	jsonData.active = $('#active').is(":checked");
	jsonData.contacts = [];
	
	$.each(selectedContactData, function(i, d){
		jsonData.contacts.push({
			'id': d
		});
	})

	loadingMask2.show();
	$.ajax({
		url : getApiBasepath() + "/group",
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

function deleteData(selectedId){
	if(confirm("Are you want to delete this item!")){
		loadingMask2.show();
		$.ajax({
			url : getApiBasepath() + "/group/" + selectedId,
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

function selectAllButtonEvent(){
	// select all button
	$('#select-all-contacts').off('click').on('click', function (e) {
		var contactTable = $('.contact-table').DataTable();

		selectedContactData = [];

		if ($(this).is(':checked')) {
			contactTable.rows().every(function(index, element) {
				var row = $(this.node());
				$(row).find('button.con-btn').removeClass('btn-default');
				$(row).find('button.con-btn').html("Selected");
				$(row).find('button.con-btn').addClass('btn-success');
				selectedContactData.push($(row).find('button.con-btn').data('id'));
			});
		} else {
			contactTable.rows().every(function(index, element) {
				var row = $(this.node());
				$(row).find('button.con-btn').addClass('btn-default');
				$(row).find('button.con-btn').html("Select");
				$(row).find('button.con-btn').removeClass('btn-success');
			});
			selectedContactData = [];
		}
	});
}

$(document).ready(function(){

	loadTableData();
	loadContactTableData();

	// add button
	$('.btn-add-group').off('click').on('click', function(e){
		e.preventDefault();
		selectedContactData = [];
		resetModal();
		restForm();
		$('#myModal').modal('show');
		selectAllButtonEvent();
	});

	// modal close btn
	$('.modal-close').off('click').on('click', function(e){
		e.preventDefault();
		selectedContactData = [];
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