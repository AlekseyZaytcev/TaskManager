from django.contrib.auth import logout, authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.http import Http404


# Create your views here.
def home(request):
    return render(request, 'managePage/home.html')


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
