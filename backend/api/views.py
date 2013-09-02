import logging
import json

from django.http import HttpResponse
from django.middleware import csrf


def login(request):
    logging.debug("login. request: %s" % request)


def csrf_token(request):
    return HttpResponse(json.dumps({
        "csrf_token": csrf.get_token(request),
    }), content_type="application/json")
