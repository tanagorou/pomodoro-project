from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    def handle(self, *args, **options):
        User = get_user_model()
        username = os.environ.get('SUPERUSER_USERNAME')
        email = os.environ.get('SUPERUSER_EMAIL')
        password = os.environ.get('SUPERUSER_PASSWORD')

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS('Created superuser'))
        else:
            self.stdout.write(self.style.ERROR('User already exists'))