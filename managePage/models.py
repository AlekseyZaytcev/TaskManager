from django.contrib.auth.models import User
from django.db import models
from django.template.defaultfilters import default
import datetime

# Create your models here.

class Project(models.Model):
    # Project have a different tasks.
    project_name = models.CharField(max_length=50)
    # One user have different number of projects.
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.project_name


class Task(models.Model):
    task_name = models.CharField(max_length=100)
    # Project id in the templates is a same is project_name.
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    createData = models.DateField(default=datetime.date.today)
    deadline = models.DateField(default=datetime.date.today)

    def __str__(self):
        return self.task_name