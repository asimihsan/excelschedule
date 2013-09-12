class excelschedule {
    Class['nginx'] -> Class['excelschedule']
    Class['python'] -> Class['excelschedule']
    Class['development_tools'] -> Class['excelschedule']
    Class['environment'] -> Class['excelschedule']
    Class['nodejs'] -> Class['excelschedule']

    exec { "mkvirtualenv excelschedule":
        command => 'su - ubuntu -c "mkvirtualenv excelschedule"',
    }    
    exec  { "pip install requirements":
        command => 'su - ubuntu -c "workon excelschedule; pip install -r /home/ubuntu/excelschedule/requirements.txt; pyenv rehash"',
        require => Exec["mkvirtualenv excelschedule"],
    }
    exec { "pyenv rehash excelschedule pip install":
        command => 'su - ubuntu -c "pyenv rehash"',
        cwd => "/home/ubuntu",
        require => [Exec["pip install requirements"]],
    }

    case $operatingsystem {
        Fedora: {
            $redis_service = "redis"
            $packages = ["redis"]
        }
        ubuntu: {
            $packages = ["redis-server"]
            $redis_service = "redis-server"
        }
    }
    package { $packages: ensure => latest }
    service { $redis_service:
        enable => true,
        ensure => "running",
        require => Package[$packages],
    }

    file { "/home/ubuntu/log":
        ensure => "directory",
    }

    exec {"gem install compass":
        unless => "gem list | grep -q compass",
    }

    exec { "npm install -g grunt-cli bower":
        require => Class["nodejs"],
    }
}