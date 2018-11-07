$('.card').on('click', function (e) {
    // console.log(this.className);
    // console.log($('.card')[0]);
    // console.log($('.card')[1]);

    // console.log($('.card')[0] == this);
    // console.log($('.card')[1] == this);

    var cards = $('.card');
    for(var i = 0; i < cards.length; ++i){
        if(cards[i] == this) {
            // console.log(i);
            $('.card')[i].classList.toggle("flipped");
        }
    }
    
  });