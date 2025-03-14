from django.core.management.base import BaseCommand
from django.utils.timezone import now
from datetime import timedelta
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

class Command(BaseCommand):
    help = "期限切れのJWTトークンを削除"

    def handle(self, *args, **kwargs):
        # `expires_at` を現在時刻より前に変更（安全対策）
        for token in OutstandingToken.objects.all():
            token.expires_at = now() - timedelta(seconds=1)
            token.save()

        # `OutstandingToken` を削除
        deleted_outstanding, _ = OutstandingToken.objects.filter(expires_at__lt=now()).delete()

        # `BlacklistedToken` も削除
        deleted_blacklisted, _ = BlacklistedToken.objects.all().delete()

        self.stdout.write(self.style.SUCCESS(f"{deleted_outstanding} 件の `OutstandingToken` を削除しました！"))
        self.stdout.write(self.style.SUCCESS(f"{deleted_blacklisted} 件の `BlacklistedToken` を削除しました！"))
