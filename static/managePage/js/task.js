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
            $(formId)[0].reset();
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
            $('#' + task_id + 'Task').remove();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
};

function updateTask(obj) {
    var taskId = (obj.id).slice(0, -7);
    var textFieldId = taskId + 'Text';
    var updateFormId = taskId + 'updateForm';
    $('#' + textFieldId).toggle(250);
    $('#' + updateFormId).toggle(250);
};

function updateTaskSend(obj) {
    var updateFormId = obj.id + 'Form';
    var data = $('#' + updateFormId + ' input').serialize();
    $.ajax({
            url: '/updateTask/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            var name = $('#' + updateFormId + ' input[name="updatedTaskName"]').val();
            $('#' + updateFormId + ' input[name="updatedTaskName"]').val('');
            var textFieldId = '#' + obj.id.slice(0, -6) + 'Text';
            $(textFieldId).html(name);
            $('#' + updateFormId).toggle(250);
            $(textFieldId).toggle(250);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
};