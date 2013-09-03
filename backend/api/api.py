from django.conf.urls import url

from tastypie.authentication import SessionAuthentication
from tastypie.authorization import Authorization
from tastypie.resources import ModelResource

from models import Schedule


class ScheduleResource(ModelResource):
    class Meta:
        queryset = Schedule.objects.all()
        resource_name = 'schedule'
        excludes = ['id']
        detail_uri_name = 'slug'
        authentication = SessionAuthentication()
        authorization = Authorization()

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/(?P<slug>[^/]+)/$" %
                self._meta.resource_name,
                self.wrap_view('dispatch_detail'),
                name='api_dispatch_detail'),
        ]
