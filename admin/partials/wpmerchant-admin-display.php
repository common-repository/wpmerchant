<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       wpmerchant.com/team
 * @since      1.0.0
 *
 * @package    Wpmerchant
 * @subpackage Wpmerchant/admin/partials
 */
?>
<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
	<h2><?php echo esc_html( get_admin_page_title() ); ?></h2>
	 <!--NEED THE settings_errors below so that the errors/success messages are shown after submission - wasn't working once we started using add_menu_page and stopped using add_options_page so needed this-->
	 <h3>Get Started with WPMerchant in 1 Minute</h3>
	 <iframe width="640" height="360" src="https://www.youtube.com/embed/OEoDKUlR-5w" frameborder="0" allowfullscreen></iframe>
	 <h3>Collect Money/Bitcoin with a WPMerchant Buy Button in 3 Simple Steps:</h3>
	<ol>
	 <li><strong><a href="/wp-admin/admin.php?page=wpmerchant-settings&tab=payment">Connect to Stripe</a></strong> and <a href="/wp-admin/admin.php?page=wpmerchant-settings">set Company Name and Logo</a></li>
	 <li><a href="/wp-admin/edit.php?post_type=wpmerchant_products">Create a Product</a></li>
	 <li><strong><a href="https://www.civicwears.com/wp-admin/edit.php?post_type=page">Add the WPMerchant Buy Button to your post or page</a></strong> and <a href="/wp-admin/admin.php?page=wpmerchant-settings&tab=payment">make Stripe status Live</a></li>
 </ol>
</div>