from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls.base import reverse

from managePage.models import Project, Task
from django.template.context_processors import request


class ViewTestClass(TestCase):

    @classmethod
    def setUpTestData(cls):
        print("setUpTestData: Run once to set up non-modified data for all class methods.")
        
        # Create user
        user1 = User.objects.create_user(username='Ruby', email='ruby@something.net', password='123456')
        user1.save()
        user2 = User.objects.create_user(username='anotherUser', email='anotherUser@something.net', password='qwerty')
        user2.save()
        # Create 5 projects for this user
        for project_num in range(5):
            Project.objects.create(project_name='Project %s' % project_num, user_id=user1)
        
        # Create 5 tasks for each project(sum=25)
        project_list = Project.objects.all()
        for project in project_list:
            for task_num in range(5):
                Task.objects.create(task_name='Task %s' % task_num, project_id=project)
                
        # Create project and 5 tasks for user2
        project = Project.objects.create(project_name='Project for user2', user_id=user2)
        for task_num in range(5):
            Task.objects.create(task_name='Task %s' % task_num, project_id=project)
        
    def setUp(self):
        print("setUp: Run once for every test method to setup clean data.")
        # for each test authenticate user
        self.client.login(username='Ruby', password='123456')
        
        
    #------------------------------finish setup for tests----------------------------------------------------
    
    
    def test_home_5Projects_and_30Tasks_exist_in_response(self):
        # Because home view load all tasks(expects 30) and filter this in view for current user's projects 
        resp = self.client.get(reverse('home'))
        self.assertTrue(len(resp.context['projects_list']) == 5)
        self.assertTrue(len(resp.context['tasks_list']) == 30)    
    
    def test_getTask_1Projects_and_25Tasks_expected(self):
        resp = self.client.get(reverse('getTask'), {'project_id': 2})
        self.assertTrue(len(resp.context['projects_list']) == 1)
        self.assertTrue(len(resp.context['tasks_list']) == 5)
        
    def test_create_project_if_empty_name_404Expected(self):
        project_name = ''
        resp = self.client.post(reverse('createProject'), {'projectName': project_name})
        self.assertTrue(resp.status_code == 404)
        
    def test_create_project_if_name_exist_404Expected(self):
        project_name = 'Project 2'
        resp = self.client.post(reverse('createProject'), {'projectName': project_name})
        self.assertTrue(resp.status_code == 404)
        
    def test_update_project_if_empty_name_404Expected(self):
        project_name = ''
        resp = self.client.post(reverse('updateProject'), {'updatedProjectName': project_name})
        self.assertTrue(resp.status_code == 404)
        
    def test_update_project_if_name_exist_404Expected(self):
        project_name = 'Project 2'
        resp = self.client.post(reverse('updateProject'), {'updatedProjectName': project_name})
        self.assertTrue(resp.status_code == 404)
        
    def test_create_task_if_empty_name_404Expected(self):
        task_name = ''
        resp = self.client.post(reverse('createTask'), {'task_name': task_name, 'project_id': 2})
        self.assertTrue(resp.status_code == 404)
        
    def test_create_task_if_name_exist_404Expected(self):
        task_name = 'Task 2'
        resp = self.client.post(reverse('createTask'), {'task_name': task_name, 'project_id': 2})
        self.assertTrue(resp.status_code == 404)
        
    def test_update_task_if_empty_name_404Expected(self):
        taskName = ''
        project_id = 2
        task_id = 4
        resp = self.client.post(reverse('updateTask'), {'updatedTaskName': taskName, 'task_id': task_id, 'project_id': project_id})
        self.assertTrue(resp.status_code == 404)
        
    def test_update_task_if_name_exist_404Expected(self):
        taskName = 'Task 2'
        project_id = 2
        task_id = 4
        resp = self.client.post(reverse('updateTask'), {'updatedTaskName': taskName, 'task_id': task_id, 'project_id': project_id})
        self.assertTrue(resp.status_code == 404)
        
    def test_check_task_expected_True_status(self):
        #tasks creates with False status by default, checkView change status to True or if status True -> False
        resp = self.client.post(reverse('checkTask'), {'task_id': 2})
        self.assertTrue(Task.objects.filter(id=2)[0].status == True)
        self.assertTrue(resp.status_code == 200)
        
    def test_shiftView_is_Task2and3_shifted(self):
        # range(5) create this range < 0, 1, 2, 3, 4 >
        # Take first project with tasks(id=3, id=4). Task 2 have status=True, id=3, name='Task 2'. After shift id=3 -> id=4, other is same
        # Task 3 have: id=4, name='Task 3', status=False. shift -> id=3 and status and name are not changed

        # Change status Task 2 to True and make shift
        Task.objects.filter(id=3).update(status=True) 
        resp = self.client.post(reverse('shiftTask'), {'project_id': 1, 'idStartdrag': 3, 'idFinishdrag': 4})
        
        # Check if Task 2 shifted(id=4 have status False -> True, name 'Task 3' -> 'Task 2':
        self.assertTrue(Task.objects.filter(id=4)[0].status == True)
        self.assertTrue(Task.objects.filter(id=4)[0].task_name == 'Task 2')
        
        # Check if Task 3 shifted(id=3 have status True -> False, name 'Task 2' -> 'Task 3':
        self.assertTrue(Task.objects.filter(id=3)[0].status == False)
        self.assertTrue(Task.objects.filter(id=3)[0].task_name == 'Task 3')
        
        # Response 200
        self.assertTrue(resp.status_code == 200)
    
    def test_deadlineView_deadline_is_empty(self):
        resp = self.client.post(reverse('setDeadline'), {'deadline': ''})
        self.assertTrue(resp.status_code == 404)
        
    