"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from django.contrib.auth.views import LogoutView
from base import views

urlpatterns = [

    path("admin/", admin.site.urls),

    # Account
    path('signup/', views.SignupTemplateView.as_view()),
    path('api/signup/',views.SignUpView.as_view()),
    path('login/',views.Login.as_view()),
    path('api/token/', views.LoginView.as_view()),
    path('logout/',LogoutView.as_view()),


    path('', views.IndexPageView.as_view()),
    path('save_record/', views.StudyRecordCreateView.as_view()),
    path('record/', views.RecordView.as_view()),
]
