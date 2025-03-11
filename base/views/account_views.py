
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView, UpdateView
from django.contrib.auth import get_user_model

from base.forms import UserCreationForm


class SignUpView(CreateView):
    form_class = UserCreationForm
    success_url = '/'
    template_name = 'pages/login_signup.html'

class Login(LoginView):
    template_name = 'pages/login_signup.html'
