import os

import celery
from celery.utils.log import get_task_logger

import process_csv as pc

logger = get_task_logger(__name__)


@celery.task()
def process_csv(filepath):
    logger.info("process_csv: filepath: %s" % filepath)
    assert(os.path.isfile(filepath))
    try:
        return pc.process_csv(filepath)
    finally:
        os.unlink(filepath)
