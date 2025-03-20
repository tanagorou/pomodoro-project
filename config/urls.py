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
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [

    path("admin/", admin.site.urls),

    # Account Template
    path('signup/', views.SignupTemplateView.as_view()),
    path('login/',views.Login.as_view()),
    path('logout/',LogoutView.as_view()),

    # Record
    path('list/record/', views.ListRecordView.as_view()),

    # Account API
    path('api/signup/', views.SignUpView.as_view()),
    path('api/login/', views.LoginView.as_view()),
    path('api/user/', views.AutenticatedUserView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/token/verify/', TokenVerifyView.as_view()),
    path('', views.IndexPageView.as_view()),

    # Record API
    path('save_record/', views.StudyRecordCreateView.as_view()),
    path('api/list/record/',views.ListRecordAPIView.as_view()),
    path('record/', views.RecordView.as_view()),
]
