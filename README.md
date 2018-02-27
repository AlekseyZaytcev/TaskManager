# TaskManager

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install python 3.6.4 for your OS.

### Installing

1) Install virtualenv:

```
> python -m pip install virtualenv
```

2) Create virtual environment:

```
> python -m virtualenv nameOfYourEnvironment
```

3) Activate virtualenv:

Windows:
```
> pathToVirtualenv\Scripts\activate
```
Linux:
```
> source pathToVirtualenv\bin\activate
```

4) Install django:

```
> python -m pip install django
```

5) Make migrations for your models and apply migrations

```
> python manage.py makemigrations

> python manage.py migrate
```

6) Create superuser 

```
> python manage.py createsuperuser
```

## Running the tests

For running tests execute
```
python manage.py test
```

# "Write the queries for" task part. All queries written in SQL:

##### 1. get all statuses, not repeating, alphabetically ordered
```sql
SELECT DISTINCT status, task_name
FROM managePage_task 
ORDER BY task_name;
```

##### 2. get the count of all tasks in each project, order by tasks count descending
```sql
SELECT managePage_project.project_name, COUNT(managePage_task.task_name) as number_tasks
FROM managePage_project
INNER JOIN managePage_task ON managePage_project.id=managePage_task.project_id_id
GROUP BY project_id_id
ORDER BY number_tasks DESC;
```
##### 3. get the count of all tasks in each project, order by projects names 
```sql
SELECT managePage_project.project_name, COUNT(managePage_task.task_name) as number_tasks
FROM managePage_project
INNER JOIN managePage_task ON managePage_project.id=managePage_task.project_id_id
GROUP BY project_id_id
ORDER BY project_name;
```
##### 4. get the tasks for all projects having the name beginning with “N” letter 
```sql
SELECT task_name FROM managePage_task WHERE task_name REGEXP '^[N][A-Za-z]*';
```
##### 5. get the list of all projects containing the ‘a’ letter in the middle of the name, and 
##### show the tasks count near each project. Mention that there can exist projects without 
##### tasks and tasks with project_id=NULL 
```sql
SELECT managePage_project.project_name, COUNT(managePage_task.task_name) as number_tasks
FROM managePage_project
INNER JOIN managePage_task ON managePage_project.id=managePage_task.project_id_id
WHERE project_name REGEXP '^([A-Za-z][^Nn]+)([n])([A-Za-z]+)'
GROUP BY project_id_id;
```
##### 6. get the list of tasks with duplicate names. Order alphabetically 
```sql
SELECT task_name, COUNT(*)
FROM managePage_task
GROUP BY task_name HAVING COUNT(*) > 1;
```
##### 7. get the list of tasks having several exact matches of both name and status, from 
##### the project ‘Garage’. Order by matches count 
```sql
SELECT managePage_task.task_name, managePage_task.status, managePage_task.project_id_id, 
    COUNT(*) as amount
FROM managePage_task
WHERE project_id_id = (SELECT id FROM managePage_project WHERE project_name='Garage')
GROUP BY task_name HAVING COUNT(*) > 1
ORDER BY amount DESC;
```
##### 8. get the list of project names having more than 10 tasks in status ‘completed’. Order 
##### by project_id
```sql
SELECT managePage_project.project_name, managePage_project.id, 
    COUNT(managePage_task.task_name) as number_tasks
FROM managePage_project
INNER JOIN managePage_task ON managePage_project.id=managePage_task.project_id_id
WHERE managePage_task.status=1
GROUP BY project_id_id HAVING number_tasks > 10
ORDER BY number_tasks DESC
```