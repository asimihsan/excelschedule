import logging

from django.contrib.auth import authenticate, login
from django.core.exceptions import PermissionDenied
from django.middleware import csrf
from django.views.decorators.http import require_GET, require_POST

from jsonview.decorators import json_view


@json_view
def csrf_failure(request, reason=""):
    raise PermissionDenied("CSRF verifcation failed: %s" % reason)


@require_POST
@json_view
def login_view(request):
    logger = logging.getLogger("api.views.login")
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user and user.is_active:
        logger.debug("user %s is present and active" % user)
        login(request, user)
    elif user and not user.is_active:
        logger.debug("user %s present but deactivated" % user)
        raise PermissionDenied("This account has been deactivated.")
    else:
        logger.debug("username %s not present or inactive" % username)
        raise PermissionDenied("Username and/or password not correct.")


@require_GET
@json_view
def csrf_token(request):
    return {"csrf_token": csrf.get_token(request)}


@require_GET
@json_view
def is_user_authenticated(request):
    return {"is_user_authenticated": request.user.is_authenticated()}


@json_view
def upload_csv(request, slug):
    logger = logging.getLogger("api.upload_csv")
    if not request.user.is_authenticated():
        logger.error("permission denied for user: %s" % request.user)
        raise PermissionDenied()
    logger.info("slug: %s" % slug)
    file_handle = request.FILES.values()[0]
    return {}
