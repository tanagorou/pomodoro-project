from django.db import models
from django.contrib.auth import get_user_model
from base.models import create_id



class StudyRecordModel(models.Model):
    id = models.CharField(default=create_id, max_length=22, primary_key=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    work_time = models.IntegerField(default=0)
    rest_time = models.IntegerField(default=0)
    total = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id