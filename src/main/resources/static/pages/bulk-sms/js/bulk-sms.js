var tableData = [];
var templateData = [];
var selectedGroupData = [];

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
			var t = $('.contact-table').DataTable();
			t.clear().draw();
			$.each(data.items, function(i, d){
				if(d.active) {
					t.row.add([
						d.name, 
						d.totalContacts, 
						'<div class="btn-group pull-right">'+
							'<button data-id="'+ d.id +'" class="btn btn-xs btn-default btn-select">Select</button>' +
						'</div>'
					]).draw(false);
	
					tableData.push(d);
				}
			})

			setTableButtonEvents(t);

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

			setTemplateTableButtonEvents(t);

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
		$(row).find('button.btn-select').off('click').on('click', function(e){
			e.preventDefault();

			if($(this).html() == "Selected"){
				$(this).addClass('btn-default');
				$(this).html("Select");
				$(this).removeClass('btn-success');

				for( var i = 0; i < selectedGroupData.length; i++){ 
					if ( selectedGroupData[i] === $(this).data('id')) { 
						selectedGroupData.splice(i, 1); 
					}
				}

			} else {
				$(this).removeClass('btn-default');
				$(this).html("Selected");
				$(this).addClass('btn-success');

				selectedGroupData.push($(this).data('id'));
			}

		})
	});
}

function setTemplateTableButtonEvents(table){
	table.rows().every(function(index, element) {
		var row = $(this.node());
		$(row).find('button.btn-template-select').off('click').on('click', function(e){
			e.preventDefault();

			$('#templateModal').modal('hide');
			$('#content').val($(this).data('content'));
		})
	});
}

function restForm(){
	$('#mainform').trigger("reset");
	selectedGroupData = [];
	$('.groups-container').html("");
	$('.total-contacts').html('Total 0 Contact');
}

function submitForm(method){
	var targettedForm = $('form#mainform');
	if(!targettedForm.smkValidate()) return;

	var jsonData = {};
	jsonData.content = $('#content').val();
	jsonData.singleSms = false;
	jsonData.language = $('#language').is(":checked") ? 'BANGLA' : 'ENGLISH';
	jsonData.groups = [];
	$.each(selectedGroupData, function(i, d){
		jsonData.groups.push({
			'id' : d
		});
	})

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

		// create tags with selected groups
		var total = 0;
		$('.groups-container').html("");
		$.each(tableData, function(i, d){
			$.each(selectedGroupData, function(j, selected){
				if(selected === d.id){
					$('.groups-container').append('<span class="label label-success group-label">'+ d.name + ' ('+ d.totalContacts +')');
					total = total + d.totalContacts;
				}
			})
		})

		var totalText = total > 1 ? ' Contacts' : ' Contact';
		$('.total-contacts').html('Total ' + total + totalText)
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