var totalRetreivedData = 0;
var debounce = null;

$(document).ready(function(){
	var dataLimit;
	var dataHint;
	var selectedPage = 1;
	var sortedColumn;
	var sortType;

	function initParameters(){
		dataLimit = $('.data-limit').val();
		dataHint = $('.data-hint').val();
		if($('.paging-btn.active').data('page') != undefined) selectedPage = $('.paging-btn.active').data('page');
		sortedColumn = $('.active-sortable-column').data('column');
		sortType = $('.active-sortable-column').data('sort');
		console.log(dataLimit + " - " + dataHint + ' - ' + selectedPage + ' - ' + sortedColumn + ' - ' + sortType);
	}

	function fetchTableData(){
		initParameters();

		loadingMask2.show();
		$.ajax({
			url : getBasepath() + '/procurements/poord/data',
			type : 'POST',
			data : {
				"limit" : dataLimit,
				"hint" : dataHint,
				"page" : selectedPage,
				"orderBy" : sortedColumn,
				"sortType" : sortType
			},
			success : function(data) {
				loadingMask2.hide();
				console.log(data)
				totalRetreivedData = data.count;
				prepareTableFromData(data);
				generatePaginationFromData(data);
				
				$('#startValue').text((selectedPage - 1) * dataLimit + 1);
				$('#endValue').text(((selectedPage * dataLimit) > data.count) ? data.count : (selectedPage * dataLimit));
				$('#totalData').text(data.count);
			}, 
			error : function(jqXHR, status, errorThrown){
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide();
			}
		}); 
	}
	fetchTableData();

	function prepareTableFromData(data){
		$('#paginatedTable').find('tbody').html("");

		for (var i = 0; i < data.poordHeader.length; i++) {

			var xpornum = data.poordHeader[i].xpornum;
			var xdate = moment(new Date(data.poordHeader[i].xdate)).format('ddd, DD-MMM-YYYY');
			if(xdate == undefined || xdate == 'Invalid date') xdate = "";
			var xcus = data.poordHeader[i].xcus == undefined ? "" : data.poordHeader[i].xcus + '-' + data.poordHeader[i].xorg;
			var xtotamt = data.poordHeader[i].xtotamt == undefined ? "" : data.poordHeader[i].xtotamt;
			var xstatuspor = data.poordHeader[i].xstatuspor == undefined ? "" : data.poordHeader[i].xstatuspor;

			var row = $('<tr>'
							+ '<td><a href="'+ getBasepath() +'/procurements/poord/'+ xpornum +'">' + xpornum + '</a></td>'
							+ '<td>' + xdate + '</td>'
							+ '<td>' + xcus + '</td>'
							+ '<td>' + xtotamt + '</td>'
							+ '<td>' + xstatuspor + '</td>'
						+'</tr>');

			$('#paginatedTable').find('tbody').append(row);
		}
		 
	}

	function generatePaginationFromData(data){

		var numberOfData = data.count;
		var totalPage = Math.ceil(numberOfData / dataLimit);

		var nextBtn = '<li class="paging-btn" data-page="NEXT"><a href="#">Next</a></li>';
		var prevBtn = '<li class="paging-btn" data-page="PREV"><a href="#">Prev</a></li>';
		var dotBtn = '<li class="paging-btn disabled" data-page="DOT"><a href="#">...</a></li>';
		if(selectedPage == 1) {
			prevBtn = '<li class="paging-btn disabled" data-page="PREV"><a href="#">Prev</a></li>';
		}
		if(selectedPage == totalPage){
			nextBtn = '<li class="paging-btn disabled" data-page="NEXT"><a href="#">Next</a></li>';
		}

		var prevDotPrint = true;
		var nextDotPrint = true;

		var pagingUl = $('ul.pagination');
		$(pagingUl).find('li').remove();

		for(var i = 1; i <= totalPage; i++) {

			if(i == 1) $(pagingUl).append(prevBtn);

			if(totalPage <= 5) {
				if(selectedPage == i) {
					$(pagingUl).append('<li class="active paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
				} else {
					$(pagingUl).append('<li class="paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
				}
			} else {
				if(i == 1 && selectedPage != i) $(pagingUl).append('<li class="paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');

				if((selectedPage - 1 ) - 1 > 1 && prevDotPrint) {
					$(pagingUl).append(dotBtn);
					prevDotPrint = false;
				}

				if(selectedPage - 1 == i && (selectedPage - 1) != 1) {
					$(pagingUl).append('<li class="paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
				}
				if(selectedPage == i) {
					$(pagingUl).append('<li class="active paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
				}
				if(selectedPage + 1 == i && (selectedPage + 1) != totalPage) {
					$(pagingUl).append('<li class="paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
				}

				if(i > (selectedPage + 1) && (selectedPage + 1 ) + 1 < totalPage && nextDotPrint) {
					$(pagingUl).append(dotBtn);
					nextDotPrint = false;
				}

				if(i == totalPage && selectedPage != i) $(pagingUl).append('<li class="paging-btn" data-page="'+ i +'"><a href="#">'+ i +'</a></li>');
			}

			if(i == totalPage) $(pagingUl).append(nextBtn);
		}

		bindPaginationButEvent(totalPage);

	}

	function bindPaginationButEvent(totalPage){

		$('.paging-btn').off('click').on('click', function(e){
			e.preventDefault();

			var selectedBtn = $(this).data('page');

			var existingSelectedBtn = $('.paging-btn.active').data('page');

			if(selectedBtn == 'PREV'){
				if(existingSelectedBtn == 1) return;
				$('.paging-btn').removeClass('active');
				$('li[data-page="'+ (existingSelectedBtn - 1) +'"]').addClass('active');
			} else if (selectedBtn == 'NEXT') {
				if(existingSelectedBtn == totalPage) return;
				$('.paging-btn').removeClass('active');
				$('li[data-page="'+ (existingSelectedBtn + 1) +'"]').addClass('active');
			} else if (selectedBtn == 'DOT') {
				return;
			} else {
				$('.paging-btn').removeClass('active');
				$(this).addClass('active');
			}


			fetchTableData();
		})
		
	}


	$("#data-limit").off('change').on('change', function(e){
		var currentSelectedLimit = $(this).val();
		var totalPage = Math.ceil(totalRetreivedData / currentSelectedLimit);
		var currentSelectedPage = $('.paging-btn.active').data('page');
		if(totalPage < currentSelectedPage){
			$('.paging-btn').removeClass('active');
			$('li[data-page="1"]').addClass('active');
		}
		fetchTableData();
	}); 

	$('.data-hint').off('keyup').on('keyup', function(e){
		if(debounce != null) clearTimeout(debounce);
		debounce = setTimeout(function(){
			fetchTableData();
		}, 2000);
	});
	
	$('th').off('click').on('click', function(e){
		 e.preventDefault();
		 $('.sortable-column').removeClass('active-sortable-column').children().removeClass('. col-sort-arrow-active ');
		 $(this).addClass('active-sortable-column');
		 $(this).find($('.col-sort-arrow')).removeClass('col-sort-arrow-active').addClass('col-sort-arrow-active');
		if(sortType=='DESC'){
			$(this).data('sort', "ASC")
			$(this).find($(".fas")).removeClass('fas fa-sort-amount-down').addClass('fas fa-sort-amount-up');
		}else{
			$(this).data('sort', "DESC")
			$(this).find($(".fas")).removeClass('fas fa-sort-amount-up').addClass('fas fa-sort-amount-down');
			
		}
		
		fetchTableData();
		
	});
	
})