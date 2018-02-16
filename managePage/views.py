import datetime

from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt

from managePage.models import Project, Task


# Create your views here.
def home(request):
    context = {}
    if request.user.is_authenticated:
        current_user = request.user
        projects_list = Project.objects.all().filter(user_id=current_user)
        tasks_list = Task.objects.all()
        for task in tasks_list:
            timeForTask = task.deadline - task.createData
            today = datetime.date.today()
            timeSpend = today - task.createData
            try:
                percent = timeSpend * 100 / timeForTask
            except:
                percent = 0
            task.percent = percent
        context = {'projects_list': projects_list,
                   'tasks_list': tasks_list, }
    return render(request, 'managePage/home.html', context)


def create_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        
        if User.objects.filter(username=username).exists():
            response_data = {'text': 'This username are used!'}
            return JsonResponse(response_data, status=404)
        
        elif User.objects.filter(email=email).exists():
            response_data = {'text': 'This email are used!'}
            return JsonResponse(response_data, status=404)
        
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            user.save()
        
            login(request, user)
            # Redirect to a success page with ajax function.
            return HttpResponse(status=200)



def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page with ajax function.
            return HttpResponse(status=200)
        else:
            # Return an 'invalid login' error message.
            print('Invalid login details: login-%s, password-%s' %
                  (username, password))
            return HttpResponse(status=404)


@login_required
def user_logout(request):
    logout(request)
    return redirect('home')


def get_project(request):
    if request.method == 'GET':
        current_user = request.user
        project_name = request.GET['projectName']
        projects_list = Project.objects.all().filter(user_id=current_user, project_name=project_name)
        return render(request, 'managePage/getProject.html', {'projects_list': projects_list})


def create_project(request):
    if request.method == 'POST':
        current_user = request.user
        project_name = request.POST['projectName']
        if not project_name:
            response_data = {'text': '<strong>Alert!</strong> Don\'t use empty project name!'}
            return JsonResponse(response_data, status=404)
        if Project.objects.filter(user_id=current_user, project_name=project_name).exists():
            response_data = {'text': '<strong>Alert!</strong> Project with same name exist!'}
            return JsonResponse(response_data, status=404)
        else:
            Project.objects.create(user_id=current_user,
                                   project_name=project_name)
            return HttpResponse(status=200)


def delete_project(request):
    if request.method == 'POST':
        project_id = request.POST.get('projectId')
        project = Project.objects.get(id=project_id)
        project.delete()
        return HttpResponse(status=200)


def update_project(request):
    if request.method == 'POST':
        current_user = request.user
        projectName = request.POST['updatedProjectName']
        
        # If name is empty:
        if not projectName:
            response_data = {'text': '<strong>Alert!</strong> You are using empty project name while edit it!'}
            return JsonResponse(response_data, status=404)
        
        # If project with same name exist:
        if Project.objects.filter(user_id=current_user, project_name=projectName).exists():
            response_data = {'text': '<strong>Alert!</strong> Project with same name exist!'}
            return JsonResponse(response_data, status=404)
        
        projectId = request.POST['id']
        Project.objects.filter(user_id=current_user, id=projectId).update(project_name=projectName)
        
        # If project created it's OK:
        if Project.objects.filter(user_id=current_user, project_name=projectName).exists():
            return HttpResponse(status=200)
        else:
            response_data = {'text': 'Project name not updated!'}
            return JsonResponse(response_data, status=404)


def get_task(request):
    if request.method == 'GET':
        current_user = request.user
        project_id = request.GET['project_id']
        tasks_list = Task.objects.filter(project_id=project_id)
        projects_list = Project.objects.all().filter(user_id=current_user, id=request.GET['project_id'])
        for task in tasks_list:
            timeForTask = task.deadline - task.createData
            today = datetime.date.today()
            timeSpend = today - task.createData
            try:
                percent = timeSpend * 100 / timeForTask
            except:
                percent = 0
            task.percent = percent
        return render(request, 'managePage/getTask.html', {'tasks_list': tasks_list, 'projects_list': projects_list})


def create_task(request):
    if request.method == 'POST':
        task_name = request.POST['task_name']
        project_id = request.POST['project_id']
        project = Project.objects.get(id=project_id)
        
        if not task_name:
            response_data = {'text': '<strong>Please,</strong> fill task name!'}
            return JsonResponse(response_data, status=404)
        if Task.objects.filter(project_id=project_id, task_name=task_name).exists():
            response_data = {'text': '<strong>Get yourself together!</strong> Don\'t duplicate task name!'}
            return JsonResponse(response_data, status=404)
        else:
            Task.objects.create(
            task_name=task_name,
            project_id=project)
            return HttpResponse(status=200)
            
        
def delete_task(request):
    if request.method == 'POST':
        task_id = request.POST['taskId']
        task = Task.objects.get(id=task_id)
        task.delete()
        return HttpResponse(status=200)


def update_task(request):
    if request.method == 'POST':
        taskName = request.POST['updatedTaskName']
        task_id = request.POST['task_id']
        project_id = request.POST['project_id']
        if not taskName:
            response_data = {'text': '<strong>Please,</strong> fill new task name!'}
            return JsonResponse(response_data, status=404)
        if Task.objects.filter(project_id=project_id, task_name=taskName).exists():
            response_data = {'text': '<strong>Exist</strong> task with this name!'}
            return JsonResponse(response_data, status=404)
        
        Task.objects.filter(id=task_id).update(task_name=taskName)
        
        if Task.objects.filter(id=task_id, task_name=taskName).exists():
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=404)


def check_task(request):
    if request.method == 'POST':
        try:
            taskId = request.POST['task_id']
            task = Task.objects.filter(id=taskId)
            if task[0].status == False:
                task.update(status=True)
            else:
                task.update(status=False)
            return HttpResponse(status=200)
        except Exception as e:
            print(e)
            return HttpResponse(status=404)
            
    
def shift_task(request):

    if request.method == 'POST':
        project_id = request.POST['project_id']
        idStartdrag = request.POST['idStartdrag']
        idFinishdrag = request.POST['idFinishdrag']
        
        # Retrieve from database dragged task and and task where need drop this task
        task_startDrag = Task.objects.filter(project_id=project_id, id=idStartdrag)
        task_finishDrag = Task.objects.filter(project_id=project_id, id=idFinishdrag)
        
        # Put status and name in to variables (dragged task)
        nameStart = task_startDrag[0].task_name
        statusStart = task_startDrag[0].status
        createDataStart = task_startDrag[0].createData
        deadlineStart = task_startDrag[0].deadline
        
        # Put status and name in to variables (place where drop task)
        nameFinish = task_finishDrag[0].task_name
        statusFinish = task_finishDrag[0].status
        createDataFinish = task_finishDrag[0].createData
        deadlineFinish = task_finishDrag[0].deadline
        
        
        # Change name and status between task's
        try:
            Task.objects.filter(id=idStartdrag).update(task_name=nameFinish, status=statusFinish, deadline=deadlineFinish, createData=createDataFinish)
            Task.objects.filter(id=idFinishdrag).update(task_name=nameStart, status=statusStart, deadline=deadlineStart, createData=createDataStart)
            
            # Render template and inject div with this task in DOM using ajax
            return HttpResponse(status=200)
        except Exception as e:
            print(e)
            return HttpResponse(status=404)
    
def set_deadline(request):
    if request.method == 'POST':
        deadline = request.POST['deadline']
        if not deadline:
            response_data = {'text': '<strong>Please,</strong> pick deadline day from calendar!'}
            return JsonResponse(response_data, status=404)
        taskId = request.POST['task_id']
        Task.objects.filter(id=taskId).update(deadline=deadline)
        task = Task.objects.filter(id=taskId)
        timeForTask = task[0].deadline - task[0].createData
        today = datetime.date.today()
        timeSpend = today - task[0].createData
        try:
            percent = timeSpend * 100 / timeForTask
        except:
            percent = 0
        response_data = {'text': '<strong>Yyeep!</strong> Deadline for your task updated!', 'percent': percent}
        return JsonResponse(response_data, status=200)
