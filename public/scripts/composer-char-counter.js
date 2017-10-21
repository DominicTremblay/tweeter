$(document).ready( () => {

    const MAXCHARS = 140;


    function updateCounter(e) {
        const nbChars = e.target.value.length;
        const $counter = $(e.target).parent().find('span.counter');
        ((MAXCHARS - nbChars)) < 0 ? $counter.addClass('negative') : $counter.removeClass('negative');  
        $counter.text(MAXCHARS - nbChars); 

    }

    $('section.new-tweet textarea').on('keyup', function(e) {
        updateCounter(e);
    });

})