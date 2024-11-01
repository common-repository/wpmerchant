(function( $ ) {
	'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note that this assume you're going to use jQuery, so it prepares
	 * the $ function reference to be used within the scope of this
	 * function.
	 *
	 * From here, you're able to define handlers for when the DOM is
	 * ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * Or when the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and so on.
	 *
	 * Remember that ideally, we should not attach any more than a single DOM-ready or window-load handler
	 * for any particular page. Though other scripts in WordPress core, other plugins, and other themes may
	 * be doing this, we should try to minimize doing that in our own work.
	 */
	var WPMerchant = {
		construct:function(){
			console.log('1');
			$(function() {
				console.log('2')
				if($('.wpMerchantPurchase').length > 0){
					$('body').append('<div class="wpm-overlay"><!--div id="wpm_loading_indicator" class="wpm-loading-indicator"><img src="'+ajax_object.loading_gif+'" width="50" height="50"></div--><div id="wpm_message"><a class="wpm-close-link"><img class="wpm-close" src="'+ajax_object.close_btn_image+'"></a><h1>'+ajax_object.post_checkout_msg+'</h1><p><img src="'+ajax_object.stripe_checkout_image+'" height="128px" width="128px"></p></div></div>');
					
				  $('.wpMerchantPurchase').bind('click', function(e) {
					  console.log('clickspp');
					  //$(".overlayView2").css("display","none");
					  var receiptMsg1 = '';
					  var receiptMsg2 = '';
					  var companyName = ajax_object.company_name;
					  var stripePublicKey = ajax_object.stripe_public_key;
					  if($(this).data('plans')){
					  	 var plans = JSON.stringify($(this).data('plans'));
					  } else {
						  var plans = '';
					  }
					  if($(this).data('products')){
						  var products = JSON.stringify($(this).data('products'));
					  } else {
						  var products = '';
					  }
					  
					  /*if(spProductId.indexOf(',') > -1){
					     var product_ids = spProductId.split(",");
						 // find the frequency of products listed
						 var products = new Array();
						 for(var i=0;i< product_ids.length;i++)
						 {
						   var key = product_ids[i];
						   products[key] = (products[key])? products[key] + 1 : 1 ;
						 }
					  } else {
						  var products[spProductId] = 1;
					  }
					  if(typeof products !== 'undefined'){
					  	products = JSON.stringify(products);
					  } else {
						  var products = '';
					  }*/
					  
					  var amount = $(this).data('amount');
					  var description =  $(this).data('description');
					  var currency =  ajax_object.currency;
					  if($(this).data('plans')){
					  	var panelLabel = 'Subscribe - {{amount}}/month';
					  } else {
					  	var panelLabel = 'Purchase - {{amount}}';
					  }
					  var spImage = ajax_object.stripe_checkout_image;
					  //MM_PLAN_ID = 6;
					  console.log(companyName+', '+description+', '+amount+', '+panelLabel+', '+receiptMsg1+', '+receiptMsg2+', '+stripePublicKey+', '+spImage+', '+plans+', '+products+', '+currency);
					  //display the loader gif
					  WPMerchant.overlayOn('loading');
					  if($(this).data('locale')){
					  	var locale = $(this).data('locale');
					  } else {
					  	var locale = 'auto';
					  }
					  if($(this).data('zip')){
					  	var zipCode = $(this).data('zip');
					  } else {
					  	var zipCode = 'false';
					  }
					  if($(this).data('billing')){
					  	var billing = $(this).data('billing');
					  } else {
					  	var billing = 'false';
					  }
					  if($(this).data('shipping')){
					  	var shipping = $(this).data('shipping');
					  } else {
					  	var shipping = 'false';
					  }
					  if($(this).data('bitcoin')){
					  	var bitcoin = $(this).data('bitcoin');
					  } else {
					  	var bitcoin = 'false';
					  }
				
					  var extraParams = {locale: locale, zipCode: zipCode, billingAddress: billing,shippingAddress: shipping,bitcoin: bitcoin};
					  WPMerchant.stripeHandler(companyName, description, amount, panelLabel, receiptMsg1, receiptMsg2, stripePublicKey, spImage, plans, products,currency, extraParams);
				    // Open Checkout with further options
				    /*handler.open({
				      name: 'MettaGroup',
				      description: 'One-on-One Mentoring ($150/month)',
				      amount: 15000
				    });*/
				  }); 
			    } else if($('#wpmerchant-payment-form').length > 0){
					Stripe.setPublishableKey(ajax_object.stripe_public_key);
					var $form = $('#wpmerchant-payment-form');
					  $form.submit(function(event) {
					    // Disable the submit button to prevent repeated clicks:
					    $form.find('.submit').prop('disabled', true);

					    // Request a token from Stripe:
					    Stripe.card.createToken($form, WPMerchant.stripeFormHandler);

					    // Prevent the form from being submitted:
					    return false;
					  });
				}
		 	 });
		},
		overlayOn:function(type){
			console.log('on')
			switch (type) {
			case 'loading':
			  $('#wpm_loading_indicator').css("display","block").css("opacity","1"); 
				break;
			case 'message':
				$('#wpm_message').css("display","block");
				break;
			default:
				
			}
			$('.wpm-overlay').css("display","block");
		},
		overlayOff:function(){
			console.log('off')
			$('#wpm_loading_indicator').css("display","none").css("opacity","0");
			$('#wpm_message').css("display","none");
			$('.wpm-overlay').css("display","none");
		},
		getQuery: function(url){
			var request = {};
			var pairs = url.substring(url.indexOf('?') + 1).split('&');
			for (var i = 0; i < pairs.length; i++) {
				var pair = pairs[i].split('=');
				request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
			}
			return request;
		},
		stripeFormHandler: function(status, response){
			  // Grab the form:
			  var $form = $('#wpmerchant-payment-form');

			  if (response.error) { // Problem!

			    // Show the errors on the form:
				$form.find('.payment-errors').removeClass('hide')
			    $form.find('.payment-errors').text(response.error.message);
			    $form.find('.submit').prop('disabled', false); // Re-enable submission

			  } else { // Token was created!
				  $form.find('.payment-errors').addClass('hide')
			   	 // Get the token ID:
					////response.id gives you the actual token value
				  var token = response;
            	
				    // Insert the token ID into the form so it gets submitted to the server:
				  $form.append($('<input type="hidden" name="stripeToken">').val(token.id));
				  if($form.find('input[name="plans"]').data('plans')){
				  	 var plans = JSON.stringify($form.find('input[name="plans"]').data('plans'));
				  } else {
					  var plans = '';
				  }
				  if($form.find('input[name="products"]').data('products')){
					  var products = JSON.stringify($form.find('input[name="products"]').data('products'));
				  } else {
					  var products = '';
				  }
				  if(!token.email){
					  token.email = $form.find('input[name="email"]').val();
				  }
	  			  var queryVars = WPMerchant.getQuery(window.location.href);
	  			  if(typeof queryVars != "undefined" && typeof queryVars['wpm_a'] != "undefined"){
	  			  	var affiliate = queryVars['wpm_a'];
	  			  } else {
	  			  	var affiliate = '';
	  			  }
				  var other = {currency:$form.find('input[data-currency]').data('currency'), description:$form.find('input[data-description]').data('description'), name:$form.find('input[name="name"]').val(), phone:$form.find('input[name="phone"]').val(), affiliate:affiliate };
				  var amount = $form.find('input[name="amount"]').data('amount');
		    	  console.log(token);
		    	  console.log(plans);
				  console.log(products);
				   console.log(other);
				    // Submit the form:
				    //$form.get(0).submit();
					// RUN AJAX PURCHASE FUNCTION
					WPMerchant.ajaxPurchase(token, plans, products, amount, other); 
			  }
		},
		stripeHandler: function(companyName, productDescription, amount, panelLabel, receiptMsg1, receiptMsg2, stripePublicKey, spImage, plans,products,currency,extraParams){ 
			//MM_PLAN_ID = spPlanId;
			/*
			https://stripe.com/docs/checkout#integration-custom
				Simplified Chinese (zh)
				Danish (da)
				Dutch (nl)
				English (en)
				Finnish (fi)
				French (fr)
				German (de)
				Italian (it)
				Japanese (ja)
				Norwegian (no)
				Spanish (es)
				Swedish (sv)
			*/
			var handler2 = StripeCheckout.configure({
				key: stripePublicKey,
			    image: spImage,
				panelLabel: panelLabel,
				name: companyName,
				currency:currency,
			    description: productDescription,
			    amount: amount,
				locale: extraParams.locale,
				zipCode: extraParams.zipCode,
				billingAddress: extraParams.billingAddress,
				shippingAddress: extraParams.shippingAddress,
				bitcoin: extraParams.bitcoin,
				opened:function(){  
					// this runs when the modal is closed
					console.log('opened');
					WPMerchant.overlayOff();
				},
				token: function(token, args) {
			      // Use the token to create the charge with a server-side script.
			      // You can access the token ID with `token.id`
			      console.log(token);
			      console.log(plans);
				  console.log(products);
				  var other = {currency: currency, name:'', phone:''};
				  //WPMerchant.loadingModal();
				  WPMerchant.ajaxPurchase(token, plans, products, amount, other); 
		 	  	 }
		 	 }); 
		 	 handler2.open();
	  	},
		ajaxPurchase:function(token, plans, products, amount, other){
		  WPMerchant.overlayOn('loading');
		  var dataString = "token=" + encodeURIComponent(token.id) + "&email=" + encodeURIComponent(token.email) + "&name=" + encodeURIComponent(other.name) + "&phone=" + encodeURIComponent(other.phone) + "&affiliate=" + encodeURIComponent(other.affiliate) +"&plans=" + encodeURIComponent(plans)+ "&products=" + encodeURIComponent(products)+"&action=wpmerchant_purchase&amount="+encodeURIComponent(amount)+"&currency="+encodeURIComponent(other.currency)+"&security="+ajax_object.purchase_nonce;
		  console.log(ajax_object);
		  console.log(dataString);
			$.ajax({
				url: ajax_object.ajax_url,  
				type: "POST",
				data: dataString,
				dataType:'json',
				success: function(data){
				    if(data.response == 'success'){
  					  WPMerchant.overlayOff();
				      console.log('success')
						if(data.redirect){
							console.log('redirect exists')
							window.open(data.redirect,'_self');
						} else {
							console.log('no redirect exists')
							WPMerchant.overlayOn('message');
							if($(".wpm-close-link").length > 0){
								$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
							}
							if($('.payment-errors').length > 0 ){
								$('.payment-errors').addClass('hide')
						    	$('.submit').prop('disabled', false); // Re-enable submission
							}
						}
						var responseMessage = 'Purchase Complete';
					   var receiptMsg1 = 'We have emailed you a receipt.';
					   var receiptMsg2 = 'Support us by sharing this purchase on your social networks.';
			   		   //WPMerchant.updateModal(productDescription, responseMessage, receiptMsg1, receiptMsg2);
				   } else if (data.response == 'sold_out'){
					   WPMerchant.overlayOff();
				      console.log('sold_out')
						/*if(data.redirect){
							console.log('redirect exists')
							window.open(data.redirect,'_self');
						} else {
							console.log('no redirect exists')
					   		WPMerchant.overlayOn('message');
					   		$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
						}*/
						if($("#wpm_message").length > 0){	
							$("#wpm_message").find('h1').empty().text('Sold Out!')
						}
						WPMerchant.overlayOn('message');
				   		if($(".wpm-close-link").length > 0){
							$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
						}
						if($('.payment-errors').length > 0 ){
							$('.payment-errors').removeClass('hide')
						    $('.payment-errors').text('Sorry, this product has been sold out!');
						    $('.submit').prop('disabled', false); // Re-enable submission
						}
			   	   } else if(data.response == 'subscriptionExists') {
				      WPMerchant.overlayOff();
					  console.log('error')
						/*if(data.redirect){
							console.log('redirect exists')
							window.open(data.redirect,'_self');
						} else {
							console.log('no redirect exists')
				   		WPMerchant.overlayOn('message');
				   		$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}*/
					if($("#wpm_message").length > 0){	
			   			$("#wpm_message").find('h1').empty().text('Subscription Exists')
					}
					WPMerchant.overlayOn('message');
			   		if($(".wpm-close-link").length > 0){	
						$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}
					if($('.payment-errors').length > 0 ){
						$('.payment-errors').removeClass('hide')
					    $('.payment-errors').text('You are currently subscribed to this plan.');
					    $('.submit').prop('disabled', false); // Re-enable submission
					}
					   var responseMessage = 'Purchase Notice'
					   var receiptMsg1 = 'You are currently subscribed to this plan.  If you would like to update subscription details please contact <a href="mailto:george@mettagroup.org">george@mettagroup.org</a>.';
					   var receiptMsg2 = '';
			   		   //WPMerchant.updateModal(productDescription, responseMessage, receiptMsg1, receiptMsg2);
				   } else {
				      WPMerchant.overlayOff();
					  console.log('error')
						/*if(data.redirect){
							console.log('redirect exists')
							window.open(data.redirect,'_self');
						} else {
							console.log('no redirect exists')
				   		WPMerchant.overlayOn('message');
				   		$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}*/
					if($("#wpm_message").length > 0){	
						$("#wpm_message").find('h1').empty().text('Purchase Error')
					}
					WPMerchant.overlayOn('message');
			   		if($(".wpm-close-link").length > 0){	
						$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}
					   var responseMessage = 'Purchase Error'
					   var receiptMsg1 = 'We\'re sorry! There was an error purchasing this product.  Please contact <a href="mailto:george@mettagroup.org">george@mettagroup.org</a>.';
					   var receiptMsg2 = '';
			   		   //WPMerchant.updateModal(productDescription, responseMessage, receiptMsg1, receiptMsg2);
					if($('.payment-errors').length > 0 ){
						$('.payment-errors').removeClass('hide')
					    $('.payment-errors').text('Sorry, there was an error purchasing this product.');
					    $('.submit').prop('disabled', false); // Re-enable submission
					}
				   }
				  console.log( data );
				  },
				error: function(jqXHR, textStatus, errorThrown) { 
					WPMerchant.overlayOff();
					console.log(jqXHR, textStatus, errorThrown); 
			      console.log('error')
					/*if(data.redirect){
						console.log('redirect exists')
						window.open(data.redirect,'_self');
					} else {
						console.log('no redirect exists')
				   		WPMerchant.overlayOn('message');
				   		$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}*/
			   		if($("#wpm_message").length > 0){	
						$("#wpm_message").find('h1').empty().text('Purchase Error')
					}
					WPMerchant.overlayOn('message');
			   		if($(".wpm-close-link").length > 0){	
						$(".wpm-close-link").bind("click",WPMerchant.overlayOff);
					}
					if($('.payment-errors').length > 0 ){
						$('.payment-errors').removeClass('hide')
					    $('.payment-errors').text('Sorry, there was an error purchasing this product.');
					    $('.submit').prop('disabled', false); // Re-enable submission
					}
				   var responseMessage = 'Purchase Error'
				   var receiptMsg1 = 'We\'re sorry! There was an error purchasing this product.  Please contact <a href="mailto:george@mettagroup.org">george@mettagroup.org</a>.';
				   var receiptMsg2 = '';
		   		   //WPMerchant.updateModal(productDescription, responseMessage, receiptMsg1, receiptMsg2);
				}
			});
		}
	
	}
	WPMerchant.construct();

})( jQuery );
