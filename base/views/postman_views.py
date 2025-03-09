from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.views.generic import TemplateView

from base.models import StudyRecordModel

class RecordView(TemplateView):
    template_name = 'pages/record.html'

@csrf_exempt
def save_record(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            record = StudyRecordModel.objects.create(
                work_time=data['work_time'],
                rest_time=data['rest_time'],
                total=data['total'],
                completed=data['completed'],
            )
            return JsonResponse({'message': 'success','id':record.id}, status=201)
        except Exception as e:
            return JsonResponse({'error':str(e)}, status=400)
    return JsonResponse({'error':'request method not supported'}, status=400)
