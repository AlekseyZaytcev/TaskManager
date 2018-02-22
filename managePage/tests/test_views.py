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
         
    def test_home_5Projects_and_30Tasks_exist_in_response(self):
        # Because home view load all tasks(expects 30) 
        resp = self.client.get(reverse('home'))
        self.assertTrue(len(resp.context['projects_list']) == 5)
        self.assertTrue(len(resp.context['tasks_list']) == 30)    
    
    def test_getTask_1Projects_and_25Tasks_expected(self):
        resp = self.client.get(reverse('getTask'), {'project_id': 2})
        self.assertTrue(len(resp.context['projects_list']) == 1)
        self.assertTrue(len(resp.context['tasks_list']) == 5)
    