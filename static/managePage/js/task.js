function createTask(obj) {
    var listId = '#' + obj.id.slice(0, -6) + 'List';
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
        .fail(function(response) {
            console.log("error while create task");
            var text = response.responseJSON.text;
            $("#warningAlertText").html(text);
            $('#warningAlert').show(200);
            setTimeout(function() { $('#warningAlert').hide(200); }, 3000);
            
        })
        .always(function() {
            console.log("complete");
            $(formId)[0].reset();
        });
};
function deleteTask(obj) {
    var task_id = obj.id.slice(4).slice(0, - 6);

    $.ajax({
            url: '/deleteTask/',
            type: 'POST',
            data: {
                taskId: task_id,
                csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
            },
        })
        .done(function() {
            $('#Task' + task_id + 'Task').remove();
        })
        .fail(function() {
            console.log("error while delete task");
        })
        .always(function() {
            console.log("complete");
        });
};

function updateTask(obj) {
    var taskId = (obj.id).slice(0, -7);
    var textFieldId = taskId + 'Text';
    var progressId = taskId + 'Progress';
    var updateFormId = taskId + 'updateForm';
    var deadlineFormId = taskId + 'DeadlineForm';
    var createDateId = taskId + 'createDate';
    var deadlineDateId = taskId + 'deadlineDate';
    $('#' + textFieldId).toggle(250);
    $('#' + progressId).toggle(250);
    $('#' + updateFormId).toggle(250);
    $('#' + deadlineFormId).toggle(250);
    $('#' + createDateId).toggle(250);
    $('#' + deadlineDateId).toggle(250);
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
            var deadlineFormId = '#' + obj.id.slice(0, -6) + 'DeadlineForm';
            var progressId = '#' + obj.id.slice(0, -6) + 'Progress';
            var createDateId = '#' + obj.id.slice(0, -6) + 'createDate';
            var deadlineDateId = '#' + obj.id.slice(0, -6) + 'deadlineDate';
            $(textFieldId).html(name);
            $(deadlineFormId).toggle(250);
            $('#' + updateFormId).toggle(250);
            $(progressId).toggle(250);
            $(textFieldId).toggle(250);
            $(createDateId).toggle(250);
            $(deadlineDateId).toggle(250);
        })
        .fail(function(response) {
            console.log("error while update task name");
            var text = response.responseJSON.text;
            $("#warningAlertText").html(text);
            $('#warningAlert').show(200);
            setTimeout(function() { $('#warningAlert').hide(200); }, 3000);
        })
        .always(function() {
            console.log("complete");
        });
};

function updateDeadline(obj) {
    var deadlineFormId = '#' + obj.id + 'Form';
    var progressId = '#' + obj.id.slice(0, -8) + 'Progress';
    var deadlineDateId = '#' + obj.id.slice(0, -8) + 'deadlineDate';
    var data = $(deadlineFormId + ' input').serialize();
    $.ajax({
            url: '/setDeadline/',
            type: 'POST',
            data: data,
        })
        .done(function(response) {
        	var percent = response['percent'];
        	var text = response['text'];
        	var deadline = response['deadline'];
        	
        	$(progressId).val(percent);
        	
            $("#successAlertText").html(text);
            $(deadlineDateId).html(deadline);
            $('#successAlert').show(200);
            setTimeout(function() { $('#successAlert').hide(200); }, 3000);
        })
        .fail(function(response) {
            console.log("error while update deadline");
            var text = response.responseJSON.text;
            $("#warningAlertText").html(text);
            $('#warningAlert').show(200);
            setTimeout(function() { $('#warningAlert').hide(200); }, 3000);
        })
        .always(function() {
            console.log("complete");
        });
};

function checkTask(obj) {
    var project_id = obj.value;
    var task_id = obj.id.slice(0, -8);
    var updateDivId = '#Task' + project_id + 'List';
    var csrftoken = getCookie('csrftoken');
    var data = {
    		'project_id': project_id,
    		'task_id': task_id,
    		'csrfmiddlewaretoken': csrftoken,
    };
    var serializedData = $.param(data)
    
    $.ajax({
            url: '/checkTask/',
            type: 'POST',
            data: serializedData,
        })
        .done(function() {
            $(updateDivId).load('/getTask/ ' + updateDivId, serializedData);
        })
        .fail(function() {
            console.log("error while check task");
            $("#dangerAlertText").html('<strong>Warning!</strong> Can\'t change task status!');
            $('#dangerAlert').show(200);
        })
        .always(function() {
            console.log("complete");
        });
};

document.addEventListener("dragenter", function(event) {
    if ( event.target.className == "list-group-item droptarget" ) {
        event.target.style.border = "3px dashed #3073ad";
        }
});
document.addEventListener("dragleave", function(event) {
    if ( event.target.className == "list-group-item droptarget" ) {
        event.target.style.border = "";
    }
});

function dragenter(event) {
    if ( event.target.className == "droptarget" ) {
        event.target.style.border = "3px dotted red";
        };
};

function startdrag(event) {
	var idStartdrag = event.target.id.slice(0, -4).slice(4);
	var dt = event.dataTransfer;
	dt.setData("text/plain", idStartdrag);
	dt.effectAllowed = 'copy';
};

function allowDrop(event) {
	event.preventDefault();
};

function onDrop(event) {
	  var idStartdrag = event.dataTransfer.getData("text/plain");
	  var idFinishdrag = event.target.id.slice(0, -4).slice(4);
	  var project_id = event.target.value;
	  var updateDivId = '#Task' + project_id + 'List';
	  var csrftoken = getCookie('csrftoken');
	  
	  var data = {
			  'project_id': project_id,
			  'idStartdrag': idStartdrag,
			  'idFinishdrag': idFinishdrag,
			  'csrfmiddlewaretoken': csrftoken,
	  };
	  
	  $.ajax({
            url: '/shiftTask/',
            type: 'POST',
            data: data,
        })
        .done(function() {
        	var serializedData = $.param(data); // This is a way to serialize data in some variable
        	// becouse this string ↓ send POST request instead GET if i pass data in object
            $(updateDivId).load('/getTask/ ' + updateDivId, serializedData);  // but i need GET for /getTask/ view
        })
        .fail(function() {
            console.log("error while check task");
            $("#dangerAlertText").html('<strong>Warning!</strong> Can\'t change task position!');
            $('#dangerAlert').show(200);
            setTimeout(function() { $('#dangerAlert').hide(200); }, 3000);
        })
        .always(function() {
            console.log("complete");
        });
	  event.preventDefault();
};