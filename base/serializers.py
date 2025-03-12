from rest_framework import serializers
from base.models import StudyRecordModel

class StudyRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyRecordModel
        fields = ['id','user','work_time','rest_time',
                  'total','completed','created','updated']
        read_only_fields = ['id','user','created','updated']

    def create(self, validated_data):
        print(f'追加前validated_data: {validated_data}')
        validated_data['user'] = self.context['request'].user
        print(f'追加後validated_data: {validated_data}')
        return super().create(validated_data)