from fabric.api import *
from loom import puppet
from loom.tasks import *

env.user = 'root'
env.loom_puppet_version = '3.2.4'
env.loom_librarian_version = '0.9.10'
env.roledefs = {
    'web-prod': [
        'li305-49.members.linode.com',  # katara
    ],
    'web-dev': [
        '192.168.50.4',
    ],
}


@task
def deploy_puppet():
    execute(puppet.update)
    execute(puppet.apply)
