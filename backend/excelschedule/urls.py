from django.conf.urls import patterns, url

urlpatterns = patterns(
    'api.views',
    url(r'^api/login', 'login', name='login'),
    url(r'^api/csrf_token', 'csrf_token', name='csrf_token'),
)
