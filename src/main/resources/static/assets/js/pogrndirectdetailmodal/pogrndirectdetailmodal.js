$(document).ready(function(){
				// Init ui for modal
				ck.ui.config.buttonevent();
				//$(".xitemsearch").click();

				$('#xqtygrn').on('blur', function(e){
					e.preventDefault();
					calculateLineAmount();
				});

				$('#xrate').on('blur', function(e){
					e.preventDefault();
					calculateLineAmount();
				});

				function calculateLineAmount(){
					var qty = $('#xqtygrn').val();
					var rate = $('#xrate').val();
					$('.xlineamt').val(qty * rate);
					$('#xlineamt').val(qty * rate);
				}
				
				/* if( ($('#xtype').val() == 'Service') || ($('#xtype').val() == 'Service') || ($('#xtype').val() == 'Cost') || ($('#xtype').val() == 'Non-Inventory') || ($('#xtype').val() == 'Servicing') ){
					$('.purpose-selection').removeClass('nodisplay');
				}
				
				 */
				var olditem = $('input[name="xitem"]').val();

				// Get item purchase unit
				$('.xitemsearch').on('blur', function(){
					setTimeout(() => {
						if($('input[name="xitem"]').val() == ''){
							$('input.xunitpur-display').val('');
							$('input.xcfpur-display').val('');
							$('input[name="xrate"]').val('');
							$(".qty").val('1');
							$('.xlineamt').val('0');
							$('#xlineamt').val('0');
							return;
						}

						if(olditem != '' && olditem == $('input[name="xitem"]').val()) return;

						loadingMask2.show();
						$.ajax({
							url : getBasepath() + '/procurements/pogrndirect/itemdetail/' + $('input[name="xitem"]').val(),
							type : 'GET',
							success : function(data) {
								loadingMask2.hide();
								
								if(data == undefined || data == null) return;

								$('input[name="xunitpur"]').val(data.xunitpur);
								$('input.xunitpur-display').val(data.xunitpur);	

								$('input[name="xcfpur"]').val(data.xcfpur);
								$('input.xcfpur-display').val(data.xcfpur);	

								$('input[name="xrate"]').val(data.xrate);

								var type=data.xtype
								console.log(tpe);
								console.log("bangladesh")

								/* if( ($('input.xtype-display').val() == 'Service') || ($('input.xtype-display').val() == 'Service') || ($('input.xtype-display').val() == 'Cost') || ($('input.xtype-display').val() == 'Non-Inventory') || ($('input.xtype-display').val() == 'Servicing') ){
									$('.purpose-selection').removeClass('nodisplay');
								}
								else{
									$('.purpose-selection').addClass('nodisplay');
								} */
								


								if($(".qty").val() == '') $(".qty").val('1');

								$(".qty").focus();
								$('.xlineamt').val($(".qty").val() * data.xrate);
								$('#xlineamt').val($(".qty").val() * data.xrate);
							},
							error : function(jqXHR, status, errorThrown){
								showMessage(status, "Something went wrong .... ");
								loadingMask2.hide();
							}
						})
					}, 1000);
				});

			});