
// funzione rimuovi current
$(document).ready( function () { 

/*////////// 	carousel /////////////////*/

$(function() {
   /* $(".anyClass").jCarouselLite({
        btnNext: ".next",
        btnPrev: ".prev",
		easing: "backout"					
    });*/
	
	$(".paginato a.current").click(function(e){
		e.preventDefault();	
	});
	
    $(".rigaNews a.thumbNews").bigTarget({	   		
        clickZone : 'div:eq(1)',
        hoverClass: 'rigaNewsOver'
    });
	
	
    $(".rigaPress a.thumbPress").bigTarget({	   		
        clickZone : 'div:eq(1)',
        hoverClass: 'rigaPressOver'
    });
 
	
});

$(function() {
        $('.anyClass a').lightBox();
		$('.immagine_news').lightBox();
    	$('.immagine_press').lightBox();
    
	});
	

});