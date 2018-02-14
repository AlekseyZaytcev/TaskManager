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
        .fail(function() {
            console.log("error while create task");
            $("#warningAlertText").html('<strong>Get yourself together!</strong> Don\'t duplicate task name!');
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
    $('#' + textFieldId).toggle(250);
    $('#' + progressId).toggle(250);
    $('#' + updateFormId).toggle(250);
    $('#' + deadlineFormId).toggle(250);
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
            $(textFieldId).html(name);
            $(deadlineFormId).toggle(250);
            $('#' + updateFormId).toggle(250);
            $(progressId).toggle(250);
            $(textFieldId).toggle(250);
        })
        .fail(function() {
            console.log("error while update task name");
        })
        .always(function() {
            console.log("complete");
        });
};

function updateDeadline(obj) {
    var deadlineFormId = '#' + obj.id + 'Form';
    var progressId = '#' + obj.id.slice(0, -8) + 'Progress';
    var data = $(deadlineFormId + ' input').serialize();
    $.ajax({
            url: '/setDeadline/',
            type: 'POST',
            data: data,
        })
        .done(function(data) {
        	$(progressId).val(data);
            $('#deadlineUpdatedAlert').show(200);
            setTimeout(function() { $('#deadlineUpdatedAlert').hide(200); }, 3000);
        })
        .fail(function() {
            console.log("error while update deadline");
        })
        .always(function() {
            console.log("complete");
        });
};

function checkTask(obj) {
    var project_id = obj.value;
    var task_id = obj.id.slice(0, -8);
    var createTaskFormId = '#Task' + project_id + 'CreateForm';
    var updateDivId = '#Task' + project_id + 'List';
    var data = $(createTaskFormId + ' input').serialize();
    $.ajax({
            url: '/checkTask/',
            type: 'POST',
            data: {
                'id': task_id,
            },
        })
        .done(function() {
            $(updateDivId).load('/getTask/ ' + updateDivId, data);
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
	  var myData = new FormData();
	  myData.append('project_id', project_id);
	  myData.append('csrfmiddlewaretoken', csrftoken);
	  
	  var data = {
			  project_id: project_id,
			  idStartdrag: idStartdrag,
			  idFinishdrag: idFinishdrag,
			  csrfmiddlewaretoken: csrftoken,
	  };
	  
	  $.ajax({
            url: '/shiftTask/',
            type: 'POST',
            data: data,
        })
        .done(function() {
            $(updateDivId).load('/getTask/ ' + updateDivId, myData);
        })
        .fail(function() {
            console.log("error while check task");
            $("#dangerAlertText").html('<strong>Warning!</strong> Can\'t change task position!');
            $('#dangerAlert').show(200);
        })
        .always(function() {
            console.log("complete");
        });
	  event.preventDefault();
	};