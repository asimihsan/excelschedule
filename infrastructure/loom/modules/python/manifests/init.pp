class python {
    Class['development_tools'] -> Class['python']
    Class['environment'] -> Class['python']
    Class['openssl'] -> Class['python']

    case $operatingsystem {
        Fedora: {
            $packages = ["bzip2-devel",
                         "expat-devel",
                         "gdbm-devel",
                         "patch",
                         "readline-devel",
                         "sqlite-devel"]
        }
        ubuntu: {
            $packages = ["libncursesw5-dev",
                         "libreadline-dev",
                         "libgdbm-dev",
                         "libc6-dev",
                         "libbz2-dev",
                         "libicu-dev",
                         "libsqlite3-dev"]
        }
    }
    package { $packages: ensure => installed }

    exec { "git clone pyenv":
        command => "git clone git://github.com/yyuu/pyenv.git .pyenv",
        cwd => "/home/ubuntu",
        user => "ubuntu",
        creates => "/home/ubuntu/.pyenv/.git",
    }
    exec { "git clone pyenv virtualenvwrapper":
        command => "git clone git://github.com/yyuu/pyenv-virtualenvwrapper.git",
        cwd => "/home/ubuntu/.pyenv/plugins",
        user => "ubuntu",
        creates => "/home/ubuntu/.pyenv/plugins/pyenv-virtualenvwrapper/.git",
    }
    exec { "pyenv install 2.7.5":
        command => 'su - ubuntu -c "pyenv install 2.7.5"',
        cwd => "/home/ubuntu",
        require => [Exec["git clone pyenv"],
                    Package[$packages]],
        unless => 'su - ubuntu  -c "pyenv versions | grep 2.7.5"',
    }
    exec { "pyenv rehash":
        command => 'su - ubuntu -c "pyenv rehash"',
        cwd => "/home/ubuntu",
        require => [Exec["pyenv install 2.7.5"]],
    }
    exec { "pyenv global 2.7.5":
        command => 'su - ubuntu -c "pyenv global 2.7.5"',
        cwd => "/home/ubuntu",
        require => Exec["pyenv rehash"],
    }
    exec { "pip install 2.7.5":
        command => 'su - ubuntu -c "pyenv shell 2.7.5; pip install virtualenv virtualenvwrapper"',
        cwd => "/home/ubuntu",
        require => Exec["pyenv rehash"],
    }
    exec { "pyenv rehash pip":
        command => 'su - ubuntu -c "pyenv rehash"',
        cwd => "/home/ubuntu",
        require => [Exec["pip install 2.7.5"]],
    }
    file { "/home/ubuntu/.virtualenvs/postactivate":
        source => "/etc/puppet/modules/python/files/postactivate",
        mode => 755,
        require => Exec["pip install 2.7.5"],
    }
    file { "/home/ubuntu/.virtualenvs/postdeactivate":
        source => "/etc/puppet/modules/python/files/postdeactivate",
        mode => 755,
        require => Exec["pip install 2.7.5"],
    }    
}
