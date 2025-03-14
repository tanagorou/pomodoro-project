from django.contrib.auth import get_user_model
from rest_framework import serializers
from base.models import StudyRecordModel


User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','email','password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class StudyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRecordModel
        fields = ['id','user','work_time','rest_time',
                  'total','completed','created','updated']
        read_only_fields = ['id','user','created','updated']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)