function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function login(){
    var data = $('#login-form input').serialize();
    $.ajax({
            url: '/login/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            location.reload();
        })
        .fail(function(response) {
            console.log("error");
            $("#login").click(); // close login popover.
            $("#dangerAlertText").html('<strong>Warning!</strong> Invalid username or password!');
            $('#dangerAlert').show(200);
        })
        .always(function() {
            console.log("complete");
        });
};

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
    login();
});

$(document).on('submit', '#createUser', function(e) {
    e.preventDefault();
    var data = $('#createUser input').serialize();
    $.ajax({
            url: '/createUser/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            location.reload();
        })
        .fail(function(response) {
            console.log("error");
            var text = response.responseJSON.text;
            $("#warningAlertText").html('<strong>Warning!</strong> ' + text);
            $('#warningAlert').show(200);
        })
        .always(function() {
            console.log("complete");
        });
});