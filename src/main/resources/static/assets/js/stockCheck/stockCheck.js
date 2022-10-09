
$(document).ready(function() {
	
	
	$('.confirm-btn-link').off('click').on('click', function(e){		
		e.preventDefault();
		
		var submitUrl = $(this).attr('href');
		var submitType = 'POST'
		
		var mdl = '<div id="myModal" class="modal fade" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title" style="color: red;">Stock Not Available!</h4></div><div class="modal-body"><div id="dynamicTable"></div></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div></div>	</div></div>'
		
		$("body").append(mdl);

		loadingMask2.show();
		$.ajax({
			url : submitUrl,
			type :submitType,
			success : function(data) {
				loadingMask2.hide();
				if(data.status == 'SUCCESS'){
					
					$('#dynamicTable').find('table').remove();

					// create table
					var $table = $('<table class="table table-striped table-bordered normal-table nowrap text-center">');

					
					$table
					// thead
					.append('<thead>').children('thead')
					.append('<tr />').children('tr').append(
							'<th class= "text-left">Item</th><th class= "text-center">Unit</th><th class= "text-center">Document Qty.</th><th class= "text-center">Available Qty.</th><th class= "text-center">Deviation</th>'
						);

					//tbody
					var $tbody = $table.append('<tbody />').children('tbody');
					
					$.each(data.modaldata, function(val, obj) {
						//console.log(obj.xitem);
						if(obj.result == false){
						// add row
						$tbody.append('<tr />').children('tr:last')
						.append('<td class= "text-left">'+obj.xitem+"  "+obj.xitem_xdesc+"</td>")
						.append("<td>"+obj.xunit+"</td>")
						.append("<td>"+obj.xqty.toFixed(2)+"</td>")
						.append("<td>"+obj.avlqty.toFixed(2)+"</td>")
						.append('<td style="color: red;">'+obj.deviation.toFixed(2)+"</td>")
						}
					});
					

					// add table to dom							
					$table.appendTo('#dynamicTable');																	
					
					if(data.displayMessage == true) showMessage(data.status.toLowerCase(), data.message);
					
					if(data.openmodal == true){
						
						$("#myModal").modal('show');
						
						return;
					}

					if(data.triggermodalurl){
						modalLoader(getBasepath() + data.triggermodalurl, data.modalid);
					} else {
						if(data.reloadurl){
							doSectionReloadWithNewData(data);
						} else if(data.redirecturl){
							setTimeout(() => {
								window.location.replace(getBasepath() + data.redirecturl);
							}, 1000);
						}
					} 
				} else {
					showMessage(data.status.toLowerCase(), data.message);
				}
			}, 
			error : function(jqXHR, status, errorThrown){
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide();
			}
		});
		
		
	});
	
});