(function( $ ) {
	'use strict';
	var WPMerchantAdmin = {
		construct:function(){
			$(function() {
				
				 if(location.pathname.search('wp-admin/post.php') != -1 || location.pathname.search('wp-admin/post-new.php') != -1){
					  /*This allows us to use the links as tabs to show the different fields in hte Product Data metabox */
					  $('.product_container_tabs a').click(function(){
						  // hide all tab content
						  $('.product_field_containers').each(function( index ) {
							   $( this ).parent().removeClass("wpm_show").addClass("wpm_hide");
						  });
						  // remove active classes from all li parenst of a links
						  $('.product_container_tabs li').each(function( index ) {
							   $( this ).removeClass("active");
						  });
						  //show the tab content that is clicked and add the active class to the li
						  var href = $(this).data("href");
						  $(this).parent().addClass('active');
						  $(href).removeClass('wpm_hide').addClass('wpm_show');
					  })
		  			  $('#wpmerchant_interval').change(function() {
		  					if($( this ).val() == 'day'){
		  						$('#wpmerchant_interval_count').attr('max','365');
		  					} else if($( this ).val() == 'week'){
		  						$('#wpmerchant_interval_count').attr('max','52');
		  					} else if($( this ).val() == 'month'){
		  						$('#wpmerchant_interval_count').attr('max','12');
		  					} else if($( this ).val() == 'year'){
		  						$('#wpmerchant_interval_count').attr('max','1');
		  					}
		  			  });
					  if(WPMerchantAdmin.getQueryVariable('wpmerchant_status') == 'saved'){
							// If the wpmerchant status is saved then run the addPlan ajax functionality
	 					  console.log('step1add_plan');
	 					  //$(".overlayView2").css("display","none");
	 					  var cost = $("[name='wpmerchant_cost']").val();
						  var amount = cost*100;
						  var data = {
							  interval_count: $("[name='wpmerchant_interval_count']").val(), 
						  	  interval:$("[name='wpmerchant_interval']").val(),
							  trial_period_days:$("[name='wpmerchant_trial_period_days']").val(),
	 					  	  cost: amount,
	 					  	  stripe_plan_id:$("[name='wpmerchant_stripe_plan_id']").val(),
							  post_id: WPMerchantAdmin.getQueryVariable("post"),
							  name:$("[name='post_title']").val()
						  }
	 					  console.log(data);
	 					  WPMerchantAdmin.addPlan(data);
				 	   }
				  } else if(location.pathname.search('wp-admin/admin.php') != -1){
					  if(WPMerchantAdmin.getQueryVariable('page') == 'wpmerchant-settings'){
						if($('.mailchimp-login').length <= 0){
							WPMerchantAdmin.getEmailData();
							$("#mailchimp-log-out").bind('click',WPMerchantAdmin.clearMailchimpAPI);
						}
						if($('.stripe-login').length <= 0){
							$("#stripe-log-out").bind('click',WPMerchantAdmin.clearStripeAPI);
						}
						
						  
					  }
				  }
				 
 		 	 });
 		},
		clearMailchimpAPI: function(event){
			event.preventDefault();
			var clear= '';
			$("#wpmerchant_mailchimp_api").val(clear);
			$("#wpmerchant_mailchimp_gen_list_id option:selected").each(function() {
				$( this ).removeAttr('selected');
		    });
			$("#submit").click();
		},
		clearStripeAPI: function(event){
			event.preventDefault();
			var clear= '';
			$("#wpmerchant_stripe_test_public_key").val(clear);
			$("#wpmerchant_stripe_test_secret_key").val(clear);
			$("#wpmerchant_stripe_live_public_key").val(clear);
			$("#wpmerchant_stripe_live_secret_key").val(clear);
			
			$("#submit").click();
		},
		addPlan: function(data1){ 
		  var dataString = "interval=" + encodeURIComponent(data1.interval) + "&interval_count=" + encodeURIComponent(data1.interval_count) + "&cost=" + encodeURIComponent(data1.cost)+ "&stripe_plan_id=" + encodeURIComponent(data1.stripe_plan_id)+"&trial_period_days=" + encodeURIComponent(data1.trial_period_days)+"&action=wpmerchant_add_plan&post_id="+encodeURIComponent(data1.post_id)+"&name="+encodeURIComponent(data1.name)+"&security="+encodeURIComponent(wpm_ajax_object.add_plan_nonce);
		  console.log(wpm_ajax_object);
			$.ajax({
				url: wpm_ajax_object.ajax_url,  
				type: "POST",
				  data: dataString,
				  dataType:'json',
				  success: function(data){
				    if(data.response == 'success'){
					   console.log('success')
						$(".planExistsStatus").css("display","block");
						$(".dashicon-container").empty().append('<span class="dashicons dashicons-yes" style="color:#7ad03a;"></span>');
				   } else if(data.response == 'requires-all'){
					    console.log('no plan')
						$(".planExistsStatus").css("display","block");
						$(".dashicon-container").empty().append('<span class="dashicons dashicons-no" style="color:#a00;"></span>');
			   	   } else {
					    console.log('no plan')
						$(".planExistsStatus").css("display","block");
						$(".dashicon-container").empty().append('<span class="dashicons dashicons-no" style="color:#a00;"></span>');
				   } 
				  console.log( data );
				  },
				error: function(jqXHR, textStatus, errorThrown) { 
					console.log(jqXHR, textStatus, errorThrown); 
				    console.log('no plan')
					$(".planExistsStatus").css("display","block");
					$(".dashicon-container").empty().append('<span class="dashicons dashicons-no" style="color:#a00;"></span>');
				}
			});
		},
		getEmailData: function(){ 
		  var dataString = "action=wpmerchant_get_email_data&security="+encodeURIComponent(wpm_ajax_object.get_email_data_nonce);
		  console.log(wpm_ajax_object);
		  console.log('getEmailData')
			$.ajax({
				url: wpm_ajax_object.ajax_url,  
				type: "GET",
				  data: dataString,
				  dataType:'json',
				  success: function(data){
				    if(data.response == 'success'){
					   console.log('success')
						var options = '';
						var existingValue = $("#wpmerchant_mailchimp_gen_list_id").data("value")
						for (var i = 0; i < data.lists.length; i++) { 
							if(data.lists[i].value == existingValue){
								var selected = 'selected'
							} else {
								var selected = '';
							}
						    options += '<option '+selected+' value="'+data.lists[i].value+'">'+data.lists[i].name+'</option>';
						}
						console.log(options)
						// this is just for hte polling version
						//$("#wpmerchant_mailchimp_gen_list_id").parent().siblings('th').text('General Interest List ID');
						//$("#wpmerchant_mailchimp_gen_list_id").css("display","block");
						$("#wpmerchant_mailchimp_gen_list_id").html(options);							
			   	   } else if(data.response == 'empty'){
					    console.log(data)
					   // polling to see if the key has been received or not
					   // this response is only returned if no api key exists - so keep running it until we get one
					  // WPMerchantAdmin.getEmailData();
				   } else if(data.response == 'error'){
					   // number of polls has gone over the limit so we throw this instead of empty - prevent polling from continuing
				   	   console.log(data)
				   }
				  console.log( data );
				  },
				error: function(jqXHR, textStatus, errorThrown) { 
					console.log(jqXHR, textStatus, errorThrown); 
				    console.log('no lists')
					//$(".planExistsStatus").css("display","block");
					//$(".dashicon-container").empty().append('<span class="dashicons dashicons-no" style="color:#a00;"></span>');
				}
			});
		},
		getQueryVariable:function(variableName) {
		       var query = window.location.search.substring(1);
		       var vars = query.split("&");
		       for (var i=0;i<vars.length;i++) {
		               var pair = vars[i].split("=");
		               if(pair[0] == variableName){return pair[1];}
		       }
		       return(false);
		},
		getCookie: function(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i=0; i<ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0)==' ') c = c.substring(1);
		        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		    }
		    return "";
		},
		setCookie: function(cname, cvalue, exdays) {
		    var d = new Date();
		    d.setTime(d.getTime() + (exdays*24*60*60*1000));
		    var expires = "expires="+d.toUTCString();
		    document.cookie = cname + "=" + cvalue + "; " + expires;
		}
	}
	WPMerchantAdmin.construct();
})( jQuery );
