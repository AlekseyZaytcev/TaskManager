from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^logout/$', views.user_logout, name='logout'),
    url(r'^login/$', views.user_login, name='login'),
    url(r'^createUser/$', views.create_user, name='createUser'),
    url(r'^createProject/$', views.create_project, name='createProject'),
    url(r'^deleteProject/$', views.delete_project, name='deleteProject'),
    url(r'^updateProject/$', views.update_project, name='updateProject'),
    url(r'^getProject/$', views.get_project, name='getProject'),
    url(r'^createTask/$', views.create_task, name='createTask'),
    url(r'^deleteTask/$', views.delete_task, name='deleteTask'),
    url(r'^updateTask/$', views.update_task, name='updateTask'),
    url(r'^getTask/$', views.get_task, name='getTask'),
    url(r'^checkTask/$', views.check_task, name='checkTask'),
]
