from django.contrib import admin

# Register your models here.
from managePage.models import Project, Task


class ProjectAdm(admin.ModelAdmin):
    list_display = [field.name for field in Project._meta.fields]

class TaskAdm(admin.ModelAdmin):
    list_display = [field.name for field in Task._meta.fields]

admin.site.register(Project, ProjectAdm)
admin.site.register(Task, TaskAdm)
