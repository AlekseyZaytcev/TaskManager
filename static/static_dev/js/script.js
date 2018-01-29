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
    $.ajax({
            url: '/login/',
            type: 'POST',
            data: {
                username: $('input#logInInputNick').val(),
                password: $('input#logInInputPassword').val(),
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
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