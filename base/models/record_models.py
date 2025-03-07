from django.db import models
from django.utils.crypto import get_random_string

def create_id():
    return get_random_string(22)


class StudyRecordModel(models.Model):
    id = models.CharField(default=create_id, max_length=22, primary_key=True)
    work_time = models.IntegerField(default=25)
    rest_time = models.IntegerField(default=5)
    total = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id