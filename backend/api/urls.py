from django.conf.urls import include, patterns, url
from tastypie.api import Api
from api import ScheduleResource

v1_api = Api(api_name='v1')
v1_api.register(ScheduleResource())

urlpatterns = patterns(
    'api.views',
    url(r'^login', 'login_view', name='login'),
    url(r'^csrf_token', 'csrf_token', name='csrf_token'),
    url(r'^is_user_authenticated', 'is_user_authenticated',
        name='is_user_authenticated'),

    url(r'', include(v1_api.urls)),
)
