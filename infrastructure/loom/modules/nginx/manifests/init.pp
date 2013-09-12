class nginx {
    Class['openssl'] -> Class['nginx']

    case $operatingsystem {
        ubuntu: {
            $packages = ["lua5.2",
                         "liblua5.2-0",
                         "liblua5.2-dev",
                         "libluajit-5.1-2",
                         "libluajit-5.1-dev"]
        }
        Fedora: {
            $packages = ["lua",
                         "lua-devel"]
        }
    }
    package { $packages: ensure => latest }
    file { "/tmp/build_nginx.sh":
        source => "/etc/puppet/modules/nginx/files/build_nginx.sh",
        mode => 755,
    }
    exec { "build nginx":
        command => '/tmp/build_nginx.sh',
        cwd => "/tmp",
        creates => "/usr/local/nginx/sbin/nginx",
        require => File['/tmp/build_nginx.sh'],
    }
    exec { "chown nginx":
        command => "chown -R ubuntu:ubuntu /usr/local/nginx",
        require => Exec["build nginx"],
    }
    exec { "touch chown nginx.pid":
        command => "touch /var/run/nginx.pid; chown ubuntu:ubuntu /var/run/nginx.pid",
        require => Exec["build nginx"],
    }
}
