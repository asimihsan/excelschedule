class python {
    Class['development_tools'] ~> Class['python']
    
    Exec {
        path => "/usr/local/bin:/usr/bin:/bin",
    }

    package {
        "python": ensure => installed;
        "python-dev": ensure => installed;
    }

    exec { "install ez_setup":
        command => "curl -k https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py | python",
        require => [Package["python"], Package["python-dev"]],
    }

    exec { "install pip":
        command => "curl -k https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python",
        require => Exec["install ez_setup"]
    }

    exec { "install virtualenv":
        command => "pip install virtualenv virtualenvwrapper",
        require => Exec["install pip"]
    }
}