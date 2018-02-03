$("#createProject").click( function(e) {
    e.preventDefault();
    var data = $('#newProject input').serialize();
    $.ajax({
            url: '/createProject/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            jQuery('#newProject')[0].reset();
            $.get('/getProject/', data, function(result) {
                $('#overflow').append(result);
            });
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
});

function deleteProject(obj) {
    var projectId = obj.id;

 
    $.ajax({
            url: '/deleteProject/',
            type: 'POST',
            data: {
                projectId: projectId,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
        })
        .done(function() {
            $('#navbar' + projectId).remove();
            $('#collapse' + projectId).remove();
            $('#br' + projectId).remove();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
};