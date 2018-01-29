$("#login").popover({
    title: '<h4>Login in TaskManager</h4>',
    container: 'body',
    placement: 'bottom',
    html: true,
    content: function(){
          return $('#popover-login-form').html();
    }
});

$(document).on('submit', '#login-form', function(e) {
    e.preventDefault();
    var data = $('#login-form input').serialize();
    data.csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajax({
            url: '/login/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            location.reload();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

});

$(document).on('submit', '#createUser', function(e) {
    e.preventDefault();
    var data = $('#createUser input').serialize();
    data.csrfmiddlewaretoken = $('input[name=csrfmiddlewaretoken]').val();
    $.ajax({
            url: '/createUser/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            location.reload();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

});