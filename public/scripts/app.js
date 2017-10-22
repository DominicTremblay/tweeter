
 $(document).ready(() => {

  $('section#tweet-list').on("mouseenter", ".tweets", function(e) {

      $(this).find('.icons').addClass('visible');

  });

  $('section#tweet-list').on("mouseleave", ".tweets", function(e) {
      
          $(this).find('.icons').removeClass('visible');
      
  });

  function createTweetElement ( data ) {

    const $article = $('<article>',{
      class: 'tweets'
    }).data('id', data._id);
    
    const $header = $('<header>',{
      class: 'clearfix'
    }).appendTo($article);
      
    $('<img>', {
      attr: { 
        src: data.user.avatars.small, 
        alt: 'avatar' }
    }).appendTo($header);

    $('<h2>', {
      text: data.user.name
    }).appendTo($header);

    $('<span>', {
      text: data.user.handle
    }).appendTo($header);

    const $main = $('<main>').appendTo($article);

    $('<p>',{
      text: data.content.text
    }).appendTo($main);

    const $footer = $('<footer>', {
      text: moment(moment(data.created_at).format()).fromNow()
    }).appendTo($article);
    
    const $div = $('<div>',{
      class: 'icons' 
    }).appendTo($footer);
      
    $('<i>', {
      class: 'fa fa-flag',
      attr: { 'aria-hidden': 'true' }
    }).appendTo($div);
      
    $('<i>', {
      class: 'fa fa-retweet',
      attr: { 'aria-hidden': 'true' }
    }).appendTo($div);
    
    $('<i>',{
      class: ( data.likes === 0 ) ? "fa fa-heart-o" : "fa fa-heart",
      attr: { 'aria-hidden': 'true' }
    }).appendTo($div);


      return $article;
  }

  function renderTweets(tweets) {
      // loops through tweets
        // calls createTweetElement for each tweet
        // takes return value and appends it to the tweets container
    
        for (let tweet of tweets) {
            const $tweet = createTweetElement(tweet);
            $('#tweet-list').prepend($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
        }
    
  }

  function loadTweets() {

    $.ajax({
      url:'/tweets',
      method: 'get',
      dataType: 'json'
    })
    .done(function(result){
      renderTweets(result);
    })
    .fail(function(error, xhr) {
      console.log(error, xhr);
    });
  }

  function validateForm(form) {
    const textarea = $(form).find('textarea');
    const counter = Number($(form).find('span.counter').text());
    const empty = textarea.val() === "";
    const tooLong = counter < 0;

    const errorMessages = { 
      errors: empty || tooLong || false,
      empty:     (empty) ? "Please, you must enter a tweet!" : false,
      tooLong:   (tooLong) ? "Please, make sure your tweet is less than 140 characters!" : false
    }

    
    return(errorMessages);

  }

  function printErrorMessages(errors) {

    const ul = $('ul.errors');
    ul.remove();

    const $ul = $('<ul>').addClass('errors');
    $ul.css('color', 'red');
    const main = $('main.container');

    delete errors.errors;

    for (let errorMsg in errors) {
      if (errors[errorMsg]) {
        const $li = $('<li>').text(errors[errorMsg]);
        $ul.append($li);
      }
    }

    main.prepend($ul);

  }

  
  function resetForm(form) {
    form.trigger('reset');
    form.parent().find('span.counter').text(140);
  }

  $('section.new-tweet input[type=submit]').on('click', (e) => {

    e.preventDefault();
    const form = $(e.target).parent();
    const errorMessages = validateForm(form);

    if (errorMessages.errors) {
      printErrorMessages(errorMessages);
    } else {
      $.ajax({
          url: '/tweets',
          method: 'post',
          data: form.serialize()
          }
        )
        .done(function(data){
          console.log("done");
          renderTweets([data]);
          resetForm(form);
        })
        .fail(function(error, xhr) {
          console.log(error, xhr); 
        })
            
      }

    });


    $('#nav-bar a').on('click', function(e) {
      const newTweetContainer = $('section.new-tweet');
      const textarea = newTweetContainer.find('textarea');
      newTweetContainer.slideToggle('slow', function(){
        textarea.focus();
      });
    })

    function updateLike(target, attValue) {

      $(target).data("likes", attValue);
      if ( attValue === 0 ) {
        $(target).removeClass('fa fa-heart');
        $(target).addClass('fa fa-heart-o');
      } else {
        $(target).removeClass('fa fa-heart-o');
        $(target).addClass('fa fa-heart');
      }
    }


    $('section#tweet-list').on('click', '[class*="fa-heart"]', function( e ){

      const id = $(this).closest('article').data('id'); 
      console.log({id});

      const data = {
        likes:  $(this).data('likes')
      }

      $.ajax({
        url: `/tweets/${id}`,
        type: 'post',
        headers: { 'X-HTTP-Method-Override': 'PUT' },
        data: data
      })
      .done(function(like){
        
        updateLike(e.target, like);
                
      })
      .fail(function(error, xhr){
        console.log(error, xhr);
      })

    });

    $('form.new-user').on('submit', function(e) {

      e.preventDefault();

      const username  = $(this).find('input[name="username"]').val();
      const email     = $(this).find('input[name="email"]').val();
      const password  = $(this).find('input[name="password"]').val();

      user = {
        username,
        email,
        password
      };

      $.ajax({
        url:  '/users',
        type: 'post',
        data: user,
      })
      .done(function(response){
        console.log(response);
      })
      .fail(function(error, xhr){
        console.log(error, xhr);
      })

    });

    loadTweets();


 })  