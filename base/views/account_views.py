
from django.contrib.auth.views import LoginView
from django.views.generic import CreateView, UpdateView, TemplateView
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from base.forms import UserCreationForm
from base.serializers import UserSerializer

User = get_user_model()

class AutenticatedUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class Login(LoginView):
    template_name = 'pages/login_signup.html'

#ログイン時に独自にJWTを発行
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        email = request.data.get('email')
        password = request.data.get('password')
        print(email, password)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise AuthenticationFailed('このメールアドレスは登録されておりません。')

        if not user.check_password(password):
            raise AuthenticationFailed('パスワードが正しくありません')

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        return Response({
            'access' : str(access),
            'refresh' : str(refresh),
            'user_id': str(user.id),
            'message': 'ログインが正常に完了しました。'
        },status=status.HTTP_200_OK)


#class LoginView(TokenObtainPairView):
#    serializer_class = CustomTokenObtainPairSerializer
#    def post(self, request, *args, **kwargs):
#
#        response = super().post(request, *args, **kwargs)
#
#        if response.status_code == status.HTTP_200_OK:
#            response.data['message'] = 'Login Successful'
#        return response


class SignupTemplateView(TemplateView):
    template_name = 'pages/login_signup.html'
class SignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        print(request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # jwtトークンを発行
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        print("バリデーションエラー:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



#class SignUpView(CreateView):
#    form_class = UserCreationForm
#    success_url = '/'
#    template_name = 'pages/login_signup.html'


