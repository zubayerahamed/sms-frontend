var loadingMask2 = {
	show : function(){
		$('div#loadingmask2, div.loadingdots, div#loadingdots').removeClass('nodisplay');
	},
	hide : function(){
		$('div#loadingmask2, div.loadingdots, div#loadingdots').addClass('nodisplay');
	}
}



/**
 * Show lobi message
 * @param type
 * @param message
 * @returns
 */
function showMessage(type, message){
	Lobibox.notify(type, {
		title: type,
		pauseDelayOnHover: true,
		continueDelayOnInactiveTab: true,
		size: 'mini',
		rounded: false,
		delayIndicator: true,
		sound: false,
		position: 'right top',
		msg: message
	});
}

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







