from django.contrib.auth import get_user_model
from rest_framework import serializers
from base.models import StudyRecordModel
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

#class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#    def __init__(self, *args, **kwargs):
#        super().__init__(*args, **kwargs)
#
#
#TokenObtainPairViewはデフォルトでパスワードとユーザーネームを使って認証するため送ったemailの内容はない、Noneと帰ってきていた
#そのためusernameのところにemailを割り当て、あたかもemailでログインしているように見せる必要がある
#
#        self.fields['email'] = self.fields['username']
#
#    def validate(self, attrs):
#        print('実行されました')
#        username = attrs.get('username')
#        email = attrs.get('email')
#        password = attrs.get('password')
#        print(username, email, password)
#
#        try:
#            user = User.objects.get(email=email)
#        except User.DoesNotExist:
#            raise AuthenticationFailed('このemailは登録されていません')
#        if not user.check_password(password) or user.username != username:
#            raise AuthenticationFailed('パスワードまたはユーザーネームが正しくありません')
#
#        attrs['user'] = user.username
#        return super().validate(attrs)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ListRecordSerializer(serializers.ModelSerializer):
    work_time = serializers.SerializerMethodField()
    rest_time = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    print(work_time)

    class Meta:
        model = StudyRecordModel
        fields = ['id','work_time','rest_time','total','created']

    def get_work_time(self, obj):
        return obj.work_time // 60

    def get_rest_time(self, obj):
        return obj.rest_time // 60

    def get_total(self, obj):
        return obj.total // 60


class StudyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRecordModel
        fields = ['id','user','work_time','rest_time',
                  'total','completed','created','updated']
        read_only_fields = ['id','user','created','updated']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)