from django.conf.urls import include, patterns, url
from tastypie.api import Api
from api import ScheduleResource

v1_api = Api(api_name='v1')
v1_api.register(ScheduleResource())

urlpatterns = patterns(
    'api.views',
    url(r'^login', 'login_view'),
    url(r'^is_user_authenticated', 'is_user_authenticated'),
    url(r'^upload_csv/(?P<slug>[A-Za-z0-9_.-]+)$', 'upload_csv'),
    url(r'^get_async_task_status', 'get_async_task_status'),

    url(r'', include(v1_api.urls)),
)
