from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect


# Create your views here.
def home(request):
    return render(request, 'managePage/home.html')


@login_required
def user_logout(request):
    logout(request)
    return redirect('home')
