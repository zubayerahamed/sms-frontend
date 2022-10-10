/**
 * Application basepath
 */
function getBasepath(){
	var basePath = $('a.basePath').attr('href');
	basePath = basePath.split('/')[1];
	var href = location.href.split('/');
	if(basePath != ''){
		return href[0] + '//' + href[2] + '/' + basePath;
	}
	return href[0] + '//' + href[2];
}

function getApiBasepath(){
	return $('#apiBaseUrl').val();
}

function getApiToken(){
	return $('#apiToken').val();
}


/**
 * Data table init
 * @returns
 */
function dataTableInit(){

	$('table.datatable').each(function (tindex, table) {
		var noSortColumns = [];
		$(table).find('th[data-nosort="Y"]').each(function(i, col){
			noSortColumns.push($(col).index());
		});

		var datatable = $(table).DataTable({
			"columnDefs": [{
				"targets": noSortColumns,
				"orderable": false
			}],
			"responsive": true,
			"aaSorting": []
		});

	});
}







