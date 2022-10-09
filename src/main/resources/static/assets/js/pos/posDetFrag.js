

$(document).ready(function() {
	// init select2 plugin
	$('.select2').select2();

	// initial focus
	$('#xtrn').focus();

	// global variables
	var trigger = false;
	var itemData = [];
	var typeData = [];
	var storeData = [];
	var bomData = [];
	var customers = [];
	var rowIndexCounter = 0;
	var rowIndex2Counter = 0;
	var rowIndex3Counter = 0;
	function initRowCounter() {
		rowIndexCounter = $("#posdetailtable tbody").find('tr').length;
	}
	initRowCounter();



	// initialize selec2 dropdown
	function initSelect2Dropdown() {
		$('#posdetailbody').find('.select2').select2();
	}
	initSelect2Dropdown();




	// initialize itemData 
	function initItemData() {
		loadingMask2.show();
		$.ajax({
			url: getBasepath() + '/production/moheader/preloadeddata',
			type: 'GET',
			success: function(data) {
				loadingMask2.hide();
				itemData = data.caitemPosList;
				costitemData = data.costitemData;
				typeData = data.moXitemList;
				customers = data.customers;
				storeData = data.storeList;
				bomData = data.bomList;
				//initselectedXitem();

				$(".item-xitem").find('option').remove().end().append('<option value="">-- Select --</option>');
				$.each(itemData, function(i, list) {
					$(".item-xitem").append($('<option>').val(list.xitem).text(list.xitem + ' - ' + list.xdesc));
				});

			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide();
			}
		})
	}
	initItemData();


	// Generate new Row in detail table
	function generateRow() {
		rowIndexCounter++;

		var itemsdropdown = '<div class="form-group"  style="width: 100%; margin:0px 0px;">' +
			'<div class="row" >' +
			'<div class="col-md-12">' +
			'<select class="form-control select2 item-xitem" name="xitem" style="width: 100%; padding:0px 0px;">' +
			'<option value=""> -- Select -- </option>';

		$.each(itemData, function(i, el) {
			itemsdropdown += '<option data-item-unit="' + el.xunitsel + '" ' +
				' data-item-rate="' + el.xrate + '" ' +
				' data-item-qty="' + el.xminsel + '" ' +
				' data-item-vat="' + el.xvatrate + '" ' +
				' data-item-disc="0" ' +
				'value=' + el.xitem + '>' + el.xitem + ' - ' + el.xdesc + '</option>';
		})

		itemsdropdown += '</select>' +
			'</div>' +
			'</div>' +
			'</div>';



		var trow = '<tr data-rowindex="' + rowIndexCounter + '" data-xsign="-1"' + '"  >' +
			'<td style="text-align: center;">' + rowIndexCounter + '</td>' +
			'<td>' + itemsdropdown + '</td>' +
			'<td>' +
			'<div class="form-group" >' +
			'<input type="text" class="form-control item-unit" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-unit"/>' +
			'</div>' +
			'</td>' +
			'<td>' +
			'<div class="form-group">' +
			'<input type="text" class="form-control item-rate" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-rate"/>' +
			'</div>' +
			'</td>' +
			'<td>' +
			'<div class="form-group" style="min-width: 50px; margin:0px 0px;">' +
			'<input type="number" class="form-control item-qty" />' +
			'</div>' +
			'</td>' +

			'<td>' +

			'<input type="text" class="form-control item-stotal" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-stotal"/>' +

			'</td>' +

			'<td>' +

			'<input type="text" class="form-control item-vat" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-vat"/>' +
			'<input type="hidden" class="form-control item-vat-pct"/>' +

			'</td>' +

			'<td>' +

			'<input type="text" class="form-control item-descount" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-descount"/>' +

			'</td>' +
			'<td>' +

			'<input type="text" class="form-control item-amount" disabled="disabled"/>' +
			'<input type="hidden" class="form-control item-amount"/>' +

			'</td>' +
			'<td style="text-align: center;">' +
			'<a href="#" class="row-creator btn btn-success"><i class="fas fa-plus-square"></i></a>' +
			'<button type="button" class="btn btn-danger row-remover"><i class="fas fa-trash"></i></button>' +

			'</td>' +
			'</tr>';

		$('#posdetailbody').append(trow);

		initSelect2Dropdown();
		rowRemove();
		changeQty();
		reserialTableRow();
		$('tr[data-rowindex="' + rowIndexCounter + '"]').find('.xitem').trigger("change");

		//Getting Unit
		$.each($('#posdetailtable tbody tr'), function(i, row) {

			$($(row).find('.item-xitem')).on('change', function(e) {
				e.preventDefault();
				$(row).find('.item-unit').val($(this).find(":selected").data('item-unit'));
				$(row).find('.item-rate').val($(this).find(":selected").data('item-rate'));
				$(row).find('.item-qty').val($(this).find(":selected").data('item-qty'));
				$(row).find('.item-qty').attr({ "min": $(this).find(":selected").data('item-qty') });
				$(row).find('.item-vat').val((($(this).find(":selected").data('item-rate') * $(this).find(":selected").data('item-qty') * $(this).find(":selected").data('item-vat')) / 100));
				$(row).find('.item-vat-pct').val($(this).find(":selected").data('item-vat'));
				$(row).find('.item-descount').val($(this).find(":selected").data('item-disc'));
				$(row).find('.item-stotal').val($(this).find(":selected").data('item-qty') * $(this).find(":selected").data('item-rate'));
				$(row).find('.item-amount').val(($(this).find(":selected").data('item-qty') * $(this).find(":selected").data('item-rate')) +
					(($(this).find(":selected").data('item-qty') * ($(this).find(":selected").data('item-rate') * $(this).find(":selected").data('item-vat')) / 100)) - ($(this).find(":selected").data('item-disc')));
				calcBill();
				calcTotalChange();
			})
		})

		$('.row-creator').off('click').on('click', function(e) {
			e.preventDefault();
			generateRow();
		});




	}


	// Remove row
	function rowRemove() {
		$('.row-remover').off('click').on('click', function(e) {
			e.preventDefault();
			$(this).parents('tr').remove();
			rowIndexCounter--;

			reserialTableRow();
		})
	}
	rowRemove();

	function changeQty() {
		$('.item-qty').keyup(function(e) {

			// Author Abu Bakkar Siddik
			// Start- Control Null Value
			var data = $(this).closest("tr").find('.item-qty').val();
			var count = data.length;
			var value = data.charAt(0);
			if (count > 1 && value == 0) {
				var data1 = data.slice(1);
				$(this).closest("tr").find('.item-qty').val(data1);
			}

			if (data == "") {
				var a = 0;
				$(this).closest("tr").find('.item-qty').val(a);

			}

			// End- Control Null Value
			var rate = $(this).closest("tr").find('.item-rate').val();
			var qty = $(this).closest("tr").find('.item-qty').val();
			var vatPct = $(this).closest("tr").find('.item-vat-pct').val();
			$(this).closest("tr").find('.item-stotal').val(parseFloat(rate) * parseFloat(qty));
			var sTotal = $(this).closest("tr").find('.item-stotal').val();
			$(this).closest("tr").find('.item-vat').val((parseFloat(sTotal) * parseFloat(vatPct)) / 100);
			var vat = $(this).closest("tr").find('.item-vat').val();
			var disc = $(this).closest("tr").find('.item-descount').val();
			$(this).closest("tr").find('.item-amount').val(parseFloat(sTotal) + parseFloat(vat) - parseFloat(disc));
			calcBill();
			calcTotalChange();
		})

	}


	// Row creator button event
	$('.row-creator').off('click').on('click', function(e) {
		e.preventDefault();
		generateRow();
	});


	$('.batch-confirm-btn').off('click').on('click', function(e) {
		e.preventDefault();
		submitForm();
	});

	function calcBill() {
		var invoiceTotal = 0.00;
		var discountTotal = 0.00;
		var vatTotal = 0.00;
		var roundChange = 0;
		var netPayable = 0;
		var round = 0;


		var rows = $("#posdetailtable tbody").find('tr');
		$.each(rows, function(i, row) {
			invoiceTotal += parseFloat($(row).find('.item-stotal').val());
			vatTotal += parseFloat($(row).find('.item-vat').val());
			discountTotal += parseFloat($(row).find('.item-descount').val());
		})

		roundChange = (invoiceTotal + vatTotal - discountTotal).toFixed();
		round = (roundChange - (invoiceTotal + vatTotal - discountTotal)).toFixed(2);

		$('#invoiceTotal').text(invoiceTotal.toFixed(2));
		$('#vatTotal').text(vatTotal.toFixed(2));
		$('#discountTotal').text(discountTotal.toFixed(2));
		$('#roundChange').text(round);
		$('#netPayable').text(roundChange);




	}

	calcBill();
	// Form submit
	function submitForm() {
		var formValues = $('.batch-header-form').serializeArray();

		var moheader = {};

		$.each(formValues, function(i, data) {
			moheader[data.name] = data.value;
		});

		var modetails = [];

		var rows = $("#modetailtable tbody").find('tr');
		$.each(rows, function(i, row) {
			var modetail = {};
			modetail.xitem = $(row).find('.item-xitem').val();
			modetail.xtype = $(row).find('.item-xtype').val();
			modetail.xqty = $(row).find('.item-qty').val();
			modetail.xqtyplan = $(row).find('.item-xqtyplan').val();
			modetail.xunit = $(row).find('.item-unit').val();
			modetail.xnote = $(row).find('.item-xnote').val();
			modetail.xsign = $(row).data('xsign');
			modetails.push(modetail);
		})


		var row = $("#modetailtable2 tbody").find('tr');
		$.each(row, function(i, row) {
			var modetail2 = {};
			modetail2.xitem = $(row).find('.item-xitem').val();
			modetail2.xtype = $(row).find('.item-xtype').val();
			modetail2.xqtyplan = $(row).find('.item-xqtyplan').val();
			modetail2.xqty = $(row).find('.item-qty').val();
			modetail2.xunit = $(row).find('.item-unit').val();
			modetail2.xnote = $(row).find('.item-xnote').val();
			modetail2.xsign = $(row).data('xsign');
			modetails.push(modetail2);
		})

		var rowa = $("#modetailtable3 tbody").find('tr');
		$.each(rowa, function(i, row) {
			var modetail3 = {};
			modetail3.xitem = $(row).find('.item-xitem').val();
			modetail3.xtype = $(row).find('.item-xtype').val();
			modetail3.xqtyplan = $(row).find('.item-xqtyplan').val();
			modetail3.xqty = $(row).find('.item-qty').val();
			modetail3.xunit = $(row).find('.item-unit').val();
			modetail3.xnote = $(row).find('.item-xnote').val();
			modetail3.xsign = $(row).data('xsign');
			modetail3.xtype = $(row).data('xtype');
			modetails.push(modetail3);
		})

		var batchMaster = {};
		batchMaster.moheader = moheader;
		batchMaster.modetails = modetails;

		loadingMask2.show();
		$.ajax({
			url: getBasepath() + '/production/productionprocess/savebatch',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(batchMaster),
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader("Content-Type", "application/json");
			},
			success: function(data) {
				loadingMask2.hide();
				if (data.status == 'SUCCESS') {
					showMessage(data.status.toLowerCase(), data.message);
					if (data.triggermodalurl) {
						modalLoader(getBasepath() + data.triggermodalurl, data.modalid);
					} else {
						if (data.reloadurl) {
							doSectionReloadWithNewData(data);
						} else if (data.redirecturl) {
							setTimeout(() => {
								window.location.replace(getBasepath() + data.redirecturl);
							}, 1000);
						}
					}
				} else {
					showMessage(data.status.toLowerCase(), data.message);
				}
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide()
			}
		})
	}

	function reserialTableRow() {
		var rows = $("#modetailtable tbody").find('tr');
		$.each(rows, function(i, elem) {
			$(elem).find('td:first').text(i + 1);
		});
	}
	reserialTableRow();



	// Submit using key ctrl + Entr
	$(document).on('keydown', function(e) {
		if (e.keyCode == 17) {
			trigger = true;
		}
		if (!(e.keyCode == 17 || e.keyCode == 13)) {
			trigger = false;
		}
		if (trigger && e.keyCode == 13) {
			submitForm();
		}
	});

	// right panel toggler
	$('.right-panel-toggler').off('click').on('click', function(e) {
		e.preventDefault();

		if ($('.right-panel').hasClass('menu-close')) {
			$(this).html();
			$(this).html('<i class="fas fa-caret-right"></i>');
			$(this).animate({
				'right': '75%',
				'opacity': '1'
			}, 200);
			$('.right-panel').animate({
				'width': '75%',
				'opacity': '1'
			}, 200);
			$('.right-panel').removeClass('menu-close');
		} else {
			$(this).html();
			$(this).html('<i class="fas fa-caret-left"></i>');
			$(this).animate({
				'right': '0%',
				'opacity': '.5'
			}, 200);
			$('.right-panel').animate({
				'width': '0%',
				'opacity': '0'
			}, 200);
			$('.right-panel').addClass('menu-close');
		}
	});


	// on change effect
	function batchUnitSeleection() {
		$('.batch-xitem').on('change', function(e) {
			e.preventDefault();
			var itemCode = $(this).val();
			$.each(itemData, function(i, item) {
				if (item.xitem == itemCode) {
					$('.batch-item-unit').val(item.xunitsel);
				}
			})
		})
	}
	batchUnitSeleection();

	//get selected stor list
	$('.project-xhwh').on('change', function(e) {
		e.preventDefault();
		initSelectedProjectStore();
	})
	function initSelectedProjectStore() {
		selectedStores = [];
		var selectedProject = $('.project-xhwh').val();
		$.each(storeData, function(i, data) {
			if (data.xproject == selectedProject) {
				selectedStores.push(data);
			}
		});

		$(".selectedStores").find('option').remove().end().append('<option value="">-- Select --</option>');
		$.each(selectedStores, function(i, list) {
			$(".selectedStores").append($('<option>').val(list.xcode).text(list.xcode + ' - ' + list.xcodename));
		});


	}


	//get select BOM list
	$('.batch-xitem').on('change', function(e) {
		e.preventDefault();
		initSelectedBOM();
	})
	function initSelectedBOM() {
		selectedBOM = [];
		var selectedItem = $('.batch-xitem').val();
		$.each(bomData, function(i, data) {
			if (data.xitem == selectedItem) {
				selectedBOM.push(data);
			}
		});

		$(".selectedBOM").find('option').remove().end().append('<option value="">-- Select --</option>');
		$.each(selectedBOM, function(i, list) {
			$(".selectedBOM").append($('<option>').val(list.xbomkey).text(list.xbomkey + ' - ' + list.xdesc));
		});
	}
	initSelectedBOM();



	$("body").on("click tap", ".cusSave", function(event) {
		var cusName = $('#cusName').val();
		var cusPhone = $('#cusPhone').val();
		var cusAddress = $('#cusAddress').val();

		if (cusName == '' && cusPhone == '') {
			showMessage("error", "Customer name or phone should not empty");
			return;
		}

		if (cusName == '' && cusPhone == '' && cusAddress == '') {
			showMessage("error", "Customer Information Should Not Empty");
			return;
		}


		$.ajax({
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			type: 'GET',
			url: getBasepath() + '/pos/saveCustomer?cusName=' + cusName + '&cusPhone=' + cusPhone + '&cusAddress=' + cusAddress,
			data: '',
			success: function(data) {
				loadingMask2.hide();
				if (data.status == 'SUCCESS') {
					showMessage(data.status.toLowerCase(), data.message);
					$('.customerName').val(data.cusId + ' ' + data.customerName);

					$('input[name="cacuspos.xcuspos"]').val(data.cusId);


				} else {
					showMessage(data.status.toLowerCase(), data.message);
				}
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide()
			}

		});

		$('#myModal').modal('hide');
	});



	$(document).ready(function() {
		// Init ui for modal
		ck.ui.config.buttonevent();

		$('.xhwhsearch').on('blur', function() {
			setTimeout(() => {
				if ($('input[name="opdoheader.xhwh"]').val() == '') {
					$("#opdoheader\\.xwh option").remove();
					var mySelect = $('#opdoheader\\.xwh');
					mySelect.append(
						$('<option></option>').val("").html("-- Select --")
					);
					return;
				}

				loadingMask2.show();
				$.ajax({
					url: getBasepath() + '/salesninvoice/directsales/allcodesbyproject/' + $('input[name="opdoheader.xhwh"]').val(),
					type: 'GET',
					success: function(data) {
						loadingMask2.hide();
						if (data == undefined || data == null) return;

						$("#opdoheader\\.xwh option").remove();
						var mySelect = $('#opdoheader\\.xwh');
						mySelect.append(
							$('<option></option>').val("").html("-- Select --")
						);
						$.each(data, function(val, obj) {
							mySelect.append(
								$('<option></option>').val(obj.xcode).html(obj.xcode + ' - ' + obj.xcodename)
							);
						});

					},
					error: function(jqXHR, status, errorThrown) {
						showMessage(status, "Something went wrong .... ");
						loadingMask2.hide();
					}
				})
			}, 1000);
		});
	});

	function rowgen() {
		var trow = `\
              <tr class="table__body-row">\
                 
                 
                                 <td class="table__body-cell">
                                    <select   id="" class="posCardType form-control" name="">
			                           <option value="0">Select</option>
			                           <option value="Debit Card">Debit Card</option>
			                           <option value="Visa Card">Visa Card</option>
			                           <option value="Master Card">Master Card</option>
			                        </select>
                                 </td>\
                                 <td class="table__body-cell">
                                    <input
                                       type="text"
                                       class="posCardNumber form-control"
                                        
                                       />
                                 </td>
                                 <td class="table__body-cell">
                                    <input
                                       type="text"
                                       class="posCardTrans form-control"
                                       
                                       />
                                 </td>
                                 <td class="table__body-cell">
                                    <input
                                       type="text"
                                       class="posCardAmount form-control"
                                       value ="0"
                                       />
                                 </td>
                                 <td class="table__body-cell" >
                                    
                                 <a class="newCard btn btn-success" ><i class="fas fa-plus-square"></i></a>
                                 <a class="newCardremove btn btn-danger" ><i class="fas fa-trash"></i></a>
                                   
                                 </td>\
              </tr>`;

		$('#poscardbody').append(trow);

		$('.posCardAmount').keyup(function() {
			calcTotalCardAmount();
		});


	}
	$("body").on("click tap", ".newCard", function(event) {
		rowgen()
		rowRemoved()
		$("body").on("click tap", ".newCard", function(event) {
			rowRemoved()
		});
		$('.posCardAmount').keyup(function() {
			calcTotalCardAmount();
		});
	});

	$('.card0ele').keyup(function() {
		var rowCount = $('#table22 tr').length;
		if (rowCount == 1) {
			rowgen()
			rowRemoved()

			$("body").on("click tap", ".newCard", function(event) {
				rowRemoved()
			});

		}

		var val222 = $('#card0type').val();

		$("#table22 tr:first-child .posCardType").val(val222);
		$("#table22 tr:first-child .posCardType").prop('disabled', true);
		$("#table22 tr:first-child .posCardNumber").val($('#card0Number').val());
		$("#table22 tr:first-child .posCardNumber").prop('disabled', true);
		$("#table22 tr:first-child .posCardTrans").val($('#card0trans').val());
		$("#table22 tr:first-child .posCardTrans").prop('disabled', true);
		$("#table22 tr:first-child .posCardAmount").val($('#card0Amount').val());
		$("#table22 tr:first-child .posCardAmount").prop('disabled', true);
		calcTotalCardAmount();
	});

	function rowRemoved() {
		$('.newCardremove').off('click').on('click', function(e) {
			e.preventDefault();
			$(this).parents('tr').remove();

		})

	}
	rowRemoved();

	function calcTotalCardAmount() {

		var totalCardAmount = 0;
		// Author Abu Bakkar Siddik
		// Start- Control Null Value
		var data = $('.posCardAmount').val();
		var count = data.length;
		var value = data.charAt(0);
		if (count > 1 && value == 0) {
			var data1 = data.slice(1);
			$('.posCardAmount').val(data1);
		}

		if (data == "") {
			var a = 0;
			$('.posCardAmount').val(a);
		}

		// End- Control Null Value

		var rows = $("#table22 tbody").find('tr');
		$.each(rows, function(i, row) {
			totalCardAmount += parseFloat($(row).find('.posCardAmount').val());

		})

		$('#totalCardAmount').text(totalCardAmount);

		calcTotalpaid();
		calcTotalChange();

	};
	function calcTotalpaid() {
		$('#totalPaid').text(parseFloat($('#totalCashAmount').val()) + parseFloat($('#totalCardAmount').text()));
	}

	$('#totalCashAmount').keyup(function() {
		// Author Abu Bakkar Siddik
		// Start- Control Null Value
		var data = $('#totalCashAmount').val();
		var count = data.length;
		var value = data.charAt(0);
		if (count > 1 && value == 0) {
			var data1 = data.slice(1);
			$('#totalCashAmount').val(data1);
		}

		if (data == "") {
			var a = 0;
			$('#totalCashAmount').val(a);
		}
		// End- Control Null Value
		calcTotalpaid();
		calcTotalChange();
	});

	function calcTotalChange() {
		$('#totalChangeAmount').text(parseFloat($('#totalPaid').text()) - parseFloat($('#netPayable').text()));
	}

	var item = $('#card0type').val();
	if (item == '') {
		$('.card-num').hide();
		$('.card-tran').hide();
		$('.card-amt').hide();
		$('.multi-card').hide();
	}

	$('#card0type').on("click", function() {
		var item = $('#card0type').val();
		if (item != '') {
			$('.card-num').show();
			$('.card-tran').show();
			$('.card-amt').show();
			$('.multi-card').show();
		} else {
			$('.card-num').hide();
			$('.card-tran').hide();
			$('.card-amt').hide();
			$('.multi-card').hide();
		}
	});
	// Searching by Invoice
	$("#bnSearch").on("click", function(event) {
		var xdornum = document.getElementById("exampleInputName2").value;
		$.ajax({
			url: getBasepath() + '/pos/' + xdornum,
			type: 'GET',
			success: function(data) {
				if (data == undefined || data == null) return;

				$('input[name="posDto.opdoheader.xdornum"]').val(data.xdornum);
				$('input[name="opdoheader.xdate"]').val(data.xdate);
				$('input[name="s.xcode"]').val(data.xstation);
				$('input[name="posDto.opdoheader.xhwh"]').val(data.xhwh);
				$('input[name="opdoheader.xwh"]').val(data.xwh);
				$('input[name="posDto.opdoheader.xpreparer"]').val(data.xpreparer);
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
				/*loadingMask2.hide();*/
			}
		})
	});
	// Go to Top Information
	$("#bnTop").one("click", function(event) {
		$.ajax({
			url: getBasepath() + '/pos/topinfo/',
			type: 'GET',
			success: function(data) {
				if (data == undefined || data == null) return;

				$('input[name="posDto.opdoheader.xdornum"]').val(data.xdornum);
				$('input[name="opdoheader.xdate"]').val(data.xdate);
				$('input[name="s.xcode"]').val(data.xstation);
				$('input[name="posDto.opdoheader.xhwh"]').val(data.xhwh);
				$('input[name="opdoheader.xwh"]').val(data.xhwh);
				$('input[name="posDto.opdoheader.xpreparer"]').val(data.xpreparer);
			},
			error: function(jxXHR, status, errorThrown) {
				showMessage(status, "Something went wrong ....");
			}
		})
	});

	// Go to Bottom Information
	$("#bnBottom").on("click", function(event) {
		$ajax({
			url: getBasepath() + '/pos/bottominfo/',
			type: 'GET',
			success: function(data) {
				if (data == undefined || data == null) return;

				$('input[name="posDto.opdoheader.xdornum"]').val(data.xdornum);
				$('input[name="opdoheader.xdate"]').val(data.xdate);
				$('input[name="s.xcode"]').val(data.xstation);
				$('input[name="posDto.opdoheader.xhwh"]').val(data.xhwh);
				$('input[name="opdoheader.xwh"]').val(data.xhwh);
				$('input[name="posDto.opdoheader.xpreparer"]').val(data.xpreparer);
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
			}
		})
	});

	// Go to Previous Information
	$("#bnPrevious").on("click", function(event) {
		$ajax({
			url: getBasepath() + '/pos/previousinfo',
			type: 'GET',
			success: function(data) {
				if (data == undefined || data == null) return;
				$('input[name="posDto.opdoheader.xdornum"]').val(data.xdornum);
				$('input[name="opdoheader.xdate"]').val(data.xdate);
				$('input[name="s.xcode"]').val(data.xstation);
				$('input[name="posDto.opdoheader.xhwh"]').val(data.xhwh);
				$('input[name="opdoheader.xwh"]').val(data.xhwh);
				$('input[name="posDto.opdoheader.xpreparer"]').val(data.xpreparer);
			},
			error: function(xhr, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
			}
		})
	});

	// Go to Next Information
	$('#bnNext').on("click", function(event) {
		$ajax({
			url: getBasepath() + '/pos/nextinfo',
			type: 'GET',
			success: function(data) {
				if (data == undefined || data == null) return;

				$('input[name="posDto.opdoheader.xdornum"]').val(data.xdornum);
				$('input[name="opdoheader.xdate"]').val(data.xdate);
				$('input[name="s.xcode"]').val(data.xstation);
				$('input[name="posDto.opdoheader.xhwh"]').val(data.xhwh);
				$('input[name="opdoheader.xwh"]').val(data.xhwh);
				$('input[name="posDto.opdoheader.xpreparer"]').val(data.xpreparer);
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
			}
		})
	});


	$("body").on("click tap", ".posconfirmbtn", function(event) {
		submitFrom();
	});

	function submitFrom() {
		var formValues = $('.batch-header-form').serializeArray();
		var posDto = {};
		var opdoheader = {
			xdate: $('#xdate').val(),
			xhwh: $('input[name="opdoheader.xhwh"]').val(),
			xwh: $('#opdoheader\\.xwh').val(),
			xpreparer: $('input[name="opdoheader.xpreparer"]').val(),
			xstation: $('#opdoheader\\.xstation').val(),
			xcus: 'CUS-000000',
			xpaymenttype: 'Cash',
			xtotamt: $('#invoiceTotal').text(),
			xvatamt: $('#vatTotal').text(),
			xaitamt: '0.0',
			xdiscamt: $('#discountTotal').text(),
			xstatusord: 'Open',
			xstatusjv: 'Open',
			xpaid: $('#totalPaid').text(),
			xshipamt: '0.0',
			xcardno: $('#card0Number').val(),
			xcardtrn: $('#card0trans').val(),
			xcardtype: $('#card0type').val(),
			xpaidcard: $('#card0Amount').val(),
			xpaidcash: $('#totalCashAmount').val(),

			xchange: $('#totalChangeAmount').text(),
			xtype: 'POS',
			xstatusar: 'Open',
			xvoucher: 'Open',
			xgrandtot: $('#netPayable').text(),
			xtrn: 'DO--',
			xtypetrn: 'Sales Number',
			xnote: '',

			xcuspos: $('input[name="cacuspos.xcuspos"]').val(),
			xroundchange: $('#roundChange').text(),

		};

		if (opdoheader.xdate == '') {
			showMessage("error", "Date Should Not Empty ");
			return;
		}

		if (opdoheader.xhwh == '') {
			showMessage("error", "Business Should Not Empty ");
			return;
		}
		if (opdoheader.xwh == '') {
			showMessage("error", "Store Should Not Empty ");
			return;
		}
		if (opdoheader.xpreparer == '') {
			showMessage("error", "Staff Should Not Empty ");
			return;
		}



		posDto.opdoheader = opdoheader;
		var opdodetails = [];
		var rows = $("#posdetailtable tbody").find('tr');
		$.each(rows, function(i, row) {
			var opdodet = {};
			opdodet.xitem = $(row).find('.item-xitem').val();
			opdodet.xunitsel = $(row).find('.item-unit').val();
			opdodet.xrate = $(row).find('.item-rate').val();
			opdodet.xqtyord = $(row).find('.item-qty').val();
			opdodet.xlineamt = $(row).find('.item-stotal').val();
			opdodet.xvatamt = $(row).find('.item-vat').val();
			opdodet.xdiscamt = $(row).find('.item-descount').val();
			opdodet.xlineamttot = $(row).find('.item-amount').val();
			opdodetails.push(opdodet);
		})

		for (var i = 0; i < opdodetails.length; i++) {
			var opdodet = opdodetails[i];
			if (opdodet.xitem == '') {
				showMessage("error", "Item Name Should Not Empty");
				return;
			}
		}


		posDto.opdodetails = opdodetails;

		var cacardpos = [];
		var rows = $("#table22 tbody").find('tr');
		$.each(rows, function(i, row) {
			var cacard = {};
			cacard.xcardtype = $(row).find('.posCardType').val();
			cacard.xcardno = $(row).find('.posCardNumber').val();
			cacard.xtrnno = $(row).find('.posCardTrans').val();
			cacard.xamount = $(row).find('.posCardAmount').val();
			cacardpos.push(cacard);
		})
		posDto.cacardpos = cacardpos;
		if (cacardpos.length > 0) {

			for (var i = 0; i < cacardpos.length; i++) {
				var cacardp = cacardpos[i];

				/**if(cacardp.xcardtype == '' || cacardp.xcardtype == null){
					showMessage("error", "Card Type Should Not Empty");
					return;
				}*/

				if (cacardp.xcardno == '') {
					showMessage("error", "Card No Should Not Empty");
					return;
				}
				if (cacardp.xtrnno == '') {
					showMessage("error", "Card Transection No Should Not Empty");
					return;
				}
				if (cacardp.xamount == '') {
					showMessage("error", "Card Amount Should Not Empty");
					return;
				}
			}

		}

		if (opdoheader.xchange == '' || opdoheader.xchange < 0) {
			$('#totalChangeAmount').css("color", "red");
			showMessage("error", "Change Amount Should Not Less Then Zero(0)");
			return;
		} else {
			$('#totalChangeAmount').css("color", "green");
		}

		$.ajax({
			url: getBasepath() + '/pos/savepos',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(posDto),
			beforeSend: function(xhr) {
				xhr.setRequestHeader("Accept", "application/json");
				xhr.setRequestHeader("Content-Type", "application/json");
			},
			success: function(data) {
				loadingMask2.hide();
				console.log(data);
				if (data.status == 'SUCCESS') {
					showMessage(data.status.toLowerCase(), data.message);
					window.location.replace(getBasepath() + data.redirecturl);
				} else {
					showMessage(data.status.toLowerCase(), data.message);
				}
			},
			error: function(jqXHR, status, errorThrown) {
				showMessage(status, "Something went wrong .... ");
				loadingMask2.hide()
			}
		})
	}



})
