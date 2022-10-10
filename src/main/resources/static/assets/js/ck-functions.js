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