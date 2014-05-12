$(document).ready(function() {
	var slideset_matrix_fashion = [
		['Leather-handbag.png', 'Folded-Neckties.png', 'M-Martinetto.png'],
		['Sunglasses.png', 'High-Heels-Shoes.png', 'M-Rinvio.png'],
		['Men-Shoes.png', 'Pink-scarf.png', 'M-Fasatore.png'] // Cambiare le prime due immagini
	];
	
	var slideset_matrix_design = [
		['Campari-bottle.png', 'Fiat-500.png', 'M-Martinetto-a-sfere.png'],
		['Retro-radio.png', 'Caffettiera-Moka.png', 'M-Fasatore.png'],
		['Pink-Scooter.png', 'Poltrona-Frau.png', 'M-Aleph.png']
	];
	
	var last_slideset = '';
	var random_slideset = null;
	var slideset_timeout = false;
	var dom_slideset = $('.slideset_wrapper');
	var slideset_title = '';
	var slideset_class = '';

	if (!! Math.round(Math.random() * 1)) {
		random_slideset = slideset_matrix_fashion;
		slideset_title = 'Italian Fashion';
		slideset_class = 'fashion';
		last_slideset = 'fashion';
	} else {
		random_slideset = slideset_matrix_design;
		slideset_title = 'Italian Design';
		slideset_class = 'design';
		last_slideset = 'design';
	}
	
	var random_row = Math.floor(Math.random()*3);
	
	var slideset_cycle = function(force_slideset) {
		if (last_slideset == 'fashion') {
			random_slideset = slideset_matrix_design;
			slideset_title = 'Italian Design';
			slideset_class = 'design';
			last_slideset = 'design';
		} else if (last_slideset == 'design') {
			random_slideset = slideset_matrix_fashion;
			slideset_title = 'Italian Fashion';
			slideset_class = 'fashion';
			last_slideset = 'fashion';
		}
		
		if (force_slideset) {
			if (force_slideset == 'fashion') {
				random_slideset = slideset_matrix_fashion;
				slideset_title = 'Italian Fashion';
				slideset_class = 'fashion';
			}
			
			if (force_slideset == 'design') {
				random_slideset = slideset_matrix_design;
				slideset_title = 'Italian Design';
				slideset_class = 'design';
			}
		}
		
		//$(dom_slideset).find('.slideset_bullets a').removeClass('current').end().find('a[href=#' + slideset_class + ']').addClass('current');
		
		$.when($(dom_slideset).find('.slideset').stop().fadeOut('slow')).then(function() {
			$.when($(dom_slideset).find('.slideset').removeClass('fashion design').addClass(slideset_class)).then(function() {
				$.when($(dom_slideset).find('li img').hide().each(function(i, v) {
					var src = '/img/slideset-home/' + random_slideset[random_row][i];
					$(this).attr('src', src);
				})).then(function() {
					$(dom_slideset).find('p').hide().find('strong').html(slideset_title);
					
					$.when($(dom_slideset).find('.slideset').stop().fadeIn('slow')).then(function() {
						$.when($(dom_slideset).find('li img.first').stop().fadeIn('slow')).then(function() {
							$.when($(dom_slideset).find('li img.second').stop().fadeIn('slow')).then(function() {
								$.when($(dom_slideset).find('li img.third').stop().fadeIn('slow')).then(function() {
									$.when($(dom_slideset).find('p').stop().fadeIn('slow')).then(function() {
										slideset_timeout = setTimeout(slideset_cycle, 4000);
									});
								});
							});
						});
					});
				});
			});
		});
	};
	
	/* SLIDESET FESTE 2012 */
	var dom_slideset_feste_2012 = $('.slideset_wrapper_feste');
	var dom_slideset_feste_2012_to_hide = '.slideset_wrapper_feste .slideset .natale';
	var dom_slideset_feste_2012_to_show = '.slideset_wrapper_feste .slideset .anno_nuovo';
	
	var slideset_feste_2012_cycle = function() {
		$.when($(dom_slideset_feste_2012_to_hide).add($(dom_slideset_feste_2012_to_hide).find('li img, p:not(.hidden)')).stop().fadeOut('slow')).then(function() {
			$(dom_slideset_feste_2012_to_show).find('li img, p:not(.hidden)').hide();
			
			$.when($(dom_slideset_feste_2012_to_show).stop().fadeIn('slow')).then(function() {
				$.when($(dom_slideset_feste_2012_to_show).find('li img.first').stop().fadeIn('slow')).then(function() {
					$.when($(dom_slideset_feste_2012_to_show).find('li img.second').stop().fadeIn('slow')).then(function() {
						$.when($(dom_slideset_feste_2012_to_show).find('li img.third').stop().fadeIn('slow')).then(function() {
							$.when($(dom_slideset_feste_2012_to_show).find('p:not(.hidden)').stop().fadeIn('slow')).then(function() {
								
								if (dom_slideset_feste_2012_to_hide == '.slideset_wrapper_feste .slideset .natale') {
									dom_slideset_feste_2012_to_hide = '.slideset_wrapper_feste .slideset .anno_nuovo';
									dom_slideset_feste_2012_to_show = '.slideset_wrapper_feste .slideset .natale';
								} else {
									dom_slideset_feste_2012_to_hide = '.slideset_wrapper_feste .slideset .natale';
									dom_slideset_feste_2012_to_show = '.slideset_wrapper_feste .slideset .anno_nuovo';
								}
								
								slideset_feste_2012_timeout = setTimeout(slideset_feste_2012_cycle, 4000);
							});
						});
					});
				});
			});
		});
	};
	
	if ($('#bannerHome .slideset_wrapper_feste').length) {
		slideset_feste_2012_timeout = setTimeout(slideset_feste_2012_cycle, 4000);
	} else {
		slideset_cycle();
	}
});