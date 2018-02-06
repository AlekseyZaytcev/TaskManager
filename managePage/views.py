from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from managePage.models import Project, Task


def home(request):
    context = {}
    if request.user.is_authenticated:
        current_user = request.user
        projects_list = Project.objects.all().filter(user_id=current_user)
        tasks_list = Task.objects.all()
        context = {'projects_list': projects_list,
                   'tasks_list': tasks_list, }
    return render(request, 'managePage/home.html', context)


def create_user(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        if user is not None:
            login(request, user)
            # Redirect to a success page with ajax function.
            return HttpResponse('200')
        else:
            # Return an 'invalid login' error message.
            print('Invalid login details: login-%s, password-%s' %
                  (username, password))
            return HttpResponse('404')


def user_login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            # Redirect to a success page with ajax function.
            return HttpResponse('200')
        else:
            # Return an 'invalid login' error message.
            print('Invalid login details: login-%s, password-%s' %
                  (username, password))
            return HttpResponse('404')


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
        user_id = request.user
        project_name = request.POST['projectName']
        Project.objects.create(
            user_id=user_id,
            project_name=project_name
        )
        return HttpResponse('200')


def delete_project(request):
    if request.method == 'POST':
        project_id = request.POST.get('projectId')
        project = Project.objects.get(id=project_id)
        project.delete()
        return HttpResponse('200')


def update_project(request):
    if request.method == 'POST':
        projectName = request.POST['updatedProjectName']
        projectId = request.POST['id']
        Project.objects.filter(id=projectId).update(project_name=projectName)
        return HttpResponse('200')


def get_task(request):
    if request.method == 'GET':
        current_user = request.user
        project_id = request.GET['project_id']
        tasks_list = Task.objects.filter(project_id=project_id)
        projects_list = Project.objects.all().filter(user_id=current_user, id=request.GET['project_id'])
        return render(request, 'managePage/getTask.html', {'tasks_list': tasks_list, 'projects_list': projects_list})


def create_task(request):
    if request.method == 'POST':
        task_name = request.POST['task_name']
        project_id = request.POST['project_id']
        project = Project.objects.get(id=project_id)
        Task.objects.create(
            task_name=task_name,
            project_id=project
        )
        return HttpResponse('200')


def delete_task(request):
    if request.method == 'POST':
        task_id = request.POST['taskId']
        task = Task.objects.get(id=task_id)
        task.delete()
        return HttpResponse('200')


def update_task(request):
    if request.method == 'POST':
        taskName = request.POST['updatedTaskName']
        taskId = request.POST['id']
        Task.objects.filter(id=taskId).update(task_name=taskName)
        return HttpResponse('200')


@csrf_exempt
def check_task(request):
    if request.method == 'POST':
        taskId = request.POST['id']
        task = Task.objects.filter(id=taskId)
        if task[0].status == False:
            task.update(status=True)
        else:
            task.update(status=False)
        return HttpResponse('200')
