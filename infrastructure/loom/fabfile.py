from fabric.api import *
from loom import puppet
from loom.tasks import *

env.user = 'root'
env.environment = 'prod'
env.roledefs = {
    'web': [
        'li305-49.members.linode.com',  # katara
    ],
}


@task
def deploy_puppet():
    execute(puppet.update)
    execute(puppet.apply)
