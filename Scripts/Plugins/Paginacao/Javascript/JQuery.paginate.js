/**
 *
 * @summary     jPaginate
 * @description Paginate an html elements
 * @version     2017.03.09
 * Rrepository  https://github.com/asirokas/jPaginate
 *
 * @author      Athanasios Sirokas (www.asirokas.com)
 * Contact      asirokas@gmail.com
 *
 */
( function( $ ) {
	$.fn.paginate = function( options ) {
		var defaults = {
			pagination_class: "pagination",
			items_per_page: 5,
		};

		// Merge deafults into options
		var options = $.extend( defaults, options );

		obj = $( this );

		// Count entries in block for pagination
		var n = obj.children().size();

		// Calculate number of pages
		var pages = Math.ceil( n / options.items_per_page );

    // Add a div after the #slideshow to put the navigation controls in
    obj.append("<div id='quebra-linha' style='clear:both;'></div>").append(
			$( '<div/>' ).addClass( options.pagination_class + "__controls paginacao" ).append(
				$( '<ul/>' ).addClass( options.pagination_class ) )
		);

		function createPaginationControls( pages ) {

			// Add Previous button
			if ( options.prev_next == true ) {
				obj.find( "." + options.pagination_class ).append( '<li class="prev"><a href="#">' + options.prev_text + '</a></li>' );
			}
			// For each div (slide) add a link in span for controls
			for ( var i = 0; i < pages; i++ ) {
				obj.find( "." + options.pagination_class ).append( '<li style="margin-left:4px"><a href="#' + ( i + 1 ) + '">' + ( i + 1 ) + '</a></li>' );
			};

			// Add Next Button
			if ( options.prev_next == true ) {
				obj.find( "." + options.pagination_class ).append( '<li class="next"><a href="#">' + options.next_text + '</a></li>' );
			}
		}

		function showPage( page_number ) {
			var start_from = ( page_number * options.items_per_page );
			var end_on = ( ( page_number + 1 ) * options.items_per_page );
			obj.children().not( '.pagination__controls, #quebra-linha' ).css( 'display', 'none' ).slice( start_from, end_on ).css( 'display', 'block' );
		}

		createPaginationControls( pages );
		showPage( 0 );

		obj.find( '.pagination li' ).not( ".prev,.next" ).first().addClass( 'ativo' );

		// Navigate to the coresponding slide when clicking on a nav-control
		obj.find( '.pagination li' ).not( ".prev,.next" ).click( function() {

			// Reset the obj element to match the current pagination element
			obj = $(this).parent().parent().parent();

			if ( options.prev_next == true ) {
				var pageIndex = $( this ).index() - 1;
			} else {
				var pageIndex = $( this ).index();
			};

			// remove ativo class from all elements
			$( this ).parent().children().removeClass( 'ativo' );
			$( this ).addClass( 'ativo' );
			showPage( pageIndex );
		} );

		// Navigate to the previous slide when clicking on the prev button
		obj.find( '.pagination li.prev' ).click( function() {

			// Reset the obj element to match the current pagination element
			obj = $(this).parent().parent().parent();

			pageIndex = $( this ).parent().find( 'li.ativo' ).index() - 2;
			if ( pageIndex < 0 ) pageIndex = 0;

			$( this ).parent().find( 'li.ativo' ).removeClass( 'ativo' );
			$( this ).parent().find( 'li:nth-child(' + ( pageIndex + 2 ) + ')' ).addClass( 'ativo' );
			showPage( pageIndex );
		} );

		// Navigate to the next slide when clicking on the next button
		obj.find( '.pagination li.next' ).click( function() {

			// Reset the obj element to match the current pagination element
			obj = $(this).parent().parent().parent();

			pageIndex = $( this ).parent().find( 'li.ativo' ).index();
			if ( pageIndex > pages - 1 ) pageIndex = pages - 1;

			$( this ).parent().find( 'li.ativo' ).removeClass( 'ativo' );
			$( this ).parent().find( 'li:nth-child(' + ( pageIndex + 2 ) + ')' ).addClass( 'ativo' );
			showPage( pageIndex );
		} );
	};
} )( jQuery );
