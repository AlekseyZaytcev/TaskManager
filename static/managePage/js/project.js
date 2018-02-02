$(document).on('submit', '#newProject', function(e) {
    e.preventDefault();
    var data = $('#newProject input').serialize();
    $.ajax({
            url: '/createProject/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            jQuery('#newProject')[0].reset();
            location.reload();
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
            location.reload();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
};