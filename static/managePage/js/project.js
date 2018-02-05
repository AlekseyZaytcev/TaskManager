$("#createProject").click( function(e) {
    e.preventDefault();
    var data = $('#newProject input').serialize();
    $.ajax({
            url: '/createProject/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            $('#newProject')[0].reset();
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

function updateProject(obj) {
    var textFieldId = obj.id + 'Text';
    var updateFormId = obj.id + 'UpdateForm';
    $('#' + textFieldId).toggle(250);
    $('#' + updateFormId).toggle(250);
};

function updateProjectSend(obj) {
    var updateFormId = obj.id + 'Form';
    var data = $('#' + updateFormId + ' input').serialize();
    $.ajax({
            url: '/updateProject/',
            type: 'POST',
            data: data,
        })
        .done(function() {
//            location.reload();
            var name = $('#' + updateFormId + ' input[name="updatedProjectName"]').val();
            $('#' + updateFormId + ' input[name="updatedProjectName"]').val('');
            var projectNameId = '#' + obj.id.slice(0, -6) + 'Text';
            $(projectNameId).html(name);
            $('#' + updateFormId).toggle(250);
            $(projectNameId).toggle(250);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
};