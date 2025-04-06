from datetime import date, timedelta

from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json

from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from base.models import StudyRecordModel
from base.serializers import StudyRecordSerializer,ListRecordSerializer

class ListRecordView(TemplateView):
    template_name = 'pages/record_list.html'
class ListRecordAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        today = date.today()
        period = request.GET.get('period')

        # 前の週、次の週のデータをとれるようにする
        offset = int(request.GET.get('offset',0))

        if period == 'day':
            queryset = StudyRecordModel.objects.filter(
                user=user, created__date=today)

        elif period == 'week':
            day_of_week = today.weekday()
            monday = today -timedelta(days=day_of_week) + timedelta(weeks=offset+1)
            sunday = monday + timedelta(days=6)
            queryset = StudyRecordModel.objects.filter(
                user=user,
                created__date__range=[monday, sunday]
            )

        elif period == 'month':
            month_start_day = today.replace(day=1)
            queryset = StudyRecordModel.objects.filter(
                user=user,
                created__date__gte=month_start_day
            )
        else:
            return Response({'error':'Invalid period'}, status=400)

        serializer = ListRecordSerializer(queryset, many=True)
        return Response(serializer.data)

class RecordView(TemplateView):
    template_name = 'pages/record.html'
class StudyRecordCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        print(f'request:{request.data}')
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
