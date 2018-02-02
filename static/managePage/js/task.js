function createTask(obj) {
    var formId = '#' + obj.id + 'Form';
    $(document).on('submit', formId, function(e) {
    e.preventDefault();
    var data = $(formId + ' input').serialize();
    $.ajax({
            url: '/createTask/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            jQuery(formId)[0].reset();
            location.reload();
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });
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