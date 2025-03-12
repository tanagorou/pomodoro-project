from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from base.models import StudyRecordModel
from base.serializers import StudyRecordSerializer


class RecordView(LoginRequiredMixin,TemplateView):
    template_name = 'pages/record.html'

class StudyRecordCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(f'request:{request}')
        print(f'request.user:{request.user}')
        serializer = StudyRecordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            record = serializer.save()
            return Response({'message':'success', 'id': record.id}, status=status.HTTP_201_CREATED)
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#csrf_exempt
#def save_record(request):
#    if request.method == 'POST':
#        try:
#            data = json.loads(request.body)
#            record = StudyRecordModel.objects.create(
#                user=request.user,
#                work_time=data['work_time'],
#                rest_time=data['rest_time'],
#                total=data['total'],
#                completed=data['completed'],
#            )
#            return JsonResponse({'message': 'success','id':record.id}, status=201)
#        except Exception as e:
#            return JsonResponse({'error':str(e)}, status=400)
#    return JsonResponse({'error':'request method not supported'}, status=400)
