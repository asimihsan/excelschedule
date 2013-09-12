import logging
import shutil
import tempfile

from celery.result import AsyncResult
from django.contrib.auth import authenticate, login
from django.core.exceptions import PermissionDenied
from django.views.decorators.http import require_GET, require_POST
from jsonview.decorators import json_view
import jsonview.exceptions

import tasks


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
def is_user_authenticated(request):
    return {"is_user_authenticated": request.user.is_authenticated()}


@json_view
def upload_csv(request, slug):
    logger = logging.getLogger("api.upload_csv")
    if not request.user.is_authenticated():
        logger.error("permission denied for user: %s" % request.user)
        raise PermissionDenied()
    logger.info("slug: %s" % slug)
    input_fh = request.FILES.values()[0]
    output_fh = tempfile.NamedTemporaryFile(delete=False)
    shutil.copyfileobj(input_fh, output_fh)
    output_fh.close()
    result = tasks.process_csv.delay(output_fh.name)
    return {
        "result_id": result.id
    }


@require_GET
@json_view
def get_async_task_status(request):
    logger = logging.getLogger("api.get_async_task_status")
    if not request.user.is_authenticated():
        logger.error("permission denied for user: %s" % request.user)
        raise PermissionDenied()
    result_id = request.GET.get('result_id', None)
    if not result_id:
        raise jsonview.exceptions.BadRequest('Need a result_id parameter')

    result = AsyncResult(result_id)
    return_value = {"result_id": result_id}
    if not result.ready():
        return_value["ready"] = False
        return return_value
    return_value["ready"] = True
    if result.failed():
        return_value["failed"] = True
        return return_value
    return_value["failed"] = False
    return_value["result"] = result.result
    return return_value
