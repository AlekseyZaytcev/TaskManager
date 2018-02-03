function createTask(obj) {
    var listId = '#' + obj.id + 'List';
    var formId = '#' + obj.id + 'Form';
    var data = $(formId + ' input').serialize();
    $.ajax({
            url: '/createTask/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            $(listId).load('/getTask/ ' + listId, data);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
            jQuery(formId)[0].reset();
        });
};
function deleteTask(obj) {
    var task_id = obj.id;

    $.ajax({
            url: '/deleteTask/',
            type: 'POST',
            data: {
                taskId: task_id,
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